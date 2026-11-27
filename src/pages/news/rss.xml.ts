// Feed RSS de noticias (/news/rss.xml): las 30 más recientes, para lectores de feeds y agregadores
import { getNoticias, getRadio } from '../../lib/api';

const escapar = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export async function GET({ site }: { site: URL }) {
  const [noticias, radio] = await Promise.all([getNoticias(), getRadio()]);
  const recientes = noticias.sort((a, b) => b.data.fecha.getTime() - a.data.fecha.getTime()).slice(0, 30);
  const web = new URL('/news/', site).href;
  const items = recientes
    .map((n) => {
      const url = new URL(`/news/${n.id}/`, site).href;
      return `    <item>
      <title>${escapar(n.data.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapar(n.data.resumen)}</description>
      <category>${escapar(n.data.categoria)}</category>
      <dc:creator>${escapar(n.data.autor)}</dc:creator>
      <pubDate>${n.data.fecha.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Noticias de ${escapar(radio.nombre)} ${escapar(radio.frecuencia)}</title>
    <link>${web}</link>
    <description>${escapar(`Las noticias de ${radio.nombre} y de la actualidad del ${radio.zona}.`)}</description>
    <language>es-ES</language>
    <atom:link href="${new URL('/news/rss.xml', site).href}" rel="self" type="application/rss+xml" />
${recientes[0] ? `    <lastBuildDate>${recientes[0].data.fecha.toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' } });
}
