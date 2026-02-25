import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { unpackMint, TOKEN_2022_PROGRAM_ID, getTransferFeeConfig } from '@solana/spl-token';

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const MINT_ADDRESS = process.env.NEXT_PUBLIC_MINT_ADDRESS;

export function useTokenTax() {
  const [feeBps, setFeeBps] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTax() {
      try {
        if (!MINT_ADDRESS || MINT_ADDRESS === "YourMintAddressHere") {
          // Fallback for development/demo
          setFeeBps(3330);
          setLoading(false);
          return;
        }

        const connection = new Connection(RPC_URL);
        const mintPubkey = new PublicKey(MINT_ADDRESS);
        
        const info = await connection.getAccountInfo(mintPubkey);
        if (!info) throw new Error("Mint not found");

        const mint = unpackMint(mintPubkey, info, TOKEN_2022_PROGRAM_ID);
        const feeConfig = getTransferFeeConfig(mint);

        if (feeConfig) {
          // For simplicity, we use the newerTransferFee bps.
          // In a high-precision app, you'd check current epoch vs feeConfig.newerTransferFee.epoch
          setFeeBps(feeConfig.newerTransferFee.transferFeeBasisPoints);
        } else {
          setFeeBps(0);
        }
      } catch (err) {
        console.error("Error fetching token tax:", err);
        setError(err instanceof Error ? err.message : String(err));
        // Fallback for demo visualization
        setFeeBps(3330); 
      } finally {
        setLoading(false);
      }
    }

    fetchTax();
    const interval = setInterval(fetchTax, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return { feeBps, loading, error };
}
