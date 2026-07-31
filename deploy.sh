#!/usr/bin/env bash
#
# deploy.sh — deploy portfolio Astro di VPS (Pola B: build di server).
#
# Alur: tarik versi terbaru dari Git → install dependency → build →
#        salin hasil build ke web root yang disajikan Nginx.
#
# Jalankan dari dalam folder source repo di VPS, mis:
#   cd /var/www/portfolio-src && ./deploy.sh
#
# Prasyarat (dipasang sekali di VPS, lihat README):
#   - Node.js LTS + npm
#   - git
#   - rsync
#   - Nginx dengan root mengarah ke $WEB_ROOT
#
# Catatan: skrip ini TIDAK menyentuh konfigurasi sistem/Nginx.
# Ia hanya build dan menyalin file. Konfigurasi server dilakukan manual sekali.

set -euo pipefail

# --- Konfigurasi (sesuaikan bila perlu) ---
SRC_DIR="/var/www/naradipta-personal-web"   # lokasi clone repo
WEB_ROOT="/var/www/naradipta"      # root yang disajikan Nginx
BRANCH="main"                      # branch yang dideploy

# --- Guard: SRC_DIR dan WEB_ROOT tidak boleh sama ---
# Kalau sama, langkah rsync --delete di bawah akan menghapus repo Git itu
# sendiri (.git, node_modules, src/, dll) karena semuanya dianggap "file
# lama yang sudah tidak ada di dist/".
if [ "$SRC_DIR" = "$WEB_ROOT" ]; then
  echo "FATAL: SRC_DIR dan WEB_ROOT tidak boleh menunjuk ke folder yang sama." >&2
  echo "       SRC_DIR=$SRC_DIR" >&2
  echo "       WEB_ROOT=$WEB_ROOT" >&2
  exit 1
fi

echo "==> Deploy dimulai"

cd "$SRC_DIR"

# 1. Tarik versi terbaru
echo "==> git pull ($BRANCH)"
git fetch --all --prune
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

# 2. Install dependency sesuai lockfile (bersih & reproducible)
echo "==> npm ci"
npm ci

# 3. Build ke ./dist
echo "==> npm run build"
npm run build

# 4. Salin hasil build ke web root
#    --delete agar file lama yang sudah tidak ada ikut terhapus.
#    Guard: pastikan dist/ benar-benar berisi hasil build sebelum --delete
#    dijalankan — dist/ kosong + --delete akan mengosongkan $WEB_ROOT.
if [ ! -f "dist/index.html" ]; then
  echo "FATAL: dist/index.html tidak ditemukan — build tampak gagal/kosong." >&2
  echo "       Membatalkan rsync agar \$WEB_ROOT tidak ikut terhapus." >&2
  exit 1
fi

echo "==> menyalin dist/ ke $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete dist/ "$WEB_ROOT/"

echo "==> Selesai. Situs terbaru sudah live."
echo "    (Nginx menyajikan dari $WEB_ROOT — tidak perlu reload untuk perubahan konten.)"
