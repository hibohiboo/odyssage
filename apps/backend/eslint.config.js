/* eslint-disable import/no-extraneous-dependencies */
import customConfig from '@odyssage/eslint-config-custom/defaults.js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    ...customConfig,
    {
      files: ['**/test/**'],
      rules: {
				'no-undef': ['off'],
        'import/extensions': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': ['off'],
        'sonarjs/slow-regex':['off']
      }
    },
		{
			"files": ["*.mts"],
			rules: {
        'no-undef': ['off'],
				"import/no-extraneous-dependencies": ["off"],
      }
		}
  ],
});
