# QA Drill API (login + sinkronisasi)

Server kecil untuk akun email + password dan sinkronisasi progres lintas perangkat.
Hanya modul bawaan Node (`node:http`, `node:crypto`, `node:sqlite`); **tanpa dependency npm**.
Butuh **Node >= 22.13** (untuk `node:sqlite`). Aplikasi di `public/learn/` tetap berfungsi tanpa server ini
(mode lokal, progres di browser); akun hanya aktif bila `/api/` tersedia.

## Perilaku
- `POST /api/register` dan `/api/login` (JSON `{email, password}`), `POST /api/logout`, `GET /api/me`.
- `GET|PUT /api/progress`: satu dokumen JSON per pengguna dengan versi (optimistic concurrency). Klien menggabungkan
  data bila ada konflik (`409`) sehingga dua perangkat tidak saling menimpa (lihat `S.merge` di `public/learn/js/store.js`).
- Tanpa verifikasi email, sesuai keputusan produk. Konsekuensinya: siapa pun bisa mendaftar dengan email siapa pun,
  dan **tidak ada reset password otomatis**. Reset manual oleh admin: `node admin.js set-password <email> <password>`.
- Keamanan: scrypt + salt per pengguna, hanya hash token sesi yang disimpan, cookie `HttpOnly; SameSite=Lax; Secure`,
  CSRF dijaga (hanya JSON + cek `Origin`), batas laju per IP dan per email, batas ukuran body/progres, batas jumlah pengguna.
- Data yang disimpan: email, hash password, dan progres belajar. Tidak ada pelacakan atau analitik.

## Menjalankan lokal (dev)
```bash
cd qa-drill/server
PORT=4400 STATIC_DIR=../../public/learn node server.js   # buka http://localhost:4400/
```
`STATIC_DIR` hanya untuk dev/CI; di produksi Nginx yang menyajikan berkas statis.

## Variabel lingkungan
| Variabel | Default | Arti |
|---|---|---|
| `PORT` / `HOST` | `4400` / `127.0.0.1` | alamat dengar (biarkan di loopback; Nginx yang publik) |
| `DB_PATH` | `server/data/qa-drill.sqlite` | lokasi SQLite (di luar repo pada produksi) |
| `ALLOWED_ORIGIN` | kosong | asal yang boleh menulis, mis. `https://learn.naradipta.com` |
| `COOKIE_SECURE` | aktif bila `NODE_ENV=production` | atribut `Secure` pada cookie |
| `TRUST_PROXY` | kosong | `1` bila di belakang Nginx (membaca `X-Real-IP`) |
| `MAX_USERS` | `2000` | batas pendaftaran |
| `RATE_LIMIT_IP` | `30` | percobaan daftar/login per IP per 15 menit |

## Pemasangan di VPS (manual, sekali)
`deploy.sh` tidak menyentuh konfigurasi sistem, jadi langkah ini dilakukan sendiri:
1. DNS: rekaman `A`/`AAAA` `learn.naradipta.com` ke IP VPS.
2. Sertifikat TLS untuk `learn.naradipta.com` (mis. `certbot --nginx -d learn.naradipta.com`).
3. Nginx: pasang `deploy/nginx-learn.conf.example` (root = `<WEB_ROOT>/learn`, proxy `/api/` ke `127.0.0.1:4400`)
   dan tambahkan pengalihan 301 `/learn/` di server `naradipta.com`.
4. Proses Node: pasang `deploy/qa-drill.service.example` sebagai unit systemd; buat `/var/lib/qa-drill` milik `www-data`.
5. Cadangan: salin `/var/lib/qa-drill/qa-drill.sqlite` secara berkala (`sqlite3 ... ".backup ..."`).
6. Setelah `deploy.sh`, jalankan `systemctl restart qa-drill` bila kode server berubah.

## Tes
`node tests/server.test.js` (dari `qa-drill/`) menguji pendaftaran, login, sesi, konflik versi, CSRF, dan pembatas laju.

## Rencana berikutnya: verifikasi email (belum dikerjakan)
Saat ini pendaftaran tanpa verifikasi (keputusan sementara). Bila nanti ditambahkan, yang dibutuhkan:
- Pengiriman email lewat SMTP atau layanan transaksional (mis. Resend, Postmark, Amazon SES) dengan pengirim `no-reply@naradipta.com`.
- Rekaman DNS `SPF`, `DKIM`, dan `DMARC` untuk `naradipta.com` agar email tidak masuk spam.
- Kolom `verified_at` di tabel `users`, token verifikasi sekali pakai berkedaluwarsa, dan tautan reset password
  (menggantikan reset manual lewat `admin.js`).
- Kredensial layanan email disimpan sebagai variabel lingkungan di VPS, bukan di repo.
