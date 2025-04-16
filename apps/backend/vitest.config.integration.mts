import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/integrations/*.spec.ts'],

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
    poolOptions: {
      // https://vitest.dev/config/#pooloptions-forks
      forks: {
        // テストの実行順序をランダムにする
        singleFork: false,
      },
    },
    // テストタイムアウトを延長（Testcontainersはコンテナの起動に時間がかかる）
    testTimeout: 60000,
  },
});
