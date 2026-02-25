import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#39ff14',
          red: '#ff0f5b',
          pink: '#ff00ff',
          yellow: '#ffbe0b',
          blue: '#00f2ff',
          black: '#050505',
          surface: '#0d0d0d',
        },
      },
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.98' },
        }
      }
    },
  },
  plugins: [],
}
export default config
