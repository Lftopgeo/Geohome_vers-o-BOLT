import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@supabase/supabase-js'],
  },
  envPrefix: 'VITE_',
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      // Resolver problemas de importação de imagens do Leaflet
      'leaflet': resolve(__dirname, 'node_modules/leaflet'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['leaflet', 'react-leaflet']
        }
      }
    }
  }
});
