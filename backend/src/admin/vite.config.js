import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/media': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/images': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/brand': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
