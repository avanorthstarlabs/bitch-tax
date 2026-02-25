import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createFeeDecayToken, finalizeLaunch } from '../../../scripts/deploy-token';
import { createMeteoraPool, addLiquidityToMeteora } from '../../../packages/solana-utils/src/meteora';
import { TOKEN_DECIMALS, TOKEN_TOTAL_SUPPLY } from '../../../packages/config/src/index';
import BN from 'bn.js';
import * as fs from 'fs';

/**
 * INITIAL SETUP FLOW:
 * 1. Load Deployer Keypair
 * 2. Deploy Token-2022 with initial 33.3% Fee (Tier 0 Start)
 * 3. Seed initial liquidity to Meteora DLMM
 * 4. Revoke Mint/Freeze Authorities
 * 5. Start Keeper (FeeController)
 */

async function main() {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load the funded keypair
  const secretKey = JSON.parse(fs.readFileSync('deployer.json', 'utf-8'));
  const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));
  
  // Keeper will use the same wallet for devnet test
  const keeperKeypair = payer; 
  const mintKeypair = Keypair.generate();
  const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");

  console.log(`--- LAUNCHING BITCH TAX ON DEVNET ---`);
  console.log(`Deployer: ${payer.publicKey.toBase58()}`);
  console.log(`Minting:  ${mintKeypair.publicKey.toBase58()}`);

  // 1. Create Mint with 33.3% Tax
  await createFeeDecayToken(
    connection,
    payer,
    mintKeypair,
    keeperKeypair.publicKey, 
    keeperKeypair.publicKey, 
    TOKEN_DECIMALS,
    3330 
  );

  // 2. Mint Total Supply to Payer for seeding LP
  const totalAmount = BigInt(TOKEN_TOTAL_SUPPLY) * BigInt(10 ** TOKEN_DECIMALS);
  
  // 3. Create LP on Meteora (DLMM)
  const poolAddress = await createMeteoraPool(
    connection,
    payer,
    mintKeypair.publicKey,
    SOL_MINT
  );

  // Use 1 SOL for seeding on devnet
  await addLiquidityToMeteora(
    connection,
    payer,
    poolAddress,
    new BN(totalAmount.toString()),
    new BN(1 * 10 ** 9) 
  );

  // 4. Finalize: Revoke Authorities
  await finalizeLaunch(connection, payer, mintKeypair.publicKey, payer.publicKey, totalAmount);

  console.log(`\n🚀 Success! Bitch Tax is live on Devnet.`);
  console.log(`Token Address: ${mintKeypair.publicKey.toBase58()}`);
  console.log(`Meteora Pool:  ${poolAddress.toBase58()}`);
  console.log(`\n--- START THE KEEPER SERVICE NOW ---`);
}

main().catch(console.error);
