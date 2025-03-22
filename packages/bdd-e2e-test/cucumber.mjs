
export default {
  // paths: ['**/features/*.feature'],
  paths: ['**/features/scenario-edit.feature'],
  import: ['**/step-definitions/*.steps.ts'],
  loader: ['ts-node/esm']
};
