import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';
import mw from './eslint.mw.mjs';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'warn',
      'import/no-cycle': 'error',
    },
  },
  {
    files: ['src/components/ui/**'],
    rules: { 'no-console': 'off' },
  },
  ...mw,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**']),
]);
