import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'fs';

async function setupDevnet() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const keypair = Keypair.generate();
    
    // Save keypair
    const secretKey = Array.from(keypair.secretKey);
    fs.writeFileSync('deployer.json', JSON.stringify(secretKey));
    console.log(`Keypair generated and saved to deployer.json: ${keypair.publicKey.toBase58()}`);

    // Request Airdrop
    console.log("Requesting airdrop of 2 SOL...");
    try {
        const signature = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature);
        console.log("Airdrop successful!");
        const balance = await connection.getBalance(keypair.publicKey);
        console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    } catch (e) {
        console.error("Airdrop failed. You might need to use a manual faucet if rate limited.");
        console.log(`Address: ${keypair.publicKey.toBase58()}`);
    }
}

setupDevnet();
