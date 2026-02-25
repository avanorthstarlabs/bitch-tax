import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';

async function tinyAirdrop() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const secretKey = JSON.parse(fs.readFileSync('deployer.json', 'utf-8'));
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    
    console.log(`Address: ${keypair.publicKey.toBase58()}`);
    console.log("Requesting tiny airdrop of 0.01 SOL...");
    try {
        const signature = await connection.requestAirdrop(keypair.publicKey, 0.01 * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature);
        console.log("Airdrop successful!");
        const balance = await connection.getBalance(keypair.publicKey);
        console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    } catch (e) {
        console.error("Airdrop failed. Faucet is truly dead for now.");
    }
}

tinyAirdrop();
