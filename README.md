# Muhammad Arrafi — Portfolio Website

Personal portfolio & case-study site untuk **Muhammad Arrafi**, QA Engineer / SDET.
Dibangun dengan **Astro**: statis, cepat, dan mudah dirawat — menambah project baru
cukup dengan menambah satu file Markdown.

---

## Kenapa Astro?

Portofolio adalah situs yang isinya 99% konten statis. Astro dipilih karena:

- **Zero-JS by default** — halaman dirender jadi HTML statis, loading cepat.
  Penting untuk kesan pertama recruiter.
- **Content Collections** — tiap studi kasus adalah satu file Markdown yang
  divalidasi otomatis. Menambah project = menambah satu file, tanpa menyentuh kode.
- **Islands Architecture** — bagian interaktif (mis. filter project) di-render
  sebagai "island" React; sisanya tetap HTML statis.
- **Hosting gratis** — hasil build statis bisa di-deploy ke Vercel, Netlify,
  atau GitHub Pages tanpa server atau database.

Pendekatan ini sengaja menghindari backend/database agar situs mudah dirawat oleh
satu orang lewat kode dan Git.

---

## Prasyarat

- **Node.js** ≥ 18.14 (disarankan versi LTS terbaru)
- **npm** (bawaan Node) — bisa juga pakai pnpm/yarn

Cek versi:

```bash
node -v
npm -v
```

---

## Menjalankan project

```bash
# 1. install dependency
npm install

# 2. jalankan dev server (hot reload)
npm run dev
# buka http://localhost:4321

# 3. build untuk produksi
npm run build      # output ke folder ./dist

# 4. preview hasil build secara lokal
npm run preview
```

---

## Struktur Direktori

```
.
├── CLAUDE.md                 # panduan untuk AI assistant (baca sebelum ubah kode)
├── README.md                 # file ini
├── ARCHITECTURE.md           # keputusan desain & alasannya
├── deploy.sh                 # skrip deploy di VPS (git pull → build → salin)
├── astro.config.mjs          # konfigurasi Astro
├── package.json
├── public/                   # aset statis (gambar, GIF demo, favicon, CV.pdf)
└── src/
    ├── config/
    │   ├── site.ts           # tipe + pemuat data situs
    │   └── site.json         # nilai bawaan: nama, tagline, kontak, link sosial, skills, pengalaman
    ├── content/
    │   ├── config.ts         # schema Content Collections (validasi frontmatter)
    │   └── projects/         # SATU file .md per studi kasus
    │       └── *.md
    ├── components/
    │   ├── Hero.astro
    │   ├── ProjectCard.astro
    │   ├── SkillsGrid.astro
    │   ├── AboutSection.astro
    │   ├── ContactSection.astro
    │   └── Footer.astro
    ├── layouts/
    │   └── BaseLayout.astro   # <head>, SEO meta, header, footer
    ├── pages/
    │   ├── index.astro        # landing page
    │   └── projects/
    │       └── [slug].astro   # halaman detail studi kasus (auto-generate)
    └── styles/
        └── global.css         # CSS variables (warna, tipografi), reset
```

**Prinsip inti:** data terpisah dari tampilan. Konten ada di `src/content/`,
konfigurasi situs di `src/config/site.json` (tipe di `site.ts`). Komponen hanya menampilkan, tidak
menyimpan data.

---

## Cara Menambah Project Baru

Ini alur paling sering dilakukan. **Tidak perlu menyentuh komponen.**

1. Buat file baru di `src/content/projects/`, misalnya
   `tracker-validation-framework.md`.
2. Isi frontmatter sesuai schema:

   ```markdown
   ---
   title: "Data-Driven Tracker Validation Framework"
   summary: "Framework yang otomatis memilih validator berdasarkan payload JSON tracker."
   role: "Designer & Sole Developer"
   status: "completed"          # completed | in-progress
   featured: true               # tampil di landing page?
   order: 1                     # urutan (kecil = duluan)
   tags: ["Java", "TestNG", "Data-Driven", "Tracker"]
   repo: "https://github.com/username/tracker-validation-demo"
   demo: ""                     # opsional: link demo/video
   cover: "/covers/tracker.png" # opsional: taruh gambar di public/covers/
   ---

   ## Problem
   Jelaskan masalahnya di sini.

   ## Role & Contribution
   Peran dan kontribusi spesifik kamu.

   ## Solution
   Pendekatan/desain yang dipakai.

   ## Impact
   Hasil terukur (cakupan, waktu hemat, stabilitas rilis, dll).
   ```

3. Simpan. Card otomatis muncul di landing (jika `featured: true`) dan halaman
   detailnya otomatis dibuat di `/projects/<nama-file>`.

### Format studi kasus (wajib konsisten)

Selalu ikuti urutan: **Problem → Role & Contribution → Solution → Impact**.
Recruiter memindai dengan pola ini; konsistensi bikin situs terasa profesional.

---

## Mengubah Info Pribadi

Semua data pribadi ada di satu tempat: `src/config/site.json`.
Ganti nama, tagline, email, nomor WhatsApp, link LinkedIn/GitHub, dan daftar skills
di sana — semua komponen ikut terupdate.

**Di produksi, ubah lewat halaman admin** (`naradipta.com/admin`, lihat `admin/README.md`): draft → preview → publish.
Setelah admin dipakai, `site.json` dan `src/content/` di repo hanya nilai awal; sumber kebenaran produksi
ada di `/var/lib/naradipta-admin/live` dan `deploy.sh` membangun dari sana.

---

## Memperbarui QA Drill (`learn.naradipta.com`)

QA Drill adalah aplikasi mandiri di `public/learn/` (HTML + CSS + JS klasik, tanpa build step) yang disajikan di akar subdomain `learn.naradipta.com`. Astro hanya menyalinnya apa adanya ke `dist/learn/`. Akun opsional memakai API kecil di `qa-drill/server/`. Sumber soal, alat, dan tes ada di `qa-drill/` dan tidak ikut terbit.

1. **Soal baru atau koreksi:** edit/tambah objek di `qa-drill/questions/*.json` (skema ada di `qa-drill/CLAUDE.md`; ID unik, `lo` harus ada di `public/learn/data/lo.js`, teks ID dan EN setara, pengecoh sama panjang dengan jawaban benar).
2. **Bangun ulang data:** `cd qa-drill && python3 tools/build-data.py` (menghasilkan `public/learn/data/questions.js`; jangan diedit tangan; gagal bila ada bias panjang opsi atau K-level tak sesuai).
3. **Tes:** `node tests/grade.test.js` dan, opsional, `npm i --no-save jsdom` lalu `node tests/smoke.test.js` (jangan commit `package-lock.json`/`node_modules` yang dihasilkan).
4. **Cek lokal:** `cd qa-drill/server && PORT=4400 STATIC_DIR=../../public/learn node server.js`, buka `http://localhost:4400/` (aplikasi + API akun). Situs utama: `npm run build` lalu `npm run preview`.
5. **Deploy** aplikasi statis seperti biasa lewat `./deploy.sh` (tersaji di `learn.naradipta.com` dari `<WEB_ROOT>/learn`). API akun (`qa-drill/server/`) dan Nginx/DNS/TLS subdomain dipasang manual sekali; lihat `qa-drill/server/README.md`. Setelah mengubah kode server: `systemctl restart qa-drill`.

Aturan: jangan menyalin teks silabus, glosarium, atau soal sampel ISTQB; progres pengguna di localStorage (`qa-drill-v1`) dan, bila masuk akun, disinkronkan ke server; teks dirender lewat `QA.h` (textContent), bukan `innerHTML`.

## Aturan Konten (kerahasiaan)

Pekerjaan di Tokopedia/ByteDance bersifat proprietary. Saat menulis studi kasus:

- **Jangan** cantumkan nama event tracker, field, atau arsitektur internal.
- Gunakan skema e-commerce generik: `product_view`, `add_to_cart`,
  `checkout_success`.
- Untuk repo publik, buat dummy data fiksi dan pastikan tidak ada jejak internal.
- Angka dampak boleh, selama umum dan tidak sensitif.

---

## Deploy

Target deploy: **VPS GCP (self-hosted) dengan Nginx.** Situs dibangun dari Git
langsung di server (build di VPS), lalu Nginx menyajikan folder hasil build.

Alur besarnya:

```
Laptop (dev)  →  git push  →  GitHub  →  git pull di VPS  →  npm run build  →  Nginx sajikan
```

### Setup awal VPS (sekali saja)

Perintah berikut menyentuh sistem/keamanan server — jalankan sendiri via SSH dan
review tiap langkah.

```bash
# 1. paket sistem
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# 2. clone repo
sudo mkdir -p /var/www && sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/USERNAME/portfolio.git portfolio-src
```

Konfigurasi Nginx di `/etc/nginx/sites-available/portfolio` (root diarahkan ke
web root, bukan langsung ke folder source):

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;                      # ganti ke domain saat sudah ada

    root /var/www/portfolio;            # web root, diisi oleh deploy.sh
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

Baris `try_files` penting: halaman detail seperti `/projects/tracker-validation`
tersimpan sebagai `tracker-validation.html`. Aktifkan lalu reload:

```bash
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Pastikan juga **firewall VPC GCP** mengizinkan `tcp:80` (dan `tcp:443` nanti)
lewat GCP Console.

### Deploy rutin (tiap ada update)

Semua langkah git pull → build → salin ke web root sudah dibungkus di `deploy.sh`:

```bash
cd /var/www/portfolio-src
./deploy.sh
```

Skrip ini hanya build dan menyalin file; ia tidak menyentuh konfigurasi sistem.
Lihat `deploy.sh` untuk menyesuaikan `SRC_DIR`, `WEB_ROOT`, atau `BRANCH`.

### Akses & HTTPS

- Untuk sekarang akses lewat **External IP** VM: `http://EXTERNAL_IP_VPS`.
- Saat domain sudah siap: arahkan A record ke IP, ganti `server_name _;` jadi
  domainmu, lalu `sudo certbot --nginx` untuk HTTPS gratis (Let's Encrypt).
  Kode situs tidak berubah.

### Deploy dengan Docker (alternatif `deploy.sh`, memudahkan pindah server)

`compose.yaml` menjalankan dua container. Situs tetap **statis**: CI membangun situs dan membakarnya ke image `web`,
jadi server tidak pernah menjalankan `astro build` (VPS kecil, ±1 GB RAM, dan berbagi dengan aplikasi lain).
Panel admin (`admin/`) **tidak** dijalankan di Docker: build-nya membuat server macet di mesin sekecil itu.

| Service | Isi | Data |
|---|---|---|
| `web` | Nginx: `naradipta.com` dan `learn.naradipta.com` (konfigurasi: `docker/nginx-web.conf`), situs statis ada di image | tidak ada |
| `qa-drill` | API login + sinkronisasi QA Drill (Node + SQLite) | volume `qa-data` (**cadangkan**) |

Hanya `qa-data` yang perlu dicadangkan.

```bash
docker compose pull && docker compose up -d     # produksi: image dari GHCR (dibangun workflow `docker`)
docker compose up -d --build                    # lokal: bangun dari source
```

Server produksi hanya butuh `compose.yaml` (dan `qa-drill.env` bila memakai email; contoh: `docker/qa-drill.env.example`),
tanpa clone repo. Memori tiap container dibatasi (`mem_limit`) agar yang kehabisan memori hanya container itu.
`web` hanya membuka `127.0.0.1:8080` (ubah dengan `WEB_PORT`); TLS tetap ditangani Nginx/Caddy di host:
satu blok per domain yang meneruskan ke port itu (contoh: `docker/host-nginx.conf.example`).

**Mengubah konten/situs:** edit file di repo (`src/content/`, `src/config/site.json`, `public/`), push ke `main`, tunggu workflow `docker`
selesai, lalu di VPS `docker compose pull && docker compose up -d`.

**Pindah server:** pasang Docker, taruh `compose.yaml` (+ `qa-drill.env`), pulihkan volume `qa-data` dari cadangan,
`docker compose pull && up -d`, pasang konfigurasi Nginx/TLS host, lalu ubah DNS.

#### Cutover dari `deploy.sh` + Nginx + systemd ke Docker (sekali saja)

Situs lama tidak disentuh sampai langkah 4, jadi langkah 1-3 aman dikerjakan kapan saja.

1. Pastikan workflow `docker` sudah berjalan di `main` (image ada di `ghcr.io/naradipta/naradipta-personal-web-{web,qa-drill}`).
   Server perlu `docker login ghcr.io` (token dengan `read:packages`) bila package-nya privat.
2. Di VPS: `mkdir -p ~/apps/naradipta`, taruh `compose.yaml` di sana, lalu `docker compose pull && docker compose up -d`.
   Keduanya ringan (web ±5 MB, qa-drill ±40 MB). `web` hanya mendengarkan `127.0.0.1:8080`; situs publik belum berubah.
3. Uji tanpa mengubah Nginx: `curl -H 'Host: naradipta.com' 127.0.0.1:8080/` dan `curl -H 'Host: learn.naradipta.com' 127.0.0.1:8080/api/health`.
   Isi `qa-drill.env` bila memakai email, lalu `docker compose up -d qa-drill`.
4. **Salin database QA Drill** (di VPS, tidak ada CLI `sqlite3`; `VACUUM INTO` memberi salinan konsisten walau service sedang jalan):
   ```bash
   sudo -u www-data node -e "const {DatabaseSync}=require('node:sqlite'); new DatabaseSync('/var/lib/qa-drill/qa-drill.sqlite').exec(\"VACUUM INTO '/tmp/qa-drill.sqlite'\")"
   docker compose stop qa-drill
   docker run --rm -v naradipta_qa-data:/data -v /tmp:/in:ro alpine sh -c 'cp /in/qa-drill.sqlite /data/qa-drill.sqlite && chown 1000:1000 /data/qa-drill.sqlite && rm -f /data/qa-drill.sqlite-wal /data/qa-drill.sqlite-shm'
   docker compose start qa-drill && rm /tmp/qa-drill.sqlite     # berkas /tmp berisi hash password: hapus
   ```
   Lakukan tepat sebelum langkah 5 supaya akun yang daftar di antaranya tidak hilang.
5. **Pindahkan trafik:** cadangkan `/etc/nginx/sites-available/{naradipta.com,learn}`, ganti isinya dengan `docker/host-nginx.conf.example`,
   lalu `sudo nginx -t && sudo systemctl reload nginx`.
6. Cek `https://naradipta.com/`, `https://learn.naradipta.com/`, dan login QA Drill.
   Bila baik: `sudo systemctl disable --now qa-drill` (service lama).
7. Simpan `/var/www/naradipta` dan unit lama seminggu untuk rollback, lalu hapus. `deploy.sh` tidak dipakai lagi.

**Rollback** (selama langkah 7 belum dikerjakan): kembalikan berkas Nginx dari cadangan, `sudo systemctl reload nginx`, dan `sudo systemctl start qa-drill`.
Akun QA Drill yang terdaftar sesudah langkah 5 hanya ada di volume Docker, jadi salin ulang database-nya bila perlu rollback.

### Alternatif (kalau suatu saat mau lepas dari VPS)

Karena outputnya statis, situs ini juga bisa dipindah ke **Vercel / Netlify**
(preset "Astro", build `npm run build`, output `dist`) atau **GitHub Pages**
tanpa mengubah kode.

---

## Roadmap Konten (rencana project yang ditampilkan)

1. **Data-Driven Tracker Validation Framework** (Java + TestNG) — *featured*.
   Payload JSON otomatis memanggil validator yang sesuai. Repo publik + dummy data.
2. **Backend Automation Framework** (Java Test Framework) — *featured*.
   Automation untuk pengujian layer backend/API.
3. **Playwright Python Automation** — *in-progress*.
   Menunjukkan pembelajaran aktif; test terhadap situs demo publik.
4. **AI-Assisted QA Workflow** — narasi.
   Bagaimana AI dipakai untuk domain onboarding, edge-case discovery dari PRD/tech
   docs, dan pembuatan test case/laporan — dengan review manusia sebagai gerbang
   kualitas.

---

## Lisensi

Kode: bebas dipakai ulang oleh pemilik. Konten (teks studi kasus, aset) milik
Muhammad Arrafi.
