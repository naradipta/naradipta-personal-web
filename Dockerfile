# Satu Dockerfile, beberapa target (lihat compose.yaml dan README bagian "Deploy dengan Docker").
#   docker build .                      → situs statis saja (Nginx + hasil build), target `runtime` (bawaan)
#   docker build --target qa-drill .    → API login + sinkronisasi QA Drill
#   docker build --target web .         → Nginx pintu masuk: naradipta.com + learn.naradipta.com (situs statis dibakar ke image)
ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

# --- qa-drill: hanya modul bawaan Node (node:sqlite), jadi cukup menyalin folder server.
FROM ${NODE_IMAGE} AS qa-drill
RUN mkdir -p /app /data && chown node:node /app /data
WORKDIR /app
COPY --chown=node:node qa-drill/server ./
ENV NODE_ENV=production \
    PORT=4400 \
    HOST=0.0.0.0 \
    TRUST_PROXY=1 \
    DB_PATH=/data/qa-drill.sqlite
USER node
EXPOSE 4400
CMD ["node", "server.js"]

# --- web: pintu masuk HTTP tunggal untuk naradipta.com dan learn.naradipta.com. Situs statis dibangun di sini
# (CI), lalu dibakar ke image; server tidak pernah menjalankan `astro build`. Update situs = image baru.
FROM nginx:alpine AS web
COPY --from=build /app/dist /srv/site
COPY docker/nginx-web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# --- runtime (target terakhir = bawaan): situs statis saja, tanpa admin/QA Drill.
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
