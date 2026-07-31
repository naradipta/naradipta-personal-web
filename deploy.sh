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
#   - Nginx dengan root mengarah ke $WEB_ROOT
#
# Catatan: skrip ini TIDAK menyentuh konfigurasi sistem/Nginx.
# Ia hanya build dan menyalin file. Konfigurasi server dilakukan manual sekali.

set -euo pipefail

# --- Konfigurasi (sesuaikan bila perlu) ---
SRC_DIR="/var/www/naradipta-personal-web"   # lokasi clone repo
WEB_ROOT="/var/www/naradipta-personal-web"      # root yang disajikan Nginx
BRANCH="main"                      # branch yang dideploy

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
echo "==> menyalin dist/ ke $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete dist/ "$WEB_ROOT/"

echo "==> Selesai. Situs terbaru sudah live."
echo "    (Nginx menyajikan dari $WEB_ROOT — tidak perlu reload untuk perubahan konten.)"
