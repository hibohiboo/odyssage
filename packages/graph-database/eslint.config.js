import customConfig from '@odyssage/eslint-config-custom/backend.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(customConfig, {
  files: ['**/*.test.ts'],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
});
