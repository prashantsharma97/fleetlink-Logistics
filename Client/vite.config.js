import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://localhost:4000', 
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
