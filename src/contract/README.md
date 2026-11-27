# Contrato de la API

Lo que comparten la API, el panel y la web de Mínima FM:

- `catalogs.ts`: listas cerradas (categorías, redes, iconos, roles). Sin dependencias.
- `schemas.ts`: validación de cada contenido y de la emisora (zod).
- `types.ts`: tipos de lo que se envía y se recibe, sacados de los esquemas.

La **fuente** está en `minimafm-api/api/src/contract/`. La API y el panel la usan desde ahí.
La web (repositorio `minimafm`) tiene una **copia** en `src/contract/`: no se edita a mano, se actualiza con

    cd minimafm-api && npm run contrato

y después `npm run check` en la web avisa de lo que haya que cambiar.
