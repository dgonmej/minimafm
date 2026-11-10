/*
 * Utilidades de la parrilla. Se usan en el servidor (para pintar la parrilla) y en el
 * navegador (para saber que suena ahora, en hora canaria). Reciben la lista de programas:
 * en el navegador sale de parrilla(), que la lee de la propia pagina.
 */
import { continuidad, type Programa } from '../data/radio';

export type Emision = {
  programa: Programa;
  dia: number;
  inicio: string;
  fin: string;
};

const minutos = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

/** Programas incrustados en la pagina por Layout.astro (solo en el navegador). */
export function parrilla(): Programa[] {
  try {
    return JSON.parse(document.getElementById('parrilla-data')?.textContent ?? '[]');
  } catch {
    return [];
  }
}

/** Emisiones de un dia (0 = lunes), ordenadas por hora. */
export function emisionesDelDia(dia: number, programas: Programa[]): Emision[] {
  return programas
    .flatMap((programa) =>
      programa.franjas.filter((f) => f.dias.includes(dia)).map((f) => ({ programa, dia, inicio: f.inicio, fin: f.fin }))
    )
    .sort((a, b) => minutos(a.inicio) - minutos(b.inicio));
}

/** Dia (0 = lunes) y minuto del dia actuales en hora de Canarias. */
export function ahoraEnCanarias(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Atlantic/Canary',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(fecha);
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';
  const dia = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(valor('weekday'));
  const minuto = (Number(valor('hour')) % 24) * 60 + Number(valor('minute'));
  return { dia, minuto };
}

/** Lo que suena ahora y lo siguiente (puede ser de otro dia). */
export function enAntena(programas: Programa[], fecha = new Date()) {
  const { dia, minuto } = ahoraEnCanarias(fecha);
  const hoy = emisionesDelDia(dia, programas);
  const actual = hoy.find((e) => minutos(e.inicio) <= minuto && minuto < minutos(e.fin)) ?? null;

  // Siguiente emision: la proxima de hoy, o la primera de los dias siguientes
  let siguiente = hoy.find((e) => minutos(e.inicio) > minuto) ?? null;
  for (let i = 1; !siguiente && i <= 7; i++) {
    siguiente = emisionesDelDia((dia + i) % 7, programas)[0] ?? null;
  }
  return { actual, siguiente, dia, continuidad };
}

/** Proxima emision de un programa (o la actual, si esta sonando). */
export function proximaEmision(id: string, programas: Programa[], fecha = new Date()) {
  const { dia, minuto } = ahoraEnCanarias(fecha);
  for (let i = 0; i <= 7; i++) {
    const d = (dia + i) % 7;
    const e = emisionesDelDia(d, programas).find((e) => e.programa.id === id && (i > 0 || minutos(e.fin) > minuto));
    if (e) return { emision: e, enDias: i, sonando: i === 0 && minutos(e.inicio) <= minuto };
  }
  return null;
}
