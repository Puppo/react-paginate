import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  base: '/',
  build: {
    outDir: path.resolve(__dirname, 'demo/build'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'react-paginate': path.resolve(__dirname, 'react_components'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/comments': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
