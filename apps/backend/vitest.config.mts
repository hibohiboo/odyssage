import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.toml' },
      },
    },
    // 下記を設定しても .dev.varsの環境変数を上書きすることはできなかった
    // env: dotenv.config({ path: '.env.local' }).parsed,
  },
});
