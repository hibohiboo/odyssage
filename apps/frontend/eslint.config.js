import customConfig from '@odyssage/eslint-config-custom/frontend.js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    ...customConfig,
    {
      files: ['**/tests/**','e2e/**'],
      rules: {
        'import/extensions': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': ['off'],
        'sonarjs/slow-regex': ['off'],
        'lintsonarjs/no-empty-test-file': ['off'],
      },
    },
    {
      files: ['**/e2e/**'],
      rules: {
        'lintsonarjs/no-empty-test-file': ['off'],
        'no-restricted-syntax': ['off'],
        'no-await-in-loop': ['off'],
      },
    },
  ],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: './tsconfig.app.json',
      },
    },
  },
});
