import { defineConfig } from 'astro/config';

// Publicado en GitHub Pages: https://dgonmej.github.io/minimafm/
export default defineConfig({
  site: 'https://dgonmej.github.io',
  base: '/minimafm',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: {
    server: {
      // Solo en desarrollo: permitir abrir el servidor local a traves de un tunel de Cloudflare
      allowedHosts: ['.trycloudflare.com'],
    },
  },
});
