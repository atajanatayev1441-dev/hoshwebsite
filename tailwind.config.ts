import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f0f3ef',
          100: '#dce5d9',
          200: '#c8d4c2',
          300: '#a8bcA1',
          400: '#8aa383',
          500: '#7a8c75',
          600: '#5e6e5a',
          700: '#4a5c46',
          800: '#384538',
          900: '#2b352b',
          950: '#1a211a',
        },
        cream: {
          50: '#fdfcfa',
          100: '#f5f2ec',
          200: '#ede7da',
          300: '#e0d6c3',
          400: '#cfc2a7',
          500: '#bfad8e',
          600: '#a08d6b',
          700: '#836f52',
          800: '#675743',
          900: '#544638',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
      keyframes: {
        'badge-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.85' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
