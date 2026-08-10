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
const isProduction = process.env.NODE_ENV === 'production';

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
    // Rolldown pre-bundles React with production entrypoints unless NODE_ENV is
    // development, which leaves jsxDEV undefined and breaks client:only islands.
    define: isProduction
      ? undefined
      : {
          'process.env.NODE_ENV': '"development"',
        },
    resolve: {
      alias: {
        '@assets': path.resolve(root, '../assets'),
      },
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
      esbuildOptions: {
        define: {
          'process.env.NODE_ENV': isProduction ? '"production"' : '"development"',
        },
      },
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
