import path from 'path';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@odyssage/frontend': path.join(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router', 'react-dom/server'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: [
            '@odyssage/ui/page-ui',
            '@odyssage/ui/index',
            '@odyssage/ui/top',
            '@odyssage/ui/layout',
          ],
          lucide: ['lucide-react'],
          util: ['swr', 'uuid'],
          vendors: ['hono', 'firebase/auth', 'firebase/app'],
        },
      },
    },
  },
});
