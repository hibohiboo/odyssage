import { config } from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_CONNECTION_STRING!,
  },
});
