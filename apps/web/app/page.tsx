'use client';

import Hero from '../components/Hero';
import LaunchVault from '../components/LaunchVault';
import Mechanics from '../components/Mechanics';
import Footer from '../components/Footer';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const { scrollY } = useScroll();
  
  // Fade out indicator after 100px of scrolling
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);
  const pointerEvents = useTransform(scrollY, [0, 100], ["auto" as const, "none" as const]);

  return (
    <main className="flex-1 flex flex-col relative">
      <Hero />
      <LaunchVault />
      <Mechanics />
      <Footer />
      
      {/* Dynamic Scroll Indicator */}
      <motion.div 
        style={{ opacity, pointerEvents }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-neon-green/50 flex flex-col items-center gap-2 z-50"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Initiate Scroll</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-neon-green to-transparent"
        />
      </motion.div>
    </main>
  );
}
