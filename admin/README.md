# Admin naradipta.com

Halaman admin untuk mengubah isi situs lewat browser: foto profil, CV, deskripsi, pengalaman, skills, project, dan galeri.
Server kecil (Node >= 22, **tanpa dependency npm**) di `127.0.0.1:4500`, dipublikasikan Nginx di `https://naradipta.com/admin/`.
Situs publik **tetap statis**: admin hanya menulis konten lalu menjalankan `astro build` dan menyalin hasilnya ke web root.
Dikecualikan dari aturan "tanpa backend" di CLAUDE.md, atas keputusan pemilik repo (sama seperti `qa-drill/server/`).

## Alur kerja
1. Login → edit di tab (Profil, What I Do, Pengalaman, Skills, Project, Galeri) → **Simpan draft**. Situs publik belum berubah.
2. **Preview** membangun draft ke folder terpisah (beberapa detik); **Buka preview** menampilkannya di `naradipta.com/admin/preview/` (hanya terlihat bila login; link di dalamnya otomatis diarahkan ke preview).
3. **Publish** membangun ulang dan menyalin ke web root. Bila build gagal, web root tidak disentuh dan pesan error ditampilkan.
4. **Buang draft** mengembalikan draft ke versi terbit. **Riwayat** menyimpan 20 versi terbit sebelumnya; pilih satu untuk dimuat ke draft, lalu Preview dan Publish.

## Data di server (`ADMIN_DATA_DIR`, di luar repo)
| Lokasi | Isi |
|---|---|
| `live/` | konten yang sedang terbit (`site.json`, `projects/*.md`, `gallery/*.md`) |
| `draft/` | konten yang sedang diedit |
| `history/` | salinan `live/` sebelum tiap publish |
| `uploads/` | foto dan PDF unggahan (dilayani sebagai `/uploads/...`) |
| `admin.json` | username + hash password (scrypt), izin 0600 |

Pemakaian pertama mengisi `live/` dari `src/config/site.json` dan `src/content/`, jadi situs tidak berubah sampai Anda publish.
`deploy.sh` otomatis membangun dari `live/` dan menyalin `uploads/` bila folder itu ada, sehingga deploy kode tidak menimpa hasil edit admin.
Konsekuensinya: setelah admin dipakai, **mengubah `src/content/` atau `site.json` di repo tidak lagi memengaruhi situs**; ubah lewat admin.

## Pemasangan di VPS (manual, sekali)
1. Buat folder data: `sudo mkdir -p /var/lib/naradipta-admin && sudo chown <user-deploy>: /var/lib/naradipta-admin`.
2. Beri `<user-deploy>` hak tulis ke web root: `sudo chown -R <user-deploy>: /var/www/naradipta` (butuh `rsync`).
3. **Buat akun admin** (username dan password diatur di server; tidak ada pendaftaran lewat web):
   ```bash
   cd /var/www/naradipta-personal-web/admin
   ADMIN_DATA_DIR=/var/lib/naradipta-admin node cli.js set-admin <username>
   ```
   Password minimal 10 karakter, dibaca dari prompt tersembunyi. Menjalankan ulang perintah yang sama = ganti password
   (lalu `systemctl restart naradipta-admin` agar sesi lama berakhir).
4. Nginx: tambahkan blok `/admin/` dari `deploy/nginx-admin.conf.example` ke server naradipta.com (tanpa subdomain baru).
5. systemd: pasang `deploy/naradipta-admin.service.example` (isi `User=`), lalu `systemctl enable --now naradipta-admin`.
6. Buka `https://naradipta.com/admin/`. Setelah kode admin berubah, `systemctl restart naradipta-admin`.

## Variabel lingkungan
| Variabel | Default | Arti |
|---|---|---|
| `ADMIN_DATA_DIR` | `admin/data` | lokasi data (di produksi: `/var/lib/naradipta-admin`) |
| `WEB_ROOT` | kosong | tujuan publish; kosong = publish ditolak (preview tetap jalan) |
| `REPO_DIR` | induk folder `admin/` | repo tempat `astro build` dijalankan |
| `PORT` / `HOST` | `4500` / `127.0.0.1` | alamat dengar (biarkan di loopback) |
| `ALLOWED_ORIGIN` | kosong | asal yang boleh menulis, `https://naradipta.com` |
| `PUBLIC_PATH` | `/admin` | awalan URL admin di Nginx; dipakai menulis ulang link di preview |
| `COOKIE_SECURE` | aktif bila `NODE_ENV=production` | atribut `Secure` pada cookie |
| `TRUST_PROXY` | kosong | `1` bila di belakang Nginx (membaca `X-Real-IP`) |

## Keamanan
- Satu akun admin; password di-hash scrypt; cookie sesi `HttpOnly; SameSite=Strict; Secure`; login berlaku 7 hari lalu minta password lagi (akun tidak terhapus; sesi disimpan di memori, jadi restart server = login ulang).
- Batas laju login per IP (10 per 15 menit) dan global; CSRF dijaga (JSON atau header khusus + cek `Origin`); UI memakai CSP ketat dan tanpa `innerHTML`.
- Unggahan hanya JPG/PNG/GIF/WebP/PDF, dicek dari isi file (bukan ekstensi), nama file dibuat ulang oleh server. SVG sengaja ditolak.
- Semua input divalidasi (aturan setara schema Content Collection); path dan slug dibatasi agar tidak bisa keluar dari folder data.
- Tidak ada reset password lewat web; ganti lewat `cli.js` di server.
- **Kerahasiaan konten tetap berlaku** (lihat CLAUDE.md): jangan mengisi data internal perusahaan lewat admin.
- Foto tidak dikecilkan otomatis; kompres dulu (maks 8 MB per foto).

## Dev lokal
```bash
cd admin
ADMIN_PASSWORD='password-sangat-panjang' node cli.js set-admin saya   # data di admin/data/ (di-gitignore)
PUBLIC_PATH= node server.js                                             # http://127.0.0.1:4500/ (preview di /preview/)
```
`WEB_ROOT` tidak diisi, jadi Publish ditolak; Preview tetap berjalan. Tes: `node admin/tests/server.test.js` (builder palsu).

## Catatan
- **Unggahan jadi publik.** Setiap file di `uploads/` ikut tersalin ke situs pada publish berikutnya dan bisa dibuka lewat URL-nya, termasuk foto yang diunggah lalu tidak dipakai. Jangan mengunggah file yang tidak boleh publik.
- **Publish membangun dari checkout repo di server** (termasuk `public/learn` QA Drill), sama seperti `deploy.sh`. Setelah mengubah kode atau QA Drill, jalankan `deploy.sh` (git pull) dulu supaya publish admin tidak menerbitkan versi lama.
- Membuka lalu menyimpan project tanpa perubahan bisa menandai draft "berubah" karena format file ditulis ulang; isinya tetap sama.
- Preview disajikan di origin yang sama dengan admin; isi Markdown/HTML yang Anda tulis sendiri ikut berjalan di sana. Jangan menempel HTML dari sumber yang tidak dipercaya.
