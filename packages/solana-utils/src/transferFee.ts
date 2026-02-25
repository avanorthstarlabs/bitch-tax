import { 
  PublicKey, 
  TransactionInstruction, 
  Connection,
} from '@solana/web3.js';
import { 
  TOKEN_2022_PROGRAM_ID, 
} from '@solana/spl-token';
import { struct, u8, u16, Layout } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export enum TransferFeeInstruction {
    InitializeTransferFeeConfig = 0,
    TransferCheckedWithFee = 1,
    WithdrawWithheldTokensFromMint = 2,
    WithdrawWithheldTokensFromAccounts = 3,
    HarvestWithheldTokensToMint = 4,
    SetTransferFee = 5
}

export interface SetTransferFeeInstructionData {
    instruction: number;
    transferFeeInstruction: number;
    transferFeeBasisPoints: number;
    maximumFee: bigint;
}

export const setTransferFeeInstructionData = struct<SetTransferFeeInstructionData>([
    u8('instruction'),
    u8('transferFeeInstruction'),
    u16('transferFeeBasisPoints'),
    u64('maximumFee'),
]);

export function createSetTransferFeeInstruction(
    mint: PublicKey,
    authority: PublicKey,
    transferFeeBasisPoints: number,
    maximumFee: bigint,
    programId: PublicKey = TOKEN_2022_PROGRAM_ID
): TransactionInstruction {
    const keys = [
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: authority, isSigner: true, isWritable: false },
    ];
    const data = Buffer.alloc(setTransferFeeInstructionData.span);
    setTransferFeeInstructionData.encode({
        instruction: 26, // TransferFeeExtension
        transferFeeInstruction: TransferFeeInstruction.SetTransferFee,
        transferFeeBasisPoints,
        maximumFee,
    }, data);
    return new TransactionInstruction({ keys, programId, data });
}

export async function getAccountsToWithdrawFrom(
    connection: Connection,
    mint: PublicKey,
    programId: PublicKey = TOKEN_2022_PROGRAM_ID
): Promise<PublicKey[]> {
    try {
        const allAccounts = await connection.getProgramAccounts(programId, {
            filters: [
                { memcmp: { offset: 0, bytes: mint.toBase58() } }
            ]
        });

        const accountsWithFees: PublicKey[] = [];
        for (const account of allAccounts) {
            if (account.account.data.length > 165) {
                accountsWithFees.push(account.pubkey);
            }
        }
        return accountsWithFees;
    } catch (e) {
        console.warn("[RPC WARNING] getProgramAccounts limited on this node. Skipping harvest for now.");
        return [];
    }
}
