import customConfig from '@odyssage/eslint-config-custom/backend.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  customConfig,
  {
    ignores: [...customConfig[0].ignores, '**/.wrangler/**'],
  },
  {
    files: ['**/test/**'],
    rules: {
      'no-undef': ['off'],
      'import/extensions': ['off'],
      'import/no-extraneous-dependencies': ['off'],
      'import/no-unresolved': ['off'],
      'sonarjs/slow-regex': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
    },
  },
  {
    files: ['*.mts'],
    rules: {
      'no-undef': ['off'],
      'import/no-extraneous-dependencies': ['off'],
    },
  },
);
