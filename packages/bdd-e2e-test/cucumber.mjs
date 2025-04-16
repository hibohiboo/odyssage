
export default {
  paths: [
    process.env.CI === 'true' 
    ? '**/features/*.feature' 
    : '**/features/session-create.feature'
  ],
  import: ['**/step-definitions/*.steps.ts'],
  loader: ['ts-node/esm'],
  format: [
    'summary',
    'progress-bar',                     // 実行時にプログレスバーをログ表示する設定
    'html:./output/cucumber-report.html'         // テスト結果をHTMLファイルで出力する設定
],
};
