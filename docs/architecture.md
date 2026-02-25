# Architecture: Fee Decay & Auto-LP System

## Overview
A production-ready Solana Token-2022 implementation that enforces a global transfer fee, decaying dynamically as market cap milestones are reached. All collected fees are converted into SOL/Token liquidity and locked.

## Core Components
1. **Token-2022 Mint**:
   - Extension: `TransferFeeConfig` (Basis Points + Max Fee).
   - Initial Fee: 4000 bps (40%).
   - Authorities: Assigned to the `Keeper` wallet.

2. **Keeper (Off-chain Controller)**:
   - Polls Market Cap from Meteora DLMM every 5 minutes.
   - Computes sustained price (TWAP/Median) to avoid manipulation.
   - Manages state machine: `Launch` -> `Tier 1 (Grace)` -> `Tier 1 (Stable)` -> ... -> `Final (1%)`.
   - Executes `withdrawWithheldTokensFromAccounts` periodically.

3. **Auto-LP Engine**:
   - Harvested fees are split 50/50.
   - 50% swapped for SOL via Jupiter/Meteora.
   - Pair added to Meteora DLMM pool.
   - LP tokens are either burned or sent to a null-address PDA.

## State Transitions
1. **Sustain Period**: MC must be above threshold for X minutes (e.g., 30 mins) before triggering a decay.
2. **Grace Window**: After a threshold is met, the fee drops immediately to a "Grace" level (incentive for buyers).
3. **Stable Fee**: After the grace period (e.g., 6 hours) ends, the fee settles at the Tier's "Stable" level.
4. **Final Tier**: Once $50M MC is reached, the fee is permanently set to 1% and the fee authority is revoked.
