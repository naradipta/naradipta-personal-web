#!/bin/sh
# Titik masuk container admin. Bila webroot masih kosong (server baru, volume baru), bangun situs dulu
# supaya naradipta.com tidak kosong sebelum ada Publish pertama. Volume yang dipulihkan dari cadangan
# sudah berisi situs, jadi langkah ini dilewati.
set -eu
cd /app
# /app/.astro menaut ke sini (lihat Dockerfile); volume lama/hasil pemulihan bisa belum punya folder ini.
mkdir -p "$ADMIN_DATA_DIR/.astro"
if [ ! -f "$WEB_ROOT/index.html" ]; then
  echo "==> webroot kosong; membangun situs awal"
  sh docker/rebuild.sh
fi
exec node admin/server.js
