import { defineConfig } from 'astro/config';

// Situs statis, zero-JS by default (lihat ARCHITECTURE.md #2, #5).
// build.format: 'file' menghasilkan halaman sebagai *.html (bukan folder/index.html)
// agar cocok dengan konfigurasi Nginx try_files $uri.html di deploy.sh/README.md.
export default defineConfig({
  output: 'static',

  build: {
    format: 'file',
  },
});