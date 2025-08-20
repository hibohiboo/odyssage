export default {
  paths: [
    process.env.CI === 'true'
      ? '**/features/*.feature'
      : '**/features/play-experience.feature',
  ],
  import: [
    // '**/step-definitions/*.steps.ts'
    // Player文脈テスト用の最小限のstep definitions
    '**/step-definitions/common.steps.ts',
    '**/step-definitions/play-experience.steps.ts',
  ],
  loader: ['ts-node/esm'],
  format: [
    'summary',
    'progress-bar', // 実行時にプログレスバーをログ表示する設定
    'html:./output/cucumber-report.html', // テスト結果をHTMLファイルで出力する設定
  ],
};
