import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src') + '/',
      '@site/': path.resolve(__dirname) + '/',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/theme/**',
        'src/components/icons/**',
        'src/components/sponsors/**',
        'src/components/homepage/**',
        'src/pages/**',
      ],
      thresholds: {
        statements: 40,
        functions: 40,
        lines: 40,
        branches: 30,
      },
    },
  },
});
