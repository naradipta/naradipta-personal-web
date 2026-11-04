# QA Drill — aplikasi belajar QA Engineer dan ISTQB CTFL

## Tujuan
Platform belajar **bersama** untuk teman-teman QA: Muhammad Arrafi memakainya untuk belajar sendiri sekaligus membuka akses bagi komunitas QA. **Bukan produk komersial dan bukan alat pemasaran**: tanpa iklan, tanpa bahasa promosi, tanpa pelacakan. Dua jalur belajar: (1) sertifikasi ISTQB CTFL (didahulukan), (2) bekal karir QA/SDET (REST API, Selenium, SQL, Playwright/Cypress/Katalon, interview). Dwibahasa Indonesia/English. Berjalan lokal tanpa AI; akun/sinkronisasi lintas perangkat bersifat opsional lewat `server/` (aplikasi tetap jalan tanpa server).

**Prinsip desain:** tenang, ramah, fokus belajar. Beranda = "Hari ini" (apa yang dikerjakan sekarang), lalu dua jalur. Copy menjelaskan apa adanya, bukan menjual. Layar masuk satu kolom sederhana dengan opsi mencoba tanpa akun.

## Lokasi
- **Aplikasi** (dilayani di akar `learn.naradipta.com`): `public/learn/` — hanya `index.html`, `styles.css`, `js/`, `data/`.
- **Sumber dan alat pengembang** (tidak ikut terbit): folder ini (`qa-drill/`) — `questions/`, `tools/`, `tests/`, dokumen ini. Semua perintah di bawah dijalankan dari folder ini.

## Menjalankan
- Buka `../public/learn/index.html` dengan klik dua kali (data dimuat lewat `<script>` klasik, bukan `fetch`, supaya jalan dari `file://`).
- Atau: `python3 -m http.server 8000` lalu buka `http://localhost:8000`.

## Struktur
```
public/learn/                    (aplikasi, ikut terbit)
  index.html, styles.css
  data/materi.js     materi lengkap Bahasa Indonesia per bab ISTQB (ditulis sendiri; tampil di Materi > Jalur 1 > bab)
  data/materi-karir.js  materi ringkas Jalur 2 per topik (REST API, Selenium, SQL, dst.; rute #/career/<topik>; tiap topik non-ISTQB wajib punya materi, dicek data.test.js)
  js/views-community.js papan belajar opt-in (nama tampilan + angka kasar; lihat server/README.md untuk aturan privasi)
  data/lo.js           peta 64 learning objective (LO) ISTQB + catatan belajar orisinal ID/EN, struktur ujian
  data/glossary.js   kartu istilah (definisi ditulis sendiri)
  data/questions.js  DIBUAT OTOMATIS dari questions/*.json — jangan diedit
  js/util.js         helper DOM aman (tanpa innerHTML), shuffle, waktu
  js/grade.js        penilaian (fungsi murni, diuji dengan Node)
  js/store.js        localStorage + Leitner (naik box hanya bila jatuh tempo; dipengaruhi keyakinan) + impor tervalidasi
  js/core.js         bahasa, router hash, fokus/aria-live, validasi data (soal rusak dilewati + peringatan)
  js/account.js      gerbang masuk/daftar/tamu, progres per akun (kunci localStorage terpisah per akun), sinkronisasi (S.onSave -> PUT /api/progress; S.merge saat konflik); bebas server bila /api tak ada
  js/views-*.js      Beranda/Belajar/Rencana/Pengaturan, Latihan (keyakinan, relearn, interleaving), Mock Exam + Kartu
qa-drill/                        (sumber dan alat, tidak terbit)
  questions/*.json   sumber soal (edit di sini)
  tools/build-data.py gabungkan questions/*.json -> public/learn/data/questions.js; memeriksa LO, K-level, bias panjang opsi
  server/            API login + sinkronisasi (Node >= 22.13, SQLite, tanpa dependency); lihat server/README.md
  tests/             grade/data/server.test.js (Node murni), smoke.test.js dan sync.test.js (butuh jsdom; sync = push saat edit datang di tengah push), e2e/ (Playwright + axe)
```

## Tata letak dan navigasi
- Desktop (>= 900px): sidebar kiri (semua menu, akun, bahasa, tautan ke naradipta.com). Mobile: top bar ringkas + tab bar bawah dengan 5 item (Beranda, Belajar, Latihan, Mock Exam, Lainnya); menu sekunder ada di rute `#/more`.
- Menu didefinisikan di `QA.nav` (`core.js`, termasuk ikon SVG dari `QA.icon` di `util.js`); jangan pakai emoji sebagai ikon. Warna/ukuran lewat token CSS di `:root` (`styles.css`), terang dan gelap.
- Layar masuk (`QA.routes.welcome`) memakai layout dua kolom di desktop dan bertumpuk di mobile; seluruh kerangka menu disembunyikan saat `body.gated`.

## Beranda, fokus, dan kartu
- `S.state.focus` (`istqb` | `career` | `both` | null) menentukan saran "Hari ini" dan urutan jalur di Beranda; dipilih lewat kartu pertanyaan di Beranda atau Pengaturan.
- Kartu "Hari ini" (`nextAction` di `views-home.js`), urutan prioritas: hari ujian (istirahat) → ujian <= 7 hari dan belum ada mock 3 hari terakhir (mock exam) → soal jatuh tempo → area terlemah menurut fokus. Tanggal ujian diabaikan bila fokus = karir. Kartu hanya tampil bila ada soal jatuh tempo, >= 10 soal sudah dijawab, atau ujian <= 14 hari.
- `data/glossary.js`: tiap kartu punya `topic` (`istqb` bawaan, atau `rest-api`, `selenium`, `sql`, `playwright`, `cypress`, `qa-general`, `interview`); kartu dipilih per topik di halaman Kartu. Istilah (`t`) harus unik karena dipakai sebagai kunci progres.
- Soal Jalur 2 baru: tambah ke `questions/*.json`, buat pengecoh selevel jawaban benar (cek bias panjang di `build-data.py`).

## Email (verifikasi dan reset password)
Server mengirim email lewat `server/mailer.js` bila `MAIL_PROVIDER` diatur (lihat `server/README.md`). Klien: halaman `#/verify/<token>` dan `#/reset/<token>` (tanpa kerangka menu), tautan "Lupa password?" di formulir masuk, dan banner verifikasi. Fitur muncul hanya bila `/api/me` melaporkan `emailEnabled`.

## Komunitas dan privasi
Papan belajar bersifat opt-in (default mati), hanya untuk anggota yang sudah masuk, dan hanya menampilkan nama tampilan + hari aktif, streak, soal dikuasai. Jangan menambah data lain (email, akurasi, jawaban) ke papan tanpa persetujuan pemilik repo. Moderasi nama: aturan nama, laporan anggota, penyembunyian otomatis, dan perintah `admin.js` (lihat `server/README.md`). Silabus resmi hanya ditautkan (`QA.syllabusUrl`, `QA.syllabusPageUrl`, `QA.syllabusUrlId`), PDF tidak dihosting.

## Akun dan progres per akun
- Bila `/api/` tersedia dan pengunjung belum masuk, `QA.gate()` menampilkan layar selamat datang (masuk / daftar / lanjut sebagai tamu). Pilihan tamu hanya berlaku selama tab terbuka (`sessionStorage`).
- Ruang penyimpanan lokal dipisah per identitas: tamu = `qa-drill-v1`, akun = `qa-drill-u<id>` (`S.useKey`). Dua akun di satu browser tidak bercampur; saat keluar, salinan lokal akun dihapus (perangkat bersama).
- Progres tamu tidak digabung diam-diam ke akun: hanya ditawarkan (konfirmasi) untuk diimpor ke akun yang masih kosong di server.
- Tanpa server (mis. `file://`) gerbang tidak muncul dan app berjalan lokal seperti biasa.

## Alur kerja menambah/mengubah soal
1. Edit atau tambah objek di `questions/<file>.json` (ID unik, lanjutkan nomor).
2. `python3 tools/build-data.py`
3. `node tests/grade.test.js`, `node tests/data.test.js` (kualitas data soal, tanpa dependensi), dan (opsional) `npm i --no-save jsdom && node tests/smoke.test.js`.

`build-data.py` menolak: ID ganda, LO tidak dikenal, K soal di atas K LO, dan jawaban benar yang terlalu sering jelas paling panjang (>30%). Buat pengecoh sama panjang dan sama masuk akalnya dengan jawaban benar.

## Skema soal
```json
{ "id":"ctfl-072", "topic":"istqb", "lo":"FL-4.2.2", "k":3, "level":3, "type":"mcq|tf|short",
  "q":{"id":"...","en":"..."} }
```
- `mcq`: `options:{id:[..],en:[..]}` (urutan sama di kedua bahasa), `answer` (indeks 0-based), `exp:{id,en}`. Opsi diacak saat tampil.
- `tf`: `answer` true/false, `exp`.
- `short`: `model:{id,en}`, `keywords` (array grup sinonim; ID dan EN dicampur), `pass` (0–1).
- `lo` + `k` hanya untuk soal ISTQB; `lo` harus ada di `data/lo.js`. `level` 1–3 mengikuti K-level.

## Penilaian isian singkat (tanpa AI)
Normalisasi (huruf kecil, tanpa aksen/tanda baca) → tiap grup terpenuhi bila ada satu sinonim muncul (kata ≤4 huruf dicocokkan sebagai kata utuh) → skor = grup terpenuhi / total → lulus bila ≥ `pass` (default 0.6). Hasil otomatis hanya saran: pengguna menilai sendiri (Benar/Hampir/Salah) dan itulah yang masuk jadwal ulang.

## Mock exam
Mengikuti struktur resmi CTFL v4.0 (ISTQB Exam Structure and Rules Tables): 40 soal, lulus 26, 60 menit (75 non-native). Sebaran per bab 8/6/4/11/9/2 dan campuran K-level per bab ada di `QA.chapters[].mix`. Hanya soal `mcq` ber-`lo`.

## Aturan konten (penting)
- **Jangan menyalin teks silabus, buku, glosarium, atau soal sampel ISTQB** (berhak cipta). Tulis penjelasan dan soal orisinal, dipetakan ke kode LO. Tautan ke silabus resmi saja yang boleh.
- Seluruh 64 kode LO dan K-level (termasuk bab 5) sudah diverifikasi terhadap silabus resmi CTFL v4.0.1 (tugas A selesai). Verifikasi ulang bila ISTQB merilis versi silabus baru.
- `data/materi.js` hanya Bahasa Indonesia (EN menampilkan catatan bahwa materi lengkap berbahasa Indonesia); tetap tulis sendiri, jangan salin silabus (silabus ID IDSTB berhak cipta ISTQB, jangan dihosting di repo).
- Setiap soal wajib ada padanan ID dan EN yang setara; istilah baku (PUT, 404, Page Object Model) tidak diterjemahkan.
- `mcq`/`tf` wajib punya `exp` yang menjelaskan mengapa benar dan mengapa pengecoh salah.
- Soal bergantung konteks (cancel order: DELETE vs PATCH vs POST /cancel; email tidak ditemukan: 401 vs 404) harus menyebut trade-off.
- Selenium 4 (bukan `find_element_by_*`).

## Konvensi kode
- Tanpa framework, tanpa build step, tanpa dependensi runtime. Satu state global: `QA.store.state`.
- Jangan render teks soal dengan `innerHTML`; pakai `QA.h` (textContent).
- Semua akses `localStorage` di dalam try/catch.
- Data divalidasi saat load (`QA.validateData`); jika gagal, tampilkan error jelas.

## Ide berikutnya
Soal tambahan Playwright/Cypress/Katalon dan SQL lanjut; soal skenario K3 lebih banyak (EP/BVA/decision table/state transition); latihan interview jawaban terbuka; CTFL Agile Tester atau Test Automation Engineer sebagai jalur lanjutan.
