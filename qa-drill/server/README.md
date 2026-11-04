# QA Drill API (login + sinkronisasi)

Server kecil untuk akun email + password dan sinkronisasi progres lintas perangkat.
Hanya modul bawaan Node (`node:http`, `node:crypto`, `node:sqlite`); **tanpa dependency npm**.
Butuh **Node >= 22.13** (untuk `node:sqlite`). Aplikasi di `public/learn/` tetap berfungsi tanpa server ini
(mode lokal, progres di browser); akun hanya aktif bila `/api/` tersedia.

## Perilaku
- `POST /api/register` dan `/api/login` (JSON `{email, password}`), `POST /api/logout`, `GET /api/me` (mengembalikan `email`, `id`, `verified`; `email: null` bila belum masuk).
- `GET|PUT /api/progress`: satu dokumen JSON per pengguna dengan versi (optimistic concurrency). Klien menggabungkan
  data bila ada konflik (`409`) sehingga dua perangkat tidak saling menimpa (lihat `S.merge` di `public/learn/js/store.js`).
- Komunitas (opt-in): `PUT /api/profile` (`{displayName, share}`) dan `GET /api/community` (wajib login). Default tidak berbagi.
  Yang tampil hanya nama tampilan (2-24 karakter, tanpa `@`), hari aktif 7 hari terakhir, streak, jumlah soal dikuasai, dan jumlah soal dilihat;
  tidak pernah email, akurasi, atau jawaban. Ringkasan dihitung server saat progres disimpan (`stats.js`, kolom `progress.stats`);
  batas hari mengikuti WIB (`TZ_OFFSET_MIN`, default 420). Berhenti berbagi langsung menghapus dari papan.
- Moderasi nama tampilan:
  - **Aturan otomatis:** nama ditolak bila memuat kata yang dicadangkan (admin, moderator, naradipta, official, dst.) atau kata kasar (daftar bawaan di `stats.js`, tambah lewat `BLOCKED_NAME_WORDS=kata1,kata2`). Pemeriksaan mengabaikan huruf besar, spasi, tanda, dan leetspeak (`Adm1n`, `ad min`). Alamat di `ADMIN_EMAILS` (dipisah koma) boleh memakai nama dicadangkan. Nama harus unik di antara anggota yang tampil (dibandingkan dengan cara yang sama).
  - **Laporan:** anggota terverifikasi bisa melaporkan nama lewat tombol "Laporkan" di papan (`POST /api/community/report`, maks 5 per jam, satu laporan terbuka per pelapor per anggota, tidak bisa melaporkan diri sendiri). Bila laporan terbuka dari `REPORT_AUTOHIDE` pelapor berbeda (default 3) terkumpul, nama otomatis disembunyikan dari papan sampai Anda meninjau.
  - **Perintah admin** (jalankan dari `qa-drill/server`, dengan `DB_PATH` produksi): `node admin.js reports` (daftar laporan terbuka), `hide-name <email>` (hapus nama, keluarkan dari papan, kunci agar tidak bisa bergabung lagi), `unhide-name <email>` (buka kunci), `dismiss <email>` (tutup laporan tanpa tindakan; nama tampil lagi).
- Tanpa verifikasi email, sesuai keputusan produk. Konsekuensinya: siapa pun bisa mendaftar dengan email siapa pun,
  Bila `MAIL_PROVIDER` diatur, tersedia verifikasi email dan reset password mandiri (lihat bagian Email). Tanpa itu, reset manual oleh admin: `node admin.js set-password <email> <password>`.
- Keamanan: scrypt + salt per pengguna, hanya hash token sesi yang disimpan, cookie `HttpOnly; SameSite=Lax; Secure`,
  CSRF dijaga (hanya JSON + cek `Origin`), batas laju per IP dan per email, batas ukuran body/progres, batas jumlah pengguna.
- Data yang disimpan: email, hash password, dan progres belajar. Tidak ada pelacakan atau analitik.

## Email: verifikasi dan reset password
Diaktifkan lewat variabel lingkungan; tanpa `MAIL_PROVIDER` semua fitur email mati (aplikasi tetap jalan, tombol "Lupa password" disembunyikan, komunitas tidak butuh verifikasi).
| Variabel | Arti |
|---|---|
| `MAIL_PROVIDER` | `resend` (kirim lewat Resend HTTP API) atau `log` (dev: isi email dicetak ke konsol) |
| `MAIL_FROM` | pengirim, mis. `QA Drill <no-reply@naradipta.com>` (domain harus terverifikasi di penyedia; atur SPF, DKIM, DMARC) |
| `RESEND_API_KEY` | kunci API Resend (rahasia: simpan di `EnvironmentFile`, bukan di repo) |
| `APP_URL` | alamat publik untuk tautan di email, mis. `https://learn.naradipta.com` |

- Alur: daftar → email verifikasi (token 24 jam, sekali pakai). Lupa password → email tautan reset (1 jam, sekali pakai); selesai reset, semua sesi dicabut dan email otomatis terverifikasi.
- Token hanya disimpan sebagai hash; tautan memakai fragment (`#/verify/<token>`, `#/reset/<token>`) sehingga token tidak masuk log web server.
- "Lupa password" menjawab sama untuk email terdaftar atau tidak (tidak membocorkan akun). Batas: 3 permintaan/jam per email, 3 kirim ulang verifikasi/jam per akun.
- Bila verifikasi aktif, bergabung di papan komunitas mensyaratkan email terverifikasi. Akun lama tetap bisa belajar dan sinkron, hanya diminta verifikasi untuk komunitas.
- Penyedia lain: tambahkan adapter di `mailer.js` (cukup fungsi `send({to, subject, text, html})`). Tidak ada SMTP karena tanpa dependency.
- Cadangan manual: `node admin.js verify <email>` dan `node admin.js set-password <email> <password>`.
- Tes E2E email: jalankan server dengan `MAIL_PROVIDER=log APP_URL=http://localhost:4400` dan arahkan stdout ke berkas, lalu `E2E_MAIL_LOG=<berkas> npm test`.

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
| `RATE_LIMIT_IP` | `60` | percobaan daftar/login/lupa password per IP per 15 menit (naikkan bila banyak teman di satu jaringan; pastikan `TRUST_PROXY=1` di belakang Nginx agar IP asli terbaca) |

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
