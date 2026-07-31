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
    │   └── site.ts           # nama, tagline, kontak, link sosial, daftar skills
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
konfigurasi situs di `src/config/site.ts`. Komponen hanya menampilkan, tidak
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

Semua data pribadi ada di satu tempat: `src/config/site.ts`.
Ganti nama, tagline, email, nomor WhatsApp, link LinkedIn/GitHub, dan daftar skills
di sana — semua komponen ikut terupdate.

---

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
