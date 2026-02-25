import { Connection, Keypair } from '@solana/web3.js';
import * as fs from 'fs';

async function generateMainnetKey() {
    const keypair = Keypair.generate();
    const secretKey = Array.from(keypair.secretKey);
    fs.writeFileSync('mainnet-deployer.json', JSON.stringify(secretKey));
    console.log(`
--- MAINNET DEPLOYER GENERATED ---`);
    console.log(`Address: ${keypair.publicKey.toBase58()}`);
    console.log(`File:    mainnet-deployer.json (GIT-IGNORED)`);
    console.log(`
ACTION REQUIRED: Fund this wallet with the SOL required for liquidity seeding.`);
}

generateMainnetKey();
