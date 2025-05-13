import customConfig from '@odyssage/eslint-config-custom/defaults.js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    ...customConfig,
    {
      files: ['**/**'],
      rules: {
        'no-underscore-dangle': ['off'],
        'no-restricted-exports': ['off'],
        'import/no-extraneous-dependencies': ['off'],
      },
    },
    {
      files: ['src/**/*.stories.tsx'],
      rules: {
        'no-shadow': ['off'],
      },
    },
  ],
});
