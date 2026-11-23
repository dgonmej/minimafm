# Contrato de la API

Lo que comparten la API, el panel y la web de Mínima FM:

- `catalogos.ts`: listas cerradas (categorías, redes, iconos, roles). Sin dependencias.
- `esquemas.ts`: validación de cada contenido y de la emisora (zod).
- `tipos.ts`: tipos de lo que se envía y se recibe, sacados de los esquemas.

La **fuente** está en `minimafm-api/api/src/contrato/`. La API y el panel la usan desde ahí.
La web (repositorio `minimafm`) tiene una **copia** en `src/contrato/`: no se edita a mano, se actualiza con

    cd minimafm-api && npm run contrato

y después `npm run check` en la web avisa de lo que haya que cambiar.
