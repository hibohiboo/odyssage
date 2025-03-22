/* eslint-disable import/no-extraneous-dependencies */
import customConfig from '@odyssage/eslint-config-custom/defaults.js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    ...customConfig,
    {
      files: ['src/**'],
      rules: {
        'no-underscore-dangle': ['off'],
        'no-restricted-exports':['off']
      },
    },
  ],
});
