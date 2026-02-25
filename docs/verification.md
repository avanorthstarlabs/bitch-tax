# Verification: Fee Decay System

## How to Verify Token-2022 Extensions
The transfer fee is built into the SPL Token-2022 program. Use the `spl-token` CLI:

```bash
# 1. View Mint Account and Extensions
spl-token --program-id TokenzQdBNbLqP5VEhdkXEhWobFLDYZZ69HIAXKSBkR display <MINT_ADDRESS>

# 2. Check for TransferFeeConfig Extension
# Look for "Extension: TransferFeeConfig" in the output.
# You will see:
# - Current Fee Basis Points (e.g., 4000 = 40%)
# - Max Fee (e.g., 100% of supply)
# - Fee Config Authority (The Keeper's address)
# - Withdraw Withheld Authority (The Keeper's address)
```

## How to Verify LP Locking
1.  Go to **Solana Explorer** or **Solscan**.
2.  Input the **Meteora Pool address**.
3.  Check the **LP Token account**.
4.  Confirm the **Owner** is a **Burn Address** (`11111111111111111111111111111111`) or a **Null PDA** with no `transfer` authority.

## How to Verify Fee Logic
The fee is updated on-chain. After a Market Cap milestone is reached, the `Fee Config Authority` (Keeper) sends an `updateTransferFee` transaction.
1.  Monitor the **Fee Config Authority** on-chain.
2.  Look for `UpdateTransferFee` instructions.
3.  Verify the `newFeeBasisPoints` matches the Tier in `packages/config`.
