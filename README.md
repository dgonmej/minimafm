# Mínima FM 97.9

Web de **Mínima FM**, la radio del Valle de Güímar (Tenerife): *"…somos tu voz."*

Publicada en **https://dgonmej.github.io/minimafm/**.

## Qué tiene

- **Reproductor en directo** fijo abajo, que sigue sonando al cambiar de página.
- **Ahora en antena**: el programa que suena, cuánto lleva y qué viene después (en hora de Canarias).
- **Programas**, con filtro por tipo.
- **Horarios**: la parrilla de la semana, día a día, con el programa en antena resaltado.
- **Eventos** y **noticias**, con su página de detalle.
- Tema claro y oscuro (según el sistema o elegido), recordado entre visitas.

> Los programas, presentadores, eventos, noticias y datos de contacto son **datos de prueba**.

## Cómo actualizar el contenido

- **Programas y parrilla**: `src/data/radio.ts`. Cada programa tiene sus franjas
  (`dias` de 0 = lunes a 6 = domingo, `inicio` y `fin`); la parrilla se calcula sola.
- **Datos de la emisora** (teléfono, WhatsApp, correo, dirección, redes, URL del directo):
  `src/data/radio.ts`.
- **Eventos**: un archivo `.md` por evento en `src/content/eventos/`.
- **Noticias**: un archivo `.md` por noticia en `src/content/noticias/`.

Los eventos pasados se ocultan solos de la portada al volver a publicar la web.

## Desarrollo

Necesita el repositorio `dgonmej-ui` en la carpeta de al lado (`../dgonmej-ui`), compilado:

```bash
cd ../dgonmej-ui && npm install && npm run build
cd ../minimafm && npm install
npm run dev        # http://localhost:4321/minimafm/
npm run build      # genera dist/
```

## Despliegue

`.github/workflows/deploy.yml` compila dgonmej-ui y el sitio y lo publica en GitHub Pages en
cada push a `main`. En GitHub, *Settings > Pages > Source* debe estar en **GitHub Actions**.
Si `dgonmej-ui` es privado, el workflow necesita un token con acceso a ese repositorio.

## Créditos

Hecha con [Astro](https://astro.build) y [dgonmej-ui](https://github.com/dgonmej/dgonmej-ui).
Iconos de [Lucide](https://lucide.dev) (licencia ISC).
