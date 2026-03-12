import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.BASE_URL ?? '/',
  plugins: [react()],
  css: {
    modules: {
      generateScopedName:
        mode === 'test' || process.env.VITEST
          ? '[local]'
          : '[local]_[hash:base64:6]',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    testTimeout: 15000,
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
  resolve: {
    alias: {
      '#shared': '/src/shared',
    },
  },
}));
