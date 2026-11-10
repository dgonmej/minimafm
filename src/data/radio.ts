/*
 * Tipos y constantes de la programacion. Los datos (emisora, programas...) vienen de la API:
 * ver src/lib/api.ts. La parrilla semanal se calcula a partir de las franjas de cada programa.
 */

/** Dias de la semana, empezando en lunes (indice 0). */
export const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;

export type Franja = { dias: number[]; inicio: string; fin: string };

export type Programa = {
  id: string;
  nombre: string;
  presentador: string;
  categoria: 'Actualidad' | 'Música' | 'Deportes' | 'Tradición' | 'Comunidad';
  descripcion: string;
  /** Secciones habituales del programa */
  secciones: string[];
  franjas: Franja[];
};

/** Programa que suena cuando no hay ninguno en antena. */
export const continuidad = {
  id: 'musica-continua',
  nombre: 'Música continua',
  presentador: 'Mínima FM',
  descripcion: 'La mejor música para acompañarte hasta el próximo programa.',
};
