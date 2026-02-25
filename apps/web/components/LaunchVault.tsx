'use client';

import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Users, Lock } from 'lucide-react';
import { useMarketData } from '../hooks/useMarketData';

export default function LaunchVault() {
  const { data: marketData, loading } = useMarketData();
  const progress = (marketData.vaultBalance / marketData.vaultGoal) * 100;

  return (
    <section id="vault" className="py-24 relative overflow-hidden bg-black/60">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-green/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-[10px] font-bold tracking-[0.2em] uppercase mb-6"
            >
              <Rocket size={14} /> Phase 1: Community Seeding
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
              THE <span className="text-neon-green text-glow">LAUNCH</span> VAULT
            </h2>
            <p className="text-gray-400 font-mono max-w-2xl mx-auto text-sm leading-relaxed">
              Early believers fund the initial liquidity. In return, you get genesis tokens at the best possible entry before the 33.3% Panic Tax goes live.
            </p>
          </div>

          {/* Progress Card */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-neon-surface/40 border border-white/5 p-8 md:p-16 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Lock size={120} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div>
                <span className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">Vault Progress</span>
                <div className="text-4xl md:text-6xl font-display font-bold text-white mt-2">
                  {marketData.vaultBalance.toFixed(1)} <span className="text-neon-green">/ {marketData.vaultGoal} SOL</span>
                </div>
              </div>
              <div className="text-right w-full md:w-auto">
                <span className="text-neon-green font-display font-black text-4xl">{progress.toFixed(0)}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-6 bg-black/60 rounded-full overflow-hidden border border-white/10 mb-12 relative p-1">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-gradient-to-r from-neon-yellow to-neon-green rounded-full relative"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:30px_30px] animate-[progress-shine_3s_linear_infinite]" />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem icon={<Users size={16} />} label="Contributors" value="142" />
              <StatItem icon={<Rocket size={16} />} label="Est. MCAP" value="$125K" />
              <StatItem icon={<Lock size={16} />} label="Locked" value="Genesis" />
              <StatItem icon={<ShieldCheck size={16} />} label="Status" value="Verified" color="text-blue-400" />
            </div>
          </motion.div>

          {/* Action Area */}
          <div className="mt-12 flex flex-col items-center">
            <button className="w-full max-w-md bg-neon-green text-black font-black py-7 px-8 rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-[0.3em] text-xl shadow-[0_0_40px_rgba(57,255,20,0.2)] mb-8">
              COMMIT SOL TO VAULT
            </button>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">
              <Lock size={12} /> Minimum Contribution: 0.1 SOL • 100% Locked Liquidity
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes progress-shine {
          0% { background-position: 0 0; }
          100% { background-position: 60px 0; }
        }
      `}</style>
    </section>
  );
}

function StatItem({ icon, label, value, color = "text-white" }: { icon: any, label: string, value: string, color?: string }) {
  return (
    <div className="p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-xl font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
