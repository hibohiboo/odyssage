import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'apps/backend/vitest.config.integration.mts',
      'apps/frontend/vitest.config.ts',
      'packages/domain/vitest.config.ts',
    ],
  },
});
