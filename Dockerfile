# syntax=docker/dockerfile:1
# Web de Minima FM (Astro en modo servidor). Se construye desde el docker-compose.yml de
# minimafm-api; dgonmej-ui se instala desde npm.

FROM node:24-alpine AS build
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
