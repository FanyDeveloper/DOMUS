import { defineConfig } from 'vite';
import { renderPage } from './src/render.js';

// Injeta a marcação no index.html em dev e build (HTML estático, legível sem JavaScript).
export default defineConfig({
  plugins: [{
    name: 'domus-prerender',
    transformIndexHtml: (html) => html.replace('<!--app-->', renderPage()),
  }],
});
