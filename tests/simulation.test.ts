import { FeeController } from '../apps/fee-controller/src/index';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { FEE_TIERS } from '../packages/config/src/index';

async function testFeeDecayLogic() {
  console.log("--- STARTING FEE DECAY SIMULATION ---");

  // Better Mocks
  const connection = {
    getProgramAccounts: async () => [],
    getMinimumBalanceForRentExemption: async () => 1000,
    sendRawTransaction: async () => "sig",
    confirmTransaction: async () => ({ value: { err: null } }),
  } as unknown as Connection;

  const payer = Keypair.generate();
  const mint = PublicKey.unique();
  const feeAuthority = Keypair.generate();
  const withdrawAuthority = Keypair.generate();
  const poolAddress = PublicKey.unique();

  const controller = new FeeController(
    connection,
    payer,
    mint,
    feeAuthority,
    withdrawAuthority,
    poolAddress
  );

  // Override updateOnChainFee to avoid real network calls
  (controller as any).updateOnChainFee = async (bps: number) => {
    console.log(`[MOCK] Updating on-chain fee to ${bps} bps`);
  };

  // 1. Initial State: Tier 0 (Launch Panic 33.3%)
  console.log("Scenario 1: Launch Panic");
  (controller as any).getTokenPriceFromMeteora = async () => 0.005; // $5M MC
  await controller.runCycle(); 

  // 2. Cross $10M Threshold
  console.log("\nScenario 2: Crossing $10M Threshold");
  (controller as any).getTokenPriceFromMeteora = async () => 0.011; // $11M MC
  await controller.runCycle(); // Should start sustain timer

  // 3. Sustain for 31 minutes
  console.log("\nScenario 3: Sustaining for 31 minutes");
  (controller as any).lastThresholdCrossedAt = Date.now() - (31 * 60 * 1000);
  await controller.runCycle(); // Should enter Grace Period Tier 1

  // 4. Verify Grace Period state
  if ((controller as any).inGracePeriod) {
    console.log("SUCCESS: Entered Grace Period.");
  }

  // 5. Expiration of Grace Period
  console.log("\nScenario 4: Grace Period Expiration");
  (controller as any).gracePeriodEndAt = Date.now() - 1000;
  await controller.runCycle(); // Should set Stable Fee Tier 1

  if (!(controller as any).inGracePeriod && (controller as any).currentTierIndex === 0) {
    console.log("SUCCESS: Settled at Stable Fee Tier 1.");
  }

  console.log("\n--- SIMULATION COMPLETE ---");
}

testFeeDecayLogic().catch(console.error);
