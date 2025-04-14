
export default {
  // paths: ['**/features/*.feature'],
  paths: [
    process.env.CI === 'true' 
    ? '**/features/*.feature' 
    : '**/features/scenario-create.feature'
  ],
  import: ['**/step-definitions/*.steps.ts'],
  loader: ['ts-node/esm']
};
