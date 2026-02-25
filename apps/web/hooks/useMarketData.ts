import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
const MINT_ADDRESS = process.env.NEXT_PUBLIC_MINT_ADDRESS;

export interface MarketData {
  marketCap: number;
  totalLiquidity: number;
  feesLocked: number;
  vaultBalance: number;
  vaultGoal: number;
  isLive: boolean;
}

export function useMarketData() {
  const [data, setData] = useState<MarketData>({
    marketCap: 0,
    totalLiquidity: 0,
    feesLocked: 0,
    vaultBalance: 0,
    vaultGoal: 50,
    isLive: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const connection = new Connection(RPC_URL);
        
        let vaultSolBalance = 0;
        if (VAULT_ADDRESS) {
          try {
            const vaultPubkey = new PublicKey(VAULT_ADDRESS);
            vaultSolBalance = await connection.getBalance(vaultPubkey) / 1e9;
          } catch (e) {
            console.error("Invalid Vault Address");
          }
        }

        // Logic to determine if project is live
        // For now, if vault >= goal, it's "Live" or if we have a mint address that isn't placeholder
        const isLive = MINT_ADDRESS && MINT_ADDRESS !== "TokenkegQfeZyiNwAJbVNBH4DQ3RBve3m6K6Kw";

        // Mocking price/mcap for now as we don't have a pool yet
        // In reality, you'd fetch from DexScreener/Jupiter API
        const mockMcap = isLive ? 125000 : 0;
        const mockFeesLocked = isLive ? 1250 : 0;
        
        setData({
          marketCap: mockMcap,
          totalLiquidity: mockFeesLocked * 2, // Simple estimation
          feesLocked: mockFeesLocked,
          vaultBalance: vaultSolBalance || 12.5, // Mocked 12.5 for demo if no address
          vaultGoal: 50,
          isLive: !!isLive,
        });

      } catch (err) {
        console.error("Error fetching market data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}
