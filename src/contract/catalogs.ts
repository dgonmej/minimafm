// Copia de minimafm-api/api/src/contract: no se edita aquí, se actualiza con «npm run contrato» en minimafm-api.
/*
 * Listas cerradas que comparten la API, el panel y la web: categorías, redes, iconos, roles…
 * Sin dependencias, para poder usarse también en el navegador. Parte del contrato (ver README.md).
 */

export const roles = ['admin', 'editor'] as const;

/** Redes sociales y plataformas de audio que se pueden enlazar desde la web */
export const redesSociales = ['facebook', 'instagram', 'youtube', 'tiktok', 'x', 'threads', 'bluesky', 'spotify', 'ivoox', 'apple-podcasts', 'soundcloud', 'twitch'] as const;
export type RedSocial = (typeof redesSociales)[number];

/** Nombre visible de cada red */
export const nombresRedes = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X',
  threads: 'Threads',
  bluesky: 'Bluesky',
  spotify: 'Spotify',
  ivoox: 'iVoox',
  'apple-podcasts': 'Apple Podcasts',
  soundcloud: 'SoundCloud',
  twitch: 'Twitch',
} as const satisfies Record<RedSocial, string>;

export const categoriasPrograma = ['Actualidad', 'Música', 'Deportes', 'Tradición', 'Comunidad'] as const;
export const categoriasEvento = ['Fiestas', 'Música', 'Mercado', 'Naturaleza', 'Solidario', 'Cultura'] as const;
export const categoriasNoticia = ['La radio', 'Municipio', 'Deportes', 'Cultura', 'Solidaridad'] as const;
export const iconosFormato = ['shopping-basket', 'mic', 'message-circle', 'party-popper'] as const;

/** Anchos en los que se guarda cada imagen subida (/media/{id}-{ancho}.webp) */
export const anchosImagen = [480, 960, 1600] as const;
