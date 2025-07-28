import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@odyssage/graph-database': path.join(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.{ts,mts}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    fileParallelism: false,
  },
});
