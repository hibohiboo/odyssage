import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/integration.spec.ts'],
    // 統合テストではNode.jsのAPIを使用するので、ポリフィルを有効化
    deps: {
      interopDefault: true,
    },
    environment: 'node',
    environmentOptions: {
      // Bunでfs/promisesなどのNode.jsモジュールを利用可能にする
      testBunIntegration: true,
    },
    // コンソールログを抑制する設定
    silent: false,
    // テストタイムアウトを延長（Testcontainersはコンテナの起動に時間がかかる）
    testTimeout: 60000,
  },
});
