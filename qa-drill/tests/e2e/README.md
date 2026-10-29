# E2E + aksesibilitas QA Drill

Uji browser (Playwright) dan axe-core (WCAG 2 A/AA) untuk `/learn/`. Dependensinya
terpisah dari situs: hanya terpasang di folder ini, tidak masuk `package.json` root.

Cakupan: pengumuman `aria-live` (urutan, bahasa, mode tanpa keyakinan, teks berulang),
axe di 8 rute × 390/1100px × terang/gelap, sesi latihan sampai ringkasan, mock exam,
ekspor/impor/reset, impor rusak, persistensi, deep link, dan cek situs (nav, 404 file dev, indexable).

```bash
# dari root repo
npm run build
npx astro preview --port 4399 &        # server statis hasil build

cd qa-drill/tests/e2e
npm install
npx playwright install chromium        # sekali saja
npm test                               # BASE_URL=http://localhost:4399 (bisa diganti)
```

Exit code 1 bila ada cek gagal atau error console/halaman.
Tidak menggantikan uji manual dengan pembaca layar sungguhan (VoiceOver/NVDA).

Di CI, job `.github/workflows/qa-drill.yml` menjalankan urutan yang sama (plus cek
`questions.js` sinkron dengan `questions/*.json`) pada PR/push yang menyentuh `public/learn/` atau `qa-drill/`.
`smoke.test.js` tidak ikut CI karena butuh jsdom (pasang manual bila ingin menjalankannya).
