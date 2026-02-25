import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction, 
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { 
  getOrCreateAssociatedTokenAccount, 
  createTransferInstruction, 
  TOKEN_2022_PROGRAM_ID 
} from '@solana/spl-token';
import { createClient } from '@supabase/supabase-js';
import BN from 'bn.js';

/**
 * Distribution System for Presalers
 */
export class DistributionSystem {
  private supabase;

  constructor(
    private connection: Connection,
    private payer: Keypair,
    private mint: PublicKey,
    supabaseUrl: string,
    supabaseKey: string
  ) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Fetches pending contributors from Supabase
   */
  async getPendingContributors() {
    const { data, error } = await this.supabase
      .from('contributors')
      .select('*')
      .eq('distributed', false);

    if (error) throw error;
    return data;
  }

  /**
   * Distributes tokens to a batch of contributors
   */
  async distributeBatch(batchSize: number = 10) {
    const contributors = await this.getPendingContributors();
    const batch = contributors.slice(0, batchSize);

    console.log(`[DISTRIBUTION] Starting batch distribution for ${batch.length} contributors...`);

    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.payer,
      this.mint,
      this.payer.publicKey,
      false,
      'confirmed',
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    for (const contributor of batch) {
      try {
        const destWallet = new PublicKey(contributor.wallet_address);
        const amount = BigInt(contributor.token_allocation);

        console.log(`[DISTRIBUTION] Sending ${amount.toString()} tokens to ${contributor.wallet_address}...`);

        const destTokenAccount = await getOrCreateAssociatedTokenAccount(
          this.connection,
          this.payer,
          this.mint,
          destWallet,
          false,
          'confirmed',
          undefined,
          TOKEN_2022_PROGRAM_ID
        );

        const tx = new Transaction().add(
          createTransferInstruction(
            sourceTokenAccount.address,
            destTokenAccount.address,
            this.payer.publicKey,
            amount,
            [],
            TOKEN_2022_PROGRAM_ID
          )
        );

        const signature = await sendAndConfirmTransaction(this.connection, tx, [this.payer]);

        // Update Supabase
        await this.supabase
          .from('contributors')
          .update({ 
            distributed: true, 
            distribution_tx: signature 
          })
          .eq('id', contributor.id);

        console.log(`[DISTRIBUTION] SUCCESS: ${signature}`);
      } catch (err) {
        console.error(`[DISTRIBUTION] FAILED for ${contributor.wallet_address}:`, err);
      }
    }
  }

  /**
   * Helper to record a new contribution
   */
  async recordContribution(walletAddress: string, solAmount: number, tokenAllocation: number) {
    const { data, error } = await this.supabase
      .from('contributors')
      .insert([
        { 
          wallet_address: walletAddress, 
          sol_amount: solAmount, 
          token_allocation: tokenAllocation 
        }
      ]);

    if (error) throw error;
    return data;
  }
}
