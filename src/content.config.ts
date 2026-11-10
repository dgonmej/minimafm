/*
 * Eventos y noticias: un archivo Markdown por elemento en src/content/.
 * Para publicar uno nuevo basta con crear el archivo con estos campos.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const eventos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/eventos' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    hora: z.string(),
    lugar: z.string(),
    categoria: z.enum(['Fiestas', 'Música', 'Mercado', 'Naturaleza', 'Solidario', 'Cultura']),
    resumen: z.string(),
  }),
});

const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: z.object({
    titulo: z.string(),
    fecha: z.coerce.date(),
    categoria: z.enum(['La radio', 'Municipio', 'Deportes', 'Cultura', 'Solidaridad']),
    autor: z.string(),
    resumen: z.string(),
  }),
});

// Textos legales: aviso legal, privacidad y cookies. El orden fija el del menu lateral.
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    orden: z.number(),
    actualizado: z.coerce.date(),
  }),
});

export const collections = { eventos, noticias, legal };
