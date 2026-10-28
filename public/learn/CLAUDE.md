# QA Drill — aplikasi belajar QA Engineer dan ISTQB CTFL

## Tujuan
Membantu satu pengguna (QA Engineer, 5 tahun pengalaman, ingin lulus ISTQB CTFL dan siap interview QA/SDET) menutup celah pengetahuan teori dan praktik. **ISTQB didahulukan**, interview/praktik menyusul. Dwibahasa Indonesia/English. Berjalan lokal tanpa backend dan tanpa AI.

## Menjalankan
- Buka `index.html` dengan klik dua kali (data dimuat lewat `<script>` klasik, bukan `fetch`, supaya jalan dari `file://`).
- Atau: `python3 -m http.server 8000` lalu buka `http://localhost:8000`.

## Struktur
```
index.html, styles.css
data/lo.js           peta 64 learning objective (LO) ISTQB + catatan belajar orisinal ID/EN, struktur ujian
data/glossary.js     kartu istilah (definisi ditulis sendiri)
data/questions.js    DIBUAT OTOMATIS dari questions/*.json — jangan diedit
questions/*.json     sumber soal (edit di sini)
js/util.js           helper DOM aman (tanpa innerHTML), shuffle, waktu
js/grade.js          penilaian (fungsi murni, diuji dengan Node)
js/store.js          localStorage + pengulangan berjarak Leitner
js/core.js           bahasa, router hash, statistik bersama, validasi data
js/views-*.js        Beranda/Belajar/Rencana/Pengaturan, Latihan, Mock Exam + Kartu
tools/build-data.py  gabungkan questions/*.json -> data/questions.js (+ tag LO soal lama)
tests/               grade.test.js (Node murni), smoke.test.js (butuh jsdom)
```

## Alur kerja menambah/mengubah soal
1. Edit atau tambah objek di `questions/<file>.json` (ID unik, lanjutkan nomor).
2. `python3 tools/build-data.py`
3. `node tests/grade.test.js` dan (opsional) `npm i jsdom && node tests/smoke.test.js`.

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
