import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
        '8xl': ['6rem', { lineHeight: '1.0' }],
        '9xl': ['8rem', { lineHeight: '0.95' }],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        snug: '-0.01em',
      },
      colors: {
        voyra: {
          blue: '#0071E3',
          black: '#1D1D1F',
          gray: '#6E6E73',
          light: '#F5F5F7',
        },
      },
    },
  },
  plugins: [],
}

export default config
