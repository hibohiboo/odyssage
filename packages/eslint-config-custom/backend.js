import globals from 'globals';
import tseslint from 'typescript-eslint';
import customConfig from './defaults.js';

export default tseslint.config({
  files: ['**/*.ts'],
  ignores: ['dist'],
  extends: [...customConfig],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.node,
      myCustomGlobal: 'readonly',
    },
  },
});
