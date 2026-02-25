'use client';

import { motion } from 'framer-motion';

interface TaxVisualizerProps {
  feeBps: number; // e.g. 3330 for 33.3%
}

export default function TaxVisualizer({ feeBps }: TaxVisualizerProps) {
  const percentage = feeBps / 100;
  const isPanic = percentage > 10;
  const isGrace = percentage <= 10 && percentage > 5;
  
  const color = isPanic ? '#ff0f5b' : isGrace ? '#ffbe0b' : '#39ff14';
  
  // Meter configuration
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  // We only show ~270 degrees of the circle for a gauge look
  const gap = 0.25; 
  const totalLength = circumference * (1 - gap);
  const offset = totalLength - (percentage / 33.3) * totalLength;

  // Speedometer Needle Logic
  // The arc is 270 degrees.
  const needleRotation = (percentage / 33.3) * 270;

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      
      {/* Dynamic Glow Backdrop */}
      <div 
        className="absolute inset-0 rounded-full blur-[80px] opacity-10 transition-colors duration-1000"
        style={{ backgroundColor: color }} 
      />

      <svg className="w-full h-full -rotate-[225deg]" viewBox="0 0 200 200">
        <defs>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#333" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>

        {/* Outer Tick Ring */}
        {[...Array(30)].map((_, i) => {
          const angle = (i * (270 / 29)) * (Math.PI / 180);
          const x1 = 100 + 92 * Math.cos(angle);
          const y1 = 100 + 92 * Math.sin(angle);
          const x2 = 100 + 98 * Math.cos(angle);
          const y2 = 100 + 98 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i / 29 <= (percentage / 33.3) ? color : "#222"}
              strokeWidth="1"
              className="transition-colors duration-500"
            />
          );
        })}

        {/* Static Background Path */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="#111"
          strokeWidth="10"
          strokeDasharray={`${totalLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Dynamic Progress Path */}
        <motion.circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${totalLength} ${circumference}`}
          initial={{ strokeDashoffset: totalLength }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "circOut" }}
          filter="url(#gauge-glow)"
        />

        {/* The Speedometer Needle */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: needleRotation }}
          transition={{ duration: 2, ease: "circOut" }}
          style={{ transformOrigin: '100px 100px' }}
        >
          {/* Main Needle Line */}
          <line
            x1="100" y1="100"
            x2="185" y2="100"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#gauge-glow)"
          />
          {/* Needle Base Circle */}
          <circle cx="100" cy="100" r="4" fill={color} filter="url(#gauge-glow)" />
          {/* Small inner detail on needle */}
          <line
            x1="160" y1="100"
            x2="180" y2="100"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        </motion.g>

        {/* Subtle scanning effect behind needle */}
        <motion.path
          d={`M 100 100 L 185 100 A 85 85 0 0 1 ${100 + 85 * Math.cos(10 * Math.PI / 180)} ${100 + 85 * Math.sin(10 * Math.PI / 180)} Z`}
          fill={color}
          fillOpacity="0.05"
          animate={{ rotate: needleRotation }}
          transition={{ duration: 2, ease: "circOut" }}
          style={{ transformOrigin: '100px 100px' }}
        />
      </svg>

      {/* Center Display Data */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        
        {/* Label Top */}
        <motion.div 
          className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-40 mb-1"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Protocol Active
        </motion.div>

        {/* Main Percentage */}
        <div className="relative">
          <motion.span 
            className="text-6xl font-display font-black text-white text-glow block"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {percentage.toFixed(1)}<span className="text-2xl text-neon-green ml-1">%</span>
          </motion.span>
          
          {/* Status Label Bottom */}
          <div className="mt-[-4px] flex items-center justify-center gap-2">
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse" 
              style={{ backgroundColor: color }} 
            />
            <span className="text-xs font-mono font-bold uppercase tracking-widest" style={{ color }}>
              {isPanic ? 'PANIC TAX' : isGrace ? 'GRACE WINDOW' : 'STABLE FEE'}
            </span>
          </div>
        </div>

        {/* Sub-label */}
        <div className="mt-6 flex flex-col items-center border-t border-white/5 pt-4 w-32">
          <span className="text-[9px] font-mono text-gray-500 uppercase">Current Trade Fee</span>
          <span className="text-[10px] font-mono text-gray-400">UNAVOIDABLE</span>
        </div>

      </div>

      {/* Decorative Accents */}
      <div className="absolute -bottom-4 flex gap-12 font-mono text-[8px] text-gray-600 uppercase tracking-tighter">
        <div className="flex flex-col items-center">
          <span>Target</span>
          <span className="text-neon-green">1.0%</span>
        </div>
        <div className="flex flex-col items-center">
          <span>Max</span>
          <span className="text-neon-red">33.3%</span>
        </div>
      </div>

    </div>
  );
}
