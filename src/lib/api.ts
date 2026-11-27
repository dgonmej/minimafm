/*
 * Datos de la web: se leen de la API de Minima FM (repositorio minimafm-api) en el servidor,
 * en cada peticion, con una cache corta en memoria para no repetir llamadas en la misma pagina.
 *
 * Eventos, noticias y paginas se devuelven con la misma forma que tenian las colecciones de
 * contenido de Astro ({ id, data, cuerpo }), asi las plantillas apenas cambian.
 */
import type { Programa } from '../data/radio';
import { nombresRedes, type RedSocial } from '../contract/catalogs';
import type { Publico, Radio as RadioApiActual } from '../contract/types';

const API_URL = (process.env.API_URL ?? import.meta.env.API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const TTL = 15_000;
const cache = new Map<string, { at: number; value: Promise<unknown> }>();

export class ApiUnavailable extends Error {}

async function get<T>(path: string): Promise<T> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < TTL) return hit.value as Promise<T>;
  const value = (async () => {
    const res = await fetch(`${API_URL}/api${path}`, { headers: { accept: 'application/json' } }).catch(() => {
      throw new ApiUnavailable(`No se puede conectar con la API en ${API_URL}`);
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new ApiUnavailable(`La API ha respondido ${res.status} en ${path}`);
    return res.json();
  })();
  cache.set(path, { at: Date.now(), value });
  value.catch(() => cache.delete(path));
  return value as Promise<T>;
}

// ---------- Emisora ----------

/** La emisora, con el nombre visible de cada red */
export type Radio = Omit<RadioApiActual, 'redes'> & { redes: { red: RedSocial; nombre: string; url: string }[] };

/** Nombre visible de cada red (el del contrato de la API) */
export const NOMBRES_REDES = nombresRedes;
export type { RedSocial };

// Una API anterior a la lista de redes solo tenía Facebook e Instagram sueltos
type RadioApi = Omit<RadioApiActual, 'redes'> & { redes?: RadioApiActual['redes']; facebook?: string | null; instagram?: string | null };

export async function getRadio(): Promise<Radio> {
  const r = await get<RadioApi>('/radio');
  if (!r) throw new ApiUnavailable('Faltan los datos de la emisora');
  const { facebook, instagram, redes, ...rest } = r;
  // Una API anterior a la lista de redes solo tenía Facebook e Instagram sueltos
  const lista =
    redes ??
    [
      facebook ? { red: 'facebook' as const, url: facebook } : null,
      instagram ? { red: 'instagram' as const, url: instagram } : null,
    ].filter((x) => x !== null);
  return {
    ...rest,
    redes: lista.filter((x) => x.red in NOMBRES_REDES).map((x) => ({ ...x, nombre: NOMBRES_REDES[x.red] })),
  };
}

export const getProgramas = async () => (await get<Programa[]>('/programas')) ?? [];
export const getPrograma = (id: string) => get<Programa | null>(`/programas/${encodeURIComponent(id)}`);

// ---------- Contenido con forma de coleccion ----------

/** Las fechas AAAA-MM-DD se convierten en Date a medianoche UTC, como hacian las colecciones */
const fecha = (s: string) => new Date(`${s}T00:00:00Z`);

type Entry<D> = { id: string; data: D; cuerpo: string };

/** Lo que la web usa de cada contenido: los campos de la API (ver src/contract) con las fechas como Date */
type Datos<R extends 'eventos' | 'noticias'> = Omit<Publico<R>, 'id' | 'cuerpo' | 'fecha'> & { fecha: Date };

export type Evento = Entry<Datos<'eventos'>>;
export type Noticia = Entry<Datos<'noticias'>>;
export type Pagina = Entry<Omit<Publico<'paginas'>, 'id' | 'cuerpo' | 'actualizado'> & { actualizado: Date }>;

// La imagen puede faltar si la API es anterior a las imágenes
const toEvento = ({ id, cuerpo, ...d }: Publico<'eventos'>): Evento => ({ id, cuerpo, data: { ...d, fecha: fecha(d.fecha), imagen: d.imagen ?? null } });
const toNoticia = ({ id, cuerpo, ...d }: Publico<'noticias'>): Noticia => ({ id, cuerpo, data: { ...d, fecha: fecha(d.fecha), imagen: d.imagen ?? null } });
const toPagina = ({ id, cuerpo, ...d }: Publico<'paginas'>): Pagina => ({ id, cuerpo, data: { ...d, actualizado: new Date(d.actualizado) } });

export const getEventos = async () => ((await get<Publico<'eventos'>[]>('/eventos')) ?? []).map(toEvento);
export const getEvento = async (id: string) => {
  const r = await get<Publico<'eventos'> | null>(`/eventos/${encodeURIComponent(id)}`);
  return r ? toEvento(r) : null;
};

export const getNoticias = async () => ((await get<Publico<'noticias'>[]>('/noticias')) ?? []).map(toNoticia);
export const getNoticia = async (id: string) => {
  const r = await get<Publico<'noticias'> | null>(`/noticias/${encodeURIComponent(id)}`);
  return r ? toNoticia(r) : null;
};

export const getPaginas = async () => ((await get<Publico<'paginas'>[]>('/paginas')) ?? []).map(toPagina);

// ---------- La radio y publicidad ----------

export type Persona = Publico<'equipo'>;
export type Hito = Publico<'historia'>;
export type Tarifa = Publico<'tarifas'>;
export type Formato = Publico<'formatos'>;

export const getEquipo = async () => (await get<Persona[]>('/equipo')) ?? [];
export const getHistoria = async () => (await get<Hito[]>('/historia')) ?? [];
export const getTarifas = async () => (await get<Tarifa[]>('/tarifas')) ?? [];
export const getFormatos = async () => (await get<Formato[]>('/formatos')) ?? [];
