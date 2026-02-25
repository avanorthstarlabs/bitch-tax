'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Send, ExternalLink, Copy } from 'lucide-react';

export default function Footer() {
  const contractAddress = "BITCHTAX_MINT_ADDRESS_HERE";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    alert("Address copied to clipboard!");
  };

  return (
    <footer className="py-16 bg-black border-t border-neon-green/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-3xl font-display font-bold text-white">
              BITCH <span className="text-neon-green">TAX</span>
            </h2>
            <p className="text-gray-500 font-mono text-sm">
              The first autonomous liquidity-injection protocol on Solana. 
              No rugs. No bullshit. Just math.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-neon-green/60 font-bold">Community</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green transition-colors flex items-center gap-2">
                  <Twitter size={14} /> Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green transition-colors flex items-center gap-2">
                  <Send size={14} /> Telegram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-neon-green transition-colors flex items-center gap-2">
                  <Github size={14} /> GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Contract */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.3em] text-neon-green/60 font-bold">Contract Address</h3>
            <div className="flex items-center gap-2 bg-neon-surface p-3 rounded border border-white/5 group">
              <code className="text-gray-400 font-mono text-xs break-all">
                {contractAddress}
              </code>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-neon-green/10 rounded transition-colors text-neon-green"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-600">
          <p>© 2026 BITCH TAX PROTOCOL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">DEXSCREENER</a>
            <a href="#" className="hover:text-white transition-colors">BIRDEYE</a>
            <a href="#" className="hover:text-white transition-colors">METEORA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
