import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';

async function testnetAirdrop() {
    const connection = new Connection("https://api.testnet.solana.com", "confirmed");
    const secretKey = JSON.parse(fs.readFileSync('deployer.json', 'utf-8'));
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    
    console.log(`Address: ${keypair.publicKey.toBase58()}`);
    console.log("Requesting 1 SOL on Testnet...");
    try {
        const signature = await connection.requestAirdrop(keypair.publicKey, 1 * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature);
        console.log("Testnet airdrop successful!");
        const balance = await connection.getBalance(keypair.publicKey);
        console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    } catch (e) {
        console.error("Testnet airdrop failed too.");
    }
}

testnetAirdrop();
