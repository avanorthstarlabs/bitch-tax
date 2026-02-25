# Launch Checklist: Fee Decay Token

## Pre-Launch
- [ ] Generate **Payer** Keypair (SOL loaded for rent/gas).
- [ ] Generate **Keeper** Keypair (SOL loaded for gas).
- [ ] Configure `packages/config/src/index.ts` (Thresholds, Fees).
- [ ] Initialize Token-2022 Mint (`apps/admin-cli/src/index.ts`).
- [ ] Verify `TransferFeeConfig` extension is active.

## Launch Phase
- [ ] Create **Meteora DLMM Pool** for Token/SOL pair.
- [ ] Add initial liquidity (e.g., 50% supply + 100 SOL).
- [ ] Revoke **Mint** and **Freeze** authorities.
- [ ] Verify supply is fixed.
- [ ] Transfer **Fee Config** and **Withdraw Withheld** authorities to the **Keeper**.

## Operation Phase
- [ ] Start **Keeper** service (`apps/fee-controller`).
- [ ] Monitor logs for:
    - [ ] Market Cap polling.
    - [ ] Fee adjustments (Tier transitions).
    - [ ] Fee harvesting from pool accounts.
    - [ ] Auto-LP swaps and additions.

## Finalization
- [ ] Reach Tier 3 ($50M MC).
- [ ] After Tier 3 Grace expires, **revoke Fee Config Authority** forever.
- [ ] Verify `fee_config_authority` is set to `null`.
