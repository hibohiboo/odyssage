
export default {
  // paths: ['**/features/*.feature'],
  paths: ['**/features/scenario-stock.feature'],
  import: ['**/step-definitions/*.steps.ts'],
  loader: ['ts-node/esm']
};
