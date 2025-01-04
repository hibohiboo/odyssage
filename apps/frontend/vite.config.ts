/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@odyssage/frontend': path.join(__dirname, './src'),
      '@odyssage/core': path.join(__dirname, '../../packages/core'),
    },
  },
});
