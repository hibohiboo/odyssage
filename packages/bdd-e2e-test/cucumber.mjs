export default {
  paths: [
    process.env.CI === 'true'
      ? '**/features/*.feature'
      : '**/features/player/*.feature',
  ],
  import: [
    // ⚠️ 段階的実装: Player文脈のstep definitionsを使用
    '**/step-definitions/common.steps.ts',
    '**/step-definitions/player/play-experience-minimal.steps.ts',
    '**/step-definitions/player/session-joining.steps.ts',
  ],
  loader: ['ts-node/esm'],
  format: [
    'summary',
    'progress-bar', // 実行時にプログレスバーをログ表示する設定
    'html:./output/cucumber-report.html', // テスト結果をHTMLファイルで出力する設定
  ],
};
