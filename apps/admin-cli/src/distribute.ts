import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { DistributionSystem } from '../../packages/solana-utils/src/distribution';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function main() {
  const rpcUrl = process.env.RPC_URL || "https://api.devnet.solana.com";
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const mintAddress = process.env.MINT_ADDRESS;
  const payerKeyPath = process.env.KEEPER_PRIVATE_KEY_PATH;

  if (!supabaseUrl || !supabaseKey || !mintAddress || !payerKeyPath) {
    console.error("Missing environment variables. Check .env");
    process.exit(1);
  }

  const connection = new Connection(rpcUrl, "confirmed");
  const payerSecret = JSON.parse(fs.readFileSync(payerKeyPath, 'utf-8'));
  const payer = Keypair.fromSecretKey(Uint8Array.from(payerSecret));
  const mint = new PublicKey(mintAddress);

  const distribution = new DistributionSystem(
    connection,
    payer,
    mint,
    supabaseUrl,
    supabaseKey
  );

  console.log("--- BITCH TAX DISTRIBUTION TOOL ---");
  
  const pending = await distribution.getPendingContributors();
  console.log(`Found ${pending.length} pending contributors.`);

  if (pending.length > 0) {
    await distribution.distributeBatch(10);
  } else {
    console.log("Nothing to distribute.");
  }
}

main().catch(console.error);
