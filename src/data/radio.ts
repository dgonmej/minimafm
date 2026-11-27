/*
 * Tipos y constantes de la programacion. Los datos (emisora, programas...) vienen de la API:
 * ver src/lib/api.ts. La parrilla semanal se calcula a partir de las franjas de cada programa.
 */

import type { Franja, Publico } from '../contract/types';

/** Dias de la semana, empezando en lunes (indice 0). */

export const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;

export type { Franja };

/** Un programa tal como lo devuelve la API (ver src/contract) */
export type Programa = Publico<'programas'>;

/** Programa que suena cuando no hay ninguno en antena. */
export const continuidad = {
  id: 'musica-continua',
  nombre: 'Música continua',
  presentador: 'Mínima FM',
  descripcion: 'La mejor música para acompañarte hasta el próximo programa.',
};
