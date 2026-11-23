/*
 * Imágenes subidas desde el panel. La API devuelve { id, alt, ancho, alto, anchos } y cada ancho
 * está en /media/{id}-{ancho}.webp (lo sirve nginx en el mismo dominio que la web).
 */
import type { Imagen } from '../contrato/tipos';

export type { Imagen };

/** Ruta del ancho más cercano por encima del pedido (o el mayor que haya) */
export const urlImagen = (img: Imagen, ancho: number) =>
  `/media/${img.id}-${img.anchos.find((a) => a >= ancho) ?? img.anchos[img.anchos.length - 1]}.webp`;

/** srcset con todos los anchos generados */
export const srcsetImagen = (img: Imagen) => img.anchos.map((a) => `/media/${img.id}-${a}.webp ${a}w`).join(', ');

/** Alto proporcional a un ancho dado (para reservar el hueco y que la página no salte) */
export const altoPara = (img: Imagen, ancho: number) => Math.round((img.alto * ancho) / img.ancho);
