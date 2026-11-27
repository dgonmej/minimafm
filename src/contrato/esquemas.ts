// Copia de minimafm-api/api/src/contrato: no se edita aquí, se actualiza con «npm run contrato» en minimafm-api.
/*
 * Cómo se valida lo que llega del panel para cada contenido y para la emisora (zod). Lo usa la API
 * (resources.ts) y de aquí salen los tipos del panel y de la web (tipos.ts). Parte del contrato (ver LEEME.md).
 */
import { z } from 'zod';
import { categoriasEvento, categoriasNoticia, categoriasPrograma, iconosFormato, redesSociales } from './catalogos.ts';

const texto = (max: number) => z.string().trim().min(1, 'Este campo es obligatorio').max(max, `Máximo ${max} caracteres`);
const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha con formato AAAA-MM-DD');
const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora con formato HH:MM');
const slug = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Solo minúsculas, números y guiones')
  .max(80);
const orden = z.number().int().default(0);
const publicado = z.boolean().default(true);

/** Imagen de un contenido, tal como la envía el panel: la ya subida y su texto alternativo */
export const imagen = z
  .object({
    id: z.string().regex(/^[a-f0-9]{24}$/, 'Imagen no válida'),
    alt: z
      .string()
      .trim()
      .min(1, 'Describe la imagen para quien no puede verla')
      .max(300, 'Máximo 300 caracteres'),
  })
  .nullable()
  .default(null);

/** Horario semanal de un programa: días (0 lunes … 6 domingo) y horas HH:MM */
export const franja = z
  .object({
    dias: z.array(z.number().int().min(0).max(6)).min(1, 'Elige al menos un día'),
    inicio: hora,
    fin: hora,
  })
  .refine((f) => f.inicio < f.fin, { message: 'La hora de fin debe ser posterior a la de inicio', path: ['fin'] });

/** Un esquema por contenido, con el nombre que lleva en la URL (/api/{nombre}) */
export const esquemas = {
  programas: z.object({
    id: slug.optional(),
    nombre: texto(120),
    presentador: texto(120),
    categoria: z.enum(categoriasPrograma),
    descripcion: texto(2000),
    secciones: z.array(texto(120)).max(10),
    franjas: z.array(franja).min(1, 'Añade al menos un horario'),
    orden,
    imagen,
    publicado,
  }),
  eventos: z.object({
    id: slug.optional(),
    titulo: texto(160),
    fecha,
    hora: texto(20),
    lugar: texto(160),
    categoria: z.enum(categoriasEvento),
    resumen: texto(400),
    cuerpo: z.string().max(20000).default(''),
    imagen,
    publicado,
  }),
  noticias: z.object({
    id: slug.optional(),
    titulo: texto(160),
    fecha,
    categoria: z.enum(categoriasNoticia),
    autor: texto(120),
    resumen: texto(400),
    cuerpo: z.string().max(40000).default(''),
    imagen,
    publicado,
  }),
  paginas: z.object({
    id: slug.optional(),
    titulo: texto(160),
    resumen: texto(400),
    cuerpo: z.string().max(60000).default(''),
    orden,
    publicado,
  }),
  equipo: z.object({ nombre: texto(120), papel: texto(120), orden, imagen, publicado }),
  historia: z.object({ anio: texto(10), titulo: texto(120), texto: texto(600), orden, publicado }),
  tarifas: z.object({
    nombre: texto(80),
    horario: texto(160),
    precio20: z.number().int().min(0),
    precio30: z.number().int().min(0),
    destacada: z.boolean().default(false),
    orden,
    publicado,
  }),
  formatos: z.object({
    nombre: texto(80),
    precio: texto(40),
    unidad: texto(40),
    texto: texto(600),
    icono: z.enum(iconosFormato),
    orden,
    publicado,
  }),
};

/** Lo que suena ahora en la emisión (/api/ahora) */
export const ahoraSchema = z.object({
  /** La emisión funciona: si es false, el resto no dice nada */
  emitiendo: z.boolean(),
  /** Hay un locutor conectado en directo */
  directo: z.boolean(),
  titulo: z.string().nullable(),
  artista: z.string().nullable(),
});

/** Datos de la emisora (una sola fila) */
export const radioSchema = z.object({
  nombre: texto(80),
  frecuencia: texto(10),
  lema: texto(120),
  zona: texto(120),
  descripcion: texto(600),
  stream: z.url('Dirección web no válida'),
  telefono: texto(30),
  whatsapp: texto(30),
  correo: z.email('Correo no válido'),
  direccion: texto(255),
  redes: z
    .array(z.object({ red: z.enum(redesSociales, 'Elige una red'), url: z.url('Dirección web no válida') }))
    .max(12, 'Máximo 12 redes')
    .default([]),
});
