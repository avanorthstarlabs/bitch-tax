import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  getMintLen,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';

export async function createFeeDecayToken(
  connection: Connection,
  payer: Keypair,
  mintKeypair: Keypair,
  feeConfigAuthority: PublicKey,
  withdrawWithheldAuthority: PublicKey,
  decimals: number = 9,
  initialFeeBps: number = 3330, 
  maxFee: bigint = BigInt(10_000 * 10 ** 9) 
) {
  const mint = mintKeypair.publicKey;
  const extensions = [ExtensionType.TransferFeeConfig];
  const mintLen = getMintLen(extensions);
  const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeTransferFeeConfigInstruction(
      mint,
      feeConfigAuthority,
      withdrawWithheldAuthority,
      initialFeeBps,
      maxFee,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint,
      decimals,
      payer.publicKey, // Temporary mint authority
      payer.publicKey, // Freeze authority
      TOKEN_2022_PROGRAM_ID
    )
  );

  await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair]);
  console.log(`Mint created: ${mint.toBase58()}`);
}

export async function finalizeLaunch(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  recipient: PublicKey,
  amount: bigint
) {
  // Fix: Need an ATA for the recipient before MintTo
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    recipient,
    false,
    'confirmed',
    undefined,
    TOKEN_2022_PROGRAM_ID
  );

  const transaction = new Transaction().add(
    // 1. Mint total supply to recipient ATA
    createMintToInstruction(mint, ata.address, payer.publicKey, amount, [], TOKEN_2022_PROGRAM_ID),
    // 2. Revoke mint authority forever
    createSetAuthorityInstruction(mint, payer.publicKey, AuthorityType.MintTokens, null, [], TOKEN_2022_PROGRAM_ID),
    // 3. Revoke freeze authority forever
    createSetAuthorityInstruction(mint, payer.publicKey, AuthorityType.FreezeAccount, null, [], TOKEN_2022_PROGRAM_ID)
  );

  await sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(`Mint authority revoked for ${mint.toBase58()}`);
}
