// Materi ringkas Jalur 2 (bekal karir QA/SDET), Bahasa Indonesia, ditulis sendiri. Bentuk bagian sama dengan materi.js:
//   { h: "judul", p: ["paragraf"], ul: ["butir"], pre: "kode", tip: ["jebakan"] }
window.QA = window.QA || {};

QA.materiKarir = {
  "rest-api": [
    { h: "Method dan idempotency",
      ul: ["GET membaca data (aman, tidak mengubah state). POST membuat resource atau memicu aksi; tidak idempotent: dua kali kirim bisa membuat dua resource.",
           "PUT mengganti seluruh resource (idempotent). PATCH mengubah sebagian field (bisa idempotent, tergantung desain). DELETE menghapus (idempotent: hasil akhirnya sama meski diulang).",
           "Idempotent artinya mengirim request yang sama berkali-kali menghasilkan state akhir yang sama. Penting untuk retry saat jaringan putus; untuk POST pembayaran biasanya dipakai idempotency key."] },
    { h: "Status code yang wajib hafal",
      ul: ["2xx sukses: 200 OK, 201 Created (biasanya dengan header Location), 204 No Content.",
           "400 request salah (validasi gagal), 401 belum terautentikasi (token tidak ada atau tidak valid), 403 terautentikasi tetapi tidak berhak, 404 resource tidak ada, 409 konflik (misalnya email sudah terdaftar), 422 data tidak bisa diproses, 429 terlalu banyak request.",
           "5xx masalah di server: 500, 502, 503. Test yang baik memastikan input buruk tidak menghasilkan 500."],
      tip: ["Kasus yang sering ditanyakan: login dengan email yang tidak ada. Mengembalikan 404 membocorkan apakah email terdaftar (user enumeration); banyak tim memilih 401 dengan pesan generik. Sebutkan trade-off-nya, bukan hanya jawabannya."] },
    { h: "Contoh trade-off desain: membatalkan pesanan",
      ul: ["DELETE /orders/{id}: cocok bila pesanan benar-benar dihapus; kurang cocok bila riwayat harus tetap ada.",
           "PATCH /orders/{id} dengan status=cancelled: menjaga riwayat dan sederhana, tetapi aturan bisnis (refund, stok) tersembunyi di balik update field.",
           "POST /orders/{id}/cancel: cocok untuk aksi dengan efek samping dan validasi sendiri (refund, notifikasi); mudah diberi aturan dan audit."] },
    { h: "Apa yang diuji pada API",
      ul: ["Happy path dan negative path: field wajib hilang, tipe salah, panjang melebihi batas, nilai batas (BVA), karakter khusus.",
           "Autentikasi dan otorisasi: tanpa token, token kedaluwarsa, token milik user lain mencoba mengakses resource (cek IDOR).",
           "Kontrak: struktur dan tipe response sesuai skema (OpenAPI/JSON Schema), header, dan format error yang konsisten.",
           "Data: efek ke database, idempotency, pagination (halaman pertama/terakhir, limit 0 atau terlalu besar), filter dan sorting.",
           "Non-fungsional: waktu respons, rate limiting, perilaku saat dependency lambat."] },
    { h: "Tool dan praktik",
      ul: ["Postman (collection, environment, skrip assertion, runner/newman di CI), REST Assured (Java), requests + pytest (Python), Playwright APIRequestContext.",
           "Pisahkan data dan konfigurasi dari test (variabel environment); jangan menaruh secret di repo.",
           "Assertion yang bermakna: status code, body, header, dan efek samping, bukan hanya \"status 200\"."] }
  ],

  "selenium": [
    { h: "Dasar Selenium 4",
      p: ["Selenium WebDriver mengendalikan browser lewat driver. Di Selenium Python 4, metode lama find_element_by_* sudah dihapus; pakai find_element(By.X, nilai). Selenium Manager (diperkenalkan di 4.6, bawaan penuh sejak 4.11) mengunduh driver yang cocok secara otomatis."],
      pre: "from selenium import webdriver\nfrom selenium.webdriver.common.by import By\n\ndriver = webdriver.Chrome()\ndriver.get(\"https://example.com/login\")\ndriver.find_element(By.ID, \"email\").send_keys(\"user@example.com\")\ndriver.find_element(By.CSS_SELECTOR, \"button[type=submit]\").click()\ndriver.quit()" },
    { h: "Locator: urutan pilihan",
      ul: ["Utamakan yang stabil dan bermakna: id, name, atribut khusus test (data-testid), lalu CSS selector. XPath dipakai bila perlu (mencari berdasarkan teks atau relasi), hindari XPath absolut yang rapuh (/html/body/div[3]/...).",
           "Selenium 4 menambah relative locators (above, below, near, toLeftOf, toRightOf) dan dukungan Chrome DevTools Protocol.",
           "Locator yang bergantung pada urutan atau styling mudah pecah ketika UI berubah."] },
    { h: "Wait: sumber utama flaky test",
      ul: ["Implicit wait berlaku global untuk pencarian elemen. Explicit wait (WebDriverWait + expected_conditions) menunggu kondisi tertentu pada elemen tertentu. Fluent wait menambah polling dan pengecualian yang diabaikan.",
           "Jangan mencampur implicit dan explicit wait: waktu tunggu bisa menjadi tidak terduga. Hindari sleep tetap kecuali untuk debugging.",
           "Tunggu kondisi yang benar: elemen terlihat, bisa diklik, atau teks berubah, bukan hanya \"ada di DOM\"."],
      pre: "from selenium.webdriver.support.ui import WebDriverWait\nfrom selenium.webdriver.support import expected_conditions as EC\n\nWebDriverWait(driver, 10).until(\n    EC.element_to_be_clickable((By.ID, \"save\"))\n).click()" },
    { h: "Page Object Model dan struktur test",
      ul: ["POM: satu class per halaman berisi locator dan aksi (login_page.login(user, pw)). Test membaca seperti skenario bisnis, dan perubahan UI cukup diperbaiki di satu tempat.",
           "Isolasi test: tiap test menyiapkan data sendiri dan tidak bergantung urutan. Gunakan fixture (pytest) atau annotation (TestNG/JUnit) untuk setup dan teardown.",
           "Jalankan paralel lewat Selenium Grid atau runner paralel; pastikan test tidak berbagi state."] },
    { h: "Menangani flaky test",
      ul: ["Cari akar masalah dulu: wait yang salah, data bersama, environment tidak stabil, animasi, atau race condition di aplikasi.",
           "Retry otomatis boleh sebagai jaring pengaman sementara, tetapi jangan dijadikan solusi; catat dan perbaiki penyebabnya.",
           "Simpan bukti saat gagal: tangkapan layar, log browser, dan video."],
      tip: ["Pertanyaan interview umum: \"Bagaimana Anda menangani test yang kadang lulus kadang gagal?\" Jawaban kuat: diagnosis akar masalah, bukan sekadar menambah sleep atau retry."] }
  ],

  "qa-general": [
    { h: "Severity vs priority dan laporan bug",
      ul: ["Severity: seberapa parah dampaknya ke sistem atau user. Priority: seberapa cepat harus diperbaiki menurut bisnis. Keduanya bisa berbeda (typo di logo di beranda: severity rendah, priority tinggi).",
           "Laporan bug yang baik: judul spesifik, langkah reproduksi, expected vs actual, environment dan versi, bukti (screenshot/log), dan dampak. Satu bug per laporan."] },
    { h: "Jenis test yang sering tertukar",
      ul: ["Smoke test: pemeriksaan cepat bahwa fungsi inti hidup setelah build baru. Sanity test: pemeriksaan sempit setelah perubahan atau perbaikan kecil.",
           "Regression test: memastikan perubahan tidak merusak yang sudah jalan. Retest (confirmation): memastikan bug yang diperbaiki benar-benar selesai.",
           "Functional vs non-functional, black-box vs white-box, manual vs otomatis (lihat Jalur 1 untuk definisi ISTQB)."] },
    { h: "Agile dan peran QA",
      ul: ["Scrum: sprint, backlog, planning, daily, review, retrospective. Peran: Product Owner, Scrum Master, tim pengembang (QA bagian dari tim).",
           "QA di Agile terlibat sejak refinement: menanyakan acceptance criteria, menyorot kasus tepi, dan menyiapkan test sebelum fitur selesai (shift-left).",
           "Definition of Done sebaiknya memuat syarat kualitas (test otomatis lulus, tidak ada bug kritis terbuka)."] },
    { h: "Git yang dipakai sehari-hari",
      ul: ["Alur dasar: branch dari main → commit kecil → push → pull request → review → merge.",
           "merge menjaga riwayat apa adanya (merge commit); rebase menyusun ulang commit di atas branch lain sehingga riwayat lurus. Jangan rebase branch yang sudah dibagikan ke orang lain.",
           "git stash menyimpan perubahan sementara; git cherry-pick mengambil satu commit; git revert membuat commit pembatal (aman untuk riwayat yang sudah dibagikan)."] },
    { h: "SQL dasar untuk QA",
      pre: "SELECT status, COUNT(*) AS jumlah\nFROM orders\nWHERE created_at >= '2026-01-01'\nGROUP BY status\nHAVING COUNT(*) > 10\nORDER BY jumlah DESC;",
      ul: ["WHERE memfilter baris sebelum pengelompokan; HAVING memfilter hasil kelompok.", "Pakai SQL untuk memverifikasi efek aplikasi: data tersimpan benar, tidak ada duplikat, relasi utuh."] }
    ,{ h: "Kasus produksi yang paling sering terjadi",
      ul: ["Race condition: dua request mengubah data yang sama bersamaan (stok -1, saldo ganda). Uji dengan request paralel dan periksa state akhir; perbaikan biasanya update atomik, locking, atau constraint.",
           "Zona waktu: bug muncul di sekitar tengah malam atau saat server (UTC) dan pengguna (UTC+7) berbeda. Simpan UTC, konversi saat tampil, uji data di batas hari, akhir bulan, dan pergantian tahun.",
           "Pagination: offset bergeser saat data berubah sehingga baris terduplikasi atau terlewat; urutan tanpa ORDER BY tidak deterministik. Pertimbangkan keyset/cursor.",
           "Retry tanpa idempotency: timeout lalu klien mengirim ulang POST sehingga tertagih dua kali. Gunakan idempotency key.",
           "Perbedaan environment: jumlah worker, replika database, konfigurasi, dan data staging berbeda dari produksi sehingga bug hanya muncul di produksi.",
           "Cache dan data basi: pengguna melihat data lama setelah update. Uji invalidasi cache dan konsistensi baca-setelah-tulis.",
           "Null, string kosong, dan karakter khusus (emoji, tanda kutip, spasi di ujung) pada input yang tidak divalidasi."],
      tip: ["Saat bug lolos ke produksi, tanyakan 'mengapa tidak tertangkap?' dan ubah jawabannya menjadi regression test atau perbaikan proses. Fokus ke sistem, bukan menyalahkan orang."] },
    { h: "Flaky test dan pipeline CI/CD",
      ul: ["Penyebab umum flaky: timing/race condition, data bersama antar test, ketergantungan urutan, environment berbeda, layanan eksternal yang tidak stabil.",
           "Langkah: kumpulkan bukti dari banyak run (log, trace, screenshot), karantina agar tidak memblokir pipeline, cari root cause, perbaiki, kembalikan. Retry hanya tambalan sementara.",
           "Pipeline berlapis: unit + lint tiap commit, API/integration + smoke E2E tiap pull request, suite penuh paralel (sharding) malam hari atau sebelum rilis.",
           "Metrik berguna: flaky rate, durasi pipeline, defect escape rate, waktu perbaikan. Pipeline lambat atau tidak dipercaya akan diabaikan tim."] },
    { h: "Strategi test dan keamanan dasar",
      ul: ["Test pyramid: banyak unit test cepat, cukup test API/integration, sedikit E2E UI. Tujuannya umpan balik cepat dengan biaya rawatan rendah.",
           "Contract testing (mis. Pact): consumer menentukan ekspektasi, provider memverifikasi, sehingga breaking change terdeteksi tanpa menjalankan seluruh sistem.",
           "Testing berbasis risiko: nilai kemungkinan x dampak, uji area paling berbahaya lebih dulu, dan sampaikan risiko residual kepada pengambil keputusan rilis.",
           "Keamanan dasar yang layak diuji QA: IDOR (ganti id milik pengguna lain), token kedaluwarsa tetap diterima, SQL injection pada input, XSS pada kolom teks, data sensitif di log atau URL. Uji hanya sistem yang Anda berwenang menguji.",
           "AI dalam QA: bantu menyusun test case, data, dan ringkasan log, tetapi hasilnya harus ditinjau dan diverifikasi; jangan menaruh data rahasia perusahaan di prompt."] }
  ],

  "sql": [
    { h: "JOIN dan memilih jenisnya",
      ul: ["INNER JOIN: hanya baris yang cocok di kedua tabel. LEFT JOIN: semua baris tabel kiri, kolom kanan NULL bila tidak cocok.",
           "Mencari data yatim (orphan): LEFT JOIN lalu filter kolom kanan IS NULL. Berguna untuk validasi integritas data."],
      pre: "-- pesanan tanpa pelanggan yang valid\nSELECT o.id\nFROM orders o\nLEFT JOIN customers c ON c.id = o.customer_id\nWHERE c.id IS NULL;" },
    { h: "Agregasi dan duplikat",
      pre: "-- email yang terdaftar lebih dari sekali\nSELECT email, COUNT(*) AS n\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;",
      ul: ["COUNT(*) menghitung semua baris; COUNT(kolom) mengabaikan NULL; COUNT(DISTINCT kolom) menghitung nilai unik.", "Kolom non-agregat di SELECT harus ada di GROUP BY."] },
    { h: "NULL",
      ul: ["NULL berarti tidak diketahui: NULL = NULL tidak benar; gunakan IS NULL / IS NOT NULL.",
           "NOT IN dengan subquery yang berisi NULL bisa menghasilkan hasil kosong yang tidak terduga; NOT EXISTS lebih aman.",
           "COALESCE(kolom, nilai_default) mengganti NULL saat menghitung atau menampilkan."] },
    { h: "Subquery, CTE, window function",
      pre: "WITH terakhir AS (\n  SELECT user_id, MAX(created_at) AS t FROM logins GROUP BY user_id\n)\nSELECT u.email, terakhir.t FROM users u JOIN terakhir ON terakhir.user_id = u.id;\n\n-- peringkat per kelompok\nSELECT *, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn FROM orders;",
      ul: ["CTE (WITH) membuat query panjang lebih terbaca. Window function (ROW_NUMBER, RANK, SUM OVER) menghitung per kelompok tanpa menggabungkan baris.", "Contoh umum: ambil transaksi terbaru per user (rn = 1)."] },
    { h: "Indeks dan EXPLAIN (level interview)",
      ul: ["Indeks mempercepat pencarian dan pengurutan tetapi memperlambat penulisan dan memakan ruang. Kolom yang sering dipakai di WHERE/JOIN adalah kandidat.",
           "EXPLAIN menunjukkan rencana eksekusi; table scan penuh pada tabel besar adalah tanda bahaya.",
           "Sebagai QA, uji data uji yang cukup besar agar masalah performa query terlihat."] }
  ],

  "playwright": [
    { h: "Mengapa orang memilih Playwright",
      ul: ["Auto-waiting: aksi seperti click menunggu elemen siap (terlihat, stabil, bisa diklik) sehingga lebih sedikit sleep dan flaky test.",
           "Web-first assertion: expect(locator).toBeVisible() mencoba ulang sampai kondisi terpenuhi atau timeout.",
           "Satu API untuk Chromium, Firefox, dan WebKit; mendukung TypeScript/JavaScript, Python, Java, dan .NET."] },
    { h: "Locator dan assertion",
      pre: "import { test, expect } from '@playwright/test';\n\ntest('login berhasil', async ({ page }) => {\n  await page.goto('/login');\n  await page.getByLabel('Email').fill('user@example.com');\n  await page.getByRole('button', { name: 'Masuk' }).click();\n  await expect(page.getByRole('heading', { name: 'Beranda' })).toBeVisible();\n});",
      ul: ["Utamakan locator berbasis peran dan label (getByRole, getByLabel, getByTestId) karena mendekati cara user melihat halaman dan tahan perubahan struktur."] },
    { h: "Isolasi dan struktur",
      ul: ["Setiap test mendapat browser context baru (seperti profil browser bersih), cepat dan terisolasi tanpa membuka browser baru.",
           "Fixture menyiapkan dependensi (halaman yang sudah login, data uji); simpan state login (storageState) agar tidak login di tiap test.",
           "Test berjalan paralel antar file dengan beberapa worker; pastikan data tidak saling bertabrakan."] },
    { h: "Network dan debugging",
      ul: ["page.route() menyadap atau mem-mock request jaringan (misalnya simulasi error 500) untuk menguji perilaku UI.",
           "Trace viewer merekam langkah, snapshot DOM, dan jaringan untuk menganalisis kegagalan di CI; ada juga codegen untuk merekam skrip awal dan mode UI untuk debugging.",
           "APIRequestContext memungkinkan test API dalam proyek yang sama."] },
    { h: "Playwright vs Selenium vs Cypress (ringkas)",
      ul: ["Playwright: multi-browser, multi-tab, auto-wait kuat, trace viewer. Selenium: ekosistem dan bahasa paling luas, butuh wait yang disusun sendiri. Cypress: pengalaman developer yang bagus berjalan di dalam browser, dengan batasan multi-tab dan lintas origin.",
           "Dalam interview, jawab dengan kriteria (tim, bahasa, kebutuhan browser, dukungan legacy), bukan kesetiaan pada satu tool."] }
  ],

  "cypress": [
    { h: "Cara kerja Cypress",
      ul: ["Cypress berjalan di dalam browser bersama aplikasi, sehingga bisa mengakses DOM, jaringan, dan state aplikasi secara langsung.",
           "Perintah Cypress diantrikan dan dijalankan berurutan; ia bukan Promise biasa, jadi jangan memakai async/await dengan cy.* seperti biasa.",
           "Retry-ability: cy.get(...) dan assertion yang mengikutinya diulang otomatis sampai berhasil atau timeout."],
      pre: "describe('login', () => {\n  it('berhasil', () => {\n    cy.visit('/login');\n    cy.get('[data-cy=email]').type('user@example.com');\n    cy.contains('button', 'Masuk').click();\n    cy.url().should('include', '/beranda');\n  });\n});" },
    { h: "Network dan data uji",
      ul: ["cy.intercept() menyadap, menunggu (alias lalu cy.wait('@alias')), atau mem-stub request; berguna untuk menguji state error dan loading tanpa bergantung backend.",
           "Fixture berisi data uji statis (folder fixtures). Untuk data dinamis, buat lewat API (cy.request) sebelum test agar cepat dan stabil.",
           "cy.session() menyimpan dan memulihkan sesi login antar test."] },
    { h: "Batasan yang perlu diketahui",
      ul: ["Tidak mendukung beberapa tab browser; lintas origin dalam satu test memerlukan cy.origin().",
           "Dukungan browser lebih sempit dibanding Playwright (Chromium family, Firefox, dan WebKit eksperimental).",
           "Bahasa terbatas pada JavaScript/TypeScript."] },
    { h: "Praktik baik",
      ul: ["Pakai atribut khusus test (data-cy atau data-testid) sebagai selector, bukan class CSS atau teks yang sering berubah.",
           "Custom command (Cypress.Commands.add) untuk aksi berulang; hindari test yang saling bergantung.",
           "Component testing memungkinkan menguji komponen UI secara terpisah di Cypress."] }
  ],

  "katalon": [
    { h: "Konsep dasar Katalon Studio",
      ul: ["Test Case adalah skenario tunggal; Test Suite mengelompokkan test case; Test Suite Collection menjalankan beberapa suite (bisa pada browser atau profil berbeda).",
           "Object Repository menyimpan test object (locator) terpusat sehingga perubahan UI cukup diperbaiki di satu tempat, mirip semangat Page Object Model.",
           "Keyword (built-in dan custom) adalah blok aksi; skrip ditulis dalam Groovy/Java. Mode manual (tanpa kode) cocok untuk pemula, mode script untuk kontrol penuh."] },
    { h: "Data dan konfigurasi",
      ul: ["Test Data (Excel, CSV, database, internal) untuk data-driven testing: satu test case dijalankan berulang dengan baris data berbeda.",
           "Execution Profile dan Global Variable menyimpan konfigurasi per environment (URL, kredensial uji) tanpa mengubah test case.",
           "Record and playback dan Web Recorder mempercepat pembuatan awal, tetapi hasil rekaman perlu dirapikan (locator, wait, assertion)."] },
    { h: "Kapan cocok dan keterbatasannya",
      ul: ["Cocok untuk tim dengan banyak tester non-programmer, kebutuhan web, mobile, dan API dalam satu tool, serta pelaporan bawaan.",
           "Keterbatasan: terikat ke tool dan lisensi, kustomisasi dan integrasi dengan stack developer lebih terbatas dibanding framework kode (Selenium, Playwright).",
           "Jawaban interview yang baik menyebut kapan Anda memilih tool low-code dan kapan framework berbasis kode."] }
  ],

  "interview": [
    { h: "Kerangka menjawab pertanyaan perilaku (STAR)",
      ul: ["Situation: konteks singkat. Task: tanggung jawab Anda. Action: apa yang Anda lakukan (pakai \"saya\", bukan \"kami\"). Result: hasil yang terukur atau pelajaran.",
           "Siapkan 4-5 cerita yang bisa dipakai ulang: bug sulit yang Anda temukan, konflik dengan developer, test otomatis yang flaky, keputusan menunda rilis, dan proses yang Anda perbaiki."] },
    { h: "Kerangka menjawab \"bagaimana Anda menguji X?\"",
      ul: ["1) Klarifikasi: siapa user-nya, apa requirement dan batasannya. 2) Identifikasi risiko dan prioritas. 3) Rancang test dengan teknik: EP/BVA, decision table, state transition, error guessing. 4) Sebutkan non-fungsional (performa, keamanan, aksesibilitas). 5) Putuskan apa yang diotomasi dan apa yang tetap manual.",
           "Contoh: login. Valid dan tidak valid, batas panjang, karakter khusus, akun terkunci setelah percobaan gagal, sesi kedaluwarsa, brute force, pesan error yang tidak membocorkan keberadaan akun."] },
    { h: "Pertanyaan yang hampir selalu muncul",
      ul: ["Beda severity dan priority; beda smoke dan regression; apa yang Anda lakukan bila developer menolak bug Anda; bagaimana menguji tanpa dokumentasi (exploratory).",
           "Kapan sebaiknya tidak mengotomasi (UI yang sering berubah, test sekali pakai, butuh penilaian manusia)? Bagaimana memilih test untuk otomasi (stabil, berulang, berisiko tinggi, cepat dijalankan)?",
           "Bagaimana Anda memutuskan rilis boleh dilakukan? Jawab dengan risiko, coverage, defect terbuka, dan kesepakatan stakeholder, bukan perasaan."] },
    { h: "Jawaban terbuka: cara berlatih",
      ul: ["Jawab dengan suara keras atau tulis jawaban 3-5 kalimat, lalu bandingkan dengan jawaban model di aplikasi ini dan nilai diri sendiri (Benar/Hampir/Salah).",
           "Beri contoh nyata dan akui trade-off. Interviewer menilai cara berpikir, bukan hafalan.",
           "Siapkan 2-3 pertanyaan balik untuk perusahaan (proses rilis, peran QA di tim, bagaimana kualitas diukur)."],
      tip: ["Jangan menyebut data internal perusahaan lama (nama sistem, angka rahasia). Gunakan contoh generik."] }
  ]
  ,
  "fundamentals": [
    { h: "Pola pikir QA dan model SDLC",
      ul: ["QA yang baik bertanya 'bagaimana ini bisa gagal?', bukan hanya 'apakah ini jalan?'. Rasa ingin tahu, skeptis yang sopan, dan komunikasi yang jelas sama pentingnya dengan alat.",
           "Waterfall: tahap berurutan, perubahan mahal, testing di akhir. V-model: tiap tahap pengembangan punya tahap test pasangannya, sehingga test dirancang sejak requirement.",
           "Agile (Scrum, Kanban, XP): iterasi pendek, umpan balik cepat, QA terlibat sejak refinement. Scrum punya sprint dan peran tetap; Kanban memvisualkan aliran kerja dan membatasi pekerjaan yang berjalan.",
           "Verifikasi = 'apakah kita membangun produk dengan benar?' (sesuai spesifikasi). Validasi = 'apakah kita membangun produk yang benar?' (sesuai kebutuhan pengguna)."],
      tip: ["Pertanyaan interview klasik: apa peran QA di Scrum? Jawab: ikut refinement (menajamkan acceptance criteria), merancang test sejak awal, menguji di dalam sprint, dan menjaga definition of done."] },
    { h: "Pendekatan dan level pengujian",
      ul: ["Black box: menguji dari luar berdasarkan perilaku tanpa melihat kode. White box: berdasarkan struktur kode (cakupan statement/branch). Gray box: sebagian pengetahuan internal, misalnya tahu skema database saat menguji API.",
           "Level: unit (fungsi/kelas, biasanya developer), integration (interaksi komponen/layanan), system/E2E (alur lengkap), acceptance/UAT (diterima pengguna atau bisnis).",
           "Jenis: fungsional (apa yang dilakukan sistem) dan non-fungsional (seberapa baik: performa, keamanan, aksesibilitas). Smoke = cek cepat build layak diuji; sanity = cek sempit setelah perubahan kecil; regression = pastikan yang lama tidak rusak.",
           "Exploratory testing: belajar, merancang, dan menjalankan test sekaligus, biasanya dengan piagam (charter) dan batas waktu, lalu mencatat temuan."] },
    { h: "Teknik desain test dan test oracle",
      ul: ["Equivalence partitioning: bagi input menjadi kelompok yang diperlakukan sama, uji satu wakil per kelompok. Boundary value analysis: uji di tepi kelompok (mis. batas 17, 18, 19 untuk usia minimal 18).",
           "Decision table untuk kombinasi aturan bisnis; state transition untuk objek yang berubah status (pesanan: baru, dibayar, dikirim, dibatalkan); pairwise untuk mengurangi kombinasi parameter.",
           "Test oracle adalah cara menentukan hasil yang benar: spesifikasi, versi sebelumnya, sistem pembanding, atau perhitungan independen. Tanpa oracle, test tidak bisa menyimpulkan lulus atau gagal.",
           "Test case yang baik: tujuan jelas, data dan prakondisi eksplisit, langkah bisa diulang, hasil yang diharapkan terukur, dan independen dari test lain."] },
    { h: "TDD, BDD, ATDD, dan perencanaan test",
      ul: ["TDD: tulis test yang gagal, buat kode minimal agar lulus, lalu refactor (red-green-refactor). Hasilnya desain yang mudah diuji dan cakupan unit yang tinggi.",
           "BDD: perilaku ditulis dalam bahasa bersama (Given-When-Then) sehingga bisnis, developer, dan QA sepakat sebelum coding. ATDD: acceptance test disepakati lebih dulu dan dijadikan target pengembangan.",
           "Rencana test mencakup ruang lingkup, pendekatan, environment, data uji, jadwal, peran, risiko, serta entry dan exit criteria. Prioritaskan test dengan risiko (kemungkinan x dampak), frekuensi pemakaian, dan area yang baru berubah.",
           "Test data management: data sintetis atau tersamar, bukan data pelanggan asli; setiap test menyiapkan dan membersihkan datanya sendiri agar bisa diulang dan diparalelkan."],
      tip: ["Given-When-Then bukan sekadar format: skenario harus menggambarkan perilaku bisnis, bukan klik-klik UI satu per satu."] }
  ],
  "nonfunctional": [
    { h: "Performance, load, dan stress testing",
      ul: ["Load test: beban yang diharapkan di produksi. Stress test: melampaui batas untuk melihat kapan dan bagaimana sistem gagal. Spike: lonjakan mendadak. Soak/endurance: beban stabil lama untuk menemukan kebocoran memori.",
           "Metrik utama: latency (pakai persentil p95/p99, bukan hanya rata-rata), throughput (request per detik), error rate, dan pemakaian resource (CPU, memori, koneksi database).",
           "Mulai dari tujuan terukur (mis. p95 di bawah 500 ms pada 200 pengguna bersamaan), pakai data dan skenario yang menyerupai produksi, dan jalankan di environment yang sebanding. Beban dari mesin pembangkit yang lemah bisa menjadi bottleneck palsu.",
           "Alat umum: k6, JMeter, Gatling, Locust. Hasil tanpa analisis tidak berguna: cari bottleneck (query lambat, pool koneksi, cache, N+1) sebelum menyalahkan 'server kecil'."],
      tip: ["Rata-rata latency menyembunyikan pengguna yang lambat. Selalu sebut persentil."] },
    { h: "Dasar security testing untuk QA",
      ul: ["OWASP Top 10 adalah daftar risiko aplikasi web yang paling umum, antara lain broken access control, injection, kegagalan kriptografi, desain tidak aman, dan misconfiguration. OWASP API Security Top 10 khusus untuk API (mis. BOLA/IDOR, autentikasi rusak).",
           "Yang realistis diuji QA: otorisasi (akses data pengguna lain), autentikasi (brute force, token kedaluwarsa, reset password), validasi input (injection, XSS), data sensitif (di log, URL, respons), header keamanan, dan dependensi rentan.",
           "Alat bantu: vulnerability scanner dan SAST/DAST di pipeline menemukan masalah umum, tetapi tidak menggantikan penilaian manusia untuk logika bisnis.",
           "Etika: hanya uji sistem yang Anda berwenang menguji, dengan izin tertulis bila di luar tim Anda. Laporkan temuan lewat jalur yang tepat dan jangan menyimpan data pengguna sungguhan."],
      tip: ["Jika ditanya 'bagaimana menguji login?', sebut juga keamanannya: rate limit, pesan error generik, penguncian akun, dan masa berlaku token."] },
    { h: "Aksesibilitas, kompatibilitas, dan responsif",
      ul: ["Aksesibilitas mengikuti WCAG (prinsip POUR: perceivable, operable, understandable, robust). Uji navigasi keyboard, fokus yang terlihat, label form, teks alternatif, kontras warna, dan pembaca layar.",
           "Alat otomatis (axe, Lighthouse, WAVE) hanya menangkap sebagian masalah; sisanya perlu uji manual dengan keyboard dan pembaca layar.",
           "Kompatibilitas: kombinasi browser, OS, dan perangkat dipilih dari data pengguna, bukan semua kombinasi. Responsif menyesuaikan tata letak dengan lebar layar; uji titik putus dan orientasi layar.",
           "Kinerja web: Lighthouse dan Core Web Vitals mengukur kecepatan muat dan kestabilan tampilan dari sisi pengguna."] }
  ],
  "tooling": [
    { h: "Git dan alur kerja kolaborasi",
      ul: ["Perintah harian: clone, status, add, commit, branch, checkout/switch, pull, push, merge, rebase, stash. Pahami beda merge (menyatukan riwayat) dan rebase (menulis ulang commit di atas cabang lain; jangan pada cabang bersama).",
           "Alur umum: cabang fitur dari main, commit kecil dengan pesan jelas, pull request, review, CI harus hijau, lalu merge. Kode test otomasi diperlakukan seperti kode produk.",
           "Konflik merge terjadi saat dua orang mengubah baris yang sama; selesaikan dengan membaca kedua sisi, bukan menerima salah satu secara buta, lalu jalankan test.",
           "Jangan commit rahasia (API key, password). Pakai variabel environment atau secret manager; bila terlanjur, ganti kuncinya, bukan hanya menghapus commit."] },
    { h: "CI/CD, container, dan pelaporan",
      ul: ["CI menjalankan build dan test otomatis tiap perubahan; CD mengirim ke environment berikutnya. Alat umum: GitHub Actions, GitLab CI, Jenkins.",
           "Pipeline berlapis menjaga umpan balik cepat: lint dan unit tiap commit, API dan smoke E2E tiap pull request, suite penuh paralel (sharding) terjadwal atau sebelum rilis.",
           "Docker membungkus aplikasi dan dependensinya sehingga environment test sama di laptop dan CI. Berguna untuk menjalankan database atau layanan pendukung sementara.",
           "Pelaporan: simpan artefak kegagalan (log, screenshot, video, trace) dan tampilkan lewat laporan seperti Allure atau HTML reporter bawaan framework. Laporan harus menjawab: apa gagal, di mana, sejak kapan."] },
    { h: "Monitoring, log, dan analisis akar masalah",
      ul: ["Observability memakai tiga sinyal: log (kejadian), metrik (angka dari waktu ke waktu), dan trace (perjalanan satu request lintas layanan). QA memanfaatkannya untuk mereproduksi bug produksi dan memeriksa dampak rilis.",
           "Error tracker (mis. Sentry) mengelompokkan exception produksi; alert yang baik actionable dan tidak berisik. Dashboard (mis. Grafana) membantu melihat tren setelah rilis.",
           "RCA: pisahkan gejala, penyebab langsung, dan akar masalah; tanyakan 'mengapa' berulang sampai menemukan kontrol yang hilang (test, review, alert). Hasilnya tindakan pencegahan, bukan mencari siapa yang salah.",
           "Pengujian pada aplikasi mobile: Appium (lintas platform), Espresso (Android), XCUITest (iOS). Tantangannya fragmentasi perangkat, izin, jaringan buruk, dan interupsi seperti telepon masuk."] }
  ]
};

// Sumber belajar per topik: [judul, URL, jenis]. jenis: "resmi" (standar/dokumentasi pemilik alat), "rujukan" (penulis/institusi tepercaya), "komunitas" (kurasi komunitas; dipakai sebagai peta topik, bukan otoritas). Hanya ditautkan (tidak disalin); semua URL diperiksa terbuka saat ditulis.
QA.sumberKarir = {
 "rest-api": [
  ["MDN: HTTP status codes", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "rujukan"],
  ["MDN: HTTP request methods", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", "rujukan"],
  ["RFC 9110: HTTP Semantics (rujukan resmi)", "https://www.rfc-editor.org/rfc/rfc9110", "resmi"],
  ["Belajar OpenAPI (resmi)", "https://learn.openapis.org/", "resmi"],
  ["Dokumentasi Postman", "https://learning.postman.com/docs/", "resmi"],
  ["OWASP API Security Top 10", "https://owasp.org/API-Security/", "resmi"],
  ["Dokumentasi Pact (contract testing)", "https://docs.pact.io/", "resmi"]
 ],
 "selenium": [
  ["Dokumentasi resmi Selenium", "https://www.selenium.dev/documentation/", "resmi"],
  ["Martin Fowler: non-determinism pada test", "https://martinfowler.com/articles/nonDeterminism.html", "rujukan"]
 ],
 "qa-general": [
  ["roadmap.sh: QA Roadmap (peta topik)", "https://roadmap.sh/qa", "komunitas"],
  ["Martin Fowler: The Practical Test Pyramid", "https://martinfowler.com/articles/practical-test-pyramid.html", "rujukan"],
  ["Google Testing Blog", "https://testing.googleblog.com/", "rujukan"],
  ["Ministry of Testing (komunitas)", "https://www.ministryoftesting.com/", "komunitas"],
  ["Pro Git (buku gratis)", "https://git-scm.com/book/en/v2", "rujukan"]
 ],
 "sql": [
  ["SQLBolt: latihan SQL interaktif", "https://sqlbolt.com/", "komunitas"],
  ["PostgreSQL: tutorial SQL", "https://www.postgresql.org/docs/current/tutorial-sql.html", "resmi"]
 ],
 "playwright": [
  ["Playwright: pengantar", "https://playwright.dev/docs/intro", "resmi"],
  ["Playwright: best practices", "https://playwright.dev/docs/best-practices", "resmi"]
 ],
 "cypress": [
  ["Dokumentasi Cypress", "https://docs.cypress.io/", "resmi"],
  ["Cypress: best practices", "https://docs.cypress.io/app/core-concepts/best-practices", "resmi"]
 ],
 "katalon": [
  ["Dokumentasi Katalon", "https://docs.katalon.com/", "resmi"]
 ],
 "interview": [
  ["roadmap.sh: QA Roadmap (peta topik)", "https://roadmap.sh/qa", "komunitas"],
  ["ISTQB (sertifikasi)", "https://istqb.org/", "resmi"],
  ["Ministry of Testing (komunitas)", "https://www.ministryoftesting.com/", "komunitas"]
 ],
 "fundamentals": [
  ["roadmap.sh: QA Roadmap (peta topik)", "https://roadmap.sh/qa", "komunitas"],
  ["ISTQB", "https://istqb.org/", "resmi"],
  ["Agile Manifesto", "https://agilemanifesto.org/", "resmi"],
  ["The Scrum Guide", "https://scrumguides.org/", "resmi"],
  ["Cucumber: BDD", "https://cucumber.io/docs/bdd/", "resmi"],
  ["Martin Fowler: Test Driven Development", "https://martinfowler.com/bliki/TestDrivenDevelopment.html", "rujukan"],
  ["Martin Fowler: The Practical Test Pyramid", "https://martinfowler.com/articles/practical-test-pyramid.html", "rujukan"]
 ],
 "nonfunctional": [
  ["roadmap.sh: QA Roadmap (peta topik)", "https://roadmap.sh/qa", "komunitas"],
  ["Dokumentasi k6", "https://grafana.com/docs/k6/latest/", "resmi"],
  ["Apache JMeter: user manual", "https://jmeter.apache.org/usermanual/index.html", "resmi"],
  ["OWASP Top 10", "https://owasp.org/www-project-top-ten/", "resmi"],
  ["OWASP Web Security Testing Guide", "https://owasp.org/www-project-web-security-testing-guide/", "resmi"],
  ["W3C: WCAG", "https://www.w3.org/WAI/standards-guidelines/wcag/", "resmi"],
  ["W3C: menguji aksesibilitas", "https://www.w3.org/WAI/test-evaluate/", "resmi"],
  ["Lighthouse (Chrome)", "https://developer.chrome.com/docs/lighthouse/overview", "resmi"]
 ],
 "tooling": [
  ["roadmap.sh: QA Roadmap (peta topik)", "https://roadmap.sh/qa", "komunitas"],
  ["Pro Git (buku gratis)", "https://git-scm.com/book/en/v2", "rujukan"],
  ["GitHub Actions docs", "https://docs.github.com/en/actions", "resmi"],
  ["Docker: get started", "https://docs.docker.com/get-started/", "resmi"],
  ["Appium docs", "https://appium.io/docs/en/latest/", "resmi"],
  ["Google SRE Book: monitoring", "https://sre.google/sre-book/monitoring-distributed-systems/", "rujukan"]
 ]
};
