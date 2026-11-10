import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

/*
 * La web se genera en el servidor en cada visita, con los datos de la API de Minima FM
 * (API_URL, por defecto http://localhost:3000). Asi lo publicado en el panel sale al momento.
 * SITE: direccion publica de la web (para enlaces canonicos y redes sociales).
 */
export default defineConfig({
  site: process.env.SITE ?? 'http://localhost:8080',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  security: { checkOrigin: true },
  vite: {
    server: {
      // Solo en desarrollo: permitir abrir el servidor local a traves de un tunel de Cloudflare
      allowedHosts: ['.trycloudflare.com'],
    },
  },
});
