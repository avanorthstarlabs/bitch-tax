'use client';

import { useTokenTax } from '../hooks/useTokenTax';
import { useMarketData } from '../hooks/useMarketData';
import TaxVisualizer from './TaxVisualizer';
import { motion } from 'framer-motion';

export default function Hero() {
  const { feeBps } = useTokenTax();
  const { data: marketData } = useMarketData();
  const fee = feeBps ?? 3330; // Default to Panic Mode for demo

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-green/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-pink/5 blur-[100px] rounded-full" />
      </div>

      {/* Content Container */}
      <div className="z-10 container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Copy */}
        <div className="text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
              Solana Fee Decay Protocol
            </div>
            <h1 className="text-6xl md:text-9xl font-bold font-display tracking-tighter mb-4 leading-none">
              <span className="text-neon-green text-glow">BITCH</span><br/>
              <span className="text-white">TAX</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-lg mx-auto lg:mx-0 font-mono">
              The only token that punishes paper hands and builds massive permanent liquidity.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-neon-surface/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Current Trade Fee</div>
              <div className="text-3xl font-mono text-neon-green font-bold">{(fee / 100).toFixed(1)}%</div>
            </div>
            <div className="bg-neon-surface/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Locked Fees</div>
              <div className="text-3xl font-mono text-neon-yellow font-bold">
                ${marketData.feesLocked > 0 ? marketData.feesLocked.toLocaleString() : '--'}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            {marketData.isLive ? (
              <a 
                href="https://meteora.ag" 
                target="_blank"
                className="inline-block bg-neon-green text-black font-bold py-5 px-10 rounded-xl hover:bg-white transition-all duration-300 uppercase tracking-[0.2em] text-lg shadow-[0_0_30px_rgba(57,255,20,0.3)]"
              >
                BUY ON METEORA
              </a>
            ) : (
              <a 
                href="#vault"
                className="inline-block bg-neon-green text-black font-bold py-5 px-10 rounded-xl hover:bg-white transition-all duration-300 uppercase tracking-[0.2em] text-lg shadow-[0_0_30px_rgba(57,255,20,0.3)]"
              >
                COMMIT TO LP VAULT
              </a>
            )}
            
            <a 
              href="#mechanics"
              className="inline-block bg-white/5 border border-white/10 text-white font-bold py-5 px-10 rounded-xl hover:bg-white/10 transition-all duration-300 uppercase tracking-[0.2em] text-lg"
            >
              MECHANICS
            </a>
          </motion.div>
        </div>

        {/* Right: Visualizer */}
        <div className="flex justify-center lg:justify-end items-center lg:pr-32">
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <div className="absolute inset-0 bg-neon-green/10 blur-[120px] rounded-full" />
            <TaxVisualizer feeBps={fee} />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
