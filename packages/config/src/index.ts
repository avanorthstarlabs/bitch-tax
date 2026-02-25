export interface FeeTier {
  id: number;
  name: string;
  thresholdMC: number; // USD
  sustainMinutes: number;
  graceMinutes: number;
  graceFeeBps: number;
  stableFeeBps: number;
}

export const TOKEN_TOTAL_SUPPLY = 1_000_000_000; // 1 Billion
export const TOKEN_DECIMALS = 9;

export const FEE_TIERS: FeeTier[] = [
  {
    id: 0,
    name: "Launch Panic",
    thresholdMC: 10_000_000,
    sustainMinutes: 30,
    graceMinutes: 360, // 6 hours
    graceFeeBps: 1000, // 10%
    stableFeeBps: 600, // 6%
  },
  {
    id: 1,
    name: "Mid-Cap Growth",
    thresholdMC: 25_000_000,
    sustainMinutes: 60,
    graceMinutes: 720, // 12 hours
    graceFeeBps: 600, // 6%
    stableFeeBps: 300, // 3%
  },
  {
    id: 2,
    name: "Established Powerhouse",
    thresholdMC: 50_000_000,
    sustainMinutes: 120,
    graceMinutes: 1440, // 24 hours
    graceFeeBps: 300, // 3%
    stableFeeBps: 100, // 1%
  }
];
