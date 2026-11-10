/*
 * Datos de la web: se leen de la API de Minima FM (repositorio minimafm-api) en el servidor,
 * en cada peticion, con una cache corta en memoria para no repetir llamadas en la misma pagina.
 *
 * Eventos, noticias y paginas se devuelven con la misma forma que tenian las colecciones de
 * contenido de Astro ({ id, data, cuerpo }), asi las plantillas apenas cambian.
 */
import type { Programa } from '../data/radio';

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

export type Radio = {
  nombre: string;
  frecuencia: string;
  lema: string;
  zona: string;
  descripcion: string;
  stream: string;
  telefono: string;
  whatsapp: string;
  correo: string;
  direccion: string;
  redes: { nombre: 'Facebook' | 'Instagram'; url: string }[];
};

export async function getRadio(): Promise<Radio> {
  const r = await get<Omit<Radio, 'redes'> & { facebook: string | null; instagram: string | null }>('/radio');
  if (!r) throw new ApiUnavailable('Faltan los datos de la emisora');
  const { facebook, instagram, ...rest } = r;
  const redes: Radio['redes'] = [];
  if (facebook) redes.push({ nombre: 'Facebook', url: facebook });
  if (instagram) redes.push({ nombre: 'Instagram', url: instagram });
  return { ...rest, redes };
}

export const getProgramas = async () => (await get<Programa[]>('/programas')) ?? [];
export const getPrograma = (id: string) => get<Programa | null>(`/programas/${encodeURIComponent(id)}`);

// ---------- Contenido con forma de coleccion ----------

/** Las fechas AAAA-MM-DD se convierten en Date a medianoche UTC, como hacian las colecciones */
const fecha = (s: string) => new Date(`${s}T00:00:00Z`);

type Entry<D> = { id: string; data: D; cuerpo: string };

export type Evento = Entry<{
  titulo: string;
  fecha: Date;
  hora: string;
  lugar: string;
  categoria: 'Fiestas' | 'Música' | 'Mercado' | 'Naturaleza' | 'Solidario' | 'Cultura';
  resumen: string;
}>;

export type Noticia = Entry<{
  titulo: string;
  fecha: Date;
  categoria: 'La radio' | 'Municipio' | 'Deportes' | 'Cultura' | 'Solidaridad';
  autor: string;
  resumen: string;
}>;

export type Pagina = Entry<{ titulo: string; resumen: string; orden: number; actualizado: Date }>;

type Raw = Record<string, unknown> & { id: string; cuerpo?: string };

const toEvento = ({ id, cuerpo = '', ...d }: Raw): Evento => ({ id, cuerpo, data: { ...(d as Evento['data']), fecha: fecha(d.fecha as string) } });
const toNoticia = ({ id, cuerpo = '', ...d }: Raw): Noticia => ({ id, cuerpo, data: { ...(d as Noticia['data']), fecha: fecha(d.fecha as string) } });
const toPagina = ({ id, cuerpo = '', ...d }: Raw): Pagina => ({ id, cuerpo, data: { ...(d as Pagina['data']), actualizado: new Date(d.actualizado as string) } });

export const getEventos = async () => ((await get<Raw[]>('/eventos')) ?? []).map(toEvento);
export const getEvento = async (id: string) => {
  const r = await get<Raw | null>(`/eventos/${encodeURIComponent(id)}`);
  return r ? toEvento(r) : null;
};

export const getNoticias = async () => ((await get<Raw[]>('/noticias')) ?? []).map(toNoticia);
export const getNoticia = async (id: string) => {
  const r = await get<Raw | null>(`/noticias/${encodeURIComponent(id)}`);
  return r ? toNoticia(r) : null;
};

export const getPaginas = async () => ((await get<Raw[]>('/paginas')) ?? []).map(toPagina);

// ---------- La radio y publicidad ----------

export type Persona = { nombre: string; papel: string };
export type Hito = { anio: string; titulo: string; texto: string };
export type Tarifa = { nombre: string; horario: string; precio20: number; precio30: number; destacada: boolean };
export type Formato = { nombre: string; precio: string; unidad: string; texto: string; icono: 'shopping-basket' | 'mic' | 'message-circle' | 'party-popper' };

export const getEquipo = async () => (await get<Persona[]>('/equipo')) ?? [];
export const getHistoria = async () => (await get<Hito[]>('/historia')) ?? [];
export const getTarifas = async () => (await get<Tarifa[]>('/tarifas')) ?? [];
export const getFormatos = async () => (await get<Formato[]>('/formatos')) ?? [];
