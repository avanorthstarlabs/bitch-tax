'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Droplets, Bot } from 'lucide-react';
import { useRef } from 'react';

export default function Mechanics() {
  const containerRef = useRef(null);
  
  const steps = [
    {
      title: "Tax Harvest",
      desc: "Every transaction triggers a transfer fee (Token-2022). These fees are withheld on-chain by the protocol.",
      icon: <ShieldAlert className="text-neon-pink w-6 h-6" />,
      color: "#ff0f5b"
    },
    {
      title: "The Keeper",
      desc: "Our automated keeper bot harvests the fees and splits them 50/50 for liquidity injection.",
      icon: <Bot className="text-neon-yellow w-6 h-6" />,
      color: "#ffbe0b"
    },
    {
      title: "Auto-LP Injection",
      desc: "Fees are converted to SOL and Token, then injected back into the Meteora DLMM pool forever.",
      icon: <Droplets className="text-neon-green w-6 h-6" />,
      color: "#39ff14"
    }
  ];

  return (
    <section id="mechanics" ref={containerRef} className="py-32 relative bg-black/40 border-y border-white/5 overflow-hidden">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-4">
            THE <span className="text-neon-green text-glow">LIQUIDITY</span> LOOP
          </h2>
          <p className="text-gray-500 font-mono uppercase tracking-[0.2em] text-sm">Automated • Unavoidable • Permanent</p>
        </div>

        {/* Advanced SVG Animation Section */}
        <div className="relative max-w-5xl mx-auto mb-32 h-[400px] hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0f5b" />
                <stop offset="50%" stopColor="#ffbe0b" />
                <stop offset="100%" stopColor="#39ff14" />
              </linearGradient>
              
              <filter id="neon-glow-mech">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Paths */}
            <path d="M 100 200 L 350 200" stroke="#111" strokeWidth="8" strokeLinecap="round" />
            <path d="M 400 200 C 450 200, 450 100, 550 100" stroke="#111" strokeWidth="8" strokeLinecap="round" />
            <path d="M 400 200 C 450 200, 450 300, 550 300" stroke="#111" strokeWidth="8" strokeLinecap="round" />
            <path d="M 600 100 C 700 100, 700 200, 750 200" stroke="#111" strokeWidth="8" strokeLinecap="round" />
            <path d="M 600 300 C 700 300, 700 200, 750 200" stroke="#111" strokeWidth="8" strokeLinecap="round" />

            {/* Animated Flow */}
            <motion.path
              d="M 100 200 L 350 200"
              stroke="url(#flow-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              filter="url(#neon-glow-mech)"
            />

            <motion.path
              d="M 400 200 C 450 200, 450 100, 550 100"
              stroke="#ffbe0b"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              filter="url(#neon-glow-mech)"
            />

            <motion.path
              d="M 400 200 C 450 200, 450 300, 550 300"
              stroke="#ffbe0b"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              filter="url(#neon-glow-mech)"
            />

            <motion.path
              d="M 600 100 C 700 100, 700 200, 750 200"
              stroke="#39ff14"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 2 }}
              filter="url(#neon-glow-mech)"
            />
            <motion.path
              d="M 600 300 C 700 300, 700 200, 750 200"
              stroke="#39ff14"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 2 }}
              filter="url(#neon-glow-mech)"
            />

            {/* Nodes */}
            <g>
              <circle cx="100" cy="200" r="20" fill="#050505" stroke="#ff0f5b" strokeWidth="2" />
              <ShieldAlert x="88" y="188" size={24} className="text-neon-pink" />
              <text x="100" y="240" fill="#ff0f5b" fontSize="10" textAnchor="middle" className="font-mono uppercase tracking-widest">Trade</text>
            </g>

            <g>
              <rect x="350" y="170" width="60" height="60" rx="8" fill="#050505" stroke="#ffbe0b" strokeWidth="2" />
              <Bot x="368" y="188" size={24} className="text-neon-yellow" />
              <text x="380" y="250" fill="#ffbe0b" fontSize="10" textAnchor="middle" className="font-mono uppercase tracking-widest">The Keeper</text>
            </g>

            <g>
              <circle cx="750" cy="200" r="30" fill="#050505" stroke="#39ff14" strokeWidth="2" />
              <Droplets x="738" y="188" size={24} className="text-neon-green" />
              <text x="750" y="250" fill="#39ff14" fontSize="10" textAnchor="middle" className="font-mono uppercase tracking-widest">Permanent LP</text>
            </g>
          </svg>
        </div>

        {/* Text Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative p-10 rounded-3xl bg-neon-surface/30 border border-white/5 hover:border-neon-green/20 transition-all group overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 w-full h-1 opacity-50"
                style={{ backgroundColor: step.color }}
              />
              
              <div className="mb-8 flex items-center justify-between">
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                  {step.icon}
                </div>
                <div className="text-4xl font-display font-black text-white/5 select-none">
                  0{index + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{step.title}</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
