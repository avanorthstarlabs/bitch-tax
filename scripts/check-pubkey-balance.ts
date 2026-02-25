import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function check() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const pubkey = new PublicKey("5yzSt2hS6ieoacEkXZ2mVHkWcdJikd5hfAvHBPNWGs8K");
    console.log(`Checking balance for: ${pubkey.toBase58()}`);
    const balance = await connection.getBalance(pubkey);
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

check();
