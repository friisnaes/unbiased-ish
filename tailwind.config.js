/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0a0a0b',
          800: '#111113',
          700: '#1a1a1e',
          600: '#222228',
          500: '#2a2a32',
        },
        accent: {
          DEFAULT: '#8b1a1a',
          light: '#a62626',
          dark: '#6b1212',
          muted: 'rgba(139, 26, 26, 0.15)',
        },
        text: {
          primary: '#e8e6e3',
          secondary: '#9a9590',
          tertiary: '#6b6660',
          inverse: '#0a0a0b',
        },
        divergence: {
          low: '#3a7d44',
          moderate: '#c4a23b',
          high: '#a62626',
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
