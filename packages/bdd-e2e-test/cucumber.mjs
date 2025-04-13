
export default {
  // paths: ['**/features/*.feature'],
  paths: ['**/features/scenario-create.feature'],
  import: ['**/step-definitions/*.steps.ts'],
  loader: ['ts-node/esm']
};
