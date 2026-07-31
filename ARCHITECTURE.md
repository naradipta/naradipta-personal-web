# Arsitektur

Dokumen ini menjelaskan **kenapa** situs ini dibangun seperti ini. README
menjelaskan cara menjalankan; CLAUDE.md menjelaskan aturan kerja; dokumen ini
menjelaskan keputusan desainnya.

---

## 1. Tujuan & Batasan

**Tujuan:** meyakinkan recruiter/klien dalam < 3 menit bahwa pemilik adalah
QA/SDET yang kuat di automation, tracker validation, dan AI-assisted QA.

**Batasan yang membentuk desain:**

- Dirawat oleh satu orang lewat kode + Git (bukan lewat CMS/admin panel).
- Konten sering bertambah (project baru), tampilan jarang berubah.
- Sebagian besar pekerjaan asli bersifat rahasia → yang dipamerkan adalah
  studi kasus + repo demo yang aman.
- Harus cepat dan murah (idealnya hosting gratis).

Batasan-batasan ini langsung menjelaskan pilihan Astro + konten Markdown +
hosting statis.

---

## 2. Kenapa Astro, bukan Laravel + React

| Kebutuhan | Astro (statis) | Laravel + React |
|---|---|---|
| Konten statis (portofolio) | Cocok, HTML pre-rendered | Overkill |
| Hosting | Gratis (Vercel/Netlify/Pages) | Butuh VPS/shared hosting |
| Database | Tidak perlu | Perlu dikelola |
| Update konten | Tambah 1 file `.md` | Tambah record + deploy backend |
| Kecepatan load | Sangat cepat (sedikit/0 JS) | Lebih berat |
| Skill React terpakai | Ya (via island) | Ya |

Laravel + React baru masuk akal bila butuh admin panel untuk mengedit konten
lewat browser. Karena pemilik nyaman mengedit lewat kode, Markdown + Git lebih
sederhana dan lebih murah.

---

## 3. Model Konten (jantung arsitektur)

Keputusan paling penting: **konten adalah data, bukan markup.**

Setiap studi kasus = satu file di `src/content/projects/*.md`, dengan frontmatter
yang divalidasi oleh schema Zod di `src/content/config.ts`. Astro Content
Collections memberi:

- **Validasi** — build gagal kalau frontmatter tidak sesuai schema. Konten
  tidak bisa "salah bentuk" tanpa ketahuan.
- **Type-safety** — komponen menerima data project yang sudah bertipe.
- **Query sederhana** — `getCollection('projects')` untuk mengambil, filter
  `featured`, urutkan `order`.

Konsekuensi desain: **komponen tidak pernah tahu isi project secara hardcode.**
Landing page memanggil collection, memfilter yang `featured`, mengurutkan, lalu
me-render `ProjectCard` untuk tiap item. Halaman detail dibuat via dynamic route
`[slug].astro` menggunakan `getStaticPaths()`.

```
src/content/projects/*.md   →  getCollection('projects')  →  filter/sort
        (data)                        (query)                   (view)
                                                                  │
                          ┌───────────────────────────────────────┤
                          ▼                                        ▼
                 index.astro (cards)                    projects/[slug].astro
                                                          (halaman detail)
```

---

## 4. Lapisan Konfigurasi

Data pribadi (nama, tagline, kontak, sosial, skills) TIDAK disebar di komponen.
Semuanya di `src/config/site.ts` sebagai satu objek bertipe. Alasan: mengganti
nomor WhatsApp atau menambah skill = edit satu tempat, dan tidak ada risiko
kelupaan meng-update salah satu komponen.

Pembagian tanggung jawab:

- `src/config/site.ts` → data tentang **orangnya** (jarang berubah).
- `src/content/projects/` → data tentang **karyanya** (sering bertambah).
- `src/components/` → **cara menampilkan** data (jarang berubah).

---

## 5. Interaktivitas (Islands)

Default: tidak ada JavaScript yang dikirim ke browser. Interaktivitas ditambahkan
hanya bila memberi nilai nyata, sebagai island:

- **Filter project berdasarkan tag** (kandidat utama) — island React kecil,
  di-hydrate dengan `client:visible`.
- **Dark mode toggle** (opsional) — bisa CSS + sedikit JS inline; tidak wajib
  jadi React.

Aturan: pilih directive hydration paling hemat (`client:visible` / `client:idle`),
dan jangan meng-hydrate apa pun yang sebenarnya statis.

---

## 6. Strategi Menampilkan Hasil Kerja

Tiga lapis yang saling melengkapi, mengatasi kendala kerahasiaan:

1. **Studi kasus tertulis** (pintu masuk) — format Problem → Role → Solution →
   Impact. Aman karena naratif, tanpa detail internal.
2. **Repo GitHub** (bukti teknis) — untuk project yang boleh dishare
   (tracker validation dengan dummy data, backend automation, Playwright).
   README repo memuat kebenaran teknis + diagram desain + badge CI.
3. **GIF/video pendek** (penarik perhatian) — klip 15–30 detik suite automation
   berjalan, ditaruh sebagai `cover` di atas studi kasus. Pelengkap, bukan
   pengganti.

Hierarki di UI: card (summary) → halaman detail (studi kasus + GIF) → link repo.

---

## 7. Styling

- CSS variables di `src/styles/global.css` untuk palet warna, skala tipografi,
  dan spacing. Semua keputusan visual berasal dari sini.
- Style spesifik komponen pakai blok `<style>` scoped di file `.astro`
  (otomatis ter-scope, tidak bocor ke komponen lain).
- Hindari framework CSS berat; situs ini kecil dan CSS biasa lebih mudah dibaca
  serta diubah oleh pemilik.

Quality floor: responsif hingga ~360px, focus state keyboard terlihat,
`prefers-reduced-motion` dihormati.

---

## 8. Rendering & Deploy

- **Build-time rendering.** Semua halaman di-generate saat `npm run build`
  menjadi HTML statis di `dist/`. Tidak ada server-side rendering saat runtime.
- **Target: self-hosted VPS GCP + Nginx.** Berbeda dari platform managed
  (Vercel/Netlify), di sini build terjadi di server dan Nginx menyajikan file
  statis dari web root. Alur: `git push` → `git pull` di VPS → `npm run build` →
  salin `dist/` ke web root (`deploy.sh`) → Nginx menyajikan.
- **Kenapa build di VPS (Pola B), bukan build di lokal lalu kirim (Pola A):**
  sumber kebenaran ada di Git; server selalu membangun dari commit yang
  ter-track, tidak bergantung pada mesin lokal. Konsekuensinya VPS perlu Node.js
  terpasang. Pola A (kirim `dist/` via rsync) tetap mungkin bila nanti Node di
  server ingin dihindari.
- **Pemisahan source vs web root.** Repo di-clone ke `/var/www/portfolio-src`,
  hasil build disalin ke `/var/www/portfolio`. Nginx hanya membaca web root, jadi
  proses build tidak pernah menyajikan file setengah jadi, dan permission lebih
  bersih (menghindari 403 akibat Nginx membaca folder source/home).
- **HTTPS & domain menyusul.** Sekarang akses via External IP. Saat domain siap,
  cukup arahkan A record + `certbot --nginx`; kode situs tidak berubah.
- Tidak ada rahasia/secret di sisi klien karena tidak ada backend.

Deploy tetap statis pada intinya — pilihan self-hosting hanya memindahkan
*siapa* yang menyajikan file, bukan mengubah sifat situs. Karena itu situs bisa
dipindah ke platform managed kapan saja tanpa mengubah kode (lihat README).

---

## 9. Keputusan yang Sengaja Ditolak

- **CMS (Strapi, Sanity, dll):** menambah kompleksipan dan biaya untuk kebutuhan
  yang sudah tercukupi oleh Markdown + Git.
- **Database:** tidak ada data dinamis yang perlu disimpan.
- **SSR/serverless functions:** tidak ada kebutuhan runtime; menambah titik
  kegagalan.
- **Framework CSS berat:** memperberat dan menyulitkan pembacaan kode.

Semua penolakan ini demi menjaga situs **mudah dirawat, mudah dibaca, dan murah**.

---

## 10. Extensibility (kalau nanti butuh lebih)

Kalau suatu saat butuh fitur dinamis (mis. form kontak yang mengirim email),
tambahkan lewat layanan tanpa server: form endpoint (Formspree/Netlify Forms)
atau serverless function tunggal — tanpa mengubah arsitektur inti menjadi
full-stack. Pertahankan konten tetap sebagai Markdown.
