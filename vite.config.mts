import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000 },
  build: {
    outDir: 'build',
    rolldownOptions: {
      output: {
        // Vendor chunks: cached across deploys and each under Vite's 500 kB warning
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'leaflet', test: /node_modules[\\/](leaflet|react-leaflet|@react-leaflet|leaflet\.markercluster|react-leaflet-markercluster)[\\/]/ },
            { name: 'recharts', test: /node_modules[\\/](recharts|recharts-scale|d3-.*|victory-vendor)[\\/]/ },
            { name: 'vendor', test: /node_modules[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});
