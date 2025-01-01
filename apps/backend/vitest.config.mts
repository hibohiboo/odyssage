import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import dotenv from 'dotenv';

export default defineWorkersConfig({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
		env: dotenv.config({ path: '.env.local' }).parsed,
	},
});
