#!/bin/sh
# Bangun ulang situs ke volume webroot. Setara langkah build + salin di deploy.sh.
# Dipakai admin-start.sh (saat webroot masih kosong) dan manual setelah kode situs berubah:
#   docker compose run --rm --no-deps admin sh docker/rebuild.sh
set -eu
cd /app

# .astro ditautkan ke volume data (lihat Dockerfile). Volume yang dipulihkan dari cadangan bisa belum punya folder ini.
mkdir -p "$ADMIN_DATA_DIR/.astro"

# Konten yang TERBIT di admin (live/) adalah sumber kebenaran; src/content hanya nilai awal.
if [ -d "$ADMIN_DATA_DIR/live" ]; then
  echo "==> memakai konten admin: $ADMIN_DATA_DIR/live"
  export CONTENT_DIR="$ADMIN_DATA_DIR/live"
fi

# Keluaran harus satu filesystem dengan .astro (rename lintas filesystem gagal), jadi di volume data, bukan dist/.
OUT="$ADMIN_DATA_DIR/rebuild-out"
rm -rf "$OUT"
echo "==> astro build"
npx astro build --outDir "$OUT"

# Foto/PDF unggahan admin bukan bagian repo; salin agar ikut terbit.
if [ -d "$ADMIN_DATA_DIR/uploads" ]; then
  cp -R "$ADMIN_DATA_DIR/uploads" "$OUT/uploads"
fi

# Sama seperti deploy.sh: keluaran kosong + --delete akan mengosongkan webroot.
if [ ! -f "$OUT/index.html" ]; then
  echo "FATAL: $OUT/index.html tidak ditemukan; build tampak gagal. webroot tidak disentuh." >&2
  exit 1
fi

echo "==> menyalin ke $WEB_ROOT"
rsync -a --delete "$OUT/" "$WEB_ROOT/"
rm -rf "$OUT"
echo "==> Selesai."
