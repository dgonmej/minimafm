// Sitemap con las paginas fijas y el contenido publicado en la API (programas, noticias, eventos y legales)
import { getEventos, getNoticias, getPaginas, getProgramas } from '../lib/api';

const fijas = ['/', '/programas/', '/horarios/', '/eventos/', '/noticias/', '/la-radio/', '/anunciate/'];
const dia = (d: Date) => d.toISOString().slice(0, 10);

export async function GET({ site }: { site: URL }) {
  const [programas, noticias, eventos, paginas] = await Promise.all([getProgramas(), getNoticias(), getEventos(), getPaginas()]);
  const urls: { ruta: string; fecha?: string }[] = [
    ...fijas.map((ruta) => ({ ruta })),
    ...programas.map((p) => ({ ruta: `/programas/${p.id}/` })),
    ...noticias.map((n) => ({ ruta: `/noticias/${n.id}/`, fecha: dia(n.data.fecha) })),
    ...eventos.map((e) => ({ ruta: `/eventos/${e.id}/` })),
    ...paginas.map((p) => ({ ruta: `/legal/${p.id}/`, fecha: dia(p.data.actualizado) })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${new URL(u.ruta, site).href}</loc>${u.fecha ? `<lastmod>${u.fecha}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
