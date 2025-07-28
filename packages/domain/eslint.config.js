import customConfig from '@odyssage/eslint-config-custom/backend.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  customConfig,
  {
    files: ['**/**/*.test.ts'],
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
    files: ['*.config.ts'],
    rules: {
      'import/no-extraneous-dependencies': ['off'],
    },
  },
  {
    files: ['src/services/*.ts'],
    rules: {
      'sonarjs/todo-tag': ['warn'],
    },
  },
);
