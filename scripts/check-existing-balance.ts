import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as fs from 'fs';

async function checkBalance() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const keyPath = "/home/hackerman/agent-runtime/tools/agent-wallet-lab/keys/solana-keypair.json";
    if (!fs.existsSync(keyPath)) {
        console.log("No key found at " + keyPath);
        return;
    }
    const secretKey = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
    const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    
    console.log(`Address: ${keypair.publicKey.toBase58()}`);
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`Devnet Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

checkBalance();
