import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 3000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    // screenshot: 'on',
    // video: 'retain-on-failure',
    // ignoreHTTPSErrors: true,
  },
});
