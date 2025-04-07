import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 統合テストではNode.jsのAPIを使用するので、ポリフィルを有効化
    deps: {
      interopDefault: true,
    },
    environment: 'node',
    environmentOptions: {
      // Bunでfs/promisesなどのNode.jsモジュールを利用可能にする
      testBunIntegration: true,
    },
    // 通常のテスト用の設定（Workers向け）
    poolOptions: {
      threads: {
        singleThread: true,
      },
      workers: {
        // Workersテスト用の設定はそのまま保持
        wrangler: { configPath: './wrangler.toml' },
      },
    },
    // コンソールログを抑制する設定
    silent: false,
    // テストタイムアウトを延長（Testcontainersはコンテナの起動に時間がかかる）
    testTimeout: 60000,
  },
});
