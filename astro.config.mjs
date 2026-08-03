// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const root = path.dirname(fileURLToPath(import.meta.url));

const apiUrl = (process.env.PUBLIC_API_URL || 'http://localhost:3002').replace(/\/$/, '');
const site = (process.env.PUBLIC_SITE_URL || 'https://www.pixeldesk.in').replace(/\/$/, '');

// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/login') && !page.includes('/home'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
    },
    resolve: {
      alias: {
        '@assets': path.resolve(root, '../assets'),
      },
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
