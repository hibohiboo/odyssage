
export default {
  paths: ['**/features/*.feature'],
  require: ['**/support/**','**/tests/*.steps.ts','**/setup.ts'],
  requireModule : ['ts-node/register']
};
