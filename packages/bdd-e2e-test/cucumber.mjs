
export default {
  // paths: ['**/features/*.feature'],
  paths: ['**/features/session-create.feature'],
  import: ['**/step-definitions/*.steps.ts'],
  loader: ['ts-node/esm']
};
