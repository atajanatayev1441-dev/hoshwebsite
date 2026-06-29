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
        // Dark industrial palette — matches HOS interior
        carbon: {
          50:  '#f5f4f2',
          100: '#e8e5df',
          200: '#d0ccc3',
          300: '#b0aa9e',
          400: '#8a8070',
          500: '#6e6457',
          600: '#574e44',
          700: '#3e3830',
          800: '#1e1b16',
          900: '#111009',
          950: '#080705',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#faeec8',
          200: '#f5da8d',
          300: '#efc04e',
          400: '#d4a93a',
          500: '#C9A84C',
          600: '#a87020',
          700: '#855019',
          800: '#633c17',
          900: '#4a2d12',
        },
        concrete: {
          100: '#f0ece3',
          200: '#ddd8cc',
          300: '#c4bfb3',
          400: '#9e9890',
          500: '#7a7570',
          600: '#5c5852',
          700: '#3d3a35',
          800: '#252320',
          900: '#161512',
        },
        // Keep sage for admin
        sage: {
          300: '#a8bca1',
          400: '#8aa383',
          500: '#7a8c75',
          600: '#5e6e5a',
          700: '#4a5c46',
          800: '#384538',
          900: '#2b352b',
          950: '#1a211a',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Jost', 'system-ui', 'sans-serif'],
        // legacy aliases kept for admin panel
        playfair: ['Cormorant Garamond', 'Georgia', 'serif'],
        inter:    ['Jost', 'system-ui', 'sans-serif'],
      },
      animation: {
        'badge-pulse': 'badge-pulse 2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'line-grow': 'line-grow 0.8s ease-out forwards',
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
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'line-grow': {
          from: { width: '0' },
          to: { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
export default config
