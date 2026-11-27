// Copia de minimafm-api/api/src/contract: no se edita aquí, se actualiza con «npm run contrato» en minimafm-api.
/*
 * Tipos de lo que se envía y se recibe de la API, sacados de los esquemas (schemas.ts): si cambia un
 * campo en la API, el panel y la web dejan de compilar donde lo usan. Parte del contrato (ver README.md).
 */
import type { z } from 'zod';
import type { ahoraSchema, cancionSchema, emisionSchema, esquemas, franja, listaSchema, modosLista, radioSchema } from './schemas.ts';
import type { RedSocial } from './catalogs.ts';

export type Recurso = keyof typeof esquemas;

/** Lo que envía el panel al crear o editar un contenido */
export type Entrada<R extends Recurso> = z.input<(typeof esquemas)[R]>;

/** Campos que se pueden editar de un contenido */
export type CampoDe<R extends Recurso> = R extends Recurso ? keyof Entrada<R> & string : never;

/** Imagen subida: cada ancho está en /media/{id}-{ancho}.webp */
export type Imagen = { id: string; alt: string; ancho: number; alto: number; anchos: number[] };

type ConImagen = 'programas' | 'eventos' | 'noticias' | 'equipo';
type IdNumerico = 'equipo' | 'historia' | 'tarifas' | 'formatos';

/**
 * Lo que devuelve la API pública (/api/{recurso} y /api/{recurso}/{id}): lo guardado, con su id y la
 * imagen completa, sin «publicado» ni quién lo creó o modificó.
 */
export type Publico<R extends Recurso> = Omit<z.output<(typeof esquemas)[R]>, 'id' | 'imagen' | 'publicado'> & {
  id: R extends IdNumerico ? number : string;
  /** Fecha y hora (ISO) */
  creado: string;
  actualizado: string;
} & (R extends ConImagen ? { imagen: Imagen | null } : unknown);

/** Lo que devuelve /api/ahora */
export type Ahora = z.output<typeof ahoraSchema>;

/** Lo que devuelve /api/radio */
export type Radio = z.output<typeof radioSchema>;
/** Lo que envía el panel al guardar la emisora */
export type EntradaRadio = z.input<typeof radioSchema>;
export type Red = { red: RedSocial; url: string };
export type Franja = z.output<typeof franja>;

// ---------- Emisión (RAD-55) ----------

/** Una canción de la biblioteca, tal como la devuelve /api/admin/canciones */
export type Cancion = z.output<typeof cancionSchema> & {
  id: number;
  /** Segundos */
  duracion: number;
  formato: string;
  bytes: number;
  creado: string;
};

export type ModoLista = (typeof modosLista)[number];
export type EntradaLista = z.input<typeof listaSchema>;

/** Para qué se usa una lista en la emisión */
export type UsoLista = 'autodj' | 'cunas' | 'reserva';

/** Una lista en el listado de /api/admin/listas */
export type ResumenLista = { id: number; nombre: string; modo: ModoLista; canciones: number; duracion: number; usos: UsoLista[] };

/** Una lista con sus canciones (ids en orden), en /api/admin/listas/{id} */
export type Lista = z.output<typeof listaSchema> & { id: number };

export type Emision = z.output<typeof emisionSchema>;
