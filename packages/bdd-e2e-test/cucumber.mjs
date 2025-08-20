export default {
  paths: [
    process.env.CI === 'true'
      ? '**/features/*.feature'
      : '**/features/play-experience-single.feature',
  ],
  import: [
    // ⚠️ 段階的実装: 最小限のstep definitionsのみ使用
    '**/step-definitions/common.steps.ts',
    '**/step-definitions/play-experience-minimal.steps.ts',
  ],
  loader: ['ts-node/esm'],
  format: [
    'summary',
    'progress-bar', // 実行時にプログレスバーをログ表示する設定
    'html:./output/cucumber-report.html', // テスト結果をHTMLファイルで出力する設定
  ],
};
