import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        realm: {
          950: '#080e1a',
          900: '#0f1729',
          800: '#1a2744',
          700: '#2a3f6f',
          600: '#3a5490',
          500: '#4a6ab0',
        },
        gold: {
          300: '#fde68a',
          400: '#f5c842',
          500: '#d4a017',
          600: '#b8860b',
          700: '#8b6914',
        },
      },
      fontFamily: {
        medieval: ['"Cinzel"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
