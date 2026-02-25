'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface TaxVisualizerProps {
  feeBps: number; // e.g. 3330 for 33.3%
}

export default function TaxVisualizer({ feeBps }: TaxVisualizerProps) {
  const percentage = feeBps / 100;
  const isPanic = percentage > 10;
  const isGrace = percentage <= 10 && percentage > 5;

  const color = isPanic ? '#ff0f5b' : isGrace ? '#ffbe0b' : '#39ff14';

  // Arc config: 270 degrees of the circle
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const gap = 0.25;
  const totalLength = circumference * (1 - gap);
  const offset = totalLength - (percentage / 33.3) * totalLength;

  // Needle angle: 0° = arc start (right in SVG), 270° = arc end (up in SVG)
  const needleAngleDeg = (percentage / 33.3) * 270;

  // Animate a single angle value — no CSS rotation, no transform-origin issues
  const angleValue = useMotionValue(0);
  useEffect(() => {
    const controls = animate(angleValue, needleAngleDeg, {
      duration: 2,
      ease: [0.23, 1, 0.32, 1],
    });
    return controls.stop;
  }, [needleAngleDeg]);

  // Derive needle endpoints directly from angle (trig beats transform-origin every time)
  const shaftX2  = useTransform(angleValue, v => 100 + 80 * Math.cos(v * Math.PI / 180));
  const shaftY2  = useTransform(angleValue, v => 100 + 80 * Math.sin(v * Math.PI / 180));
  const tipX1    = useTransform(angleValue, v => 100 + 62 * Math.cos(v * Math.PI / 180));
  const tipY1    = useTransform(angleValue, v => 100 + 62 * Math.sin(v * Math.PI / 180));
  const scanPath = useTransform(angleValue, v => {
    const end = v + 12;
    const r = 82;
    return `M 100 100 L ${100 + r * Math.cos(v * Math.PI / 180)} ${100 + r * Math.sin(v * Math.PI / 180)} A ${r} ${r} 0 0 1 ${100 + r * Math.cos(end * Math.PI / 180)} ${100 + r * Math.sin(end * Math.PI / 180)} Z`;
  });

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

        {/* Static Background Arc */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="#111"
          strokeWidth="10"
          strokeDasharray={`${totalLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Dynamic Progress Arc */}
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

        {/* Scan fan — computed directly, no rotation transform */}
        <motion.path d={scanPath} fill={color} fillOpacity="0.06" />

        {/* Needle shaft */}
        <motion.line
          x1={100} y1={100}
          x2={shaftX2} y2={shaftY2}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#gauge-glow)"
        />

        {/* Bright white tip */}
        <motion.line
          x1={tipX1} y1={tipY1}
          x2={shaftX2} y2={shaftY2}
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Hub */}
        <circle cx="100" cy="100" r="5" fill={color} filter="url(#gauge-glow)" />
        <circle cx="100" cy="100" r="2.5" fill="white" opacity="0.7" />
      </svg>

      {/* Center Display Data */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <motion.div
          className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-40 mb-1"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Protocol Active
        </motion.div>

        <div className="relative">
          <motion.span
            className="text-6xl font-display font-black text-white text-glow block"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {percentage.toFixed(1)}<span className="text-2xl text-neon-green ml-1">%</span>
          </motion.span>

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
