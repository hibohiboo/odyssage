import tseslint from 'typescript-eslint';
import customConfig from './defaults.js';

export default tseslint.config({
  extends: [...customConfig],
  rules: {
    'import/extensions': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'import/no-unresolved': ['off'],
  }
});

