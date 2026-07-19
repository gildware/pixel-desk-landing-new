// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const apiUrl = (process.env.PUBLIC_API_URL || 'http://localhost:3002').replace(/\/$/, '');

// https://astro.build/config
export default defineConfig({
  output: 'static',
  compressHTML: true,
  integrations: [react()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
    },
    server: {
      // Same-origin API proxy (mirrors pixel-desk-web /api/proxy) for cookie auth in local/dev.
      proxy: {
        '/api/proxy': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/proxy/, ''),
        },
      },
    },
  },
});
