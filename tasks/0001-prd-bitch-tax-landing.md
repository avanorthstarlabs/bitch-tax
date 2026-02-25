# Product Requirements Document: Bitch Tax Landing Page

## 1. Introduction
The **Bitch Tax Landing Page** is a high-impact, visual-first website designed to explain the mechanics of the "Bitch Tax" (Solana Fee Decay Token) to potential investors and users. It serves as the primary educational and marketing interface, featuring live on-chain data and complex visualizations to demonstrate the unique value proposition (unavoidable fees that decay over time and lock liquidity).

## 2. Goals
- **Educate:** Clearly explain the "Panic -> Grace -> Stable" fee decay mechanism.
- **Visualize:** Use high-quality SVG animations to make the abstract concept concrete.
- **Prove:** Display REAL-TIME data from the Solana blockchain to prove the current tax rate and market cap.
- **Auto-LP Transparency:** Show exactly how fees are converted into locked liquidity.
- **Convert:** Drive users to trade on Meteora via deep links.

## 3. User Stories
- As a **degen trader**, I want to see the **current tax rate** immediately so I know if it's safe to buy/sell.
- As a **skeptic**, I want to see the **visual breakdown** of where the tax goes (Auto-LP) so I trust the project isn't a rug.
- As a **diamond hand**, I want to see the total amount of **liquidity added from taxes** to feel secure in my position.

## 4. Functional Requirements

### 4.1. Hero Section (The "Hook")
- **Live Tax Display:** A massive, neon-styled counter showing the current Transfer Fee (e.g., "33.3%", "10%", "6%").
  - *Source:* RPC call to the Token-2022 Mint Account (TransferFeeConfig extension).
- **Market Cap Status:** Live MC display with a progress bar towards the next "Decay Milestone" (e.g., "$11M / $25M for next drop").
- **CTA:** "Buy on Meteora" button (neon, glowing).

### 4.2. The "Fee Decay" Visualization (SVG Animation)
- **Concept:** A tiered "bucket" or "pressure valve" system.
  - **Tier 0 (Panic):** Red/Hot colors, high pressure, 33.3% drain.
  - **Grace Period:** Valve opens, pressure drops, colors shift to Orange/Yellow.
  - **Stable:** Green/Cool colors, low pressure, 1% fee.
- **Tech:** React-Spring or Framer Motion handling SVG paths.

### 4.3. Mechanics Explainer
- **Auto-LP Section:** Diagram showing:
  1. Transaction (Transfer) -> Fee Withheld.
  2. Keeper Bot ("The Bitch") harvests.
  3. Swap 50% -> SOL.
  4. Add LP -> Lock.
- **Live LP Counter:** "Total Fees Locked: $XX,XXX" (Live RPC fetch).

### 4.4. The Launch Vault (Community Seeding)
- **Contribution UI:** A "Commit SOL" interface for early believers to seed the initial liquidity.
- **Progress Tracking:** Real-time progress bar showing "SOL Committed vs. Goal" (e.g., "12.5 / 50 SOL").
- **Status:** "Vesting Status" for contributors (showing their future allocation).
- **Security:** Clear notice that SOL is locked in a dedicated vault until the Meteora LP is seeded.

## 5. Launch Vault Mechanics
1. **Commit Phase:** Users send SOL to the vault.
2. **Goal Threshold:** Once the goal (e.g. 50 SOL) is reached, the "Commit Phase" closes.
3. **Auto-Launch:** The Agent (Ava) executes the `admin-cli` flow:
   - Mints 1B Bitch Tax tokens.
   - Splits tokens: 50% to LP, X% to contributors, Y% to treasury.
   - Seeds Meteora DLMM using the 50 SOL + 50% tokens.
   - Revokes mint authority.
   - Starts Fee Decay Controller.

## 5. Design & Aesthetic
- **Theme:** "Bitch Tax" / Cyberpunk / Hacker Terminal.
- **Colors:** Neon Green (`#39ff14`), Hot Pink (for high taxes), Deep Black background.
- **Typography:** Monospace (JetBrains Mono or similar) for data; Aggressive display font for headers.
- **Vibe:** Aggressive, transparent, high-tech.

## 6. Technical Stack
- **Framework:** Next.js 14 (App Router).
- **Styling:** Tailwind CSS (v3).
- **Solana:** `@solana/web3.js`, `@solana/spl-token` (for parsing Mint data).
- **Animation:** Framer Motion.
- **Hosting:** Vercel (or static export).

## 7. Open Questions
- **Meteora Integration:** Can we embed the Meteora swap widget directly? (Stretch goal).
- **Domain:** What is the deployment domain? (TBD).
