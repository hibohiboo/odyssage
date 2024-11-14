// https://github.com/cucumber/cucumber-js/blob/main/docs/transpiling.md#esm
// https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md#files
export default {
  paths: ['**/features/*.feature'],
  import: ['**/tests/*.steps.ts'],
  loader: ['ts-node/esm']
};