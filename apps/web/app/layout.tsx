import type { Metadata } from 'next'
import { JetBrains_Mono, Orbitron } from 'next/font/google'
import './globals.css'

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-jetbrains' 
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display'
})

export const metadata: Metadata = {
  title: 'Bitch Tax | Solana Fee Decay',
  description: 'The first auto-decaying tax token on Solana. Unavoidable fees that automatically inject into permanent liquidity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jetbrains.variable} ${orbitron.variable} bg-neon-black text-neon-green antialiased selection:bg-neon-green selection:text-neon-black`}>
        {/* CRT Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-flicker" />
        
        <div className="fixed inset-0 bg-grid -z-10" />
        
        <main className="min-h-screen flex flex-col relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}
