import customConfig from './defaults.js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [...customConfig],
  rules: {
    'import/extensions': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    'import/no-unresolved': ['off'],
  }
});

