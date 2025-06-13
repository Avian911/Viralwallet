import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', 'pg'],
  },
  resolve: {
    alias: {
      'cloudflare:sockets': '/src/empty-module.js',
      'pg': '/src/empty-module.js'
    }
  }
});