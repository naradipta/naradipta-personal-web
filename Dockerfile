# Satu Dockerfile, beberapa target (lihat compose.yaml dan README bagian "Deploy dengan Docker").
#   docker build .                      → situs statis saja (Nginx + hasil build), target `runtime` (bawaan)
#   docker build --target admin .       → server admin + `astro build` (menulis ke volume webroot)
#   docker build --target qa-drill .    → API login + sinkronisasi QA Drill
#   docker build --target web .         → Nginx pintu masuk: naradipta.com, /admin/, learn.naradipta.com
ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

# --- admin: butuh source + node_modules karena Publish menjalankan `astro build`, dan rsync untuk menyalin ke webroot.
FROM ${NODE_IMAGE} AS admin
RUN apk add --no-cache rsync \
 && mkdir -p /app/.admin-data/.astro /webroot \
 && chown -R node:node /app /webroot
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
# `astro build` memindahkan hasil dari .astro/ ke folder keluaran dengan rename(), yang gagal lintas mount (EXDEV).
# Keluaran admin ada di volume data, jadi .astro harus ikut di volume itu. Volume dipasang DI DALAM /app
# (bukan /data) agar Node, yang mencari node_modules dari lokasi nyata berkas, tetap menemukan /app/node_modules.
RUN ln -s /app/.admin-data/.astro /app/.astro && chown -h node:node /app/.astro
ENV NODE_ENV=production \
    PORT=4500 \
    HOST=0.0.0.0 \
    TRUST_PROXY=1 \
    REPO_DIR=/app \
    ADMIN_DATA_DIR=/app/.admin-data \
    WEB_ROOT=/webroot \
    ASTRO_TELEMETRY_DISABLED=1 \
    XDG_CONFIG_HOME=/app/.admin-data/.config
USER node
EXPOSE 4500
CMD ["sh", "docker/admin-start.sh"]

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

# --- web: pintu masuk HTTP tunggal. Isi situs dibaca dari volume (diisi admin), bukan dibakar ke image.
# /srv/site sengaja kosong dan dimiliki uid 1000 (= user `node` di image admin), sama seperti /webroot di admin:
# Docker menyalin pemilik titik-mount ke volume baru, jadi siapa pun yang start duluan, admin tetap bisa menulis.
# (Jangan mount di /usr/share/nginx/html: isinya halaman "Welcome to nginx" akan ikut masuk volume.)
FROM nginx:alpine AS web
RUN mkdir -p /srv/site && chown 1000:1000 /srv/site
COPY docker/nginx-web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# --- runtime (target terakhir = bawaan): situs statis saja, tanpa admin/QA Drill.
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
