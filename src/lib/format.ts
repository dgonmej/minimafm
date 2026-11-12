import { dias, type Franja } from '../data/radio';

const fechaLarga = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Atlantic/Canary' });
const fechaCorta = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Atlantic/Canary' });
const mesCorto = new Intl.DateTimeFormat('es-ES', { month: 'short', timeZone: 'Atlantic/Canary' });
const diaMes = new Intl.DateTimeFormat('es-ES', { day: 'numeric', timeZone: 'Atlantic/Canary' });

const mayuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "sábado, 19 de diciembre de 2026" -> con mayuscula inicial */
export const formatoFechaLarga = (d: Date) => mayuscula(fechaLarga.format(d));
/** "19 de diciembre de 2026" */
export const formatoFecha = (d: Date) => fechaCorta.format(d);
/** Para el bloque de fecha de los eventos: { dia: '19', mes: 'dic' } */
export const partesFecha = (d: Date) => ({ dia: diaMes.format(d), mes: mesCorto.format(d).replace('.', '') });
/** Fecha ISO (AAAA-MM-DD) para el atributo datetime */
export const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Dias de una franja en lenguaje natural: "De lunes a viernes", "Lunes, miércoles y viernes" */
export function describirDias(lista: number[]) {
  const orden = [...lista].sort((a, b) => a - b);
  const consecutivos = orden.every((d, i) => i === 0 || d === orden[i - 1] + 1);
  if (orden.length >= 3 && consecutivos) {
    return `De ${dias[orden[0]].toLowerCase()} a ${dias[orden[orden.length - 1]].toLowerCase()}`;
  }
  const nombres = orden.map((d, i) => (i === 0 ? dias[d] : dias[d].toLowerCase()));
  return nombres.length > 1 ? `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}` : nombres[0];
}

/** "De lunes a viernes, de 07:00 a 10:00" */
export const describirFranja = (f: Franja) => `${describirDias(f.dias)}, de ${f.inicio} a ${f.fin}`;

/** Icono (de Icon.astro) para cada categoria de evento */
export const iconoEvento = {
  Fiestas: 'party-popper',
  Música: 'headphones',
  Mercado: 'shopping-basket',
  Naturaleza: 'leaf',
  Solidario: 'heart-handshake',
  Cultura: 'landmark',
} as const;

/** Icono para cada categoria de programa */
export const iconoPrograma = {
  Actualidad: 'newspaper',
  Música: 'headphones',
  Deportes: 'trophy',
  Tradición: 'landmark',
  Comunidad: 'users',
} as const;

/** Tono de color (clase .tono-* de global.css) para cada categoria de programa */
export const tonoPrograma = {
  Actualidad: 'tono-anil',
  Música: 'tono-atardecer',
  Deportes: 'tono-platanera',
  Tradición: 'tono-ocre',
  Comunidad: 'tono-granate',
} as const;
