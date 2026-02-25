import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { 
  createWithdrawWithheldTokensFromAccountsInstruction,
  TOKEN_2022_PROGRAM_ID,
  getAccount,
} from '@solana/spl-token';
import DLMM from '@meteora-ag/dlmm';
import { FEE_TIERS, TOKEN_TOTAL_SUPPLY } from '../../../packages/config/src/index';
import { createSetTransferFeeInstruction, getAccountsToWithdrawFrom } from '../../../packages/solana-utils/src/transferFee';
import { swapHalfToSOL, addLiquidityToMeteora } from '../../../packages/solana-utils/src/meteora';
import BN from 'bn.js';

export class FeeController {
  private currentTierIndex: number = -1; // -1 means Initial Launch Panic (33.3%)
  private lastThresholdCrossedAt: number = 0;
  private inGracePeriod: boolean = false;
  private gracePeriodEndAt: number = 0;

  constructor(
    private connection: Connection,
    private payer: Keypair,
    private mint: PublicKey,
    private feeAuthority: Keypair,
    private withdrawAuthority: Keypair,
    private poolAddress: PublicKey
  ) {}

  /**
   * Main loop called every 5-10 minutes
   */
  async runCycle() {
    const currentPrice = await this.getTokenPriceFromMeteora();
    const currentMC = currentPrice * TOKEN_TOTAL_SUPPLY;

    console.log(`[MC CHECK] Current MC: $${currentMC.toLocaleString()} | Tier: ${this.currentTierIndex === -1 ? 'Launch' : FEE_TIERS[this.currentTierIndex].name}`);

    // Logic: Check if we can move to next tier
    const nextTierIndex = this.currentTierIndex + 1;
    if (nextTierIndex < FEE_TIERS.length) {
      const nextTier = FEE_TIERS[nextTierIndex];

      if (currentMC >= nextTier.thresholdMC) {
        if (this.lastThresholdCrossedAt === 0) {
          this.lastThresholdCrossedAt = Date.now();
          console.log(`[ALERT] Threshold ${nextTier.thresholdMC} reached. Sustaining...`);
        } else if (Date.now() - this.lastThresholdCrossedAt >= nextTier.sustainMinutes * 60 * 1000) {
          // Sustained! Start Grace Period
          await this.enterGracePeriod(nextTierIndex);
        }
      } else {
        // Reset sustain timer if MC drops
        this.lastThresholdCrossedAt = 0;
      }
    }

    // Logic: Handle Grace Period expiry
    if (this.inGracePeriod && Date.now() >= this.gracePeriodEndAt) {
      await this.enterStableFee(this.currentTierIndex);
    }

    // Logic: Auto-LP if fees are high
    await this.harvestAndAutoLP();
  }

  private async enterGracePeriod(tierIndex: number) {
    const tier = FEE_TIERS[tierIndex];
    console.log(`[TRANSITION] Entering Grace Period for Tier: ${tier.name}. Fee -> ${tier.graceFeeBps / 100}%`);
    
    await this.updateOnChainFee(tier.graceFeeBps);
    
    this.currentTierIndex = tierIndex;
    this.inGracePeriod = true;
    this.gracePeriodEndAt = Date.now() + tier.graceMinutes * 60 * 1000;
    this.lastThresholdCrossedAt = 0;
  }

  private async enterStableFee(tierIndex: number) {
    const tier = FEE_TIERS[tierIndex];
    console.log(`[TRANSITION] Grace Period over. Setting Stable Fee -> ${tier.stableFeeBps / 100}%`);
    
    await this.updateOnChainFee(tier.stableFeeBps);
    this.inGracePeriod = false;

    // If final tier reached, we can optionally revoke fee authority here or in admin CLI
    if (tierIndex === FEE_TIERS.length - 1) {
      console.log("[FINAL] Last tier reached. System stable.");
    }
  }

  private async updateOnChainFee(bps: number) {
    const transaction = new Transaction().add(
      createSetTransferFeeInstruction(
        this.mint,
        this.feeAuthority.publicKey,
        bps,
        BigInt(10_000 * 10 ** 9), 
        TOKEN_2022_PROGRAM_ID
      )
    );
    await sendAndConfirmTransaction(this.connection, transaction, [this.payer, this.feeAuthority]);
  }

  /**
   * 1. Harvest withheld fees from accounts
   * 2. Swap half to SOL
   * 3. Add LP to Meteora
   */
  private async harvestAndAutoLP() {
    console.log("[AUTO-LP] Checking for withheld fees...");
    
    const accountsToWithdrawFrom = await getAccountsToWithdrawFrom(this.connection, this.mint, TOKEN_2022_PROGRAM_ID);
    
    if (accountsToWithdrawFrom.length === 0) {
      console.log("[AUTO-LP] No fees to harvest.");
      return;
    }

    console.log(`[AUTO-LP] Harvesting from ${accountsToWithdrawFrom.length} accounts...`);

    // 2. Withdraw withheld tokens to payer
    const withdrawIx = createWithdrawWithheldTokensFromAccountsInstruction(
        this.mint,
        this.payer.publicKey,
        this.withdrawAuthority.publicKey,
        [],
        accountsToWithdrawFrom,
        TOKEN_2022_PROGRAM_ID
    );

    const withdrawTx = new Transaction().add(withdrawIx);
    await sendAndConfirmTransaction(this.connection, withdrawTx, [this.payer, this.withdrawAuthority]);

    // 3. Get total tokens harvested
    // In a real scenario, we'd check the payer's token account balance
    const tokenAccount = await this.connection.getTokenAccountsByOwner(this.payer.publicKey, { mint: this.mint });
    if (tokenAccount.value.length === 0) return;
    
    const accountInfo = await getAccount(this.connection, tokenAccount.value[0].pubkey, "confirmed", TOKEN_2022_PROGRAM_ID);
    const totalHarvested = new BN(accountInfo.amount.toString());

    if (totalHarvested.lt(new BN(1000))) {
      console.log("[AUTO-LP] Harvested amount too small for Auto-LP.");
      return;
    }

    console.log(`[AUTO-LP] Total harvested: ${totalHarvested.toString()}`);

    // 4. Swap half to SOL
    const swappedAmount = await swapHalfToSOL(this.connection, this.payer, this.poolAddress, totalHarvested);
    
    // 5. Add Liquidity
    const solBalance = await this.connection.getBalance(this.payer.publicKey);
    await addLiquidityToMeteora(
      this.connection, 
      this.payer, 
      this.poolAddress, 
      totalHarvested.sub(swappedAmount), 
      new BN(solBalance).div(new BN(10)) // Using 10% of balance for mock
    );

    console.log("[AUTO-LP] Completed successfully.");
  }

  private async getTokenPriceFromMeteora(): Promise<number> {
    try {
      const dlmmPool = await DLMM.create(this.connection, this.poolAddress);
      const activeBin = await dlmmPool.getActiveBin();
      return parseFloat(activeBin.price);
    } catch (e) {
      console.error("[PRICE ERROR] Failed to fetch price from Meteora:", e);
      return 0.05; // Fallback
    }
  }
}
