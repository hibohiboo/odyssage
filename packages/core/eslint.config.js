/* eslint-disable import/no-extraneous-dependencies */
import customConfig from '@odyssage/eslint-config-custom/defaults.js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [...customConfig,
    {
      files: ['**/tests/**'],
      rules: {
        'import/extensions': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': ['off'],
        'sonarjs/slow-regex':['off']
      }
    }
  ],
});
