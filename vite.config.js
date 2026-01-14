// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      // Configuration du proxy pour l'API
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Configuration du proxy pour les uploads
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});