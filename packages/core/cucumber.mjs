// https://github.com/cucumber/cucumber-js/blob/main/docs/transpiling.md#esm
// https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md#files
export default {
  paths: ['./**/*.feature'],
  loader: ['ts-node/esm'],
  import: ['./**/*.test.ts'],
}
