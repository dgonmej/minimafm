/*
 * Markdown del contenido (cuerpo de noticias, eventos y paginas) a HTML.
 * El HTML escrito a mano se muestra como texto y solo se permiten enlaces http(s), mailto y tel:
 * aunque lo escriba alguien del equipo, una cuenta robada no puede meter codigo en la web.
 */
import { Marked, type Tokens } from 'marked';

export type Heading = { depth: number; slug: string; text: string };

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function renderMarkdown(source: string) {
  const headings: Heading[] = [];
  const used = new Map<string, number>();

  const marked = new Marked({
    gfm: true,
    renderer: {
      html: ({ text }: Tokens.HTML | Tokens.Tag) => escape(text),
      heading({ tokens, depth, text }: Tokens.Heading) {
        let slug = slugify(text) || 'seccion';
        const n = used.get(slug) ?? 0;
        used.set(slug, n + 1);
        if (n) slug = `${slug}-${n}`;
        headings.push({ depth, slug, text });
        return `<h${depth} id="${slug}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return text;
        const external = /^https?:/i.test(href);
        return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ''}${external ? ' rel="noopener noreferrer"' : ''}>${text}</a>`;
      },
      image: ({ text }: Tokens.Image) => escape(text),
    },
  });

  const html = marked.parse(source ?? '', { async: false }) as string;
  return { html, headings };
}
