// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

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
}, storybook.configs["flat/recommended"]);
