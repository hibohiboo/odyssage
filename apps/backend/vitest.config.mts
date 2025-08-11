import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environmentOptions: {
      testBunIntegration: true, // Bunでfs/promisesなどのNode.jsモジュールを利用可能にする
    },
    silent: false, // コンソールログを抑制
    poolOptions: {
      forks: {
        singleFork: false, // false: テストの実行順序をランダムにする
      },
    },
    // テストタイムアウトを延長（Testcontainersはコンテナの起動に時間がかかる）
    testTimeout: 60000,
  },
});
