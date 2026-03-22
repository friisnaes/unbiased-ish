/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0a0a0b',
          800: '#121215',
          700: '#1e1e23',
          600: '#2a2a31',
          500: '#35353e',
        },
        accent: {
          DEFAULT: '#a52525',
          light: '#c43030',
          dark: '#7b1515',
          muted: 'rgba(165, 37, 37, 0.18)',
        },
        text: {
          primary: '#f5f3f0',
          secondary: '#b8b2ab',
          tertiary: '#8a847e',
          inverse: '#0a0a0b',
        },
        divergence: {
          low: '#4daa5a',
          moderate: '#dbb94a',
          high: '#c93030',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        hero: ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        headline: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        subhead: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
