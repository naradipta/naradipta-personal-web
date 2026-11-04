# CLAUDE.md

Panduan untuk Claude (dan AI assistant lain) saat bekerja di repository ini.
Baca file ini sebelum membuat perubahan.

## Tentang Project

Personal portfolio website untuk **Muhammad Arrafi** — QA Engineer / SDET.
Tujuan utama: meyakinkan recruiter dan calon klien dalam beberapa menit bahwa
pemilik situs adalah engineer QA yang kompeten di automation, tracker validation,
dan AI-assisted QA.

Situs utama (naradipta.com) **content-first dan statis**: tidak ada database, backend, atau
autentikasi. Konten (studi kasus / project) adalah warga kelas satu.

**Dua pengecualian terdokumentasi (keputusan pemilik repo):**
1. QA Drill di `learn.naradipta.com` punya akun email + password opsional dan sinkronisasi progres lewat
   API Node kecil + SQLite (`qa-drill/server/`).
2. **Admin** di `naradipta.com/admin` (`admin/`): server Node kecil tanpa dependency npm untuk mengedit
   konten (foto, deskripsi, pengalaman, skills, project, galeri) lewat browser dengan alur draft → preview → publish.
   Situs publik TETAP statis: admin hanya menulis konten ke `ADMIN_DATA_DIR` (di luar repo) lalu menjalankan
   `astro build` dan menyalin hasilnya ke web root. Detail di `admin/README.md`.

Selain dua itu, situs utama tetap tanpa backend/database.

## Tech Stack

- **Astro** — static site generator, zero-JS by default
- **Content Collections** — setiap studi kasus adalah satu file Markdown/MDX
- **TypeScript** — untuk config, schema, dan komponen
- **CSS murni / scoped `<style>`** di komponen `.astro` (tidak pakai framework CSS berat)
- **React island** — HANYA untuk bagian yang benar-benar interaktif (mis. filter project)
- Deploy: static build → Vercel / Netlify / GitHub Pages

Jangan menambahkan backend, database, atau dependency berat tanpa alasan kuat.
Kalau sebuah fitur bisa dikerjakan dengan HTML statis, kerjakan dengan HTML statis.

## Prinsip yang Wajib Dijaga

1. **Data terpisah dari tampilan.** Konten ada di `src/content/`, konfigurasi
   situs (nama, link sosial, kontak, skills) ada di `src/config/site.ts`.
   Komponen tidak boleh hardcode data yang seharusnya ada di config atau content.
   Build dengan env `CONTENT_DIR` (dipakai admin dan `deploy.sh`) membaca `site.json`, `projects/`, dan
   `gallery/` dari folder itu, bukan dari repo. Setelah admin dipakai, folder `live/` di `ADMIN_DATA_DIR`
   adalah sumber kebenaran konten di produksi; `src/content/` dan `site.json` hanya nilai awal/cadangan.

2. **Nambah project = nambah satu file `.md`.** Jangan pernah membuat proses
   penambahan konten yang mengharuskan menyentuh komponen. Kalau menambah project
   baru butuh edit komponen, berarti arsitekturnya salah — perbaiki arsitekturnya.

3. **Clean & readable.** Komponen kecil, satu tanggung jawab. Nama jelas.
   Hindari abstraksi prematur. Pemilik repo ingin bisa membaca dan mengubah kode
   sendiri dengan mudah.

4. **Zero-JS by default.** Tambahkan interaktivitas (island React) hanya bila
   perlu, dan pakai directive `client:visible` / `client:idle` yang paling hemat.

5. **Kerahasiaan.** Konten project TIDAK BOLEH memuat data internal perusahaan
   (nama event/field internal, angka rahasia, arsitektur internal). Gunakan skema
   generik/dummy. Lihat bagian "Aturan Konten" di bawah.

## Struktur Direktori

```
public/
└── learn/                   # QA Drill: aplikasi belajar mandiri (HTML/CSS/JS klasik, tanpa build) → learn.naradipta.com (akar subdomain)
admin/                       # server admin (Node, tanpa dependency npm): login, edit draft, preview, publish → naradipta.com/admin
                             # data hasil edit disimpan di ADMIN_DATA_DIR (luar repo); detail di admin/README.md
qa-drill/                    # sumber dan alat QA Drill (soal *.json, build-data.py, tes); TIDAK terbit
                             # server/ = API login + sinkronisasi (Node + SQLite, tanpa dependency npm), dijalankan manual di VPS
                             # Pengecualian terdokumentasi: QA Drill memakai JS vanilla sendiri (bukan Astro/React)
                             # karena berupa aplikasi interaktif mandiri; detail di qa-drill/CLAUDE.md
compose.yaml                 # alternatif deploy: web (Nginx, situs statis dibakar ke image) + qa-drill dalam Docker; target di Dockerfile
docker/                      # nginx-web.conf (pintu masuk), host-nginx.conf.example, qa-drill.env.example
src/
├── config/
│   ├── site.ts              # tipe + pemuat data situs
│   └── site.json            # nilai bawaan: nama, tagline, kontak, link sosial, skills, pengalaman
├── content/
│   ├── config.ts            # schema Content Collections (Zod)
│   └── projects/            # SATU file .md per studi kasus
│       └── *.md
├── components/
│   ├── Hero.astro
│   ├── ProjectCard.astro
│   ├── SkillsGrid.astro
│   ├── AboutSection.astro
│   ├── ContactSection.astro
│   └── Footer.astro
├── layouts/
│   └── BaseLayout.astro     # <head>, SEO meta, header, footer, slot
├── pages/
│   ├── index.astro          # landing: hero → featured → about → skills → contact
│   └── projects/
│       └── [slug].astro     # halaman detail, auto-generate dari content
└── styles/
    └── global.css           # reset, CSS variables (warna, tipografi, spacing)
```

## Content Collection: schema `projects`

Setiap file di `src/content/projects/*.md` WAJIB punya frontmatter sesuai schema
di `src/content/config.ts`. Field:

- `title` (string) — nama project
- `summary` (string) — 1 kalimat, muncul di card
- `role` (string) — peran pemilik di project ini
- `status` (enum: `completed` | `in-progress`) — untuk badge
- `featured` (boolean) — tampil di landing page atau tidak
- `order` (number) — urutan tampil (kecil = duluan)
- `tags` (string[]) — mis. ["Java", "TestNG", "Data-Driven"]
- `repo` (string, optional) — URL GitHub
- `demo` (string, optional) — URL live demo / video
- `cover` (string, optional) — path gambar/GIF cover

Body Markdown mengikuti format studi kasus:
**Problem → Role & Contribution → Solution → Impact**.
Selalu pertahankan urutan naratif ini di setiap studi kasus.

## Aturan Konten (PENTING — kerahasiaan)

- Jangan tulis nama event tracker, field, atau skema internal Tokopedia/ByteDance.
- Ganti dengan skema e-commerce generik: `product_view`, `add_to_cart`,
  `checkout_success`, dll.
- Angka dampak boleh disebut bila sifatnya umum dan tidak sensitif
  (mis. "cakupan regresi meningkat", "zero critical incident saat migrasi").
- Untuk project yang reponya publik, README repo adalah sumber kebenaran teknis;
  studi kasus di situs adalah ringkasan naratifnya.

## Perintah

```bash
npm install        # install dependency
npm run dev        # dev server (default http://localhost:4321)
npm run build      # build ke ./dist
npm run preview    # preview hasil build
```

Deploy ke VPS GCP (Nginx) dilakukan lewat `./deploy.sh` yang dijalankan di server
(git pull → npm ci → build → salin ke web root). Skrip itu tidak menyentuh
konfigurasi sistem/Nginx; setup server dilakukan manual sekali (lihat README).
Jangan menaruh langkah konfigurasi server ke dalam kode aplikasi.

Alternatif: `docker compose pull && docker compose up -d` (image dibangun workflow `docker` ke GHCR; lihat README, "Deploy dengan Docker"). Situs publik tetap statis yang
disajikan Nginx; hanya volume `qa-data` yang berisi data dan perlu dicadangkan. **Admin tidak dijalankan di Docker**
(`astro build` terlalu berat untuk VPS 1 GB yang berbagi dengan aplikasi lain; pernah membuat server macet). Dua jalur deploy
ini tidak dipakai bersamaan di server yang sama: pilih salah satu.

## Definition of Done untuk perubahan

- [ ] `npm run build` sukses tanpa error
- [ ] Tidak ada data internal perusahaan yang bocor di konten
- [ ] Konten baru masuk lewat `src/content/`, bukan hardcode di komponen
- [ ] Responsif sampai lebar mobile (~360px)
- [ ] Focus state keyboard terlihat pada elemen interaktif
- [ ] Tidak menambah dependency/JS yang tidak perlu

## Yang TIDAK boleh dilakukan

- Menambahkan CMS, database, atau backend ke situs utama (satu-satunya pengecualian: `qa-drill/server/` dan `admin/`, lihat atas)
- Membuat halaman publik bergantung pada server admin (situs publik harus tetap HTML statis)
- Hardcode daftar project di dalam komponen (harus dari Content Collection)
- Membocorkan detail internal perusahaan
- Mengubah struktur folder tanpa memperbarui file ini
- Menambahkan library UI berat untuk masalah yang bisa diselesaikan CSS biasa
