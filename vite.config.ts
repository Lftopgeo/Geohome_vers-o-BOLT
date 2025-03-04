import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', '@supabase/supabase-js'],
  },
  envPrefix: 'VITE_',
  server: {
    port: 3000,
    open: true,
  },
});
