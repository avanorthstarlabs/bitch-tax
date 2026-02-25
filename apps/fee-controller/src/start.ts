import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { FeeController } from './index';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

async function start() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // Load deployer as payer and authority
    const secretKey = JSON.parse(fs.readFileSync('deployer.json', 'utf-8'));
    const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    
    // The Mint we just created
    const mint = new PublicKey("D8NpQER2c3tP19MuZaVHs3wLYKEeieNRSiA3hemFtRYN");
    
    // Using a system program address as a placeholder for the pool in devnet test
    const poolAddress = new PublicKey("11111111111111111111111111111111");

    const controller = new FeeController(
        connection,
        payer,
        mint,
        payer, // feeAuthority
        payer, // withdrawAuthority
        poolAddress
    );

    console.log("--- BITCH TAX KEEPER STARTED ---");
    console.log(`Monitoring Mint: ${mint.toBase58()}`);

    // Run the cycle immediately
    await controller.runCycle();

    // Set up 5 minute interval
    setInterval(async () => {
        try {
            await controller.runCycle();
        } catch (e) {
            console.error("Cycle failed:", e);
        }
    }, 5 * 60 * 1000);
}

start().catch(console.error);
