# CLAUDE.md

Panduan untuk Claude (dan AI assistant lain) saat bekerja di repository ini.
Baca file ini sebelum membuat perubahan.

## Tentang Project

Personal portfolio website untuk **Muhammad Arrafi** — QA Engineer / SDET.
Tujuan utama: meyakinkan recruiter dan calon klien dalam beberapa menit bahwa
pemilik situs adalah engineer QA yang kompeten di automation, tracker validation,
dan AI-assisted QA.

Situs ini **content-first dan statis**. Tidak ada database, tidak ada backend,
tidak ada autentikasi. Konten (studi kasus / project) adalah warga kelas satu.

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
src/
├── config/
│   └── site.ts              # nama, tagline, kontak, link sosial, daftar skills
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

## Definition of Done untuk perubahan

- [ ] `npm run build` sukses tanpa error
- [ ] Tidak ada data internal perusahaan yang bocor di konten
- [ ] Konten baru masuk lewat `src/content/`, bukan hardcode di komponen
- [ ] Responsif sampai lebar mobile (~360px)
- [ ] Focus state keyboard terlihat pada elemen interaktif
- [ ] Tidak menambah dependency/JS yang tidak perlu

## Yang TIDAK boleh dilakukan

- Menambahkan CMS, database, atau backend
- Hardcode daftar project di dalam komponen (harus dari Content Collection)
- Membocorkan detail internal perusahaan
- Mengubah struktur folder tanpa memperbarui file ini
- Menambahkan library UI berat untuk masalah yang bisa diselesaikan CSS biasa
