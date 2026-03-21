import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Permite usar @/ como atalho para src/ em todos os imports.
      '@': path.resolve(__dirname, './src'),
    },
  },
});
