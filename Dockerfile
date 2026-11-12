# syntax=docker/dockerfile:1
# Web de Minima FM (Astro en modo servidor). Necesita el repositorio dgonmej-ui como contexto
# adicional; se construye desde el docker-compose.yml de minimafm-api.

FROM node:24-alpine AS ui
WORKDIR /src/dgonmej-ui
COPY --from=dgonmej-ui --exclude=node_modules --exclude=dist --exclude=.git . .
RUN npm ci --ignore-scripts && npm run build

FROM node:24-alpine AS build
COPY --from=ui /src/dgonmej-ui /src/dgonmej-ui
WORKDIR /src/minimafm
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321
WORKDIR /app
COPY --from=build /src/minimafm/node_modules node_modules
COPY --from=build /src/minimafm/dist dist
COPY package.json ./
USER node
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
