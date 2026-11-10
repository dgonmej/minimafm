# Mínima FM 97.9

Web de **Mínima FM**, la radio del Valle de Güímar (Tenerife): *"…somos tu voz."*

La web se genera en el servidor en cada visita con el contenido de la API de Mínima FM
([minimafm-api](https://github.com/dgonmej/minimafm-api)). Lo que se publica en el panel de
administración aparece en la web al momento.

## Qué tiene

- **Reproductor en directo** fijo abajo, que sigue sonando al cambiar de página.
- **Ahora en antena**: el programa que suena, cuánto lleva y qué viene después (en hora de Canarias).
- **Programas**, con filtro por tipo y ficha de cada programa.
- **Horarios**: la parrilla de la semana, día a día, con el programa en antena resaltado.
- **Eventos** por meses y **noticias** como un periódico, con su página de detalle.
- **La radio** (historia, equipo y cómo escucharnos), **Anúnciate** (tarifas y contacto) y páginas legales.
- Tema claro y oscuro (según el sistema o elegido), recordado entre visitas.

> Los programas, presentadores, eventos, noticias y datos de contacto son **datos de prueba**.

## Cómo actualizar el contenido

Todo el contenido (programas y parrilla, datos de la emisora, eventos, noticias, equipo, historia,
tarifas y páginas legales) se gestiona desde el **panel de administración** de
[minimafm-api](https://github.com/dgonmej/minimafm-api), en `/admin/`.

La parrilla se calcula sola a partir del horario de cada programa, y los eventos pasados dejan de
salir en la portada.

## Desarrollo

Necesita, en carpetas vecinas, `dgonmej-ui` (compilado) y `minimafm-api` con la API en marcha
(ver su README):

```bash
cd ../dgonmej-ui && npm install && npm run build
cd ../minimafm && npm install
npm run dev        # http://localhost:4321, lee la API de http://localhost:3000
```

Variables de entorno:

| Variable | Para qué | Por defecto |
| --- | --- | --- |
| `API_URL` | Dirección de la API | `http://localhost:3000` |
| `SITE` | Dirección pública de la web (enlaces canónicos) | `http://localhost:8080` |

## Despliegue

La web se ejecuta con Node (`npm run build` y `node dist/server/entry.mjs`) o con Docker
(`Dockerfile`). Lo más sencillo es levantarla junto a la API, la base de datos y nginx con el
`docker-compose.yml` de [minimafm-api](https://github.com/dgonmej/minimafm-api), donde se explica
cómo publicarla en un servidor propio.

## Créditos

Hecha con [Astro](https://astro.build) y [dgonmej-ui](https://github.com/dgonmej/dgonmej-ui).
Iconos de [Lucide](https://lucide.dev) (licencia ISC).
