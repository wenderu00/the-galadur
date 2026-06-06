import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        popover: { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary: { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        accent: { DEFAULT: 'var(--accent)', foreground: 'var(--accent-foreground)' },
        destructive: { DEFAULT: 'var(--destructive)' },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        realm: {
          950: '#08060f',
          900: '#0f0b1e',
          800: '#1c1535',
          700: '#2d1f5e',
          600: '#4a2d8a',
          500: '#6b48c4',
          400: '#9370db',
        },
        gold: {
          300: '#fde68a',
          400: '#f5c842',
          500: '#d4a017',
          600: '#b8860b',
          700: '#8b6914',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      fontFamily: {
        medieval: ['"Cinzel"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
