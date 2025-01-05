// eslint-disable-next-line import/no-extraneous-dependencies
import { config } from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'drizzle-kit';

config({ path: process.env.DOTENV_CONFIG_PATH });

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_CONNECTION_STRING!,
  },
});
