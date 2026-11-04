// Dibuat otomatis oleh tools/build-data.py. Jangan diedit; edit file di questions/ lalu jalankan ulang.
window.QA = window.QA || {};
QA.questions = [
{
"id": "gen-031",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Test otomatis Anda lulus di laptop tetapi gagal acak di CI. Langkah pertama yang paling tepat?",
"en": "Your automated test passes on your laptop but fails randomly in CI. Best first step?"
},
"options": {
"id": [
"Kumpulkan log dan trace dari beberapa run gagal, cari polanya",
"Tambahkan retry 3x pada test itu agar pipeline kembali hijau",
"Tandai test itu skip sampai ada waktu luang untuk memeriksanya",
"Naikkan semua timeout menjadi 60 detik di seluruh suite"
],
"en": [
"Collect logs and traces from several failed runs, look for a pattern",
"Add 3 retries to that test so the pipeline goes green again",
"Mark the test as skipped until there is spare time to check it",
"Raise all timeouts to 60 seconds across the whole suite"
]
},
"answer": 0,
"exp": {
"id": "Flaky test harus didiagnosis dulu: penyebab umum adalah race condition, data bersama antar test, dan perbedaan environment. Retry, skip, dan timeout besar hanya menyembunyikan gejala dan menurunkan kepercayaan pada pipeline.",
"en": "A flaky test must be diagnosed first: common causes are race conditions, data shared between tests and environment differences. Retries, skips and huge timeouts only hide the symptom and erode trust in the pipeline."
}
},
{
"id": "gen-032",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa test pyramid menyarankan lebih banyak unit test daripada UI test?",
"en": "Why does the test pyramid recommend more unit tests than UI tests?"
},
"options": {
"id": [
"Unit test cepat, murah, dan stabil, jadi umpan baliknya lebih dini",
"UI test tidak mampu mendeteksi bug fungsional sama sekali",
"Unit test selalu menggantikan kebutuhan akan integration test",
"Developer tidak diperbolehkan menulis UI test di tim mana pun"
],
"en": [
"Unit tests are fast, cheap and stable, so feedback comes earlier",
"UI tests are unable to detect functional bugs at all",
"Unit tests always replace the need for any integration tests",
"Developers are not allowed to write UI tests in any team"
]
},
"answer": 0,
"exp": {
"id": "Semakin tinggi lapisan, semakin lambat, mahal, dan rapuh test-nya. Piramida bukan larangan UI test; ia mengarahkan porsi usaha. Unit test tidak menggantikan integration test karena tidak melihat interaksi antar komponen.",
"en": "The higher the layer, the slower, costlier and more brittle the tests. The pyramid does not ban UI tests; it guides effort. Unit tests do not replace integration tests because they cannot see interactions between components."
}
},
{
"id": "gen-033",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Pipeline CI berjalan 45 menit dan developer mulai mengabaikannya. Perbaikan yang paling masuk akal?",
"en": "A CI pipeline takes 45 minutes and developers start ignoring it. What is the most sensible fix?"
},
"options": {
"id": [
"Bagi jadi tahap: unit dan smoke tiap commit, suite penuh paralel",
"Hapus semua test UI dari repository supaya pipeline cepat",
"Jalankan seluruh test hanya sebelum release akhir bulan saja",
"Minta developer tetap menunggu sampai pipeline selesai"
],
"en": [
"Split into stages: unit and smoke per commit, full suite in parallel",
"Delete every UI test from the repository to speed up the pipeline",
"Run the entire test suite only before the end-of-month release",
"Ask developers to keep waiting until the pipeline finishes"
]
},
"answer": 0,
"exp": {
"id": "Feedback cepat adalah tujuan CI. Pelapisan, paralelisasi, dan sharding menjaga sinyal tetap cepat tanpa membuang coverage. Menghapus test atau menunda ke akhir bulan menghilangkan manfaat CI.",
"en": "Fast feedback is the point of CI. Layering, parallelism and sharding keep the signal fast without dropping coverage. Deleting tests or deferring to month-end removes the benefit of CI."
}
},
{
"id": "gen-034",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa itu defect escape rate?",
"en": "What is the defect escape rate?"
},
"options": {
"id": [
"Proporsi defect yang lolos testing dan baru ditemukan di produksi",
"Jumlah test case yang dilewati selama siklus regression",
"Persentase bug yang ditolak developer dengan alasan tertentu",
"Rata-rata waktu yang dibutuhkan untuk memperbaiki sebuah bug"
],
"en": [
"The share of defects that slip past testing into production",
"The number of test cases skipped during a regression cycle",
"The percentage of bugs developers reject for some reason",
"The average time it takes to fix a single reported bug"
]
},
"answer": 0,
"exp": {
"id": "Metrik ini menunjukkan seberapa efektif testing menangkap masalah sebelum release. Ketiga opsi lain adalah metrik berbeda (skip rate, rejection rate, MTTR).",
"en": "This metric shows how effectively testing catches problems before release. The other options are different metrics (skip rate, rejection rate, MTTR)."
}
},
{
"id": "gen-035",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Bug: laporan transaksi menampilkan tanggal berbeda di server UTC dan browser user di Jakarta (UTC+7), terutama di sekitar tengah malam. Dugaan root cause paling mungkin?",
"en": "Bug: a transaction report shows different dates on a UTC server and a Jakarta (UTC+7) user's browser, especially around midnight. Most likely root cause?"
},
"options": {
"id": [
"Zona waktu ditangani tidak konsisten antar lapisan sistem",
"Database kehabisan ruang penyimpanan pada jam-jam tertentu",
"Cache browser user belum dibersihkan sejak minggu lalu",
"Font tanggal pada laporan tidak mendukung angka tertentu"
],
"en": [
"Timezone handling is inconsistent between storage and display",
"The database runs out of storage space at certain hours",
"The user's browser cache has not been cleared since last week",
"The report's date font does not support certain digits"
]
},
"answer": 0,
"exp": {
"id": "Masalah di sekitar tengah malam adalah ciri khas konversi zona waktu. Praktik baik: simpan UTC, konversi hanya saat tampil, dan uji dengan data di batas hari (23:30 UTC+7 = 16:30 UTC, hari sama; 00:30 UTC+7 = 17:30 UTC hari sebelumnya).",
"en": "Trouble around midnight is the signature of timezone conversion. Good practice: store UTC, convert only at display, and test with data at the day boundary (00:30 UTC+7 is 17:30 UTC on the previous day)."
}
},
{
"id": "gen-036",
"topic": "qa-general",
"level": 3,
"type": "mcq",
"q": {
"id": "Dua user menekan 'Beli' untuk stok terakhir hampir bersamaan dan keduanya sukses (stok menjadi -1). Jenis masalah dan testing yang tepat?",
"en": "Two users click 'Buy' on the last item almost simultaneously and both succeed (stock becomes -1). What kind of problem is this and how to test it?"
},
"options": {
"id": [
"Race condition; uji dengan request paralel, periksa stok akhir",
"Bug tampilan; cukup diuji dengan membandingkan screenshot",
"Masalah jaringan sesaat; ulangi test sampai berhasil",
"Masalah validasi UI; cukup tambahkan pesan error di layar"
],
"en": [
"Race condition; test with parallel requests, check the final stock",
"Display bug; testing screenshot comparisons is enough",
"A brief network glitch; rerun the test until it passes",
"A UI validation issue; just add an error message on screen"
]
},
"answer": 0,
"exp": {
"id": "Cek-lalu-ubah tanpa atomisitas menyebabkan oversell. Uji lewat request paralel (script atau tool load) dan pastikan stok tidak negatif; perbaikan biasanya update atomik, locking, atau constraint database.",
"en": "A non-atomic check-then-update causes overselling. Test with parallel requests (script or load tool) and assert stock never goes negative; the fix is usually an atomic update, locking or a database constraint."
}
},
{
"id": "gen-037",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa beda severity dan priority yang benar?",
"en": "What is the correct difference between severity and priority?"
},
"options": {
"id": [
"Severity = dampak teknis bug; priority = urgensi bisnis perbaikannya",
"Severity = siapa yang memperbaiki bug; priority = siapa yang melaporkannya",
"Keduanya sama persis dan bisa dipertukarkan dalam bug report",
"Severity selalu ditentukan developer; priority selalu oleh tester"
],
"en": [
"Severity = technical impact of a bug; priority = business urgency to fix",
"Severity = who fixes the bug; priority = who reported it",
"Both are exactly the same and interchangeable in a bug report",
"Severity is always set by developers; priority always by testers"
]
},
"answer": 0,
"exp": {
"id": "Contoh: typo di logo halaman utama severity rendah tetapi priority tinggi; crash di fitur yang jarang dipakai severity tinggi tetapi priority bisa lebih rendah. Penetapan idealnya hasil diskusi, bukan satu peran.",
"en": "Example: a typo in the homepage logo is low severity but high priority; a crash in a rarely used feature is high severity but may be lower priority. Ideally both are agreed together, not set by one role."
}
},
{
"id": "gen-038",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Fitur diberi tenggat mepet dan Anda tidak bisa menguji semuanya. Pendekatan terbaik?",
"en": "A feature has a tight deadline and you cannot test everything. Best approach?"
},
"options": {
"id": [
"Prioritaskan menurut risiko dan sampaikan apa yang belum teruji",
"Uji secara acak lalu nyatakan fitur itu siap untuk dirilis",
"Tolak release sampai seluruh kombinasi input sudah teruji",
"Uji happy path saja dan jangan bahas sisanya dengan tim"
],
"en": [
"Prioritise by risk and communicate what remains untested",
"Test at random, then declare the feature ready to be released",
"Refuse release until every input combination has been tested",
"Test the happy path only and do not discuss the rest with the team"
]
},
"answer": 0,
"exp": {
"id": "Testing berbasis risiko menempatkan usaha di area paling berbahaya, dan transparansi soal risiko residual membuat keputusan release dibuat oleh pihak yang berwenang. Menguji semua kombinasi tidak mungkin.",
"en": "Risk-based testing puts effort where failure hurts most, and being open about residual risk lets the right people make the release call. Testing every combination is impossible."
}
},
{
"id": "gen-039",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa tujuan utama contract testing (mis. Pact) pada arsitektur microservices?",
"en": "What is the main purpose of contract testing (e.g. Pact) in a microservices architecture?"
},
"options": {
"id": [
"Mendeteksi perubahan API yang merusak consumer tanpa menjalankan sistem penuh",
"Mengukur kecepatan respons endpoint saat load user sangat tinggi",
"Memeriksa tampilan UI di banyak browser dan ukuran layar",
"Menggantikan seluruh unit test milik tim provider API"
],
"en": [
"Detect API changes that break consumers without the full system",
"Measure endpoint response speed when user load is very high",
"Check the interface across many browsers and screen sizes",
"Replace all unit tests owned by the API provider team"
]
},
"answer": 0,
"exp": {
"id": "Consumer mendefinisikan ekspektasi (kontrak) dan provider memverifikasinya di pipeline-nya sendiri, sehingga breaking change terdeteksi lebih dini dan lebih murah daripada end-to-end test.",
"en": "The consumer defines expectations (the contract) and the provider verifies them in its own pipeline, so breaking changes are caught earlier and cheaper than with end-to-end tests."
}
},
{
"id": "gen-040",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Kapan smoke test dijalankan?",
"en": "When is a smoke test run?"
},
"options": {
"id": [
"Setelah build atau deploy baru, memastikan fungsi kritis hidup",
"Hanya setelah seluruh bug di backlog berhasil ditutup tim",
"Sebelum developer mulai menulis kode untuk fitur baru",
"Sebagai pengganti penuh seluruh suite regression yang ada"
],
"en": [
"After a new build or deploy, confirming critical functions are alive",
"Only after every bug in the backlog has been closed by the team",
"Before developers start writing code for a new feature",
"As a full replacement for the entire existing regression suite"
]
},
"answer": 0,
"exp": {
"id": "Smoke test = pemeriksaan cepat dan dangkal atas alur kritis. Jika gagal, build tidak layak diuji lebih lanjut. Ia tidak menggantikan regression.",
"en": "A smoke test is a quick, shallow check of critical flows. If it fails, the build is not worth deeper testing. It does not replace regression."
}
},
{
"id": "gen-041",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Staging memakai 1 worker sedangkan produksi 4 worker; bug 'data ganda' hanya muncul di produksi. Pelajaran QA terbaik?",
"en": "Staging uses 1 worker while production uses 4; a 'duplicate data' bug only appears in production. Best QA takeaway?"
},
"options": {
"id": [
"Samakan konfigurasi staging dengan produksi, tambah test konkurensi",
"Anggap bug yang hanya muncul di produksi tidak bisa direproduksi",
"Matikan 3 worker di produksi untuk selamanya agar sama dengan staging",
"Cukup tambahkan catatan bug di dokumentasi internal tim"
],
"en": [
"Align staging with production config, add concurrency tests",
"Assume bugs that only appear in production cannot be reproduced",
"Turn off 3 production workers permanently to match staging",
"Just add a bug note to the team's internal documentation"
]
},
"answer": 0,
"exp": {
"id": "Perbedaan environment (jumlah worker, zona waktu, replika database) adalah sumber umum bug produksi-saja. Menyamakan konfigurasi dan menguji konkurensi menutup celahnya.",
"en": "Environment differences (worker count, timezone, database replicas) are a common source of production-only bugs. Matching configuration and testing concurrency closes the gap."
}
},
{
"id": "gen-042",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Setelah bug lolos ke produksi, tindakan QA yang paling bernilai?",
"en": "After a bug escapes to production, which QA action is most valuable?"
},
"options": {
"id": [
"Telusuri mengapa lolos, lalu tambah test atau perbaiki proses",
"Mencari tahu siapa yang paling pantas disalahkan atas bug itu",
"Menutup tiket tanpa menambahkan test baru apa pun",
"Menunggu sampai customer melaporkan masalah yang sama lagi"
],
"en": [
"Trace why it was not caught, then add a test or fix the process",
"Find out who is most deserving of blame for the bug",
"Close the ticket without adding any new test whatsoever",
"Wait until customers report the very same problem again"
]
},
"answer": 0,
"exp": {
"id": "RCA yang sehat berfokus pada sistem: celah deteksi apa yang ada? Hasilnya diubah menjadi regression test atau perubahan proses. Mencari kambing hitam merusak budaya reporting.",
"en": "A healthy RCA focuses on the system: what detection gap existed? The result becomes a regression test or process change. Blaming individuals damages the culture of reporting."
}
},
{
"id": "gen-043",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Halaman daftar produk memakai pagination offset. Saat ada produk baru ditambahkan antara halaman 1 dan 2, user melihat produk yang sama dua kali. Cara menguji dan menyarankan perbaikan?",
"en": "A product list uses offset pagination. When a new product is added between page 1 and 2, users see the same product twice. How to test and what to suggest?"
},
"options": {
"id": [
"Sisipkan data antar permintaan halaman, sarankan keyset pagination",
"Anggap itu perilaku wajar dan tidak perlu diuji sama sekali",
"Perbesar ukuran halaman menjadi 10.000 baris per permintaan",
"Hapus fitur halaman berikutnya dari seluruh daftar produk"
],
"en": [
"Insert data between page requests, suggest keyset pagination",
"Treat it as normal behaviour that needs no testing at all",
"Raise the page size to 10,000 rows per request",
"Remove the next-page feature from every product list"
]
},
"answer": 0,
"exp": {
"id": "Offset bergeser saat data berubah sehingga baris terduplikasi atau terlewat. Keyset pagination memakai penanda terakhir dan urutan unik sehingga stabil. Uji juga urutan tanpa ORDER BY yang tidak deterministik.",
"en": "Offsets shift when data changes, so rows get duplicated or skipped. Keyset pagination uses the last-seen marker and a unique ordering, which is stable. Also test for non-deterministic ordering without ORDER BY."
}
},
{
"id": "gen-044",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Apa tujuan retest (confirmation testing) setelah bug diperbaiki?",
"en": "What is the purpose of a retest (confirmation test) after a bug fix?"
},
"options": {
"id": [
"Memastikan bug yang dilaporkan sudah benar-benar hilang",
"Memastikan fitur lain di aplikasi tidak ikut menjadi rusak",
"Mengukur performance aplikasi setelah perbaikan dilakukan",
"Menghitung jumlah baris kode yang berubah pada perbaikan"
],
"en": [
"Confirm the reported bug is truly gone",
"Confirm other features are not broken",
"Measure application performance",
"Count lines of code"
]
},
"answer": 0,
"exp": {
"id": "Retest mengulang skenario yang gagal. Memastikan fitur lain tidak rusak adalah tugas regression testing, yang berbeda.",
"en": "A retest repeats the failing scenario. Checking that other features are not broken is regression testing, which is different."
}
},
{
"id": "gen-045",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Kapan paling masuk akal membuat test otomatis dari sebuah skenario?",
"en": "When does it make most sense to automate a scenario?"
},
"options": {
"id": [
"Skenario stabil, berulang, berisiko tinggi, dan cepat dijalankan",
"Fitur baru yang antarmukanya masih berubah hampir setiap hari",
"Testing kegunaan yang butuh penilaian dari manusia sungguhan",
"Skenario khusus yang hanya akan dijalankan satu kali saja"
],
"en": [
"The scenario is stable, repeated, high-risk and quick to run",
"A new feature whose interface still changes almost every day",
"Usability testing that needs judgement from real human users",
"A special scenario that will only ever be run a single time"
]
},
"answer": 0,
"exp": {
"id": "Nilai otomasi datang dari pengulangan. UI yang sering berubah, penilaian manusia, dan skenario sekali pakai biaya perawatannya lebih besar daripada manfaatnya.",
"en": "Automation pays off through repetition. Fast-changing UI, human judgement and one-off scenarios cost more to maintain than they return."
}
},
{
"id": "gen-046",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Developer menolak bug Anda dengan alasan 'works on my machine'. Respons terbaik?",
"en": "A developer rejects your bug saying 'works on my machine'. Best response?"
},
"options": {
"id": [
"Beri langkah reproduksi, versi build, data, dan log, bandingkan environment",
"Tutup bug itu sendiri karena developer sudah menyatakan tidak bisa",
"Eskalasi langsung ke manajer tanpa menyertakan bukti pendukung",
"Turunkan severity menjadi rendah agar tiket cepat diselesaikan"
],
"en": [
"Give repro steps, build version, data and logs, compare environments",
"Close the bug yourself since the developer already said it cannot happen",
"Escalate straight to a manager without attaching supporting evidence",
"Lower the severity to low so the ticket gets resolved quickly"
]
},
"answer": 0,
"exp": {
"id": "Perbedaan environment atau data adalah penyebab umum. Bukti yang jelas dan perbandingan environment mengubah debat menjadi pemecahan masalah bersama.",
"en": "Environment or data differences are a common cause. Clear evidence and an environment comparison turn a debate into joint problem-solving."
}
},
{
"id": "gen-047",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa test case sebaiknya independen satu sama lain?",
"en": "Why should test cases be independent of each other?"
},
"options": {
"id": [
"Agar bisa jalan acak atau paralel dan failure mudah dilacak",
"Agar jumlah test case dalam laporan bertambah banyak",
"Agar tidak diperlukan test data sama sekali di seluruh suite",
"Agar test bisa dilewati begitu saja ketika tenggat mendekat"
],
"en": [
"So they run in any order or in parallel and failures trace easily",
"So the number of test cases in the report grows larger",
"So no test data is needed at all anywhere in the suite",
"So tests can simply be skipped whenever a deadline approaches"
]
},
"answer": 0,
"exp": {
"id": "Test yang bergantung pada hasil test lain rapuh: satu failure menjatuhkan rantai dan tidak bisa diparalelkan. Setiap test menyiapkan dan membersihkan datanya sendiri.",
"en": "Tests that rely on another test's result are brittle: one failure topples the chain and they cannot run in parallel. Each test sets up and cleans its own data."
}
},
{
"id": "gen-048",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Mana contoh kerentanan IDOR yang perlu diuji tester?",
"en": "Which is an example of an IDOR vulnerability a tester should check?"
},
"options": {
"id": [
"Mengganti id di /orders/123 jadi 124 dan melihat pesanan user lain",
"Password diwajibkan minimal 8 karakter saat pendaftaran akun",
"Halaman login sudah memakai HTTPS di seluruh domain",
"Tombol submit pada formulir tidak berwarna merah seperti desain"
],
"en": [
"Changing the id in /orders/123 to 124 and seeing another user's order",
"Passwords are required to be at least 8 characters at sign-up",
"The login page already uses HTTPS across the whole domain",
"The submit button on the form is not red as in the design"
]
},
"answer": 0,
"exp": {
"id": "IDOR (insecure direct object reference) terjadi saat server tidak memeriksa kepemilikan resource. Uji dengan token user A terhadap resource user B. Hasil yang benar 403 atau 404; trade-off: 404 tidak membocorkan bahwa resource itu ada, 403 lebih jelas bagi client yang sah.",
"en": "IDOR (insecure direct object reference) happens when the server does not check resource ownership. Test with user A's token against user B's resource. The correct result is 403 or 404; trade-off: 404 does not reveal the resource exists, 403 is clearer for legitimate clients."
}
},
{
"id": "gen-049",
"topic": "qa-general",
"level": 3,
"type": "mcq",
"q": {
"id": "Mana test untuk mendeteksi SQL injection yang paling tepat pada kolom pencarian?",
"en": "Which test best detects SQL injection on a search field?"
},
"options": {
"id": [
"Kirim ' OR '1'='1, lalu periksa hasil, error, atau waktu respons",
"Kirim 10 karakter huruf biasa lalu lihat hasil pencarian",
"Ubah ukuran jendela browser sambil melihat tampilan hasil",
"Tekan tombol cari dua kali berturut-turut dengan cepat"
],
"en": [
"Send ' OR '1'='1, then inspect results, errors or response time",
"Send 10 plain letters and then look at the search results",
"Resize the browser window while watching the results display",
"Press the search button twice in quick succession"
]
},
"answer": 0,
"exp": {
"id": "Payload khusus menguji apakah input digabung langsung ke query. Perbaikan yang benar adalah parameterized query, bukan hanya filter karakter. Uji dilakukan hanya pada sistem yang Anda berwenang menguji.",
"en": "Special payloads test whether input is concatenated into a query. The proper fix is parameterized queries, not just character filtering. Only test systems you are authorised to test."
}
},
{
"id": "gen-050",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa makna 'shift-left testing'?",
"en": "What does 'shift-left testing' mean?"
},
"options": {
"id": [
"Melibatkan testing sedini mungkin, mis. review requirement dan test API",
"Menunda seluruh kegiatan testing sampai setelah release produksi",
"Memindahkan semua test yang ada ke lapisan UI saja",
"Mengurangi jumlah tester agar biaya tim lebih rendah"
],
"en": [
"Involving testing as early as possible, e.g. requirement reviews and API tests",
"Postponing all testing activities until after the production release",
"Moving every existing test to the UI layer only",
"Cutting the number of testers so team costs are lower"
]
},
"answer": 0,
"exp": {
"id": "Defect yang ditemukan lebih awal jauh lebih murah diperbaiki. Shift-left tidak menghapus peran tester; ia memindahkan kegiatan kualitas ke hulu.",
"en": "Defects found earlier are far cheaper to fix. Shift-left does not remove testers; it moves quality activities upstream."
}
},
{
"id": "api-029",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Client mengirim POST /payments dua kali karena timeout dan customer tertagih ganda. Mekanisme yang mencegahnya?",
"en": "A client sends POST /payments twice after a timeout and the customer is charged twice. Which mechanism prevents this?"
},
"options": {
"id": [
"Idempotency key di header yang dicek oleh server",
"Mengganti method POST menjadi GET untuk endpoint pembayaran",
"Menambah timeout client menjadi 5 menit untuk semua request",
"Mengembalikan status 200 untuk setiap kasus pembayaran"
],
"en": [
"An idempotency key in a header that the server checks",
"Switching the POST method to GET for the payment endpoint",
"Raising the client timeout to 5 minutes for all requests",
"Returning status 200 for every payment case"
]
},
"answer": 0,
"exp": {
"id": "Server menyimpan hasil per key sehingga request ulang mengembalikan hasil yang sama tanpa menagih lagi. GET tidak boleh mengubah state, dan timeout besar tidak menyelesaikan retry.",
"en": "The server stores the result per key so a repeat returns the same outcome without charging again. GET must not change state, and a long timeout does not solve retries."
}
},
{
"id": "api-030",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Sebuah REST API mengembalikan 200 dengan body {\"error\":\"not found\"} untuk resource yang tidak ada. Temuan tester?",
"en": "A REST API returns 200 with body {\"error\":\"not found\"} for a missing resource. What is the tester's finding?"
},
"options": {
"id": [
"Status code menyesatkan; seharusnya 404 agar monitoring bereaksi",
"Tidak ada masalah, karena body respons sudah menjelaskan errornya",
"Seharusnya 500, karena resource yang diminta tidak ditemukan",
"Seharusnya 301, karena resource sudah dipindahkan ke tempat lain"
],
"en": [
"Misleading status code; it should be 404 so monitoring can react",
"No problem, because the response body already explains the error",
"It should be 500, because the requested resource was not found",
"It should be 301, because the resource was moved elsewhere"
]
},
"answer": 0,
"exp": {
"id": "Client, cache, dan alat monitoring bergantung pada status code. 500 berarti kesalahan server, bukan resource hilang; 301 untuk pemindahan permanen. Catatan konteks: pada GraphQL, 200 dengan array errors adalah konvensi yang wajar, jadi periksa dulu gaya API-nya.",
"en": "Clients, caches and monitoring depend on status codes. 500 means a server fault, not a missing resource; 301 is a permanent redirect. Context note: in GraphQL, 200 with an errors array is a normal convention, so check the API style first."
}
},
{
"id": "api-031",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Endpoint GET /users?page=2&limit=-5. Perilaku yang benar?",
"en": "Endpoint GET /users?page=2&limit=-5. What is the correct behaviour?"
},
"options": {
"id": [
"400 dengan pesan validasi yang jelas",
"500 karena terjadi error tak terduga di server",
"200 berisi seluruh data user tanpa batas",
"Server berhenti merespons sampai direstart"
],
"en": [
"400 with a clear validation message",
"500 because an unexpected error occurs on the server",
"200 containing all user data without any limit",
"The server stops responding until it is restarted"
]
},
"answer": 0,
"exp": {
"id": "Input tidak valid dari client adalah 400 (atau 422). Trade-off: sebagian API diam-diam memakai nilai bawaan (clamp), tetapi validasi eksplisit lebih jelas bagi client. Yang pasti salah adalah 500 atau membocorkan seluruh data.",
"en": "Invalid client input is a 400 (or 422). Trade-off: some APIs silently clamp to a default, but explicit validation is clearer for clients. What is definitely wrong is a 500 or leaking all data."
}
},
{
"id": "api-032",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Token JWT sudah kedaluwarsa tetapi tetap diterima API. Risikonya?",
"en": "An expired JWT is still accepted by the API. What is the risk?"
},
"options": {
"id": [
"Akses tak sah bertahan setelah sesi seharusnya berakhir",
"Respons API menjadi sedikit lebih lambat dari biasanya",
"Format JSON di body respons berubah secara tidak terduga",
"Tidak ada risiko, sebab format token masih tampak valid"
],
"en": [
"Unauthorised access persists after the session should have ended",
"API responses become a little slower than usual",
"The JSON format of the response body changes unexpectedly",
"No risk, since the token's format still looks valid"
]
},
"answer": 0,
"exp": {
"id": "Server wajib memeriksa klaim exp dan menolak dengan 401. Token curian jadi berguna selamanya bila expiry tidak ditegakkan.",
"en": "The server must validate the exp claim and reject with 401. A stolen token stays useful forever if expiry is not enforced."
}
},
{
"id": "api-033",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa beda PUT dan PATCH yang tepat?",
"en": "What is the correct difference between PUT and PATCH?"
},
"options": {
"id": [
"PUT mengganti seluruh resource; PATCH mengubah sebagian field",
"PUT hanya dipakai untuk membuat, PATCH hanya untuk menghapus",
"Keduanya identik dan bisa saling menggantikan di semua API",
"PATCH selalu idempotent sedangkan PUT tidak pernah idempotent"
],
"en": [
"PUT replaces the whole resource; PATCH changes some fields",
"PUT is only used to create, PATCH is only used to delete",
"Both are identical and can replace each other in every API",
"PATCH is always idempotent while PUT is never idempotent"
]
},
"answer": 0,
"exp": {
"id": "PUT idempotent karena mengganti penuh. PATCH bisa idempotent atau tidak tergantung desain (mis. 'tambah 1' tidak idempotent).",
"en": "PUT is idempotent because it replaces fully. PATCH may or may not be idempotent depending on design (e.g. 'add 1' is not)."
}
},
{
"id": "api-034",
"topic": "rest-api",
"level": 3,
"type": "mcq",
"q": {
"id": "Provider menghapus field 'phone' dari response. Consumer lama crash. Test yang paling cocok mencegahnya?",
"en": "A provider removes the 'phone' field from a response and an old consumer crashes. Which test best prevents this?"
},
"options": {
"id": [
"Contract test atau validasi schema OpenAPI di CI",
"Test warna dan posisi tombol di user interface",
"Load test dengan 1000 virtual user secara bersamaan",
"Test manual yang dijalankan sekali setahun oleh tim"
],
"en": [
"A contract test or OpenAPI schema validation in CI",
"A test of button colour and position in the user interface",
"A load test with 1000 virtual users running at the same time",
"A manual test run once a year by the team"
]
},
"answer": 0,
"exp": {
"id": "Menghapus atau mengubah tipe field adalah breaking change. Validasi schema/kontrak di pipeline menangkapnya sebelum release.",
"en": "Removing or retyping a field is a breaking change. Schema/contract validation in the pipeline catches it before release."
}
},
{
"id": "api-035",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Rate limit 100 request/menit. Tester mengirim 101. Hasil yang diharapkan?",
"en": "Rate limit is 100 requests/minute. The tester sends 101. Expected result?"
},
"options": {
"id": [
"429 Too Many Requests, idealnya dengan header Retry-After",
"403 Forbidden yang berlaku permanen bagi client tersebut",
"200 seperti biasa karena batas hanya bersifat anjuran",
"500 Internal Server Error karena server kewalahan"
],
"en": [
"429 Too Many Requests, ideally with a Retry-After header",
"A 403 Forbidden that applies permanently to that client",
"200 as usual because the limit is only a recommendation",
"500 Internal Server Error because the server is overwhelmed"
]
},
"answer": 0,
"exp": {
"id": "429 adalah kode standar untuk pembatasan laju. Uji juga bahwa kuota pulih setelah jendela waktu berlalu.",
"en": "429 is the standard code for rate limiting. Also test that the quota recovers after the time window passes."
}
},
{
"id": "sel-032",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Test Selenium sering gagal dengan StaleElementReferenceException setelah halaman memuat ulang sebagian. Perbaikan terbaik?",
"en": "A Selenium test often fails with StaleElementReferenceException after a partial page reload. Best fix?"
},
"options": {
"id": [
"Cari ulang elemen setelah DOM berubah, pakai explicit wait",
"Tambahkan Thread.sleep(10000) di setiap langkah test",
"Simpan elemen di variabel global selama seluruh test",
"Matikan JavaScript browser agar DOM tidak berubah"
],
"en": [
"Re-locate the element after the DOM change, use an explicit wait",
"Add Thread.sleep(10000) before every step in the test",
"Keep the element in a global variable throughout the test",
"Disable browser JavaScript so the DOM cannot change"
]
},
"answer": 0,
"exp": {
"id": "Stale berarti referensi menunjuk elemen yang sudah dilepas dari DOM. Locate ulang plus explicit wait menangani ini; sleep membuat test lambat dan tetap rapuh.",
"en": "Stale means the reference points to an element detached from the DOM. Re-locating plus an explicit wait handles it; sleep makes tests slow and still brittle."
}
},
{
"id": "sel-033",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa implicit wait dan explicit wait sebaiknya tidak dicampur?",
"en": "Why should implicit and explicit waits not be mixed?"
},
"options": {
"id": [
"Waktu tunggu bisa menumpuk dan sulit diprediksi saat debugging",
"Selenium melarangnya dengan error saat kompilasi kode",
"Explicit wait berhenti berfungsi sepenuhnya jika dicampur",
"Implicit wait hanya dirancang untuk testing mobile saja"
],
"en": [
"Wait times can stack up and become hard to predict when debugging",
"Selenium forbids it with an error at code compilation",
"Explicit waits stop working completely when they are mixed",
"Implicit waits are designed for mobile testing only"
]
},
"answer": 0,
"exp": {
"id": "Mencampurkan keduanya dapat menghasilkan waktu tunggu yang tak terduga. Pilih satu strategi, umumnya explicit wait pada kondisi spesifik.",
"en": "Mixing them can produce unpredictable timeouts. Pick one strategy, usually explicit waits on specific conditions."
}
},
{
"id": "sel-034",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Cara menjalankan test Selenium yang andal di banyak browser dan paralel di CI?",
"en": "How do you run Selenium tests reliably across browsers and in parallel in CI?"
},
"options": {
"id": [
"Selenium Grid atau layanan cloud, satu driver per thread",
"Satu driver global yang dipakai bersama oleh semua thread",
"Menjalankan hanya satu browser dalam sebulan sekali",
"Memakai akun user yang sama untuk semua test paralel"
],
"en": [
"Selenium Grid or a cloud service, one driver per thread",
"One global driver shared among all the threads",
"Running only a single browser once a month",
"Using the same user account for all parallel tests"
]
},
"answer": 0,
"exp": {
"id": "WebDriver tidak thread-safe untuk dibagi. Satu instance per thread/test plus test data terpisah membuat paralelisasi aman.",
"en": "A WebDriver is not safe to share across threads. One instance per thread/test plus separate test data makes parallelism safe."
}
},
{
"id": "sel-035",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Untuk apa Page Object Model?",
"en": "What is the Page Object Model for?"
},
"options": {
"id": [
"Memisahkan locator dan aksi halaman dari logika test",
"Membuat browser berjalan jauh lebih cepat dari biasanya",
"Menggantikan kebutuhan akan assertion di dalam test",
"Membuat laporan hasil test secara otomatis tiap run"
],
"en": [
"Separating page locators and actions from the test logic",
"Making the browser run much faster than it normally does",
"Replacing the need for assertions inside the tests",
"Generating the test result report automatically on each run"
]
},
"answer": 0,
"exp": {
"id": "Saat UI berubah, hanya page object yang diperbarui, bukan setiap test. Assertion tetap ada di test.",
"en": "When the UI changes only the page object is updated, not every test. Assertions stay in the test."
}
},
{
"id": "sql-017",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Beda INNER JOIN dan LEFT JOIN?",
"en": "What is the difference between INNER JOIN and LEFT JOIN?"
},
"options": {
"id": [
"INNER hanya baris yang cocok; LEFT menyertakan semua baris kiri",
"INNER mengambil semua baris dari kedua tabel; LEFT hanya satu baris",
"Tidak ada perbedaan; keduanya selalu memberi hasil yang sama",
"LEFT hanya bisa dipakai pada tabel yang sedang kosong"
],
"en": [
"INNER only matching rows; LEFT keeps all left-table rows",
"INNER takes all rows from both tables; LEFT takes only one row",
"No difference; both always give the same result",
"LEFT can only be used on tables that are currently empty"
]
},
"answer": 0,
"exp": {
"id": "LEFT JOIN mengisi NULL untuk sisi kanan yang tidak cocok. Berguna untuk mencari data yatim, mis. user tanpa pesanan.",
"en": "LEFT JOIN fills NULL for unmatched right-side rows. Useful for orphan checks, e.g. users without orders."
}
},
{
"id": "sql-018",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Query untuk menemukan email ganda di tabel users?",
"en": "Which query finds duplicate emails in the users table?"
},
"options": {
"id": [
"SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1",
"SELECT email FROM users WHERE COUNT(email) > 1 GROUP BY email",
"SELECT DISTINCT email, COUNT(*) FROM users ORDER BY email",
"SELECT email FROM users GROUP BY email ORDER BY email LIMIT 1"
],
"en": [
"SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1",
"SELECT email FROM users WHERE COUNT(email) > 1 GROUP BY email",
"SELECT DISTINCT email, COUNT(*) FROM users ORDER BY email",
"SELECT email FROM users GROUP BY email ORDER BY email LIMIT 1"
]
},
"answer": 0,
"exp": {
"id": "Filter pada hasil agregat harus memakai HAVING, bukan WHERE. DISTINCT justru menyembunyikan duplikat.",
"en": "Filtering on an aggregate result needs HAVING, not WHERE. DISTINCT actually hides duplicates."
}
},
{
"id": "sql-019",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Setelah transfer saldo, data A berkurang tetapi B tidak bertambah karena error di tengah proses. Properti ACID yang dilanggar?",
"en": "After a balance transfer, A is debited but B is not credited because of a mid-process error. Which ACID property is violated?"
},
"options": {
"id": [
"Atomicity",
"Isolation",
"Durability",
"Consistency tidak relevan di sini"
],
"en": [
"Atomicity",
"Isolation",
"Durability",
"Consistency is irrelevant here"
]
},
"answer": 0,
"exp": {
"id": "Atomicity menjamin transaksi berhasil seluruhnya atau dibatalkan seluruhnya (rollback). Kondisi setengah jadi menandakan transaksi tidak atomik; akibatnya total saldo juga tidak konsisten, tetapi pelanggaran yang menjadi sebab langsung adalah atomicity.",
"en": "Atomicity guarantees a transaction fully succeeds or fully rolls back. A half-done state means the transaction was not atomic; the totals end up inconsistent too, but the direct violation is atomicity."
}
},
{
"id": "sql-020",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa WHERE kolom = NULL tidak mengembalikan baris yang diharapkan?",
"en": "Why does WHERE column = NULL not return the expected rows?"
},
"options": {
"id": [
"NULL bukan nilai, jadi pakai IS NULL",
"Kolom itu wajib bertipe teks agar bisa dibandingkan",
"Database mengabaikan klausa WHERE untuk nilai kosong",
"NULL dianggap sama dengan string kosong oleh SQL"
],
"en": [
"NULL is not a value, so use IS NULL",
"The column must be of text type to be compared",
"The database ignores the WHERE clause for empty values",
"SQL treats NULL as equal to an empty string"
]
},
"answer": 0,
"exp": {
"id": "Perbandingan apa pun dengan NULL bernilai unknown, bukan true. Pakai IS NULL / IS NOT NULL.",
"en": "Any comparison with NULL yields unknown, not true. Use IS NULL / IS NOT NULL."
}
},
{
"id": "pw-017",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa keunggulan auto-waiting Playwright dibanding sleep manual?",
"en": "What advantage does Playwright auto-waiting have over manual sleeps?"
},
"options": {
"id": [
"Menunggu elemen siap (terlihat, stabil, aktif) lalu bertindak",
"Test boleh ditulis tanpa assertion sama sekali di mana pun",
"Elemen tersembunyi selalu diabaikan untuk selamanya oleh tool",
"Fitur ini hanya berfungsi di browser Chromium saja saat ini"
],
"en": [
"It waits until the element is ready (visible, stable, enabled)",
"Tests may be written without any assertions at all anywhere",
"Hidden elements are always ignored forever by the tool",
"This feature currently only works in the Chromium browser"
]
},
"answer": 0,
"exp": {
"id": "Actionability checks mengurangi flakiness tanpa jeda tetap. Assertion web-first (expect(locator)) juga mencoba ulang sampai batas waktu.",
"en": "Actionability checks reduce flakiness without fixed delays. Web-first assertions (expect(locator)) also retry until the timeout."
}
},
{
"id": "pw-018",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Pipeline CI gagal tetapi Anda tidak bisa mereproduksi lokal. Fitur Playwright yang paling membantu?",
"en": "A CI run fails but you cannot reproduce it locally. Which Playwright feature helps most?"
},
"options": {
"id": [
"Trace viewer: snapshot DOM, jaringan, dan log per langkah",
"console.log yang dipasang di setiap baris kode test",
"Menaikkan jumlah workers sampai 100 sekaligus di CI",
"Menghapus test yang gagal agar pipeline kembali hijau"
],
"en": [
"Trace viewer with DOM snapshots, network and logs per step",
"console.log statements placed on every line of test code",
"Raising the number of workers up to 100 at once",
"Deleting the failing test so the pipeline goes green"
]
},
"answer": 0,
"exp": {
"id": "Trace menyimpan jejak langkah per aksi sehingga failure di CI bisa diputar ulang secara visual.",
"en": "A trace records every step so a CI failure can be replayed visually."
}
},
{
"id": "cy-016",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa cy.intercept berguna untuk menguji failure backend?",
"en": "Why is cy.intercept useful for testing backend failures?"
},
"options": {
"id": [
"Menyubstitusi respons (mis. 500) tanpa merusak backend",
"Mengubah kode server secara permanen di test environment",
"Menggantikan peran browser selama test berjalan di CI",
"Hanya dipakai untuk mencatat cookie milik user"
],
"en": [
"Stubbing responses (e.g. 500 or slow) without breaking the backend",
"Permanently changing the server code in the test environment",
"Replacing the role of the browser while the test runs",
"It is only used to record the user's cookies"
]
},
"answer": 0,
"exp": {
"id": "Dengan intercept, UI diuji pada kondisi error, kosong, atau lambat secara deterministik.",
"en": "With intercept, the UI is tested under error, empty or slow conditions deterministically."
}
},
{
"id": "int-013",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda menangani flaky test di pipeline?",
"en": "How do you handle flaky tests in a pipeline?"
},
"model": {
"id": "Ukur dulu: catat pola gagal/lulus dari banyak run, karantina test yang flaky agar tidak memblokir pipeline, lalu cari root cause (race condition, data bersama, environment, timing). Retry hanya sementara, bukan solusi; perbaiki dan kembalikan test ke suite.",
"en": "Measure first: track pass/fail patterns over many runs, quarantine flaky tests so they do not block the pipeline, then find the root cause (race condition, shared data, environment, timing). Retries are temporary, not a fix; repair and return the test to the suite."
},
"keywords": [
[
"karantina",
"quarantine",
"isolasi"
],
[
"root cause",
"akar",
"penyebab"
],
[
"retry",
"ulang"
],
[
"pola",
"pattern",
"ukur",
"measure",
"track"
]
],
"pass": 0.6
},
{
"id": "int-014",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda merancang strategi test untuk fitur checkout baru?",
"en": "How would you design a test strategy for a new checkout feature?"
},
"model": {
"id": "Mulai dari risiko dan requirement: alur utama (keranjang, pembayaran, konfirmasi), negative path, nilai batas, pembayaran ganda/idempotency, konkurensi stok, security, dan integrasi payment. Bagi ke lapisan: unit, API, sedikit E2E; tentukan test data, environment, dan kriteria keluar.",
"en": "Start from risk and requirements: main flow (cart, payment, confirmation), negative paths, boundaries, double payment/idempotency, stock concurrency, security and payment integration. Split across layers: unit, API, a few E2E; define test data, environment and exit criteria."
},
"keywords": [
[
"risiko",
"risk"
],
[
"negative",
"batas",
"boundary",
"edge"
],
[
"api",
"unit",
"e2e",
"layer",
"lapisan"
],
[
"data",
"environment",
"exit criteria",
"kriteria"
]
],
"pass": 0.6
},
{
"id": "int-015",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda menguji API tanpa dokumentasi lengkap?",
"en": "How do you test an API with incomplete documentation?"
},
"model": {
"id": "Eksplorasi: baca kode/Swagger bila ada, tanya developer, amati trafik client (dev tools/proxy), lalu uji metode, status code, validasi, auth, dan format error. Catat temuan sebagai dokumentasi dan usulkan kontrak/OpenAPI.",
"en": "Explore: read code/Swagger if available, ask developers, observe client traffic (dev tools/proxy), then test methods, status codes, validation, auth and error format. Record findings as documentation and propose a contract/OpenAPI."
},
"keywords": [
[
"eksplorasi",
"explor",
"amati",
"observe"
],
[
"status",
"validasi",
"validation",
"auth"
],
[
"tanya",
"ask",
"developer"
],
[
"openapi",
"kontrak",
"contract",
"dokumentasi",
"documentation"
]
],
"pass": 0.6
},
{
"id": "int-016",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Apa yang Anda lakukan jika menemukan bug kritis sehari sebelum release?",
"en": "What do you do if you find a critical bug a day before release?"
},
"model": {
"id": "Reproduksi dan kumpulkan bukti, nilai dampak dan frekuensi, beri tahu developer dan product owner segera, bantu ukur opsi (perbaiki, workaround, tunda, feature flag), dan biarkan keputusan go/no-go dibuat stakeholder berdasarkan risiko. Setelah itu tambahkan regression test.",
"en": "Reproduce and gather evidence, assess impact and frequency, notify the developer and product owner immediately, help weigh options (fix, workaround, delay, feature flag), and let stakeholders make the go/no-go call based on risk. Afterwards add a regression test."
},
"keywords": [
[
"reproduksi",
"reproduce",
"bukti",
"evidence"
],
[
"dampak",
"impact",
"risiko",
"risk"
],
[
"go/no-go",
"stakeholder",
"product owner"
],
[
"regression",
"regresi",
"workaround",
"feature flag"
]
],
"pass": 0.6
},
{
"id": "int-017",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Jelaskan perbedaan QA, QC, dan testing dengan contoh singkat.",
"en": "Explain the difference between QA, QC and testing with a short example."
},
"model": {
"id": "QA preventif dan berorientasi proses (mis. code review, standar, definition of done). QC berorientasi produk untuk mendeteksi defect. Testing adalah salah satu kegiatan QC: menjalankan atau memeriksa produk untuk menemukan defect dan menilai kualitas.",
"en": "QA is preventive and process-oriented (e.g. code review, standards, definition of done). QC is product-oriented, detecting defects. Testing is one QC activity: running or inspecting the product to find defects and assess quality."
},
"keywords": [
[
"preventif",
"preventive",
"proses",
"process"
],
[
"produk",
"product",
"deteksi",
"detect"
],
[
"testing"
],
[
"contoh",
"example",
"review",
"definition of done"
]
],
"pass": 0.6
},
{
"id": "int-018",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Di mana AI membantu pekerjaan QA, dan apa batasnya?",
"en": "Where does AI help in QA, and what are its limits?"
},
"model": {
"id": "AI membantu menyusun test case, test data, ringkasan log, dan menulis boilerplate otomasi. Batasnya: bisa salah atau mengarang, tidak paham konteks bisnis, dan berisiko membocorkan data bila prompt memuat informasi rahasia. Hasilnya harus ditinjau manusia dan diverifikasi dengan eksekusi nyata.",
"en": "AI helps draft test cases, test data, log summaries and automation boilerplate. Limits: it can be wrong or invent things, lacks business context, and risks leaking data if prompts contain confidential information. Output must be reviewed by a human and verified by real execution."
},
"keywords": [
[
"test case",
"data uji",
"test data",
"boilerplate",
"log"
],
[
"salah",
"wrong",
"halusinasi",
"hallucinat",
"mengarang"
],
[
"rahasia",
"confidential",
"data",
"privasi",
"privacy"
],
[
"tinjau",
"review",
"verifikasi",
"verify",
"manusia",
"human"
]
],
"pass": 0.6
},
{
"id": "code-001",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa keluaran kode JavaScript ini?",
"en": "What does this JavaScript print?"
},
"code": "console.log([1, 2, 3].map(parseInt));",
"options": {
"id": [
"[1, NaN, NaN]",
"[1, 2, 3]",
"[0, 1, 2]",
"[1, 2, NaN]"
],
"en": [
"[1, NaN, NaN]",
"[1, 2, 3]",
"[0, 1, 2]",
"[1, 2, NaN]"
]
},
"answer": 0,
"exp": {
"id": "map memberi parseInt tiga argumen (nilai, indeks, array). Indeks dipakai sebagai radix: parseInt(2, 1) dan parseInt(3, 2) menghasilkan NaN. Pakai map(Number) atau map(x => parseInt(x, 10)).",
"en": "map passes parseInt three arguments (value, index, array). The index is used as the radix: parseInt(2, 1) and parseInt(3, 2) give NaN. Use map(Number) or map(x => parseInt(x, 10))."
}
},
{
"id": "code-002",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa assertion ini sebaiknya tidak ditulis seperti itu?",
"en": "Why should this assertion not be written this way?"
},
"code": "const total = 0.1 + 0.2;\nexpect(total).toBe(0.3);   // gagal",
"options": {
"id": [
"Pecahan biner tidak tepat; pakai toBeCloseTo atau satuan bulat",
"toBe hanya bisa dipakai untuk membandingkan string saja",
"0.1 + 0.2 selalu persis 0.3, jadi tes ini salah ketik",
"JavaScript tidak mendukung bilangan desimal sama sekali"
],
"en": [
"Binary fractions are inexact; use toBeCloseTo or integer units",
"toBe can only be used for comparing strings and nothing else",
"0.1 + 0.2 is always exactly 0.3, so this test has a typo",
"JavaScript does not support decimal numbers at all"
]
},
"answer": 0,
"exp": {
"id": "0.1 + 0.2 bernilai 0.30000000000000004. Untuk uang, simpan dalam satuan terkecil (sen) sebagai bilangan bulat; untuk perbandingan lain gunakan toleransi.",
"en": "0.1 + 0.2 is 0.30000000000000004. For money, store the smallest unit (cents) as integers; for other comparisons use a tolerance."
}
},
{
"id": "code-003",
"topic": "coding",
"level": 3,
"type": "mcq",
"q": {
"id": "Apa keluaran kode ini?",
"en": "What does this print?"
},
"code": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
"options": {
"id": [
"3 3 3",
"0 1 2",
"2 2 2",
"0 0 0"
],
"en": [
"3 3 3",
"0 1 2",
"2 2 2",
"0 0 0"
]
},
"answer": 0,
"exp": {
"id": "var berlingkup fungsi sehingga ketiga callback berbagi satu i yang sudah bernilai 3 saat callback berjalan. Dengan let, tiap iterasi punya salinan sendiri dan hasilnya 0 1 2.",
"en": "var is function-scoped, so all three callbacks share one i that is already 3 when they run. With let, each iteration has its own copy and the output is 0 1 2."
}
},
{
"id": "code-004",
"topic": "coding",
"level": 3,
"type": "mcq",
"q": {
"id": "Urutan keluaran kode ini?",
"en": "What is the output order?"
},
"code": "console.log('A');\nsetTimeout(() => console.log('B'));\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
"options": {
"id": [
"A D C B",
"A B C D",
"A C D B",
"A D B C"
],
"en": [
"A D C B",
"A B C D",
"A C D B",
"A D B C"
]
},
"answer": 0,
"exp": {
"id": "Kode sinkron jalan dulu (A, D). Callback promise (microtask) berjalan sebelum setTimeout (macrotask), sehingga C lalu B.",
"en": "Synchronous code runs first (A, D). Promise callbacks (microtasks) run before setTimeout (macrotasks), so C then B."
}
},
{
"id": "code-005",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa masalah pada kode test Playwright ini?",
"en": "What is wrong with this Playwright test?"
},
"code": "test('login', async ({ page }) => {\n  page.goto('/login');\n  await page.fill('#email', 'a@b.c');\n  await page.click('#submit');\n});",
"options": {
"id": [
"goto tidak di-await, langkah berikutnya jalan lebih dulu",
"fill tidak boleh dipakai pada elemen input teks",
"fungsi test tidak boleh dideklarasikan sebagai async",
"click wajib dipanggil lebih dulu daripada fill"
],
"en": [
"goto is not awaited, so later steps run too early",
"fill must not be used on plain text input elements",
"a test function must not be declared as async",
"click is required to be called before fill happens"
]
},
"answer": 0,
"exp": {
"id": "Promise yang tidak di-await membuat test berlanjut tanpa menunggu dan menghasilkan flaky test atau unhandled rejection. Aktifkan lint rule no-floating-promises.",
"en": "An un-awaited promise lets the test continue without waiting, causing flakiness or unhandled rejections. Enable the no-floating-promises lint rule."
}
},
{
"id": "code-006",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa test Selenium (Python) ini flaky?",
"en": "Why is this Selenium (Python) test flaky?"
},
"code": "driver.find_element(By.ID, 'save').click()\nassert driver.find_element(By.ID, 'msg').text == 'Saved'",
"options": {
"id": [
"Teks dibaca tepat setelah klik tanpa jeda; pakai explicit wait",
"find_element tidak bisa dipanggil dua kali berturut-turut",
"assert tidak berfungsi untuk membandingkan teks string",
"By.ID sudah tidak didukung lagi di Selenium 4 ke atas"
],
"en": [
"Text is read right after the click, no wait; use an explicit wait",
"find_element cannot be called twice in a row in a single test",
"assert does not work for comparing text strings of any kind",
"By.ID is no longer supported in Selenium 4 or later versions"
]
},
"answer": 0,
"exp": {
"id": "Pesan muncul setelah request selesai. Gunakan WebDriverWait dengan expected_conditions, mis. text_to_be_present_in_element, bukan sleep.",
"en": "The message appears after a request finishes. Use WebDriverWait with expected_conditions, e.g. text_to_be_present_in_element, not sleep."
}
},
{
"id": "code-007",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Test API ini tidak pernah gagal bahkan saat status 500. Mengapa?",
"en": "This API test never fails even on a 500. Why?"
},
"code": "def test_create_user():\n    r = client.post('/users', json=payload)\n    assert r.status_code == 200 or 201",
"options": {
"id": [
"'or 201' selalu truthy; pakai status_code in (200, 201)",
"client.post tidak mengembalikan atribut status_code",
"assert hanya akan memeriksa kode HTTP berawalan 2xx",
"payload tidak pernah dikirim ke endpoint tersebut"
],
"en": [
"'or 201' is always truthy; use status_code in (200, 201)",
"client.post does not return a status_code attribute",
"assert only ever checks HTTP codes that start with 2xx",
"the payload is never actually sent to that endpoint"
]
},
"answer": 0,
"exp": {
"id": "Python membaca (status_code == 200) or 201; angka 201 selalu truthy. Ini kesalahan klasik yang membuat test hijau palsu.",
"en": "Python reads (status_code == 200) or 201; the number 201 is always truthy. A classic mistake that creates false-green tests."
}
},
{
"id": "code-008",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa keluaran kode Python ini?",
"en": "What does this Python print?"
},
"code": "def add(x, items=[]):\n    items.append(x)\n    return items\n\nadd(1)\nprint(add(2))",
"options": {
"id": [
"[1, 2]",
"[2]",
"[1]",
"[]"
],
"en": [
"[1, 2]",
"[2]",
"[1]",
"[]"
]
},
"answer": 0,
"exp": {
"id": "Nilai default dibuat sekali saat fungsi didefinisikan sehingga list dipakai bersama antar pemanggilan. Pakai items=None lalu buat list baru di dalam fungsi. Efek serupa bisa membuat test saling bergantung.",
"en": "The default is created once at definition time, so the list is shared across calls. Use items=None and create a new list inside. A similar effect can make tests depend on each other."
}
},
{
"id": "code-009",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa keluaran kode Python ini?",
"en": "What does this Python print?"
},
"code": "print(10 // 3, -10 // 3, 10 % 3)",
"options": {
"id": [
"3 -4 1",
"3 -3 1",
"3 -4 -1",
"3.33 -3.33 1"
],
"en": [
"3 -4 1",
"3 -3 1",
"3 -4 -1",
"3.33 -3.33 1"
]
},
"answer": 0,
"exp": {
"id": "// adalah pembagian lantai: -10 // 3 = -4 (dibulatkan ke bawah, bukan ke nol). 10 % 3 = 1.",
"en": "// is floor division: -10 // 3 = -4 (rounded down, not toward zero). 10 % 3 = 1."
}
},
{
"id": "code-010",
"topic": "coding",
"level": 3,
"type": "mcq",
"q": {
"id": "Apa keluaran kode Python ini?",
"en": "What does this Python print?"
},
"code": "print(round(2.5), round(3.5))",
"options": {
"id": [
"2 4",
"3 4",
"2 3",
"3 3"
],
"en": [
"2 4",
"3 4",
"2 3",
"3 3"
]
},
"answer": 0,
"exp": {
"id": "Python 3 memakai pembulatan ke genap terdekat (banker's rounding) untuk nilai .5. Penting saat memverifikasi perhitungan uang atau persentase.",
"en": "Python 3 rounds .5 values to the nearest even number (banker's rounding). Important when verifying money or percentage calculations."
}
},
{
"id": "code-011",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Berapa panjang a setelah kode ini dijalankan?",
"en": "What is the length of a after this runs?"
},
"code": "a = [1, 2, 3]\nb = a[:]\nb.append(4)\nprint(len(a))",
"options": {
"id": [
"3",
"4",
"7",
"Error"
],
"en": [
"3",
"4",
"7",
"Error"
]
},
"answer": 0,
"exp": {
"id": "a[:] membuat salinan dangkal sehingga menambah elemen ke b tidak mengubah a. Bila b = a, panjang a menjadi 4 karena keduanya menunjuk list yang sama.",
"en": "a[:] makes a shallow copy so appending to b does not change a. With b = a the length would be 4 because both names point to the same list."
}
},
{
"id": "code-012",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa hasil query ini?",
"en": "What does this query return?"
},
"code": "-- users: 5 baris, 2 di antaranya email = NULL\nSELECT COUNT(*), COUNT(email) FROM users;",
"options": {
"id": [
"5 dan 3",
"5 dan 5",
"3 dan 3",
"3 dan 5"
],
"en": [
"5 dan 3",
"5 dan 5",
"3 dan 3",
"3 dan 5"
]
},
"answer": 0,
"exp": {
"id": "COUNT(*) menghitung semua baris; COUNT(kolom) melewati NULL. Berguna untuk memeriksa kelengkapan data.",
"en": "COUNT(*) counts all rows; COUNT(column) skips NULLs. Useful for checking data completeness."
}
},
{
"id": "code-013",
"topic": "coding",
"level": 3,
"type": "mcq",
"q": {
"id": "User u2 dan u3 tidak muncul di hasil. Mengapa?",
"en": "Users u2 and u3 are missing from the result. Why?"
},
"code": "-- users: u1,u2,u3; orders: (o1,u1,'paid'), (o2,u1,'cancelled')\nSELECT u.id, COUNT(o.id)\nFROM users u LEFT JOIN orders o ON o.user_id = u.id\nWHERE o.status = 'paid'\nGROUP BY u.id;",
"options": {
"id": [
"WHERE di tabel kanan membuang NULL, LEFT JOIN jadi seperti INNER",
"LEFT JOIN memang selalu menghapus user tanpa pesanan",
"GROUP BY tidak boleh dipakai bersama fungsi COUNT",
"Status 'paid' sama sekali tidak ada di tabel orders"
],
"en": [
"WHERE on the right table drops NULLs, so LEFT JOIN acts like INNER",
"LEFT JOIN always removes users that have no orders at all",
"GROUP BY must not be used together with the COUNT function",
"The 'paid' status does not exist in the orders table at all"
]
},
"answer": 0,
"exp": {
"id": "Untuk u2 dan u3, o.status bernilai NULL sehingga ditolak oleh WHERE. Pindahkan syaratnya ke ON (AND o.status = 'paid') agar semua user tetap tampil dengan hitungan 0.",
"en": "For u2 and u3, o.status is NULL and is rejected by WHERE. Move the condition into ON (AND o.status = 'paid') so every user stays with a count of 0."
}
},
{
"id": "code-014",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa test ini rapuh dan bagaimana memperbaikinya?",
"en": "Why is this test brittle and how do you fix it?"
},
"code": "const r = await api.get('/products');\nexpect(r.body.items).toEqual(['pen', 'book', 'bag']);",
"options": {
"id": [
"Bergantung pada urutan dan isi data; siapkan data sendiri",
"toEqual tidak mampu membandingkan array sama sekali",
"await tidak boleh dipakai pada permintaan GET biasa",
"items seharusnya berupa objek, bukan sebuah array"
],
"en": [
"It depends on data order and content; seed own data",
"toEqual is not able to compare arrays at all",
"await must not be used on a plain GET request",
"items should be an object rather than an array"
]
},
"answer": 0,
"exp": {
"id": "Mengandalkan data bersama atau urutan yang tidak dijamin membuat test gagal acak. Buat test data di dalam test atau pakai pencocokan yang tidak peka urutan.",
"en": "Relying on shared data or unguaranteed order makes tests fail randomly. Create test data inside the test or use order-insensitive matching."
}
},
{
"id": "code-015",
"topic": "coding",
"level": 2,
"type": "mcq",
"q": {
"id": "Hasil dari regex ini?",
"en": "What does this regex return?"
},
"code": "import re\nprint(re.findall(r'\\d+', 'order 123 and 45'))",
"options": {
"id": [
"['123', '45']",
"['1', '2', '3', '4', '5']",
"['123 and 45']",
"[123, 45]"
],
"en": [
"['123', '45']",
"['1', '2', '3', '4', '5']",
"['123 and 45']",
"[123, 45]"
]
},
"answer": 0,
"exp": {
"id": "\\d+ mencocokkan satu atau lebih digit berurutan, dan findall mengembalikan list string. Berguna untuk mengambil ID dari log.",
"en": "\\d+ matches one or more consecutive digits and findall returns a list of strings. Useful for extracting IDs from logs."
}
},
{
"id": "code-016",
"topic": "coding",
"level": 3,
"type": "mcq",
"q": {
"id": "Berapa hasil kode ini dan apa fungsinya?",
"en": "What does this return and what is it for?"
},
"code": "lines = ['INFO start', 'ERROR db', 'WARN slow', 'ERROR timeout']\nprint(sum(1 for l in lines if 'ERROR' in l))",
"options": {
"id": [
"2, menghitung baris log berlevel ERROR",
"4, menghitung semua baris",
"0, karena sum tidak menerima generator",
"1, hanya baris ERROR pertama"
],
"en": [
"2, counting log lines at ERROR level",
"4, counting all lines",
"0, because sum does not accept generators",
"1, only the first ERROR line"
]
},
"answer": 0,
"exp": {
"id": "Generator menghasilkan 1 untuk tiap baris yang memuat ERROR lalu dijumlahkan. Pola ini sering dipakai untuk menganalisis log hasil test.",
"en": "The generator yields 1 for each line containing ERROR, then sums them. This pattern is common when analysing test logs."
}
},
{
"id": "code-017",
"topic": "coding",
"level": 3,
"type": "mcq",
"q": {
"id": "Mengapa JavaScript mencetak 'undefined' pada kode ini?",
"en": "Why does JavaScript print 'undefined' here?"
},
"code": "async function getUser() { return { id: 1 }; }\nconst u = getUser();\nconsole.log(u.id);",
"options": {
"id": [
"getUser mengembalikan Promise; perlu await untuk membacanya",
"Properti id memang tidak ada pada objek yang dikembalikan",
"Fungsi async dilarang mengembalikan nilai berupa objek",
"console.log tidak mampu mencetak nilai berupa angka"
],
"en": [
"getUser returns a Promise; it needs await to be read",
"The id property does not exist on the returned object",
"An async function is forbidden from returning an object",
"console.log is not able to print a numeric value"
]
},
"answer": 0,
"exp": {
"id": "Fungsi async selalu mengembalikan Promise. Tanpa await, u.id dibaca dari Promise (undefined). Lupa await adalah penyebab umum test otomasi aneh.",
"en": "An async function always returns a Promise. Without await, u.id is read from the Promise (undefined). A forgotten await is a common cause of odd automation tests."
}
},
{
"id": "code-018",
"topic": "coding",
"level": 2,
"type": "short",
"q": {
"id": "Tulis (atau jelaskan) cara menemukan elemen duplikat dalam sebuah list dan kompleksitasnya.",
"en": "Write (or explain) how to find duplicate elements in a list, and its complexity."
},
"model": {
"id": "Telusuri list sekali sambil menyimpan elemen yang sudah terlihat di set atau dictionary. Bila elemen sudah ada di set, itu duplikat. Waktu O(n) dengan memori tambahan O(n); membandingkan semua pasangan O(n^2). Bahas juga kasus list kosong dan tipe data campuran.",
"en": "Walk the list once while storing seen elements in a set or dictionary. If an element is already in the set it is a duplicate. Time O(n) with O(n) extra memory; comparing all pairs is O(n^2). Also mention the empty list and mixed types."
},
"keywords": [
[
"set",
"dictionary",
"hash",
"dict"
],
[
"o(n)",
"linear",
"sekali",
"once"
],
[
"duplikat",
"duplicate"
],
[
"kosong",
"empty",
"kasus",
"edge",
"memori",
"memory"
]
],
"pass": 0.6
},
{
"id": "code-019",
"topic": "coding",
"level": 3,
"type": "short",
"q": {
"id": "Bagaimana memeriksa apakah tanda kurung dalam sebuah string seimbang, misalnya \"{[()]}\"?",
"en": "How do you check whether brackets in a string are balanced, e.g. \"{[()]}\"?"
},
"model": {
"id": "Pakai stack: dorong kurung buka; tiap kurung tutup harus cocok dengan puncak stack lalu pop. Di akhir stack harus kosong. Test case: string kosong, hanya kurung tutup, urutan salah seperti \"([)]\", dan kurung tidak berpasangan. Kompleksitas O(n).",
"en": "Use a stack: push opening brackets; each closing bracket must match the top of the stack, then pop. At the end the stack must be empty. Test cases: empty string, only closing bracket, wrong order like \"([)]\", unmatched brackets. Complexity O(n)."
},
"keywords": [
[
"stack",
"tumpukan"
],
[
"push",
"pop",
"dorong",
"buka",
"open"
],
[
"kosong",
"empty",
"akhir",
"end"
],
[
"kasus",
"case",
"uji",
"test",
"edge",
"o(n)"
]
],
"pass": 0.6
},
{
"id": "code-020",
"topic": "coding",
"level": 2,
"type": "short",
"q": {
"id": "Anda diberi file log besar. Bagaimana menghitung jumlah error per jenis dengan script?",
"en": "You are given a large log file. How would you script counting errors by type?"
},
"model": {
"id": "Baca file baris demi baris (streaming) agar tidak memuat semuanya ke memori, ekstrak level atau kode error dengan split atau regex, lalu hitung dengan dictionary atau Counter. Tampilkan urutan terbanyak dan tangani baris yang formatnya rusak.",
"en": "Read the file line by line (streaming) so it is not loaded into memory, extract the level or error code with split or regex, then count with a dictionary or Counter. Show the most frequent first and handle malformed lines."
},
"keywords": [
[
"baris",
"line",
"stream"
],
[
"regex",
"split",
"ekstrak",
"extract",
"parse"
],
[
"dictionary",
"counter",
"hitung",
"count"
],
[
"rusak",
"malformed",
"memori",
"memory",
"urut",
"sort"
]
],
"pass": 0.6
},
{
"id": "pw-007",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Locator mana yang paling dianjurkan Playwright untuk tombol \"Masuk\"?",
"en": "Which locator does Playwright recommend most for a \"Sign in\" button?"
},
"options": {
"id": [
"page.getByRole('button', { name: 'Masuk' })",
"page.locator('div > div:nth-child(3) > button')",
"page.locator('.btn.btn-primary.mt-4')",
"page.locator('xpath=/html/body/div[2]/button')"
],
"en": [
"page.getByRole('button', { name: 'Masuk' })",
"page.locator('div > div:nth-child(3) > button')",
"page.locator('.btn.btn-primary.mt-4')",
"page.locator('xpath=/html/body/div[2]/button')"
]
},
"answer": 0,
"exp": {
"id": "getByRole mencerminkan cara user dan teknologi bantu melihat halaman, sehingga tahan terhadap perubahan struktur DOM atau class CSS. Ketiga lainnya bergantung pada struktur atau styling yang mudah berubah.",
"en": "getByRole mirrors how users and assistive technology see the page, so it survives DOM or CSS class changes. The others depend on structure or styling that changes easily."
}
},
{
"id": "pw-008",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Mana assertion yang memakai mekanisme retry otomatis (web-first assertion)?",
"en": "Which assertion uses automatic retrying (a web-first assertion)?"
},
"options": {
"id": [
"expect(await locator.isVisible()).toBe(true)",
"await expect(locator).toBeVisible()",
"expect(await locator.textContent()).toBeTruthy()",
"if (await locator.count() > 0) { /* lanjut */ }"
],
"en": [
"expect(await locator.isVisible()).toBe(true)",
"await expect(locator).toBeVisible()",
"expect(await locator.textContent()).toBeTruthy()",
"if (await locator.count() > 0) { /* continue */ }"
]
},
"answer": 1,
"exp": {
"id": "expect(locator) mengulang pemeriksaan sampai terpenuhi atau timeout. Pola lain membaca nilai sekali lalu membandingkannya, sehingga rawan flaky bila UI belum siap.",
"en": "expect(locator) re-checks until the condition holds or times out. The other patterns read a value once and compare it, which is flaky when the UI is not ready yet."
}
},
{
"id": "pw-009",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa test Playwright dijalankan di browser context yang baru per test?",
"en": "Why does Playwright run each test in a fresh browser context?"
},
"options": {
"id": [
"Context baru mengunduh ulang seluruh browser sehingga hasilnya lebih akurat",
"Context memberi isolasi seperti profil browser bersih (cookie, storage) dengan biaya kecil",
"Context diperlukan supaya test bisa berjalan di lebih dari satu bahasa pemrograman",
"Context membuat test otomatis lulus walaupun aplikasi sedang bermasalah"
],
"en": [
"A fresh context downloads the whole browser again so results are more accurate",
"A context gives clean-profile isolation (cookies, storage) at low cost",
"A context is needed so tests can run in more than one programming language",
"A context makes tests pass automatically even when the app has problems"
]
},
"answer": 1,
"exp": {
"id": "Context itu ringan dan terisolasi, jadi test tidak saling mewariskan state tanpa harus membuka browser baru. Ia tidak mengunduh browser dan tidak memengaruhi hasil lulus atau gagal.",
"en": "A context is lightweight and isolated, so tests do not inherit each other's state without launching a new browser. It does not download browsers or influence pass/fail results."
}
},
{
"id": "pw-010",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Bagaimana cara menghindari login lewat UI di setiap test Playwright?",
"en": "How do you avoid logging in through the UI in every Playwright test?"
},
"options": {
"id": [
"Login sekali, simpan storageState, lalu pakai ulang di context test lain",
"Menaruh password di URL halaman supaya otomatis masuk",
"Menjalankan seluruh test dalam satu test panjang tanpa pemisahan",
"Menonaktifkan autentikasi di aplikasi selama semua test berjalan"
],
"en": [
"Log in once, save the storageState and reuse it in other test contexts",
"Putting the password in the page URL so you are signed in automatically",
"Running all checks inside one very long test with no separation",
"Turning authentication off in the app while every test runs"
]
},
"answer": 0,
"exp": {
"id": "storageState menyimpan cookie dan local storage hasil login sehingga test berikutnya langsung berstatus masuk, cepat dan tetap terisolasi. Opsi lain tidak aman atau merusak independensi test.",
"en": "storageState keeps the login cookies and local storage so later tests start signed in, fast and still isolated. The other options are unsafe or break test independence."
}
},
{
"id": "pw-011",
"topic": "playwright",
"level": 3,
"type": "mcq",
"q": {
"id": "Anda ingin menguji tampilan error saat API mengembalikan 500 tanpa mengubah backend. Apa yang dipakai?",
"en": "You want to test the UI error state when the API returns 500 without changing the backend. What do you use?"
},
"options": {
"id": [
"page.route() untuk mencegat request dan memberi respons 500 palsu",
"page.pause() agar Anda mematikan server secara manual",
"page.setViewportSize() untuk mengubah ukuran layar",
"test.skip() supaya skenario error tidak perlu diuji"
],
"en": [
"page.route() to intercept the request and fulfil it with a fake 500 response",
"page.pause() so you switch the server off by hand",
"page.setViewportSize() to change the screen size",
"test.skip() so the error scenario need not be tested"
]
},
"answer": 0,
"exp": {
"id": "page.route menyadap request jaringan dan memungkinkan stub respons (status, body), cocok untuk menguji state error dan loading secara deterministik.",
"en": "page.route intercepts network requests and lets you stub the response (status, body), which suits deterministic error and loading states."
}
},
{
"id": "pw-012",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Test gagal hanya di CI dan Anda tidak bisa mereproduksinya lokal. Fitur Playwright apa yang paling membantu?",
"en": "A test fails only in CI and you cannot reproduce it locally. Which Playwright feature helps most?"
},
"options": {
"id": [
"Trace viewer: rekaman langkah, snapshot DOM, dan jaringan dari run yang gagal",
"Mengganti semua locator dengan XPath absolut supaya terlihat lebih presisi dan pasti",
"Menambah page.waitForTimeout(10000) di awal setiap test supaya semuanya lebih lambat",
"Menghapus assertion yang gagal dari test supaya pipeline CI kembali berwarna hijau"
],
"en": [
"Trace viewer: recorded steps, DOM snapshots and network from the failed run",
"Replacing every locator with absolute XPath expressions to make them more precise",
"Adding page.waitForTimeout(10000) at the start of every test to slow things down",
"Deleting the failing assertion from the test so the CI pipeline turns green again"
]
},
"answer": 0,
"exp": {
"id": "Trace (misalnya trace: 'on-first-retry') merekam apa yang terjadi saat test gagal sehingga bisa diputar ulang. Sleep tetap dan menghapus assertion menyembunyikan masalah, bukan menemukannya.",
"en": "A trace (e.g. trace: 'on-first-retry') records what happened during the failure so it can be replayed. Fixed sleeps and deleting assertions hide the problem instead of finding it."
}
},
{
"id": "pw-013",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Secara default, bagaimana Playwright Test menjalankan test secara paralel?",
"en": "By default, how does Playwright Test run tests in parallel?"
},
"options": {
"id": [
"Antar file test berjalan paralel lewat beberapa worker; test dalam satu file berurutan",
"Semua test dalam satu file berjalan paralel tetapi antar file berurutan",
"Semua test selalu berurutan di satu proses tanpa pengecualian",
"Paralel hanya bila memakai Selenium Grid bersama Playwright"
],
"en": [
"Test files run in parallel across workers; tests inside one file run in order",
"All tests in one file run in parallel but files run one after another",
"All tests always run sequentially in one process with no exceptions",
"Parallelism works only when using Selenium Grid together with Playwright"
]
},
"answer": 0,
"exp": {
"id": "Worker menjalankan file berbeda secara paralel; test dalam satu file berurutan kecuali fullyParallel diaktifkan. Karena itu test data antar worker tidak boleh bertabrakan.",
"en": "Workers run different files in parallel; tests within a file run in order unless fullyParallel is enabled. So test data must not collide across workers."
}
},
{
"id": "pw-014",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa fungsi fixture di Playwright Test?",
"en": "What are fixtures for in Playwright Test?"
},
"options": {
"id": [
"Menyiapkan dan membersihkan dependensi test (halaman login, test data) secara terisolasi dan dapat dipakai ulang",
"Mengunci versi browser di proyek supaya tidak pernah ikut diperbarui oleh release Playwright",
"Menerjemahkan test secara otomatis ke bahasa pemrograman lain ketika tim memintanya",
"Menggantikan kebutuhan assertion dengan menyimpan screenshot di akhir setiap test"
],
"en": [
"Setting up and tearing down test dependencies (signed-in page, test data) in an isolated, reusable way",
"Pinning the browser version in the project so that it is never updated by Playwright releases",
"Automatically translating the tests into another programming language when the team asks",
"Replacing the need for assertions by saving a screenshot at the end of every test"
]
},
"answer": 0,
"exp": {
"id": "Fixture mendeklarasikan apa yang dibutuhkan test (misalnya authedPage) dan Playwright menyiapkan serta membersihkannya per test.",
"en": "A fixture declares what a test needs (e.g. an authed page) and Playwright sets it up and cleans it per test."
}
},
{
"id": "pw-015",
"topic": "playwright",
"level": 3,
"type": "mcq",
"q": {
"id": "Klik tombol membuka tab baru (popup). Bagaimana pendekatan yang tepat di Playwright?",
"en": "Clicking a button opens a new tab (popup). What is the right approach in Playwright?"
},
"options": {
"id": [
"Mulai menunggu event popup, klik tombol, lalu gunakan page popup yang dihasilkan",
"Mustahil, karena Playwright hanya mendukung satu tab per test dan mengabaikan jendela baru",
"Pakai Thread.sleep(5000) setelah klik lalu tebak tab mana yang sedang aktif saat itu",
"Muat ulang halaman awal berulang kali sampai tab baru tidak muncul lagi setelah klik"
],
"en": [
"Start waiting for the popup event, click the button, then use the resulting popup page",
"Impossible, because Playwright supports only one tab per test and ignores new windows",
"Use Thread.sleep(5000) after the click and then guess which of the tabs is active now",
"Reload the original page repeatedly until the new tab stops appearing after each click"
]
},
"answer": 0,
"exp": {
"id": "Pola const popupPromise = page.waitForEvent('popup'); klik; const popup = await popupPromise menangani tab baru tanpa race. Playwright mendukung banyak page dalam satu context.",
"en": "The pattern const popupPromise = page.waitForEvent('popup'); click; const popup = await popupPromise handles new tabs without a race. Playwright supports many pages in one context."
}
},
{
"id": "pw-016",
"topic": "playwright",
"level": 1,
"type": "mcq",
"q": {
"id": "Apa kegunaan perintah codegen Playwright?",
"en": "What is Playwright's codegen command for?"
},
"options": {
"id": [
"Merekam interaksi di browser dan menghasilkan kode test awal yang perlu dirapikan",
"Membuat bug report rinci ke Jira secara otomatis tanpa campur tangan manusia sama sekali",
"Mengompilasi aplikasi yang diuji menjadi paket instalasi untuk setiap platform",
"Menghapus seluruh cache browser milik semua user yang pernah mengunjungi situs"
],
"en": [
"Recording browser interactions and generating starter test code that needs tidying",
"Automatically filing detailed bug reports in Jira without any human involvement at all",
"Compiling the application under test into an installer package for every platform",
"Clearing the whole browser cache of every user who has ever visited the website"
]
},
"answer": 0,
"exp": {
"id": "Codegen membantu memulai script dengan cepat, tetapi hasilnya tetap perlu ditinjau: locator, assertion, dan struktur.",
"en": "Codegen helps start scripts quickly, but the output still needs review: locators, assertions and structure."
}
},
{
"id": "cy-006",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa kode ini keliru? const nama = cy.get('#nama').text();",
"en": "Why is this code wrong? const name = cy.get('#name').text();"
},
"options": {
"id": [
"Perintah cy.* diantrikan dan tidak mengembalikan nilai langsung; gunakan .then() atau alias",
"Cypress sama sekali tidak bisa membaca elemen lewat atribut id, hanya lewat class atau teks",
"Variabel const dilarang di setiap file test Cypress, sehingga harus selalu memakai let",
"Metode text() memang ada tetapi hanya berjalan ketika test dieksekusi di browser Firefox"
],
"en": [
"cy.* commands are queued and do not return values directly; use .then() or an alias",
"Cypress cannot read elements by their id attribute at all, only by class name or text",
"const variables are forbidden in every Cypress test file, so let must always be used",
"The text() method exists but it only runs when the tests are executed in Firefox"
]
},
"answer": 0,
"exp": {
"id": "Cypress menyusun queue perintah asinkron; cy.get tidak mengembalikan elemen sebagai nilai biasa dan jQuery text() tidak tersedia di chain Cypress. Ambil nilai lewat .then(($el) => ...).",
"en": "Cypress builds an async command queue; cy.get does not return the element as a plain value, and jQuery's text() is not on the Cypress chain. Read values via .then(($el) => ...)."
}
},
{
"id": "cy-007",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Untuk menunggu request tertentu selesai sebelum assertion, apa yang dianjurkan?",
"en": "To wait for a specific request to finish before asserting, what is recommended?"
},
"options": {
"id": [
"cy.intercept() dengan alias, lalu cy.wait('@alias')",
"cy.wait(5000) supaya dianggap \"cukup lama\" untuk request apa pun",
"Memanggil Date.now() berulang di dalam loop while sampai nilainya berubah",
"Menutup browser lalu membukanya lagi sebelum setiap assertion dijalankan"
],
"en": [
"cy.intercept() with an alias, then cy.wait('@alias')",
"cy.wait(5000) so that it is \"long enough\" for any request",
"Calling Date.now() repeatedly inside a while loop until its value changes",
"Closing the browser and opening it again before every assertion is run"
]
},
"answer": 0,
"exp": {
"id": "Menunggu alias request bergantung pada kejadian nyata, bukan tebakan waktu. Sleep tetap membuat test lambat sekaligus tetap rawan flaky.",
"en": "Waiting on a request alias depends on a real event, not a time guess. Fixed sleeps make tests slow and still flaky."
}
},
{
"id": "cy-008",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa arti retry-ability di Cypress?",
"en": "What does retry-ability mean in Cypress?"
},
"options": {
"id": [
"Query seperti cy.get dan assertion yang mengikutinya diulang otomatis sampai berhasil atau timeout",
"Seluruh file test diulang tanpa batas sampai setiap test di dalamnya akhirnya berhasil lulus",
"Cypress otomatis mengirim ulang bug report ke tracker yang sebelumnya gagal terkirim",
"Aksi seperti click dijalankan berulang kali sampai halaman akhirnya berubah state-nya"
],
"en": [
"Queries like cy.get and the assertions after them are retried automatically until they pass or time out",
"The whole test file is repeated without any limit until every single test inside it passes",
"Cypress automatically resends bug reports to the tracker that failed to be delivered earlier",
"Actions such as click are executed again and again until the page finally changes state"
]
},
"answer": 0,
"exp": {
"id": "Retry berlaku pada query dan assertion, sehingga menunggu elemen muncul tidak butuh sleep. Aksi seperti click tidak diulang begitu saja.",
"en": "Retrying applies to queries and assertions, so waiting for an element needs no sleep. Actions such as click are not simply repeated."
}
},
{
"id": "cy-009",
"topic": "cypress",
"level": 3,
"type": "mcq",
"q": {
"id": "Test Anda harus berpindah dari app.example.com ke login.partner.com di tengah skenario. Apa yang dipakai?",
"en": "Your test must go from app.example.com to login.partner.com mid-scenario. What do you use?"
},
"options": {
"id": [
"cy.origin() untuk menjalankan perintah di origin kedua",
"Tidak mungkin; Cypress selalu gagal pada domain berbeda",
"cy.wait() sampai domain pertama berubah menjadi domain kedua sendiri",
"Menjalankan dua test terpisah dan menggabungkan hasilnya manual"
],
"en": [
"cy.origin() to run commands in the second origin",
"Impossible; Cypress always fails on a different domain",
"cy.wait() until the first domain turns into the second by itself",
"Running two separate tests and merging the results by hand"
]
},
"answer": 0,
"exp": {
"id": "cy.origin() memungkinkan alur lintas origin dalam satu test (dengan batasan coverage callback). Ini bagian dari batasan same-origin yang perlu diketahui.",
"en": "cy.origin() enables cross-origin flows in one test (with callback scope limits). It is part of the same-origin constraint you should know about."
}
},
{
"id": "cy-010",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa yang dilakukan Cypress terhadap cookie dan local storage di antara test (test isolation)?",
"en": "What does Cypress do with cookies and local storage between tests (test isolation)?"
},
"options": {
"id": [
"Membersihkannya secara default agar tiap test mulai dari state bersih",
"Mengumpulkannya sepanjang seluruh run agar semua test saling berbagi sesi",
"Mengirimkannya ke server Cypress untuk dianalisis",
"Mengenkripsinya lalu menyimpannya selamanya"
],
"en": [
"Clears them by default so each test starts from a clean state",
"Accumulates them across the whole run so all tests share a session",
"Sends them to a Cypress server for analysis",
"Encrypts them and stores them forever"
]
},
"answer": 0,
"exp": {
"id": "Test isolation membuat test independen. Untuk menghemat login yang berulang, pakai cy.session() yang menyimpan dan memulihkan sesi secara sengaja.",
"en": "Test isolation keeps tests independent. To avoid repeating logins, use cy.session(), which saves and restores a session deliberately."
}
},
{
"id": "cy-011",
"topic": "cypress",
"level": 1,
"type": "mcq",
"q": {
"id": "Untuk apa Cypress.Commands.add()?",
"en": "What is Cypress.Commands.add() for?"
},
"options": {
"id": [
"Membuat custom command yang dapat dipakai ulang di banyak test",
"Menambah anggota baru ke tim Cypress Cloud",
"Menginstal browser tambahan secara otomatis",
"Mengubah versi aplikasi yang sedang diuji"
],
"en": [
"Creating a custom command reusable across many tests",
"Adding new members to a Cypress Cloud team",
"Installing extra browsers automatically",
"Changing the version of the application under test"
]
},
"answer": 0,
"exp": {
"id": "Custom command membungkus langkah berulang (misalnya login) menjadi satu perintah sehingga test lebih ringkas.",
"en": "A custom command wraps repeated steps (e.g. login) into one command so tests stay short."
}
},
{
"id": "cy-012",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Selector mana yang paling stabil untuk elemen yang akan sering berubah tampilannya?",
"en": "Which selector is most stable for an element whose look will change often?"
},
"options": {
"id": [
"[data-cy=submit] (atribut khusus test)",
".btn.btn-lg.btn-blue",
"div:nth-child(4) > span",
"Teks tombol \"Kirim Sekarang!\" yang sering diganti tim marketing"
],
"en": [
"[data-cy=submit] (a test-dedicated attribute)",
".btn.btn-lg.btn-blue",
"div:nth-child(4) > span",
"The button text \"Send Now!\" that marketing keeps changing"
]
},
"answer": 0,
"exp": {
"id": "Atribut data-cy hanya berubah bila tim test memang mengubahnya, sedangkan class, urutan, dan teks berubah mengikuti desain atau copywriting.",
"en": "A data-cy attribute only changes when the test owners change it, whereas classes, order and text change with design or copywriting."
}
},
{
"id": "cy-013",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa fungsi cy.session()?",
"en": "What is cy.session() for?"
},
"options": {
"id": [
"Menyimpan dan memulihkan cookie, local storage sesi login antar test agar tidak login berulang",
"Menambah jumlah sesi user bersamaan yang dapat dilayani aplikasi di production environment",
"Mengatur batas waktu global yang berlaku untuk seluruh eksekusi Cypress di mesin tersebut",
"Merekam video seluruh layar komputer selama test sedang berjalan di mesin tersebut"
],
"en": [
"Saving and restoring login cookies and local storage between tests to avoid repeated logins",
"Increasing the number of concurrent user sessions that the production application can serve",
"Setting the global timeout that applies to the whole Cypress run on the machine",
"Recording a video of the complete computer screen while the tests are running"
]
},
"answer": 0,
"exp": {
"id": "cy.session menjaga isolasi tetapi menghemat waktu: login dijalankan sekali per kunci sesi lalu dipulihkan.",
"en": "cy.session keeps isolation while saving time: login runs once per session key and is then restored."
}
},
{
"id": "cy-014",
"topic": "cypress",
"level": 1,
"type": "mcq",
"q": {
"id": "Apa kegunaan component testing di Cypress?",
"en": "What is component testing in Cypress for?"
},
"options": {
"id": [
"Memasang dan menguji satu komponen UI secara terpisah tanpa menjalankan seluruh aplikasi",
"Menguji koneksi antar server database secara langsung tanpa user interface",
"Menghitung jumlah baris kode dan melaporkan totalnya untuk setiap folder repositori",
"Menggantikan setiap test end-to-end di proyek tanpa terkecuali sama sekali"
],
"en": [
"Mounting and testing a single UI component in isolation without running the whole app",
"Testing the connections between database servers directly without a user interface",
"Counting the lines of code and reporting the totals for each folder of the repository",
"Replacing every single end-to-end test in the project without any exception at all"
]
},
"answer": 0,
"exp": {
"id": "Component testing lebih cepat dan fokus; ia melengkapi, bukan menggantikan, test end-to-end.",
"en": "Component testing is faster and focused; it complements, not replaces, end-to-end tests."
}
},
{
"id": "cy-015",
"topic": "cypress",
"level": 3,
"type": "mcq",
"q": {
"id": "Manajer meminta satu test Cypress yang membuka dua tab browser dan berpindah di antaranya. Respons terbaik?",
"en": "A manager asks for one Cypress test that opens two browser tabs and switches between them. Best response?"
},
"options": {
"id": [
"Jelaskan batasan multi-tab Cypress; sarankan memisahkan skenario atau memakai tool lain (misalnya Playwright) untuk kasus itu",
"Setujui dan tulis test yang mungkin berhasil tanpa memverifikasi bahwa tab kedua benar-benar terkendali",
"Tolak seluruh otomasi UI di proyek karena satu skenario tidak didukung oleh tool tersebut",
"Ganti seluruh suite ke tool lain sekarang juga tanpa analisis biaya atau usaha migrasinya"
],
"en": [
"Explain Cypress's multi-tab limitation; suggest splitting the scenario or using another tool (e.g. Playwright) for that case",
"Agree and write a test that might work without verifying that the second tab is really controlled",
"Reject all UI automation for the project because one single scenario is not supported by the tool",
"Switch the entire suite to another tool immediately without any analysis of cost or migration effort"
]
},
"answer": 0,
"exp": {
"id": "Jawaban yang matang menyebut batasan, menawarkan alternatif, dan mempertimbangkan biaya. Memilih tool adalah keputusan berdasarkan kebutuhan, bukan kesetiaan.",
"en": "A mature answer states the limitation, offers alternatives and weighs cost. Tool choice follows needs, not loyalty."
}
},
{
"id": "kt-005",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa manfaat utama Object Repository di Katalon Studio?",
"en": "What is the main benefit of the Object Repository in Katalon Studio?"
},
"options": {
"id": [
"Menyimpan test object (locator) terpusat sehingga perubahan UI cukup diperbaiki di satu tempat",
"Menyimpan seluruh kode sumber aplikasi yang diuji untuk setiap release yang ada",
"Menyimpan password semua user aplikasi secara polos untuk keperluan test",
"Menjalankan test dengan sendirinya tanpa memerlukan test case sama sekali"
],
"en": [
"Keeps test objects (locators) in one place so a UI change is fixed once",
"Stores the complete source code of the application under test for every release",
"Stores the passwords of all application users in plain text for the test runs",
"Runs tests automatically on its own without the need for any test case at all"
]
},
"answer": 0,
"exp": {
"id": "Konsepnya mirip Page Object Model: locator dikelola terpusat dan dipakai ulang oleh banyak test case.",
"en": "The idea is close to the Page Object Model: locators are managed centrally and reused by many test cases."
}
},
{
"id": "kt-006",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa beda Test Suite dan Test Suite Collection di Katalon?",
"en": "What is the difference between a Test Suite and a Test Suite Collection in Katalon?"
},
"options": {
"id": [
"Test Suite mengelompokkan test case; Collection menjalankan beberapa test suite (misalnya di beberapa browser atau profil)",
"Keduanya fitur yang identik, dan satu-satunya perbedaan hanya nama folder tempatnya berada",
"Test Suite hanya untuk aplikasi mobile sedangkan Collection hanya untuk aplikasi web",
"Collection hanya boleh berisi satu test case dan tidak boleh berisi apa pun lainnya"
],
"en": [
"A Test Suite groups test cases; a Collection runs several test suites (e.g. across browsers or profiles)",
"They are identical features, and the only difference is the name of the folder they live in",
"A Test Suite is meant for mobile apps only while a Collection is meant for web apps only",
"A Collection can contain exactly one test case and nothing else, unlike a normal suite"
]
},
"answer": 0,
"exp": {
"id": "Collection berguna untuk eksekusi lintas browser atau environment: tiap suite dijalankan dengan konfigurasinya sendiri.",
"en": "A Collection is useful for cross-browser or cross-environment runs: each suite runs with its own configuration."
}
},
{
"id": "kt-007",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Anda ingin test yang sama berjalan di environment staging dan production-like tanpa mengubah test case. Apa yang dipakai?",
"en": "You want the same test to run on staging and a production-like environment without editing test cases. What do you use?"
},
"options": {
"id": [
"Execution Profile dengan variabel per environment (URL, akun uji)",
"Menyalin test case lalu mengubah URL secara manual di dalam setiap salinannya",
"Menulis URL langsung ke dalam setiap langkah pada test case tersebut",
"Menonaktifkan environment yang sedang tidak dipakai oleh seluruh tim"
],
"en": [
"An Execution Profile with per-environment variables (URL, test accounts)",
"Copying the test case and editing the URL by hand inside each of the copies",
"Hard-coding the URL directly into every single step of the test case",
"Disabling the environment that is not currently being used by the whole team"
]
},
"answer": 0,
"exp": {
"id": "Profil memisahkan konfigurasi dari test sehingga satu test case dipakai untuk banyak environment.",
"en": "Profiles separate configuration from the test so one test case serves many environments."
}
},
{
"id": "kt-008",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Bagaimana data-driven testing dilakukan di Katalon?",
"en": "How is data-driven testing done in Katalon?"
},
"options": {
"id": [
"Menghubungkan Test Data (Excel, CSV, database) ke variabel test case sehingga test berjalan per baris data",
"Menulis ulang test case yang sama sekali lagi untuk setiap baris data yang ada",
"Memasukkan semua baris data langsung ke Object Repository sebagai test object",
"Menunggu user sungguhan mengetik data ke formulir satu per satu selama run"
],
"en": [
"Binding Test Data (Excel, CSV, database) to test case variables so the test runs once per data row",
"Rewriting the same test case again once for every single row of data that exists",
"Putting all the data rows directly into the Object Repository as test objects",
"Waiting for real users to type the data into the form one by one during the run"
]
},
"answer": 0,
"exp": {
"id": "Binding Test Data pada test suite membuat satu test case dieksekusi berulang dengan data berbeda.",
"en": "Binding Test Data in a test suite makes one test case execute repeatedly with different data."
}
},
{
"id": "kt-009",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa itu self-healing di Katalon Studio?",
"en": "What is self-healing in Katalon Studio?"
},
"options": {
"id": [
"Mencoba locator alternatif secara otomatis saat locator utama gagal menemukan elemen",
"Memperbaiki bug aplikasi secara otomatis sehingga developer tidak perlu lagi",
"Menghapus test yang gagal dari proyek sehingga laporan hanya menampilkan yang lulus",
"Mengganti sistem operasi mesin supaya test dapat lulus dengan sendirinya"
],
"en": [
"Automatically trying alternative locators when the primary locator fails to find the element",
"Fixing the bugs in the application automatically so developers no longer have to",
"Deleting failed tests from the project so that the report shows only passes",
"Replacing the operating system of the machine so that the tests can pass"
]
},
"answer": 0,
"exp": {
"id": "Self-healing mengurangi failure karena perubahan locator, tetapi hasilnya tetap perlu ditinjau agar locator yang \"disembuhkan\" tidak menunjuk elemen yang salah.",
"en": "Self-healing reduces failures from locator changes, but the result should still be reviewed so a healed locator does not point to the wrong element."
}
},
{
"id": "kt-010",
"topic": "katalon",
"level": 1,
"type": "mcq",
"q": {
"id": "Bahasa apa yang dipakai untuk custom keyword dan script di Katalon Studio?",
"en": "Which language is used for custom keywords and scripts in Katalon Studio?"
},
"options": {
"id": [
"Groovy",
"COBOL",
"Assembly",
"Fortran"
],
"en": [
"Groovy",
"COBOL",
"Assembly",
"Fortran"
]
},
"answer": 0,
"exp": {
"id": "Katalon Studio berbasis Groovy/Java sehingga library Java dapat dipakai di script.",
"en": "Katalon Studio is Groovy/Java based, so Java libraries can be used in scripts."
}
},
{
"id": "kt-011",
"topic": "katalon",
"level": 3,
"type": "mcq",
"q": {
"id": "Pada keyword WebUI.verifyElementPresent, apa fungsi FailureHandling.CONTINUE_ON_FAILURE?",
"en": "On a WebUI.verifyElementPresent keyword, what does FailureHandling.CONTINUE_ON_FAILURE do?"
},
"options": {
"id": [
"Mencatat failure tetapi melanjutkan langkah berikutnya, dan test case akhirnya ditandai gagal",
"Mengabaikan failure sepenuhnya, seolah verifikasi itu tidak pernah dijalankan",
"Menghentikan seluruh eksekusi seketika dan menghapus semua hasil sejauh ini",
"Mengulang keyword tanpa batas sampai akhirnya berhasil dengan sendirinya"
],
"en": [
"Logs the failure but continues with the next steps, and the test case is finally marked failed",
"Ignores the failure completely, as if the verification had never been executed",
"Stops the whole execution immediately and deletes all of the results so far",
"Repeats the keyword without any limit until it finally succeeds on its own"
]
},
"answer": 0,
"exp": {
"id": "STOP_ON_FAILURE menghentikan test, CONTINUE_ON_FAILURE melanjutkan tetapi status akhir gagal, OPTIONAL hanya memberi peringatan. Pilih sesuai pentingnya langkah.",
"en": "STOP_ON_FAILURE halts the test, CONTINUE_ON_FAILURE continues but the final status is failed, OPTIONAL only warns. Choose by how critical the step is."
}
},
{
"id": "kt-012",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Bagaimana test Katalon dijalankan di pipeline CI tanpa membuka interface Studio?",
"en": "How do you run Katalon tests in a CI pipeline without opening the Studio UI?"
},
"options": {
"id": [
"Lewat Katalon Runtime Engine / command line dengan parameter proyek dan test suite",
"Mengirim email berisi seluruh proyek ke tim QA tiap malam agar ada yang menjalankannya",
"Meminta setiap developer menjalankan test manual di laptop masing-masing per commit",
"Tidak mungkin, karena test Katalon hanya berjalan di dalam jendela Studio yang terbuka"
],
"en": [
"Through Katalon Runtime Engine / the command line with project and test suite parameters",
"Emailing the whole project to the QA team every night so that someone runs it",
"Asking each developer to run the tests manually on their own laptop per commit",
"It is not possible, because Katalon tests run only inside an opened Studio window"
]
},
"answer": 0,
"exp": {
"id": "Mode command line (Runtime Engine) memungkinkan eksekusi headless di CI, lalu hasilnya dikirim ke laporan atau platform seperti TestOps.",
"en": "Command-line mode (Runtime Engine) allows headless execution in CI, with results sent to reports or a platform such as TestOps."
}
},
{
"id": "kt-013",
"topic": "katalon",
"level": 3,
"type": "mcq",
"q": {
"id": "Tim Anda terdiri dari tester non-programmer yang butuh otomasi web, API, dan mobile dalam satu tool. Pertimbangan paling seimbang?",
"en": "Your team is non-programmer testers who need web, API and mobile automation in one tool. What is the most balanced consideration?"
},
"options": {
"id": [
"Katalon cocok untuk kebutuhan itu, dengan catatan soal lisensi, keterikatan tool, dan keterbatasan integrasi dibanding framework kode",
"Katalon selalu pilihan terbaik, dan framework kode tidak pernah dibutuhkan tim mana pun",
"Framework kode selalu pilihan terbaik, dan tool low-code tidak pernah layak dipakai",
"Pilih tool apa pun yang paling populer di media sosial bulan ini, apa pun kondisi tim"
],
"en": [
"Katalon fits that need, noting licensing, tool lock-in and integration limits compared with code frameworks",
"Katalon is always the best choice, and code frameworks are never needed by any team",
"Code frameworks are always the best choice, and low-code tools are never a viable option",
"Choose whichever tool is the most popular on social media this month, whatever the team is"
]
},
"answer": 0,
"exp": {
"id": "Jawaban interview yang baik menimbang kecocokan tim, biaya, dan batasan, bukan fanatisme pada satu pendekatan.",
"en": "A good interview answer weighs team fit, cost and limits, not zeal for a single approach."
}
},
{
"id": "kt-014",
"topic": "katalon",
"level": 1,
"type": "mcq",
"q": {
"id": "Apa kegunaan Web Recorder / Spy Web di Katalon Studio?",
"en": "What are Web Recorder / Spy Web used for in Katalon Studio?"
},
"options": {
"id": [
"Menangkap elemen halaman sebagai test object dan merekam interaksi sebagai langkah awal test",
"Mengunci halaman web supaya developer tidak lagi dapat mengubah elemen-elemennya",
"Menghitung jumlah pengunjung yang membuka situs produksi sepanjang minggu ini",
"Menerjemahkan aplikasi yang diuji ke bahasa lain untuk pemeriksaan lokalisasi"
],
"en": [
"Capturing page elements as test objects and recording interactions as starting test steps",
"Locking the web page so that developers are no longer able to change its elements",
"Counting the number of visitors who have opened the production website this week",
"Translating the application under test into other languages for localisation checks"
]
},
"answer": 0,
"exp": {
"id": "Hasil rekaman cepat untuk memulai tetapi perlu dirapikan: locator stabil, wait, dan assertion yang bermakna.",
"en": "Recordings are a quick start but need tidying: stable locators, waits and meaningful assertions."
}
},
{
"id": "sql-007",
"topic": "sql",
"level": 3,
"type": "mcq",
"q": {
"id": "Cara mengambil pesanan terbaru milik tiap customer (satu baris per customer)?",
"en": "How do you get each customer's latest order (one row per customer)?"
},
"options": {
"id": [
"SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;",
"SELECT * FROM (SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) rn FROM orders o) x WHERE rn = 1;",
"SELECT customer_id, MAX(id) FROM orders GROUP BY created_at;",
"SELECT DISTINCT * FROM orders WHERE created_at = NOW();"
],
"en": [
"SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;",
"SELECT * FROM (SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) rn FROM orders o) x WHERE rn = 1;",
"SELECT customer_id, MAX(id) FROM orders GROUP BY created_at;",
"SELECT DISTINCT * FROM orders WHERE created_at = NOW();"
]
},
"answer": 1,
"exp": {
"id": "ROW_NUMBER() dengan PARTITION BY menomori pesanan per customer; rn = 1 adalah yang terbaru. Opsi pertama hanya mengembalikan satu baris total, bukan per customer.",
"en": "ROW_NUMBER() with PARTITION BY numbers orders per customer; rn = 1 is the latest. The first option returns a single row overall, not one per customer."
}
},
{
"id": "sql-008",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Query mana yang menemukan email yang terdaftar lebih dari sekali?",
"en": "Which query finds emails registered more than once?"
},
"options": {
"id": [
"SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1;",
"SELECT email FROM users WHERE COUNT(*) > 1;",
"SELECT DISTINCT email FROM users HAVING email > 1;",
"SELECT email FROM users ORDER BY COUNT(email);"
],
"en": [
"SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1;",
"SELECT email FROM users WHERE COUNT(*) > 1;",
"SELECT DISTINCT email FROM users HAVING email > 1;",
"SELECT email FROM users ORDER BY COUNT(email);"
]
},
"answer": 0,
"exp": {
"id": "HAVING memfilter hasil kelompok setelah GROUP BY. COUNT(*) tidak boleh berada di WHERE karena WHERE bekerja sebelum pengelompokan.",
"en": "HAVING filters groups after GROUP BY. COUNT(*) cannot go in WHERE because WHERE runs before grouping."
}
},
{
"id": "sql-009",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Kolom phone berisi 100 baris, 40 di antaranya NULL. Apa hasil COUNT(phone) dan COUNT(*)?",
"en": "The phone column has 100 rows, 40 of them NULL. What do COUNT(phone) and COUNT(*) return?"
},
"options": {
"id": [
"COUNT(phone)=100 dan COUNT(*)=60",
"COUNT(phone)=60 dan COUNT(*)=100",
"Keduanya 100",
"Keduanya 60"
],
"en": [
"COUNT(phone)=100 and COUNT(*)=60",
"COUNT(phone)=60 and COUNT(*)=100",
"Both are 100",
"Both are 60"
]
},
"answer": 1,
"exp": {
"id": "COUNT(kolom) mengabaikan NULL sehingga 60; COUNT(*) menghitung semua baris sehingga 100.",
"en": "COUNT(column) ignores NULLs so it is 60; COUNT(*) counts all rows so it is 100."
}
},
{
"id": "sql-010",
"topic": "sql",
"level": 3,
"type": "mcq",
"q": {
"id": "Mengapa SELECT * FROM a WHERE id NOT IN (SELECT a_id FROM b) bisa mengembalikan nol baris padahal ada data yatim?",
"en": "Why can SELECT * FROM a WHERE id NOT IN (SELECT a_id FROM b) return zero rows even though orphans exist?"
},
"options": {
"id": [
"Bila subquery berisi NULL, perbandingan NOT IN menjadi tidak diketahui sehingga tidak ada baris lolos",
"NOT IN hanya bekerja pada tabel dengan satu baris, sehingga tabel besar tak mengembalikan apa pun",
"Subquery selalu dijalankan sebelum tabel luar sempat dibuat di dalam memori",
"Database diam-diam membuang setiap baris yang id-nya kebetulan berupa angka genap"
],
"en": [
"If the subquery contains NULL, NOT IN becomes unknown so no row passes",
"NOT IN only works on tables that contain a single row, so larger tables return nothing",
"The subquery is always executed before the outer table has been created in memory",
"The database silently drops every row whose id happens to be an even number"
]
},
"answer": 0,
"exp": {
"id": "Logika tiga nilai SQL: x NOT IN (..., NULL) tidak pernah benar. Gunakan NOT EXISTS atau LEFT JOIN ... IS NULL untuk mencari data yatim.",
"en": "SQL's three-valued logic: x NOT IN (..., NULL) is never true. Use NOT EXISTS or LEFT JOIN ... IS NULL to find orphans."
}
},
{
"id": "sql-011",
"topic": "sql",
"level": 3,
"type": "mcq",
"q": {
"id": "LEFT JOIN orders o ON ... WHERE o.status = 'PAID' ternyata menghilangkan customer tanpa pesanan. Mengapa?",
"en": "LEFT JOIN orders o ON ... WHERE o.status = 'PAID' drops customers with no orders. Why?"
},
"options": {
"id": [
"Kondisi di WHERE pada tabel kanan menyaring baris NULL sehingga efeknya seperti INNER JOIN; pindahkan ke ON",
"LEFT JOIN tidak boleh digabung dengan kolom status, sehingga query diam-diam berubah menjadi scan biasa",
"PAID adalah kata terlarang di SQL, sehingga database membuang customer yang tidak punya pesanan",
"Database menghapus customer tanpa pesanan dari tabel aslinya secara fisik setelah query dijalankan"
],
"en": [
"A WHERE condition on the right table filters out the NULL rows so it behaves like an INNER JOIN; move it to ON",
"LEFT JOIN cannot be combined with a status column, so the query silently falls back to a plain scan",
"PAID is a reserved word in SQL, which makes the database discard the customers that have no orders",
"The database physically deletes customers without orders from the underlying table after the query"
]
},
"answer": 0,
"exp": {
"id": "Baris tanpa pesanan memiliki o.status NULL, yang tidak memenuhi o.status = 'PAID'. Menaruh kondisi di ON mempertahankan customer tanpa pesanan.",
"en": "Rows without orders have o.status NULL, which fails o.status = 'PAID'. Putting the condition in ON keeps customers without orders."
}
},
{
"id": "sql-012",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Anda perlu membersihkan test data milik satu user saja. Pernyataan mana yang tepat?",
"en": "You need to clean up test data for one user only. Which statement is right?"
},
"options": {
"id": [
"DELETE FROM orders WHERE user_id = 42;",
"TRUNCATE TABLE orders RESTART IDENTITY;",
"DROP TABLE orders CASCADE;",
"UPDATE orders SET status = 'x';"
],
"en": [
"DELETE FROM orders WHERE user_id = 42;",
"TRUNCATE TABLE orders RESTART IDENTITY;",
"DROP TABLE orders CASCADE;",
"UPDATE orders SET status = 'x';"
]
},
"answer": 0,
"exp": {
"id": "DELETE dengan WHERE menghapus baris tertentu saja dan bisa dibatalkan dalam transaksi. TRUNCATE mengosongkan seluruh tabel dan DROP menghapus tabelnya.",
"en": "DELETE with WHERE removes only the chosen rows and can be rolled back in a transaction. TRUNCATE empties the whole table and DROP removes the table itself."
}
},
{
"id": "sql-013",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Query mana yang paling mungkin tidak bisa memakai indeks pada kolom name?",
"en": "Which query is least likely to use an index on the name column?"
},
"options": {
"id": [
"WHERE name LIKE '%budi'",
"WHERE name = 'budi'",
"WHERE name LIKE 'budi%'",
"WHERE name IN ('budi','sari')"
],
"en": [
"WHERE name LIKE '%budi'",
"WHERE name = 'budi'",
"WHERE name LIKE 'budi%'",
"WHERE name IN ('budi','sari')"
]
},
"answer": 0,
"exp": {
"id": "Wildcard di awal membuat pencarian tidak bisa memanfaatkan urutan indeks sehingga cenderung table scan. Pola awalan 'budi%' masih bisa memakai indeks.",
"en": "A leading wildcard cannot use the index ordering, so it tends to scan the table. A prefix pattern like 'budi%' can still use the index."
}
},
{
"id": "sql-014",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa beda UNION dan UNION ALL?",
"en": "What is the difference between UNION and UNION ALL?"
},
"options": {
"id": [
"UNION menghapus baris duplikat; UNION ALL mempertahankan semuanya dan umumnya lebih cepat",
"UNION ALL menghapus baris duplikat, sedangkan UNION mempertahankan semua baris yang ditemukan",
"Keduanya berperilaku persis sama, dan hanya kata kunci yang ditulis yang berbeda",
"UNION bekerja untuk paling banyak dua tabel, UNION ALL dipakai untuk tiga tabel atau lebih"
],
"en": [
"UNION removes duplicate rows; UNION ALL keeps all of them and is usually faster",
"UNION ALL removes duplicate rows, while UNION keeps all of the rows that it finds",
"They behave exactly the same, and only the keyword that is written differs between them",
"UNION works for two tables at most, and UNION ALL is used for three tables or more"
]
},
"answer": 0,
"exp": {
"id": "Penghapusan duplikat butuh pengurutan atau hashing tambahan, jadi UNION ALL lebih murah bila duplikat tidak masalah atau mustahil.",
"en": "Removing duplicates needs extra sorting or hashing, so UNION ALL is cheaper when duplicates do not matter or cannot occur."
}
},
{
"id": "sql-015",
"topic": "sql",
"level": 3,
"type": "mcq",
"q": {
"id": "Transfer saldo gagal di tengah jalan: saldo pengirim sudah berkurang tetapi penerima belum bertambah. Properti ACID mana yang dilanggar?",
"en": "A balance transfer fails midway: the sender was debited but the receiver not credited. Which ACID property is violated?"
},
"options": {
"id": [
"Atomicity (transaksi harus tuntas seluruhnya atau tidak sama sekali)",
"Durability (data hilang begitu aliran listrik server dimatikan)",
"Isolation (dua user yang bekerja bersamaan melihat kumpulan data yang berbeda)",
"Consistency saja, yang sama sekali tidak berhubungan dengan penanganan transaksi"
],
"en": [
"Atomicity (a transaction must complete entirely or not at all)",
"Durability (data is lost once the power supply of the server is switched off)",
"Isolation (two users working at the same moment see a different set of data)",
"Consistency only, which has no relation at all with how transactions are handled"
]
},
"answer": 0,
"exp": {
"id": "Atomicity menjamin dua langkah transfer diperlakukan sebagai satu kesatuan; bila salah satu gagal, seluruhnya dibatalkan (rollback).",
"en": "Atomicity guarantees the two transfer steps are treated as one unit; if one fails everything is rolled back."
}
},
{
"id": "sql-016",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Query mana yang menemukan pesanan yang customer_id-nya tidak ada di tabel customers?",
"en": "Which query finds orders whose customer_id does not exist in customers?"
},
"options": {
"id": [
"SELECT o.* FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;",
"SELECT o.* FROM orders o INNER JOIN customers c ON c.id = o.customer_id WHERE c.id > 0;",
"SELECT o.* FROM orders o WHERE o.customer_id IS NOT NULL AND o.customer_id > 0;",
"SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;"
],
"en": [
"SELECT o.* FROM orders o LEFT JOIN customers c ON c.id = o.customer_id WHERE c.id IS NULL;",
"SELECT o.* FROM orders o INNER JOIN customers c ON c.id = o.customer_id WHERE c.id > 0;",
"SELECT o.* FROM orders o WHERE o.customer_id IS NOT NULL AND o.customer_id > 0;",
"SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;"
]
},
"answer": 0,
"exp": {
"id": "LEFT JOIN lalu c.id IS NULL menampilkan baris yang tidak punya pasangan: cara standar memeriksa integritas referensial. INNER JOIN justru hanya menampilkan yang cocok.",
"en": "LEFT JOIN then c.id IS NULL shows rows with no match: the standard referential-integrity check. INNER JOIN shows only matching rows."
}
},
{
"id": "int-007",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Ceritakan bug tersulit yang pernah Anda temukan dan bagaimana Anda menanganinya.",
"en": "Tell me about the hardest bug you found and how you handled it."
},
"model": {
"id": "Gunakan STAR: konteks singkat, langkah reproduksi dan penyempitan penyebab (log, data, environment), kerja sama dengan developer sampai root cause, dampak bisnis, lalu pelajaran atau pencegahan (regression test baru, perbaikan proses). Hindari menyebut data internal perusahaan.",
"en": "Use STAR: brief context, reproduction and narrowing down the cause (logs, data, environment), working with developers to the root cause, business impact, then the lesson or prevention (new regression test, process fix). Avoid naming internal company data."
},
"keywords": [
[
"reproduksi",
"reproduce",
"langkah",
"steps"
],
[
"root cause",
"akar",
"penyebab",
"log"
],
[
"dampak",
"impact",
"risiko",
"risk"
],
[
"pelajaran",
"lesson",
"cegah",
"prevent",
"regression",
"regresi"
]
],
"pass": 0.6
},
{
"id": "int-008",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Developer menolak bug yang Anda laporkan dengan alasan \"itu bukan bug\". Apa yang Anda lakukan?",
"en": "A developer rejects a bug you reported saying \"that's not a bug\". What do you do?"
},
"model": {
"id": "Cek ulang bukti dan reproduksi, rujuk requirement atau acceptance criteria, diskusikan langsung (bukan hanya lewat komentar), jelaskan dampak ke user, dan bila tetap berbeda libatkan product owner untuk memutuskan. Pertahankan sikap konstruktif, bukan menyalahkan.",
"en": "Re-check evidence and reproduction, refer to the requirement or acceptance criteria, discuss directly (not only via comments), explain the user impact, and if opinions still differ involve the product owner to decide. Stay constructive, not blaming."
},
"keywords": [
[
"bukti",
"evidence",
"reproduksi",
"reproduce"
],
[
"requirement",
"acceptance",
"kriteria",
"spesifikasi"
],
[
"diskusi",
"discuss",
"bicara",
"talk"
],
[
"product owner",
"po",
"stakeholder",
"eskalasi",
"escalate"
]
],
"pass": 0.6
},
{
"id": "int-009",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda menguji fitur login?",
"en": "How would you test a login feature?"
},
"model": {
"id": "Klarifikasi requirement lalu rancang test: kredensial valid dan tidak valid, nilai batas panjang input, karakter khusus, akun terkunci setelah percobaan gagal, sesi dan logout, \"ingat saya\", security (brute force, SQL injection, pesan error yang tidak membocorkan keberadaan akun), accessibility, dan performance. Putuskan mana yang diotomasi.",
"en": "Clarify requirements, then design tests: valid and invalid credentials, input length boundaries, special characters, lockout after failed attempts, session and logout, \"remember me\", security (brute force, SQL injection, error messages that do not reveal account existence), accessibility and performance. Decide what to automate."
},
"keywords": [
[
"valid",
"invalid",
"tidak valid"
],
[
"batas",
"boundary",
"bva",
"panjang",
"length"
],
[
"keamanan",
"security",
"brute",
"lock",
"terkunci",
"injection"
],
[
"sesi",
"session",
"logout",
"pesan error",
"error message"
]
],
"pass": 0.6
},
{
"id": "int-010",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Bagaimana Anda memutuskan bahwa sebuah release aman untuk dirilis (go/no-go)?",
"en": "How do you decide that a release is safe to ship (go/no-go)?"
},
"model": {
"id": "Berdasarkan bukti, bukan perasaan: exit criteria terpenuhi (coverage, test kritis lulus), defect terbuka beserta severity dan workaround, risiko residual, hasil regression dan smoke di environment mirip produksi, rencana rollback, lalu keputusan bersama stakeholder yang menerima risikonya.",
"en": "Based on evidence, not feeling: exit criteria met (coverage, critical tests pass), open defects with severity and workarounds, residual risk, regression and smoke results on a production-like environment, a rollback plan, then a joint decision with stakeholders who accept the risk."
},
"keywords": [
[
"exit criteria",
"kriteria",
"coverage",
"cakupan"
],
[
"defect",
"bug",
"severity"
],
[
"risiko",
"risk",
"residual"
],
[
"stakeholder",
"rollback",
"keputusan",
"decision"
]
],
"pass": 0.6
},
{
"id": "int-011",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Test otomatis Anda kadang lulus kadang gagal (flaky). Bagaimana Anda menanganinya?",
"en": "Your automated test sometimes passes and sometimes fails (flaky). How do you handle it?"
},
"model": {
"id": "Cari root cause dulu: wait yang salah, data bersama antar test, ketergantungan urutan, environment tidak stabil, atau race condition di aplikasi. Kumpulkan bukti (log, trace, video), perbaiki penyebabnya, karantina sementara test yang mengganggu pipeline, dan pakai retry hanya sebagai jaring pengaman, bukan solusi.",
"en": "Find the root cause first: wrong waits, data shared between tests, order dependence, an unstable environment or a race condition in the app. Gather evidence (logs, traces, video), fix the cause, quarantine the test temporarily if it blocks the pipeline, and use retries only as a safety net, not a solution."
},
"keywords": [
[
"akar",
"root cause",
"penyebab"
],
[
"wait",
"tunggu",
"data",
"isolasi",
"isolation",
"race"
],
[
"bukti",
"log",
"trace",
"video",
"evidence"
],
[
"retry",
"karantina",
"quarantine"
]
],
"pass": 0.6
},
{
"id": "int-012",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Anda diminta menguji sebuah API tanpa dokumentasi. Bagaimana langkah Anda?",
"en": "You are asked to test an API with no documentation. What are your steps?"
},
"model": {
"id": "Cari sumber informasi: tanya developer, baca kode atau OpenAPI/Swagger bila ada, amati lalu lintas dari aplikasi client. Jelajahi endpoint secara eksploratori (method, status, header, error), catat temuan sebagai kontrak sementara, konfirmasi ke developer, lalu ubah menjadi test otomatis yang mencakup positif, negatif, autentikasi, dan batas.",
"en": "Find information sources: ask developers, read the code or OpenAPI/Swagger if available, observe traffic from the client app. Explore endpoints exploratively (methods, status, headers, errors), record findings as a provisional contract, confirm with developers, then turn it into automated tests covering positive, negative, authentication and boundaries."
},
"keywords": [
[
"developer",
"tanya",
"ask",
"swagger",
"openapi",
"kode",
"code"
],
[
"eksploratori",
"exploratory",
"explore",
"postman",
"traffic",
"lalu lintas"
],
[
"kontrak",
"contract",
"catat",
"document"
],
[
"negatif",
"negative",
"autentikasi",
"authentication",
"batas",
"boundary"
]
],
"pass": 0.6
},
{
"id": "fun-001",
"topic": "fundamentals",
"level": 1,
"type": "mcq",
"q": {
"id": "Apa beda verifikasi dan validasi?",
"en": "What is the difference between verification and validation?"
},
"options": {
"id": [
"Verifikasi: sesuai spesifikasi? Validasi: sesuai kebutuhan?",
"Verifikasi dilakukan user; validasi dilakukan developer",
"Verifikasi hanya untuk kode; validasi hanya untuk dokumen",
"Keduanya sama dan hanya beda istilah antar perusahaan"
],
"en": [
"Verification: matches the spec? Validation: meets user needs?",
"Verification is done by users; validation is done by developers",
"Verification is only for code; validation is only for documents",
"Both are the same and only differ by company terminology"
]
},
"answer": 0,
"exp": {
"id": "Verifikasi memeriksa kesesuaian dengan spesifikasi ('membangun dengan benar'); validasi memeriksa apakah produk memenuhi kebutuhan nyata ('membangun yang benar'). Produk bisa lolos verifikasi tetapi gagal validasi bila spesifikasinya salah.",
"en": "Verification checks conformance to the spec ('building it right'); validation checks it meets real needs ('building the right thing'). A product can pass verification yet fail validation if the spec itself is wrong."
}
},
{
"id": "fun-002",
"topic": "fundamentals",
"level": 2,
"type": "mcq",
"q": {
"id": "Peran QA yang paling tepat dalam tim Scrum?",
"en": "What is the most fitting QA role in a Scrum team?"
},
"options": {
"id": [
"Menajamkan acceptance criteria sejak refinement dan menguji di dalam sprint",
"Menunggu fitur selesai lalu menguji di fase terpisah setelah sprint",
"Hanya menulis bug report untuk dibaca manajer proyek",
"Memutuskan prioritas backlog menggantikan product owner"
],
"en": [
"Sharpen acceptance criteria from refinement and test within the sprint",
"Wait for features to finish, then test in a separate post-sprint phase",
"Only write bug reports for the project manager to read",
"Decide backlog priority in place of the product owner"
]
},
"answer": 0,
"exp": {
"id": "Dalam Agile kualitas dikerjakan bersama sepanjang sprint. Fase test terpisah mengembalikan pola waterfall, dan prioritas backlog adalah wewenang product owner.",
"en": "In Agile, quality is built together throughout the sprint. A separate test phase brings back waterfall habits, and backlog priority belongs to the product owner."
}
},
{
"id": "fun-003",
"topic": "fundamentals",
"level": 2,
"type": "mcq",
"q": {
"id": "Aturan usia minimal 18 tahun. Nilai uji boundary value yang paling relevan?",
"en": "The rule says minimum age is 18. Which boundary values are most relevant?"
},
"options": {
"id": [
"17, 18, 19",
"1, 50, 100",
"0, 18, 180",
"18, 28, 38"
],
"en": [
"17, 18, 19",
"1, 50, 100",
"0, 18, 180",
"18, 28, 38"
]
},
"answer": 0,
"exp": {
"id": "BVA menguji di dan sekitar tepi: tepat di bawah (17), tepat di batas (18), dan tepat di atas (19). Nilai lain tidak berada di tepi kelompok.",
"en": "BVA tests at and around the edge: just below (17), on the boundary (18) and just above (19). The other values are not at a partition edge."
}
},
{
"id": "fun-004",
"topic": "fundamentals",
"level": 2,
"type": "mcq",
"q": {
"id": "Status pesanan: baru, dibayar, dikirim, dibatalkan. Teknik apa paling cocok untuk menguji perpindahan statusnya?",
"en": "Order status: new, paid, shipped, cancelled. Which technique fits testing its transitions?"
},
"options": {
"id": [
"State transition testing",
"Equivalence partitioning pada nama customer",
"Uji performance load tinggi",
"Compatibility test browser"
],
"en": [
"State transition testing",
"Equivalence partitioning on the customer name",
"High-load performance testing",
"Browser compatibility testing"
]
},
"answer": 0,
"exp": {
"id": "State transition memodelkan status, kejadian, dan perpindahan yang sah maupun tidak sah (mis. dikirim lalu dibayar harus ditolak).",
"en": "State transition models states, events and valid or invalid moves (e.g. shipped then paid must be rejected)."
}
},
{
"id": "fun-005",
"topic": "fundamentals",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa itu test oracle?",
"en": "What is a test oracle?"
},
"options": {
"id": [
"Sumber penentu hasil yang benar dari sebuah test",
"Alat otomasi untuk menjalankan test secara paralel",
"Database khusus yang menyimpan seluruh test data",
"Laporan ringkasan hasil regression tiap malam"
],
"en": [
"A source that decides the correct result of a test",
"An automation tool for running tests in parallel",
"A special database that stores all of the test data",
"A nightly summary report of regression results"
]
},
"answer": 0,
"exp": {
"id": "Oracle bisa berupa spesifikasi, versi sebelumnya, sistem pembanding, atau perhitungan independen. Tanpa oracle, hasil sebenarnya tidak bisa dinilai.",
"en": "An oracle can be a spec, a previous version, a reference system or an independent calculation. Without one, an actual result cannot be judged."
}
},
{
"id": "fun-006",
"topic": "fundamentals",
"level": 1,
"type": "mcq",
"q": {
"id": "Urutan siklus TDD yang benar?",
"en": "What is the correct TDD cycle?"
},
"options": {
"id": [
"Tulis test gagal, buat lulus, refactor",
"Tulis kode, tulis test, abaikan hasilnya",
"Refactor dulu, tulis kode, hapus test",
"Deploy dulu, tulis test, lalu perbaiki kode"
],
"en": [
"Write a failing test, make it pass, refactor",
"Write code, write a test, ignore the result",
"Refactor first, write code, delete the test",
"Deploy first, write a test, then fix the code"
]
},
"answer": 0,
"exp": {
"id": "Red-green-refactor: test gagal dulu (red), kode minimal agar lulus (green), lalu rapikan desain tanpa mengubah perilaku.",
"en": "Red-green-refactor: failing test first (red), minimal code to pass (green), then clean the design without changing behaviour."
}
},
{
"id": "fun-007",
"topic": "fundamentals",
"level": 2,
"type": "mcq",
"q": {
"id": "Skenario Given-When-Then manakah yang ditulis dengan baik?",
"en": "Which Given-When-Then scenario is written well?"
},
"options": {
"id": [
"Given pesanan dibayar, When customer membatalkan, Then dana dikembalikan",
"Given klik tombol biru, When klik menu ketiga, Then lihat halaman",
"Given buka browser, When ketik teks, Then tekan enter lalu tutup",
"Given sebuah database, When sebuah query dijalankan, Then ada hasil"
],
"en": [
"Given an order is paid, When the customer cancels, Then the money is refunded",
"Given click the blue button, When click the third menu, Then see the page",
"Given open the browser, When type text, Then press enter then close",
"Given a database, When a query is run, Then there is a result"
]
},
"answer": 0,
"exp": {
"id": "Skenario BDD menggambarkan perilaku bisnis yang bisa disepakati semua pihak, bukan rangkaian klik UI.",
"en": "A BDD scenario describes business behaviour everyone can agree on, not a sequence of interface clicks."
}
},
{
"id": "fun-008",
"topic": "fundamentals",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa test data sebaiknya disiapkan dan dibersihkan oleh test itu sendiri?",
"en": "Why should each test prepare and clean up its own data?"
},
"options": {
"id": [
"Agar test independen, bisa diulang, dan aman paralel",
"Agar suite berjalan lebih lambat dan lebih teliti",
"Agar tidak perlu environment khusus untuk menguji",
"Agar data produksi bisa langsung dipakai ulang"
],
"en": [
"So tests stay independent, repeatable and parallel-safe",
"So the suite runs slower and with more thoroughness",
"So that no dedicated test environment is needed",
"So that production data can be reused directly"
]
},
"answer": 0,
"exp": {
"id": "Data bersama membuat test saling memengaruhi sehingga hasilnya berubah-ubah. Data produksi juga membawa risiko privasi.",
"en": "Shared data makes tests affect each other so results vary. Production data also carries privacy risk."
}
},
{
"id": "nfn-001",
"topic": "nonfunctional",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa laporan performance sebaiknya memakai persentil (p95/p99) dan bukan hanya rata-rata?",
"en": "Why should performance reports use percentiles (p95/p99) rather than only the average?"
},
"options": {
"id": [
"Rata-rata menyembunyikan user yang sangat lambat",
"Persentil selalu bernilai lebih kecil dari rata-rata",
"Rata-rata tidak dapat dihitung pada data waktu respons",
"Persentil hanya berlaku untuk pengukuran database"
],
"en": [
"The average hides users with very slow responses",
"Percentiles are always smaller than the average",
"The average cannot be computed on response time data",
"Percentiles only apply to database measurements"
]
},
"answer": 0,
"exp": {
"id": "Sebagian kecil permintaan yang sangat lambat tidak terlihat di rata-rata, padahal itulah yang dirasakan user tertentu. Persentil menampilkan ekor distribusi.",
"en": "A small share of very slow requests vanishes in the average, yet some users feel exactly that. Percentiles show the tail of the distribution."
}
},
{
"id": "nfn-002",
"topic": "nonfunctional",
"level": 2,
"type": "mcq",
"q": {
"id": "Perbedaan load test dan stress test?",
"en": "What is the difference between a load test and a stress test?"
},
"options": {
"id": [
"Load: load diharapkan; stress: lewat batas untuk cari titik gagal",
"Load: tanpa user sama sekali; stress: dengan satu user",
"Load: khusus untuk security; stress: khusus untuk tampilan",
"Tidak ada perbedaan, hanya beda nama pada alat tertentu"
],
"en": [
"Load: expected demand; stress: past limits to find the break point",
"Load: with no users at all; stress: with one single user",
"Load: for security checks only; stress: for appearance only",
"No difference, only different names in particular tools"
]
},
"answer": 0,
"exp": {
"id": "Load test memverifikasi sistem sanggup menangani load normal-puncak; stress test mencari batas dan perilaku saat gagal (apakah pulih dengan baik).",
"en": "A load test verifies the system handles normal-to-peak demand; a stress test finds the limit and how it behaves on failure (does it recover gracefully)."
}
},
{
"id": "nfn-003",
"topic": "nonfunctional",
"level": 2,
"type": "mcq",
"q": {
"id": "Test load 500 user menunjukkan CPU mesin load generator 100% sedangkan server target santai. Kesimpulan?",
"en": "A 500-user load test shows the load generator at 100% CPU while the target server is idle. What follows?"
},
"options": {
"id": [
"Tidak valid: bottleneck di load generator, bukan di target",
"Server target pasti sangat cepat dan efisien sekali",
"Sistem dinyatakan lulus load test dengan sangat baik",
"Jumlah user sebaiknya dinaikkan lagi segera mungkin"
],
"en": [
"Invalid: the bottleneck is the load generator, not the target",
"The target server must be extremely fast and efficient",
"The system is declared to pass the load test well",
"The user count should be raised again right away"
]
},
"answer": 0,
"exp": {
"id": "Bila generator jenuh, angka latency dan throughput mencerminkan generator, bukan sistem yang diuji. Tambah mesin load generator atau kurangi load per mesin.",
"en": "When the generator is saturated, latency and throughput reflect the generator, not the system under test. Add generators or reduce the per-machine load."
}
},
{
"id": "nfn-004",
"topic": "nonfunctional",
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang termasuk risiko 'broken access control' pada OWASP Top 10?",
"en": "Which is an example of 'broken access control' in the OWASP Top 10?"
},
"options": {
"id": [
"User biasa membuka halaman admin lewat URL langsung",
"Situs memuat gambar lebih lambat di jaringan 3G biasa",
"Warna tombol utama tidak persis sesuai desain awal",
"Teks bantuan di halaman profil memuat salah ketik"
],
"en": [
"A normal user opens an admin page via a direct URL",
"The site loads images more slowly on a regular 3G network",
"The main button colour does not match the original design",
"The help text on the profile page contains a typo"
]
},
"answer": 0,
"exp": {
"id": "Access control memastikan setiap user hanya mengakses yang berhak. Mengandalkan 'menu disembunyikan' tanpa pemeriksaan di server adalah celah klasik.",
"en": "Access control ensures each user reaches only what they are entitled to. Relying on 'hiding the menu' without a server-side check is a classic hole."
}
},
{
"id": "nfn-005",
"topic": "nonfunctional",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa alat accessibility otomatis (axe, Lighthouse) tidak cukup?",
"en": "Why are automated accessibility tools (axe, Lighthouse) not enough?"
},
"options": {
"id": [
"Hanya sebagian; keyboard dan pembaca layar perlu uji manual",
"Alat otomatis selalu memberikan hasil yang salah semua",
"WCAG sama sekali tidak bisa diuji oleh tim mana pun",
"Accessibility hanya berkaitan dengan warna halaman saja"
],
"en": [
"Only part; keyboard and screen readers need manual checks",
"Automated tools always give results that are all wrong",
"WCAG cannot be tested by any team at all, ever",
"Accessibility is only related to the colours of a page"
]
},
"answer": 0,
"exp": {
"id": "Alat menangkap pelanggaran yang bisa dideteksi mesin (kontras, label hilang). Urutan fokus yang logis atau teks alternatif yang bermakna butuh penilaian manusia.",
"en": "Tools catch machine-detectable violations (contrast, missing labels). A logical focus order or meaningful alt text needs human judgement."
}
},
{
"id": "nfn-006",
"topic": "nonfunctional",
"level": 1,
"type": "mcq",
"q": {
"id": "Apa singkatan POUR pada WCAG?",
"en": "What does POUR stand for in WCAG?"
},
"options": {
"id": [
"Perceivable, Operable, Understandable, Robust",
"Performance, Output, Usability, Reliability",
"Planning, Operation, Updates, Review",
"Public, Open, Universal, Reachable"
],
"en": [
"Perceivable, Operable, Understandable, Robust",
"Performance, Output, Usability, Reliability",
"Planning, Operation, Updates, Review",
"Public, Open, Universal, Reachable"
]
},
"answer": 0,
"exp": {
"id": "POUR adalah empat prinsip accessibility WCAG: dapat dipersepsi, dapat dioperasikan, dapat dipahami, dan kokoh terhadap teknologi bantu.",
"en": "POUR are the four WCAG accessibility principles: perceivable, operable, understandable and robust against assistive technology."
}
},
{
"id": "nfn-007",
"topic": "nonfunctional",
"level": 2,
"type": "mcq",
"q": {
"id": "Cara memilih kombinasi browser/perangkat untuk compatibility test?",
"en": "How should you choose browser/device combinations for compatibility testing?"
},
"options": {
"id": [
"Dari data user nyata (analytics) dan risiko",
"Semua kombinasi yang pernah ada di pasar",
"Hanya browser yang dipakai oleh developer",
"Dipilih acak setiap kali ada release baru"
],
"en": [
"From real user data (analytics) and risk",
"Every combination that has ever existed on the market",
"Only the browsers that the developers use",
"Chosen at random each time there is a new release"
]
},
"answer": 0,
"exp": {
"id": "Semua kombinasi mustahil diuji. Analytics menunjukkan yang benar-benar dipakai user sehingga usaha tertuju pada risiko terbesar.",
"en": "Testing all combinations is impossible. Analytics shows what users actually use, so effort goes to the biggest risk."
}
},
{
"id": "nfn-008",
"topic": "nonfunctional",
"level": 3,
"type": "mcq",
"q": {
"id": "Security testing di sistem milik klien tanpa izin tertulis, 'hanya untuk membantu'. Penilaian?",
"en": "Security testing a client's system without written permission, 'just to help'. Assessment?"
},
"options": {
"id": [
"Tidak etis dan bisa melanggar hukum; minta izin tertulis",
"Boleh saja selama niatnya memang baik",
"Boleh bila hanya dilakukan pada malam hari",
"Boleh bila hasilnya dirahasiakan dari semua orang"
],
"en": [
"Unethical and possibly illegal; get written permission",
"Perfectly fine as long as the intent is good",
"Fine if it is only done during the night",
"Fine if the results are kept secret from everyone"
]
},
"answer": 0,
"exp": {
"id": "Niat baik tidak menggantikan otorisasi. Security test hanya pada sistem yang secara jelas Anda berwenang menguji.",
"en": "Good intent does not replace authorisation. Security-test only systems you are clearly authorised to test."
}
},
{
"id": "tool-001",
"topic": "tooling",
"level": 2,
"type": "mcq",
"q": {
"id": "Perbedaan utama git merge dan git rebase?",
"en": "What is the main difference between git merge and git rebase?"
},
"options": {
"id": [
"Merge menyatukan riwayat; rebase menulis ulang commit",
"Merge menghapus sebuah cabang; rebase membuat cabang",
"Rebase hanya dipakai untuk file gambar dan biner",
"Tidak ada perbedaan sama sekali antara keduanya"
],
"en": [
"Merge joins histories; rebase rewrites commits",
"Merge deletes a branch; rebase creates a branch",
"Rebase is only used for image and binary files",
"There is no difference at all between the two"
]
},
"answer": 0,
"exp": {
"id": "Rebase mengubah riwayat commit sehingga tidak dilakukan pada cabang yang dipakai bersama. Merge mempertahankan riwayat apa adanya.",
"en": "Rebase changes commit history so it is avoided on shared branches. Merge preserves history as is."
}
},
{
"id": "tool-002",
"topic": "tooling",
"level": 2,
"type": "mcq",
"q": {
"id": "Anda tidak sengaja meng-commit API key ke repository. Tindakan yang benar?",
"en": "You accidentally committed an API key to the repository. What is the right action?"
},
"options": {
"id": [
"Cabut dan ganti key, lalu bersihkan riwayat bila perlu",
"Hapus commit terakhir saja lalu anggap selesai",
"Biarkan saja karena repository ini bersifat privat",
"Ubah nama file yang memuat key tersebut saja"
],
"en": [
"Revoke and rotate the key, then clean history if needed",
"Just delete the last commit and consider it done",
"Leave it alone because the repository is private",
"Only rename the file that contains the key"
]
},
"answer": 0,
"exp": {
"id": "Key yang pernah masuk riwayat harus dianggap bocor. Menghapus commit tidak cukup karena salinan dan cache mungkin ada.",
"en": "A key that ever entered history must be considered leaked. Deleting the commit is not enough because copies and caches may exist."
}
},
{
"id": "tool-003",
"topic": "tooling",
"level": 2,
"type": "mcq",
"q": {
"id": "Tujuan Docker pada environment test?",
"en": "What is Docker's purpose in a test environment?"
},
"options": {
"id": [
"Membuat environment sama di laptop dan CI",
"Menggantikan seluruh test otomatis di proyek",
"Menambah kecepatan CPU secara fisik di server",
"Menghapus kebutuhan akan versi dependensi aplikasi"
],
"en": [
"Creating the same environment on laptops and CI",
"Replacing every automated test in the project",
"Physically adding CPU speed on the server",
"Removing the need for application dependency versions"
]
},
"answer": 0,
"exp": {
"id": "Container membungkus aplikasi dan dependensinya sehingga perbedaan environment, penyebab umum flaky test dan 'works on my machine', berkurang.",
"en": "Containers bundle the app and its dependencies, reducing environment differences, a common cause of flaky tests and 'works on my machine'."
}
},
{
"id": "tool-004",
"topic": "tooling",
"level": 2,
"type": "mcq",
"q": {
"id": "Laporan test otomatis yang berguna harus menjawab apa?",
"en": "What must a useful automated test report answer?"
},
"options": {
"id": [
"Apa yang gagal, di mana, dan buktinya (log, gambar)",
"Hanya berapa banyak test yang sudah dijalankan saja",
"Siapa nama penulis dari setiap test yang ada ini",
"Berapa lama server CI tetap menyala pada hari ini"
],
"en": [
"What failed, where, and the evidence (logs, images)",
"Only how many tests have been run so far in total",
"The name of the author of each of the existing tests",
"How long the CI server has stayed switched on today"
]
},
"answer": 0,
"exp": {
"id": "Laporan yang tidak memberi bukti memaksa orang mereproduksi failure dari nol. Failure artifact mempercepat diagnosis.",
"en": "A report without evidence forces people to reproduce failures from scratch. Failure artefacts speed up diagnosis."
}
},
{
"id": "tool-005",
"topic": "tooling",
"level": 2,
"type": "mcq",
"q": {
"id": "Tiga sinyal observability?",
"en": "What are the three observability signals?"
},
"options": {
"id": [
"Log, metrik, trace",
"CPU, RAM, disk",
"Build, test, deploy",
"Alpha, beta, gamma"
],
"en": [
"Logs, metrics, traces",
"CPU, RAM, disk",
"Build, test, deploy",
"Alpha, beta, gamma"
]
},
"answer": 0,
"exp": {
"id": "Log mencatat kejadian, metrik menghitung tren, trace mengikuti satu request lintas layanan. Ketiganya saling melengkapi saat menyelidiki bug produksi.",
"en": "Logs record events, metrics count trends, traces follow a single request across services. Together they help investigate production bugs."
}
},
{
"id": "tool-006",
"topic": "tooling",
"level": 3,
"type": "mcq",
"q": {
"id": "Dalam RCA bug produksi, mana yang paling tepat disebut root cause yang bisa dicegah?",
"en": "In an RCA of a production bug, which is best called the preventable root cause?"
},
"options": {
"id": [
"Kontrol yang hilang hingga bug lolos, mis. tanpa test",
"Baris kode tempat error pertama kali muncul di log",
"User yang melaporkan masalah itu pertama kalinya",
"Waktu terjadinya insiden menurut jam server produksi"
],
"en": [
"The missing control that let it through, e.g. no test",
"The line of code where the error first appeared",
"The user who first reported the problem",
"The time of the incident according to server clock"
]
},
"answer": 0,
"exp": {
"id": "Baris kode adalah penyebab langsung. Root cause yang bisa dicegah adalah celah proses atau kontrol (tidak ada test, review terlewat, requirement ambigu) yang membuat bug lolos. Satu insiden bisa punya beberapa faktor penyebab.",
"en": "The code line is the proximate cause. The preventable root cause is the process or control gap (no test, missed review, ambiguous requirement) that let the bug through. One incident can have several contributing factors."
}
},
{
"id": "tool-007",
"topic": "tooling",
"level": 2,
"type": "mcq",
"q": {
"id": "Tantangan khas testing aplikasi mobile dibanding web?",
"en": "What is a typical challenge of mobile testing compared with web?"
},
"options": {
"id": [
"Fragmentasi perangkat/OS, izin, jaringan buruk, interupsi",
"Perangkat mobile memang tidak memiliki layar sama sekali",
"Aplikasi mobile tidak mungkin bisa diotomasi sama sekali",
"Hanya tersedia satu ukuran layar untuk semua perangkat"
],
"en": [
"Device/OS fragmentation, permissions, bad networks, interrupts",
"Mobile devices simply do not have any screen at all",
"Mobile apps cannot possibly be automated in any way",
"Only a single screen size exists for every kind of device"
]
},
"answer": 0,
"exp": {
"id": "Perangkat, versi OS, izin (kamera/lokasi), kondisi jaringan, dan interupsi (telepon, notifikasi) membuat kasus mobile unik. Appium dan alat lain bisa mengotomasi.",
"en": "Devices, OS versions, permissions (camera/location), network conditions and interruptions (calls, notifications) make mobile unique. Appium and others can automate it."
}
},
{
"id": "tool-008",
"topic": "tooling",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa pipeline CI sebaiknya menyimpan screenshot/trace saat test gagal?",
"en": "Why should CI keep screenshots/traces when a test fails?"
},
"options": {
"id": [
"Agar failure bisa didiagnosis tanpa reproduksi manual",
"Agar pipeline menjadi lebih lambat dari biasanya",
"Agar developer tidak perlu lagi membaca log apa pun",
"Agar test tidak akan pernah gagal di masa depan"
],
"en": [
"So failures can be diagnosed without manual reproduction",
"So the pipeline becomes slower than it normally is",
"So developers no longer need to read any logs at all",
"So tests will never fail again in the future"
]
},
"answer": 0,
"exp": {
"id": "Failure CI sering tidak muncul lokal. Artefak menyimpan keadaan saat gagal sehingga penyebab bisa ditelusuri.",
"en": "CI failures often do not reproduce locally. Artefacts keep the state at failure so the cause can be traced."
}
},
{
"id": "int-019",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Ceritakan saat Anda berselisih pendapat dengan developer soal sebuah bug. Bagaimana akhirnya?",
"en": "Tell me about a time you disagreed with a developer about a bug. How did it end?"
},
"model": {
"id": "Gunakan STAR. Tunjukkan Anda memisahkan fakta dari opini: langkah reproduksi, log atau rekaman, dan dampak ke user. Dengarkan sudut pandang developer, cari titik temu (mungkin perilaku sesuai spesifikasi tetapi spesifikasinya yang bermasalah), libatkan product owner bila perlu, dan sebut hasilnya serta hubungan kerja sesudahnya. Hindari menyalahkan orang.",
"en": "Use STAR. Show you separated facts from opinion: reproduction steps, logs or a recording, and user impact. Listen to the developer's view, find common ground (maybe the behaviour matches the spec but the spec is the problem), involve the product owner when needed, and state the result and the working relationship afterwards. Avoid blaming people."
},
"keywords": [
[
"fakta",
"bukti",
"evidence",
"reproduksi",
"reproduce",
"log"
],
[
"dengar",
"listen",
"sudut pandang",
"perspective",
"kolaborasi",
"collaborat"
],
[
"product owner",
"stakeholder",
"spesifikasi",
"spec",
"requirement"
],
[
"hasil",
"result",
"outcome",
"pelajaran",
"lesson"
]
],
"pass": 0.6
},
{
"id": "int-020",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Ceritakan kesalahan yang pernah Anda buat sebagai QA dan apa yang Anda ubah sesudahnya.",
"en": "Tell me about a mistake you made as a QA and what you changed afterwards."
},
"model": {
"id": "Pilih kesalahan nyata yang tidak fatal. Jelaskan situasi, akui tanggung jawab tanpa membela diri, sebutkan dampaknya, tindakan perbaikan yang segera dilakukan, dan perubahan jangka panjang (mis. checklist, regression test baru, review). Tutup dengan pelajaran yang bisa diterapkan lagi.",
"en": "Choose a real, non-fatal mistake. Describe the situation, own it without defensiveness, state the impact, the immediate fix, and the long-term change (e.g. a checklist, a new regression test, a review). Close with a lesson you can reuse."
},
"keywords": [
[
"akui",
"own",
"tanggung jawab",
"responsib",
"admit"
],
[
"dampak",
"impact",
"akibat"
],
[
"perbaik",
"fix",
"checklist",
"regression",
"proses",
"process"
],
[
"pelajaran",
"lesson",
"belajar",
"learn"
]
],
"pass": 0.6
},
{
"id": "int-021",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Anda punya lima tugas penting dan waktu hanya cukup untuk dua. Bagaimana memutuskan?",
"en": "You have five important tasks and time for only two. How do you decide?"
},
"model": {
"id": "Nilai berdasarkan risiko dan dampak bisnis (kemungkinan x dampak), tenggat, dan ketergantungan. Konfirmasi prioritas dengan product owner atau atasan alih-alih menebak. Komunikasikan secara terbuka apa yang ditunda beserta risikonya, dan cari cara mendelegasikan atau mengotomasi sebagian.",
"en": "Assess by risk and business impact (likelihood x impact), deadlines and dependencies. Confirm priorities with the product owner or manager instead of guessing. Communicate openly what is deferred and its risk, and look for ways to delegate or automate part of it."
},
"keywords": [
[
"risiko",
"risk",
"dampak",
"impact"
],
[
"tenggat",
"deadline",
"prioritas",
"priorit"
],
[
"konfirmasi",
"confirm",
"product owner",
"atasan",
"manager",
"komunikasi",
"communicat"
],
[
"tunda",
"defer",
"delegasi",
"delegate",
"otomasi",
"automat"
]
],
"pass": 0.6
},
{
"id": "int-022",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Product owner menganggap bug yang Anda temukan 'tidak penting', Anda yakin sebaliknya. Apa yang Anda lakukan?",
"en": "The product owner says a bug you found 'does not matter', but you disagree. What do you do?"
},
"model": {
"id": "Siapkan data, bukan opini: seberapa banyak user terdampak, seberapa sering, dampak ke uang, reputasi, atau security, dan apakah ada workaround. Presentasikan singkat, tawarkan opsi (perbaiki sekarang, workaround, jadwalkan), lalu hormati keputusan yang diambil sambil mencatat risiko residual di tiket.",
"en": "Bring data, not opinions: how many users are affected, how often, the impact on money, reputation or security, and whether a workaround exists. Present briefly, offer options (fix now, workaround, schedule), then respect the decision while recording the residual risk in the ticket."
},
"keywords": [
[
"data",
"bukti",
"evidence",
"pengguna",
"user",
"frekuensi",
"frequency"
],
[
"dampak",
"impact",
"risiko",
"risk"
],
[
"opsi",
"option",
"workaround",
"jadwal",
"schedule"
],
[
"catat",
"record",
"dokumen",
"document",
"keputusan",
"decision",
"hormati",
"respect"
]
],
"pass": 0.6
},
{
"id": "int-023",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Anda bergabung ke tim yang belum punya test otomasi. Apa yang Anda lakukan di 90 hari pertama?",
"en": "You join a team with no test automation. What do you do in your first 90 days?"
},
"model": {
"id": "Bulan pertama: pahami produk, alur kritis, risiko, dan proses release; bangun hubungan dengan developer dan product owner. Lalu mulai kecil: smoke test otomatis untuk alur paling penting dan jalankan di CI. Bulan berikutnya perluas ke test API dan regression berisiko tinggi, tetapkan konvensi dan test data, serta ukur hasilnya (waktu regression, bug yang tertangkap).",
"en": "Month one: learn the product, critical flows, risks and the release process; build relationships with developers and the product owner. Then start small: automated smoke tests for the most important flow, run in CI. In later months expand to API tests and high-risk regression, set conventions and test data, and measure results (regression time, bugs caught)."
},
"keywords": [
[
"pahami",
"understand",
"risiko",
"risk",
"alur kritis",
"critical"
],
[
"smoke",
"kecil",
"small"
],
[
"ci",
"pipeline"
],
[
"ukur",
"measure",
"api",
"regression",
"konvensi",
"convention"
]
],
"pass": 0.6
},
{
"id": "int-024",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda menguji fitur login?",
"en": "How would you test a login feature?"
},
"model": {
"id": "Positif: kredensial valid, ingat saya, logout. Negatif: password salah, email tidak terdaftar (pesan generik), kolom kosong, spasi di ujung, huruf besar-kecil. Batas dan security: panjang maksimum, rate limit atau penguncian akun, masa berlaku sesi dan token, injection, HTTPS. Lain-lain: accessibility, tombol back, banyak perangkat. Otomasi di level API dan beberapa E2E.",
"en": "Positive: valid credentials, remember me, logout. Negative: wrong password, unregistered email (generic message), empty fields, trailing spaces, letter case. Limits and security: maximum length, rate limiting or account lockout, session and token expiry, injection, HTTPS. Other: accessibility, back button, multiple devices. Automate at API level plus a few E2E."
},
"keywords": [
[
"positif",
"positive",
"valid"
],
[
"negatif",
"negative",
"salah",
"wrong",
"kosong",
"empty"
],
[
"keamanan",
"security",
"rate limit",
"kunci",
"lock",
"token",
"sesi",
"session"
],
[
"batas",
"boundary",
"aksesibilitas",
"accessib",
"otomasi",
"automat"
]
],
"pass": 0.6
},
{
"id": "int-025",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda menguji fitur pencarian pada toko online?",
"en": "How would you test the search feature of an online shop?"
},
"model": {
"id": "Fungsional: kata kunci cocok persis, sebagian, huruf besar-kecil, salah ketik, kosong, tidak ada hasil. Relevansi dan pengurutan, filter, serta pagination yang konsisten saat data berubah. Input khusus (karakter spesial, emoji, string sangat panjang, injection). Performance pada data besar dan kecepatan respons, plus tampilan di mobile dan accessibility.",
"en": "Functional: exact and partial keyword matches, letter case, typos, empty, no results. Relevance and sorting, filters, and pagination that stays consistent as data changes. Special input (special characters, emoji, very long strings, injection). Performance on large data and response time, plus mobile display and accessibility."
},
"keywords": [
[
"kata kunci",
"keyword",
"cocok",
"match",
"kosong",
"empty",
"tidak ada hasil",
"no result"
],
[
"relevan",
"urut",
"sort",
"filter",
"pagination"
],
[
"karakter",
"special",
"injection",
"panjang",
"long"
],
[
"performa",
"performance",
"mobile",
"aksesibilitas",
"accessib"
]
],
"pass": 0.6
},
{
"id": "int-026",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda menguji fitur upload file (upload)?",
"en": "How would you test a file upload feature?"
},
"model": {
"id": "Tipe dan ekstensi yang diizinkan atau ditolak (termasuk ekstensi ganda dan tipe palsu), ukuran minimum dan maksimum, nama file dengan spasi atau karakter khusus, file kosong atau rusak, upload banyak file sekaligus, koneksi putus di tengah, pembatalan, dan upload ulang. Security: file berbahaya, path traversal, dan pemeriksaan di server, bukan hanya di client.",
"en": "Allowed and rejected types and extensions (including double extensions and spoofed types), minimum and maximum size, file names with spaces or special characters, empty or corrupt files, multiple files at once, connection drop midway, cancel, and re-upload. Security: malicious files, path traversal, and checks on the server, not only on the client."
},
"keywords": [
[
"tipe",
"type",
"ekstensi",
"extension",
"format"
],
[
"ukuran",
"size",
"batas",
"limit",
"kosong",
"empty",
"rusak",
"corrupt"
],
[
"putus",
"interrupt",
"batal",
"cancel",
"jaringan",
"network",
"banyak",
"multiple"
],
[
"keamanan",
"security",
"server",
"berbahaya",
"malicious",
"traversal"
]
],
"pass": 0.6
},
{
"id": "int-027",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Bagaimana Anda menguji fitur transfer uang atau pembayaran?",
"en": "How would you test a money transfer or payment feature?"
},
"model": {
"id": "Happy path dan semua negative path (saldo kurang, nominal nol atau negatif, batas harian). Integritas: transaksi atomik dengan rollback, tidak ada pembayaran ganda saat retry (idempotency), konkurensi pada saldo yang sama, rekonsiliasi saldo dan ledger. Security: otorisasi, verifikasi tambahan, pengelolaan data kartu. Juga failure pihak ketiga, timeout, audit log, dan kepatuhan.",
"en": "Happy path and all negative paths (insufficient balance, zero or negative amount, daily limit). Integrity: atomic transactions with rollback, no double payment on retry (idempotency), concurrency on the same balance, reconciliation of balance and ledger. Security: authorisation, extra verification, handling of card data. Also third-party failures, timeouts, audit logs and compliance."
},
"keywords": [
[
"saldo",
"balance",
"negatif",
"negative",
"batas",
"limit"
],
[
"atomik",
"atomic",
"rollback",
"idempoten",
"konkuren",
"concurren",
"ganda",
"double"
],
[
"rekonsiliasi",
"reconcil",
"ledger",
"audit"
],
[
"keamanan",
"security",
"otorisasi",
"authoris",
"authoriz",
"timeout",
"pihak ketiga",
"third"
]
],
"pass": 0.6
},
{
"id": "int-028",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Bagaimana Anda menguji integrasi dengan API pembayaran pihak ketiga yang tidak stabil di environment test?",
"en": "How do you test an integration with an unstable third-party payment API in the test environment?"
},
"model": {
"id": "Pisahkan: gunakan mock atau stub untuk test harian agar deterministik dan bisa mensimulasikan error, timeout, dan respons lambat; pakai sandbox resmi untuk test integrasi terbatas; tambahkan contract test supaya perubahan kontrak terdeteksi. Uji juga sisi kita: retry dengan backoff, idempotency, penanganan status tidak pasti, dan alert saat vendor bermasalah.",
"en": "Separate concerns: use mocks or stubs for daily tests so they are deterministic and can simulate errors, timeouts and slow responses; use the official sandbox for limited integration tests; add contract tests so contract changes are detected. Also test our side: retry with backoff, idempotency, handling of uncertain status, and alerts when the vendor is unhealthy."
},
"keywords": [
[
"mock",
"stub",
"simulasi",
"simulat"
],
[
"sandbox",
"integrasi",
"integration"
],
[
"contract",
"kontrak"
],
[
"retry",
"backoff",
"idempoten",
"timeout",
"alert"
]
],
"pass": 0.6
},
{
"id": "int-029",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Anda diminta menguji fitur baru, tetapi requirement-nya samar. Apa langkah Anda?",
"en": "You are asked to test a new feature but the requirements are vague. What are your steps?"
},
"model": {
"id": "Ajukan pertanyaan klarifikasi kepada product owner dan developer, tuliskan asumsi dan acceptance criteria dalam contoh konkret (Given-When-Then), dan minta persetujuan. Sambil menunggu, lakukan exploratory testing berpiagam dan catat temuan. Catat hal yang belum jelas sebagai risiko, dan perbarui test saat requirement diperjelas.",
"en": "Ask clarifying questions to the product owner and developers, write the assumptions and acceptance criteria as concrete examples (Given-When-Then), and get them confirmed. Meanwhile do charter-based exploratory testing and record findings. Log unclear points as risks, and update tests as requirements are clarified."
},
"keywords": [
[
"tanya",
"ask",
"klarifikasi",
"clarif"
],
[
"asumsi",
"assumption",
"acceptance criteria",
"given-when-then",
"contoh",
"example"
],
[
"exploratory",
"eksplorasi"
],
[
"risiko",
"risk",
"catat",
"record",
"perbarui",
"update"
]
],
"pass": 0.6
},
{
"id": "int-030",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Test otomasi Anda tidak menemukan bug apa pun selama enam bulan. Apakah itu berarti test-nya tidak berguna?",
"en": "Your automated tests have found no bugs for six months. Does that mean they are useless?"
},
"model": {
"id": "Belum tentu. Regression test bernilai sebagai jaring pengaman: ketiadaan failure bisa berarti kode stabil atau perubahan aman. Tetapi perlu ditinjau: apakah test benar-benar bisa gagal (uji dengan mutasi atau bug sengaja), apakah coverage area berisiko memadai, dan apakah ada bug yang lolos ke produksi yang tidak tertangkap. Hapus atau gabungkan test yang berlebihan.",
"en": "Not necessarily. Regression tests are valuable as a safety net: no failures may mean stable code or safe changes. But review it: can the tests actually fail (try mutation or a deliberate bug), is coverage of risky areas adequate, and did bugs escape to production that the tests missed? Remove or merge redundant tests."
},
"keywords": [
[
"jaring pengaman",
"safety net",
"regresi",
"regression"
],
[
"bisa gagal",
"can fail",
"mutasi",
"mutation",
"sengaja",
"deliberate"
],
[
"cakupan",
"coverage",
"risiko",
"risk"
],
[
"lolos",
"escape",
"produksi",
"production",
"hapus",
"remove",
"redundan"
]
],
"pass": 0.6
},
{
"id": "int-031",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Bagaimana Anda mengukur apakah upaya QA di tim berhasil?",
"en": "How do you measure whether QA is succeeding in a team?"
},
"model": {
"id": "Pakai metrik hasil, bukan aktivitas: defect escape rate (bug yang lolos ke produksi), waktu mendeteksi dan memperbaiki, flaky rate, durasi pipeline, dan keluhan customer. Gabungkan dengan tren, bukan angka tunggal. Hindari metrik yang mudah dimanipulasi seperti jumlah test case atau jumlah bug yang ditemukan.",
"en": "Use outcome metrics, not activity: defect escape rate (bugs reaching production), time to detect and fix, flaky rate, pipeline duration and customer complaints. Look at trends rather than single numbers. Avoid easily gamed metrics such as the number of test cases or bugs found."
},
"keywords": [
[
"escape",
"lolos",
"produksi",
"production"
],
[
"waktu",
"time",
"flaky",
"pipeline",
"durasi",
"duration"
],
[
"tren",
"trend",
"pelanggan",
"customer"
],
[
"hindari",
"avoid",
"manipulasi",
"gamed",
"jumlah test",
"number of test"
]
],
"pass": 0.6
},
{
"id": "int-032",
"topic": "interview",
"level": 2,
"type": "short",
"q": {
"id": "Mengapa Anda memilih karir di QA dan ke mana Anda ingin berkembang?",
"en": "Why did you choose a QA career and where do you want to grow?"
},
"model": {
"id": "Jawab jujur dan spesifik: apa yang Anda sukai dari QA (berpikir kritis, melindungi user, kolaborasi), contoh momen yang membuat Anda yakin, dan arah pengembangan konkret (otomasi, API dan performance, security, atau kepemimpinan kualitas) beserta langkah belajar yang sedang dijalani. Kaitkan dengan kebutuhan perusahaan tersebut.",
"en": "Answer honestly and specifically: what you like about QA (critical thinking, protecting users, collaboration), an example moment that convinced you, and a concrete growth direction (automation, API and performance, security, or quality leadership) with the learning steps you are taking. Tie it to the company's needs."
},
"keywords": [
[
"pengguna",
"user",
"berpikir kritis",
"critical thinking",
"kolaborasi",
"collaborat"
],
[
"contoh",
"example",
"momen",
"moment",
"pengalaman",
"experience"
],
[
"otomasi",
"automat",
"performa",
"performance",
"keamanan",
"security",
"kepemimpinan",
"leadership"
],
[
"belajar",
"learn",
"perusahaan",
"company",
"kebutuhan",
"needs"
]
],
"pass": 0.6
},
{
"id": "pw-001",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Sebelum menjalankan page.click() / locator.click(), apa yang dilakukan Playwright secara otomatis?",
"en": "Before running page.click() / locator.click(), what does Playwright do automatically?"
},
"options": {
"id": [
"Menunggu elemen visible, stabil, enabled, dan bisa menerima event (actionability checks)",
"Langsung mengklik koordinat elemen tanpa menunggu apa pun agar test cepat",
"Selalu menunggu 30 detik tetap lalu mengklik walau elemen sudah siap lebih awal",
"Menunggu networkidle di seluruh halaman, baru kemudian mengklik elemen tersebut"
],
"en": [
"Waits for the element to be visible, stable, enabled and able to receive events",
"Clicks the element's coordinates immediately without waiting so the test is fast",
"Always waits a fixed 30 seconds and then clicks even if the element was ready earlier",
"Waits for networkidle on the whole page before finally clicking the element"
]
},
"answer": 0,
"exp": {
"id": "Auto-waiting memeriksa kesiapan elemen sampai timeout, sehingga sleep tetap hampir tidak diperlukan. Menunggu fixed 30 detik atau networkidle bukan perilaku default.",
"en": "Auto-waiting checks the element is ready until timeout, so fixed sleeps are rarely needed. A fixed 30-second wait or networkidle is not the default behaviour."
}
},
{
"id": "pw-002",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Locator mana yang paling disarankan karena paling tahan terhadap perubahan tampilan?",
"en": "Which locator is most recommended because it best survives UI changes?"
},
"options": {
"id": [
"page.getByRole('button', { name: 'Bayar' })",
"page.locator('div:nth-child(3) > div > button')",
"page.locator('//*[@id=\"root\"]/div[2]/button')",
"page.locator('.btn.btn-primary.mt-4')"
],
"en": [
"page.getByRole('button', { name: 'Pay' })",
"page.locator('div:nth-child(3) > div > button')",
"page.locator('//*[@id=\"root\"]/div[2]/button')",
"page.locator('.btn.btn-primary.mt-4')"
]
},
"answer": 0,
"exp": {
"id": "Locator berbasis role, label, atau test id mencerminkan cara user melihat halaman dan jarang patah. Selector posisi dan kelas gaya rapuh terhadap perubahan struktur.",
"en": "Role, label or test-id locators mirror how users see the page and rarely break. Position and styling-class selectors are brittle against structure changes."
}
},
{
"id": "pw-003",
"topic": "playwright",
"level": 3,
"type": "mcq",
"q": {
"id": "Mengapa await expect(locator).toBeVisible() lebih baik daripada expect(await locator.isVisible()).toBe(true)?",
"en": "Why is await expect(locator).toBeVisible() better than expect(await locator.isVisible()).toBe(true)?"
},
"options": {
"id": [
"Web-first assertion mencoba ulang sampai timeout, sedangkan isVisible() membaca sekali sehingga rawan flaky",
"Keduanya identik karena isVisible() juga menunggu elemen tampil sebelum mengembalikan hasil",
"toBeVisible() lebih cepat karena tidak menunggu sama sekali dan langsung memberi hasil",
"isVisible() tidak bisa dipakai di TypeScript sehingga proyek TypeScript wajib memakai toBeVisible()"
],
"en": [
"The web-first assertion retries until timeout, while isVisible() reads once and is prone to flakiness",
"They are identical because isVisible() also waits for the element to appear before returning",
"toBeVisible() is faster because it never waits and gives a result straight away",
"isVisible() cannot be used in TypeScript so TypeScript projects must use toBeVisible()"
]
},
"answer": 0,
"exp": {
"id": "Assertion async Playwright melakukan retry hingga kondisi terpenuhi atau timeout. Pembacaan sekali (snapshot) tidak menunggu UI selesai berubah.",
"en": "Playwright's async assertions retry until the condition holds or times out. A one-shot read (snapshot) doesn't wait for the UI to settle."
}
},
{
"id": "pw-004",
"topic": "playwright",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa manfaat BrowserContext baru untuk setiap test di Playwright?",
"en": "What is the benefit of a fresh BrowserContext per test in Playwright?"
},
"options": {
"id": [
"Cookie, storage, dan sesi terisolasi antar test tanpa membuka browser baru",
"Semua test otomatis berbagi sesi login yang sama sehingga tidak perlu login berulang kali",
"Test otomatis berjalan berurutan di satu halaman sehingga tidak mungkin berjalan paralel",
"Browser tidak perlu dipasang karena Playwright menjalankan semua test tanpa browser nyata"
],
"en": [
"Cookies, storage and sessions are isolated between tests without launching a new browser",
"All tests automatically share the same login session so nobody has to log in repeatedly",
"Tests automatically run one after another on a single page so parallel runs are impossible",
"No browser needs to be installed because Playwright runs every test without a real browser"
]
},
"answer": 0,
"exp": {
"id": "Context itu murah dan terisolasi, sehingga test independen dan bisa paralel. Berbagi sesi harus dilakukan eksplisit, mis. lewat storageState.",
"en": "Contexts are cheap and isolated, keeping tests independent and parallel-friendly. Sharing a session must be explicit, e.g. via storageState."
}
},
{
"id": "pw-005",
"topic": "playwright",
"level": 3,
"type": "mcq",
"q": {
"id": "Aplikasi butuh login, dan login lewat UI di setiap test memperlambat suite. Pendekatan yang tepat di Playwright?",
"en": "The app requires login and logging in via the UI in every test slows the suite. What is the right Playwright approach?"
},
"options": {
"id": [
"Login sekali di setup project, simpan storageState, lalu pakai ulang di test",
"Hapus login dari aplikasi saat test",
"Login manual sebelum menjalankan suite lalu jangan ditutup",
"Pakai waitForTimeout lebih lama"
],
"en": [
"Log in once in a setup project, save storageState, then reuse it in tests",
"Remove login from the app during tests",
"Log in manually before the run and never close the browser",
"Use a longer waitForTimeout"
]
},
"answer": 0,
"exp": {
"id": "storageState menyimpan cookie dan localStorage hasil login, sehingga test tetap terisolasi tetapi tidak mengulang login. Trade-off: kalau yang diuji adalah alur login itu sendiri, tetap uji lewat UI.",
"en": "storageState saves the cookies and localStorage from login, keeping tests isolated without repeating login. Trade-off: if the login flow itself is under test, still go through the UI."
}
},
{
"id": "pw-006",
"topic": "playwright",
"level": 3,
"type": "mcq",
"q": {
"id": "Anda ingin menguji tampilan saat API produk mengembalikan HTTP 500 tanpa merusak backend. Cara di Playwright?",
"en": "You want to test the UI when the products API returns HTTP 500 without breaking the backend. How in Playwright?"
},
"options": {
"id": [
"page.route('**/api/products', route => route.fulfill({ status: 500 }))",
"Mematikan server backend secara manual lalu menjalankan test sebelum server dinyalakan lagi",
"Mengubah kode aplikasi supaya melempar error setiap kali memanggil API produk dalam test",
"Tidak bisa diuji di Playwright karena Playwright tidak dapat memanipulasi request jaringan"
],
"en": [
"page.route('**/api/products', route => route.fulfill({ status: 500 }))",
"Shutting the backend server down manually and running the test before turning it back on",
"Changing the app code to throw an error every time it calls the products API during tests",
"It cannot be tested in Playwright because Playwright cannot manipulate network requests"
]
},
"answer": 0,
"exp": {
"id": "page.route mencegat request dan menjawab dengan respons buatan, sehingga kondisi error dapat diuji deterministik. Pastikan juga ada test happy path terhadap backend asli.",
"en": "page.route intercepts the request and answers with a fabricated response so error states are tested deterministically. Keep a happy-path test against the real backend too."
}
},
{
"id": "cy-001",
"topic": "cypress",
"level": 3,
"type": "mcq",
"q": {
"id": "Mengapa const el = cy.get('#total'); el.text() tidak bekerja di Cypress?",
"en": "Why does const el = cy.get('#total'); el.text() not work in Cypress?"
},
"options": {
"id": [
"Command Cypress async dalam queue dan mengembalikan chainable, bukan nilai; pakai .then() atau alias",
"Karena cy.get hanya mendukung selector ID dan tidak bisa membaca teks elemen sama sekali",
"Karena Cypress memang tidak menyediakan fungsi untuk membaca teks dari sebuah elemen",
"Karena semua command Cypress wajib diawali dengan await agar nilai kembaliannya tersedia"
],
"en": [
"Cypress commands are queued and async and return a chainable, not a value; use .then() or an alias",
"Because cy.get only supports ID selectors and cannot read element text at all",
"Because Cypress simply provides no function to read text from an element",
"Because every Cypress command must be prefixed with await for its return value to be available"
]
},
"answer": 0,
"exp": {
"id": "Cypress tidak memakai async/await; command dirangkai dan dieksekusi berurutan. Mengambil nilai harus lewat .then(), .invoke(), atau alias.",
"en": "Cypress does not use async/await; commands are chained and run in order. Values must be read via .then(), .invoke() or aliases."
}
},
{
"id": "cy-002",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Bagaimana cara mengintersep dan menunggu request API tertentu di Cypress agar test tidak memakai cy.wait(ms)?",
"en": "How do you intercept and wait for a specific API request in Cypress instead of using cy.wait(ms)?"
},
"options": {
"id": [
"cy.intercept('GET', '/api/orders').as('orders') lalu cy.wait('@orders')",
"cy.wait(5000) setelah setiap klik",
"cy.request() menggantikan semua UI test",
"Dengan cy.reload() berkali-kali"
],
"en": [
"cy.intercept('GET', '/api/orders').as('orders') then cy.wait('@orders')",
"cy.wait(5000) after every click",
"cy.request() replacing all UI tests",
"Calling cy.reload() repeatedly"
]
},
"answer": 0,
"exp": {
"id": "Alias intersepsi membuat test menunggu kejadian nyata (request selesai), bukan waktu tebakan, sehingga lebih stabil dan cepat.",
"en": "An intercept alias makes the test wait for a real event (request completed) instead of guessed time, so it is more stable and faster."
}
},
{
"id": "cy-003",
"topic": "cypress",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa yang dimaksud retry-ability pada Cypress?",
"en": "What does retry-ability mean in Cypress?"
},
"options": {
"id": [
"Query dan assertion diulang otomatis sampai lolos atau timeout (default 4 detik)",
"Seluruh test diulang jika gagal tanpa perlu konfigurasi apa pun oleh user Cypress",
"Command yang mengubah state seperti click diulang berkali-kali sampai berhasil dijalankan",
"Cypress mengulang test terus-menerus sampai hasilnya hijau, berapa pun jumlah percobaannya"
],
"en": [
"Queries and assertions are retried automatically until they pass or time out (default 4 seconds)",
"The whole test is rerun on failure without any configuration from the Cypress user",
"State-changing commands such as click are retried repeatedly until they succeed",
"Cypress keeps rerunning the test until the result is green, however many attempts it takes"
]
},
"answer": 0,
"exp": {
"id": "Yang diulang adalah query beserta assertion setelahnya, bukan aksi yang mengubah state. Retry seluruh test adalah fitur test retries yang harus dikonfigurasi dan sebaiknya tidak menutupi flakiness.",
"en": "What retries is the query plus its assertions, not state-changing actions. Retrying whole tests is the separate test-retries feature, which must be configured and shouldn't mask flakiness."
}
},
{
"id": "cy-004",
"topic": "cypress",
"level": 3,
"type": "mcq",
"q": {
"id": "Login lewat UI sebelum setiap test memperlambat suite Cypress. Solusi yang disarankan?",
"en": "Logging in via the UI before every Cypress test slows the suite. What is the recommended solution?"
},
"options": {
"id": [
"cy.session() untuk menyimpan dan memulihkan sesi login (login lewat API bila bisa)",
"Login manual dulu di browser lalu menjalankan Cypress tanpa pernah menutup browser itu",
"Menonaktifkan autentikasi di aplikasi sepenuhnya selama test berjalan di environment apa pun",
"Memakai cy.wait(10000) setiap kali login supaya sesi sempat terbentuk dengan sempurna"
],
"en": [
"cy.session() to cache and restore the login session (log in via API where possible)",
"Log in manually first in the browser and run Cypress without ever closing that browser",
"Disable authentication in the app entirely while tests run in any environment",
"Use cy.wait(10000) at every login so the session has time to form perfectly"
]
},
"answer": 0,
"exp": {
"id": "cy.session menyimpan cookie, localStorage, dan sessionStorage antar test. Login lewat UI cukup diuji sekali di test khusus.",
"en": "cy.session caches cookies, localStorage and sessionStorage between tests. UI login only needs one dedicated test."
}
},
{
"id": "cy-005",
"topic": "cypress",
"level": 3,
"type": "mcq",
"q": {
"id": "Alur test berpindah dari app.contoh.com ke domain berbeda (SSO pihak ketiga). Apa yang perlu diperhatikan di Cypress?",
"en": "A test flow moves from app.example.com to a different domain (third-party SSO). What should you consider in Cypress?"
},
"options": {
"id": [
"Gunakan cy.origin() untuk perintah di domain lain; Cypress tidak mendukung banyak tab",
"Tidak ada batasan apa pun karena Cypress bebas berpindah antar domain di satu test",
"Cypress tidak bisa menguji aplikasi yang memakai SSO pihak ketiga dalam bentuk apa pun",
"Cukup mengganti baseUrl di tengah test lalu melanjutkan perintah seperti biasa"
],
"en": [
"Use cy.origin() for commands on another domain; Cypress does not support multiple tabs",
"There is no limitation because Cypress moves freely across domains within one test",
"Cypress cannot test apps that use third-party SSO in any form whatsoever",
"Just change baseUrl in the middle of the test and continue with commands as usual"
]
},
"answer": 0,
"exp": {
"id": "Cypress berjalan di dalam browser dengan batasan same-origin; cy.origin() mengizinkan perintah di origin kedua. Alternatif: login SSO lewat API/cy.session.",
"en": "Cypress runs inside the browser with same-origin constraints; cy.origin() allows commands on a second origin. Alternative: log in to SSO via API/cy.session."
}
},
{
"id": "kat-001",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Di Katalon Studio, cara terbaik menjalankan test suite yang sama di environment staging dan production dengan URL berbeda?",
"en": "In Katalon Studio, the best way to run the same test suite against staging and production with different URLs?"
},
"options": {
"id": [
"Execution Profile berisi variabel global (mis. baseUrl) yang dipilih saat eksekusi",
"Menyalin semua test case lalu mengganti URL secara manual di setiap langkah yang memakainya",
"Menulis URL langsung di tiap langkah test supaya setiap test bisa dibaca sendiri",
"Membuat dua project berbeda, satu untuk staging dan satu lagi untuk production"
],
"en": [
"An Execution Profile with global variables (e.g. baseUrl) selected at run time",
"Copying every test case and changing the URL manually in each step that uses it",
"Hard-coding the URL in every test step so that each test can be read on its own",
"Creating two separate projects, one for staging and another one for production"
]
},
"answer": 0,
"exp": {
"id": "Profile memisahkan konfigurasi per environment dari logika test, sehingga satu test case dipakai ulang.",
"en": "Profiles separate per-environment configuration from test logic so one test case is reused."
}
},
{
"id": "kat-002",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa fungsi Test Suite Collection di Katalon?",
"en": "What is a Test Suite Collection in Katalon for?"
},
"options": {
"id": [
"Menjalankan beberapa test suite sekaligus, mis. lintas browser atau profile, berurutan atau paralel",
"Menyimpan locator elemen web secara terpusat untuk dipakai ulang oleh seluruh test case",
"Menyimpan test data dalam file CSV yang dihubungkan ke langkah-langkah test case",
"Membuat bug report otomatis ke sistem tracker setiap kali sebuah test gagal"
],
"en": [
"Running several test suites together, e.g. across browsers or profiles, sequentially or in parallel",
"Storing web element locators centrally for reuse by every test case",
"Storing test data in CSV files linked to the steps of test cases",
"Creating bug reports automatically in the tracker whenever a test fails"
]
},
"answer": 0,
"exp": {
"id": "Test Case = satu skenario, Test Suite = kumpulan test case, Test Suite Collection = kumpulan test suite untuk eksekusi lintas browser/environment.",
"en": "Test Case = one scenario, Test Suite = a set of test cases, Test Suite Collection = a set of suites for cross-browser/environment execution."
}
},
{
"id": "kat-003",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Langkah login dipakai di puluhan test case Katalon. Cara menghindari duplikasi?",
"en": "A login step is used in dozens of Katalon test cases. How to avoid duplication?"
},
"options": {
"id": [
"Membuat custom keyword (Groovy) atau test case yang dipanggil ulang",
"Menyalin langkah login ke setiap test case supaya tiap test benar-benar berdiri sendiri",
"Merekam ulang langkah login tiap kali dibutuhkan lewat fitur recorder bawaan Katalon",
"Menghapus login dari semua test lalu menguji dalam kondisi sudah login dari awal"
],
"en": [
"Create a custom keyword (Groovy) or a reusable test case that is called",
"Copy the login steps into every test case so each test is fully self-contained",
"Re-record the login steps every time they are needed using Katalon's built-in recorder",
"Remove login from all tests and test from a state that is already logged in from the start"
]
},
"answer": 0,
"exp": {
"id": "Custom keyword menyatukan logika yang sama di satu tempat, sehingga perubahan UI login hanya diperbaiki sekali.",
"en": "A custom keyword keeps shared logic in one place, so a login UI change is fixed once."
}
},
{
"id": "kat-004",
"topic": "katalon",
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa Test Objects di Object Repository Katalon penting untuk maintainability?",
"en": "Why do Test Objects in Katalon's Object Repository matter for maintainability?"
},
"options": {
"id": [
"Locator disimpan terpusat sehingga satu perubahan memperbaiki semua test; ada self-healing",
"Karena membuat setiap test berjalan jauh lebih cepat dibanding menulis locator di langkah",
"Karena menghilangkan kebutuhan assertion pada hampir seluruh langkah verifikasi test",
"Karena otomatis menuliskan test data yang dibutuhkan oleh setiap test case baru"
],
"en": [
"Locators are kept centrally so one change fixes all tests; self-healing is available",
"Because it makes every test run far faster than writing locators inside the steps",
"Because it removes the need for assertions in nearly all verification steps of a test",
"Because it automatically writes the test data every new test case needs"
]
},
"answer": 0,
"exp": {
"id": "Pemusatan locator adalah ide yang sama dengan Page Object Model: perubahan UI cukup diperbaiki di satu tempat.",
"en": "Centralising locators is the same idea as the Page Object Model: a UI change is fixed in one place."
}
},
{
"id": "sql-001",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Query mana yang menemukan email yang terdaftar lebih dari sekali di tabel users?",
"en": "Which query finds emails registered more than once in the users table?"
},
"options": {
"id": [
"SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1",
"SELECT email FROM users WHERE COUNT(*) > 1",
"SELECT DISTINCT email FROM users",
"SELECT email FROM users ORDER BY email"
],
"en": [
"SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1",
"SELECT email FROM users WHERE COUNT(*) > 1",
"SELECT DISTINCT email FROM users",
"SELECT email FROM users ORDER BY email"
]
},
"answer": 0,
"exp": {
"id": "Agregat difilter dengan HAVING setelah GROUP BY. WHERE tidak boleh memakai fungsi agregat.",
"en": "Aggregates are filtered with HAVING after GROUP BY. WHERE cannot use aggregate functions."
}
},
{
"id": "sql-002",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Query mana yang menemukan customer yang belum pernah membuat pesanan?",
"en": "Which query finds customers who have never placed an order?"
},
"options": {
"id": [
"SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL",
"SELECT c.* FROM customers c INNER JOIN orders o ON o.customer_id = c.id",
"SELECT c.* FROM customers c WHERE c.id = NULL",
"SELECT * FROM orders WHERE customer_id IS NULL"
],
"en": [
"SELECT c.* FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL",
"SELECT c.* FROM customers c INNER JOIN orders o ON o.customer_id = c.id",
"SELECT c.* FROM customers c WHERE c.id = NULL",
"SELECT * FROM orders WHERE customer_id IS NULL"
]
},
"answer": 0,
"exp": {
"id": "LEFT JOIN mempertahankan semua customer; yang tidak punya pesanan memiliki kolom o.id NULL. NOT EXISTS juga valid. '= NULL' tidak pernah benar.",
"en": "LEFT JOIN keeps all customers; those without orders have o.id NULL. NOT EXISTS is also valid. '= NULL' is never true."
}
},
{
"id": "sql-003",
"topic": "sql",
"level": 2,
"type": "mcq",
"q": {
"id": "Apa beda WHERE dan HAVING?",
"en": "What is the difference between WHERE and HAVING?"
},
"options": {
"id": [
"WHERE memfilter baris sebelum pengelompokan; HAVING memfilter grup hasil agregasi",
"Keduanya sama persis dan bisa saling menggantikan pada semua jenis query tanpa pengecualian",
"WHERE hanya dapat dipakai untuk kolom angka, sedangkan HAVING hanya dapat dipakai untuk teks",
"HAVING dijalankan lebih dulu daripada WHERE sehingga baris sudah terfilter sebelum dikelompokkan"
],
"en": [
"WHERE filters rows before grouping; HAVING filters groups after aggregation",
"They are exactly the same and can replace each other in every kind of query without exception",
"WHERE can only be used on numeric columns, whereas HAVING can only be used on text",
"HAVING runs before WHERE so rows are already filtered before they are grouped"
]
},
"answer": 0,
"exp": {
"id": "Urutan logis: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.",
"en": "Logical order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY."
}
},
{
"id": "sql-004",
"topic": "sql",
"level": 3,
"type": "mcq",
"q": {
"id": "Anda perlu pesanan terbaru untuk setiap user. Pendekatan window function yang tepat?",
"en": "You need each user's most recent order. Which window-function approach is right?"
},
"options": {
"id": [
"ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC), lalu ambil nomor 1",
"SELECT MAX(*) FROM orders GROUP BY user_id sehingga setiap user otomatis mendapat baris terbarunya",
"ORDER BY created_at DESC lalu LIMIT 1 yang dijalankan sekali untuk seluruh user sekaligus",
"GROUP BY user_id tanpa fungsi agregat, lalu SELECT * agar memperoleh pesanan paling baru"
],
"en": [
"ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC), then keep row number 1",
"SELECT MAX(*) FROM orders GROUP BY user_id so every user automatically gets their latest row",
"ORDER BY created_at DESC then LIMIT 1 run once for all users at the same time",
"GROUP BY user_id without aggregate functions, then SELECT * to obtain the newest order"
]
},
"answer": 0,
"exp": {
"id": "PARTITION BY membuat penomoran per user. LIMIT 1 hanya mengembalikan satu baris untuk seluruh tabel.",
"en": "PARTITION BY numbers rows per user. LIMIT 1 returns a single row for the whole table."
}
},
{
"id": "sql-005",
"topic": "sql",
"level": 3,
"type": "mcq",
"q": {
"id": "Tabel orders memiliki 3 pesanan: A (2 item), B (1 item), C (0 item). Berapa baris hasil orders LEFT JOIN order_items ON order_items.order_id = orders.id?",
"en": "The orders table has 3 orders: A (2 items), B (1 item), C (0 items). How many rows does orders LEFT JOIN order_items ON order_items.order_id = orders.id return?"
},
"options": {
"id": [
"3",
"4",
"5",
"6"
],
"en": [
"3",
"4",
"5",
"6"
]
},
"answer": 1,
"exp": {
"id": "A menghasilkan 2 baris, B 1 baris, dan C 1 baris dengan kolom item NULL. Total 4. INNER JOIN hanya 3. Berhati-hatilah menghitung baris setelah join satu-ke-banyak.",
"en": "A yields 2 rows, B 1 row, and C 1 row with NULL item columns. Total 4. INNER JOIN would give 3. Be careful counting rows after a one-to-many join."
}
},
{
"id": "sql-006",
"topic": "sql",
"level": 3,
"type": "mcq",
"q": {
"id": "Anda ingin semua pesanan yang statusnya bukan 'paid', termasuk yang status-nya NULL. Mengapa WHERE status <> 'paid' bermasalah?",
"en": "You want all orders whose status is not 'paid', including NULL status. Why is WHERE status <> 'paid' a problem?"
},
"options": {
"id": [
"Perbandingan dengan NULL menghasilkan UNKNOWN, jadi baris NULL terlewat; tambahkan OR status IS NULL",
"Operator <> tidak tersedia di SQL standar sehingga harus diganti dengan NOT EQUAL",
"Karena huruf kecil dan besar selalu diabaikan sehingga 'PAID' dan 'paid' dianggap sama",
"Tidak ada masalah sama sekali karena baris NULL otomatis ikut terpilih oleh <>"
],
"en": [
"Comparison with NULL yields UNKNOWN, so NULL rows are missed; add OR status IS NULL",
"The <> operator is not available in standard SQL so it must be replaced with NOT EQUAL",
"Because upper and lower case are always ignored so 'PAID' and 'paid' count as the same",
"There is no problem at all because NULL rows are automatically selected by <>"
]
},
"answer": 0,
"exp": {
"id": "Logika tiga nilai SQL: NULL <> 'paid' bukan TRUE. Ini sumber bug validasi data yang umum.",
"en": "SQL's three-valued logic: NULL <> 'paid' is not TRUE. A common source of data-validation bugs."
}
},
{
"id": "int-001",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Bagaimana Anda memutuskan test mana yang layak diotomasi?",
"en": "How do you decide which tests are worth automating?"
},
"model": {
"id": "Otomasi test yang stabil, berulang, dan berisiko tinggi (regression, smoke, jalur kritis bisnis, data-driven); biarkan manual yang berubah cepat, sekali pakai, atau butuh penilaian manusia seperti eksploratori dan UX. Pertimbangkan biaya maintenance dan return on investment.",
"en": "Automate tests that are stable, repeated and high-risk (regression, smoke, business-critical paths, data-driven); keep manual those that change often, are one-off or need human judgement such as exploratory and UX. Weigh maintenance cost and return on investment."
},
"keywords": [
[
"regression",
"regresi",
"smoke",
"repeat",
"berulang"
],
[
"risk",
"risiko",
"critical",
"kritis"
],
[
"maintenance",
"maintain",
"roi",
"return",
"biaya",
"cost"
],
[
"manual",
"exploratory",
"eksploratori"
]
],
"pass": 0.6
},
{
"id": "int-002",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Test otomasi Anda flaky (kadang lolos, kadang gagal). Bagaimana Anda menanganinya?",
"en": "Your automated test is flaky (sometimes passes, sometimes fails). How do you handle it?"
},
"model": {
"id": "Reproduksi dan cari root cause: timing/waiting, test data yang saling mengganggu, environment tidak stabil, atau locator rapuh. Perbaiki dengan wait berbasis kondisi, isolasi data, mock dependensi tak stabil; karantina sementara agar tidak menghalangi pipeline, dan jangan sekadar menambah retry.",
"en": "Reproduce and find the root cause: timing/waiting, test data interference, unstable environment or brittle locators. Fix with condition-based waits, data isolation, mocking unstable dependencies; quarantine temporarily so the pipeline is not blocked, and don't just add retries."
},
"keywords": [
[
"root cause",
"akar",
"reproduce",
"reproduksi",
"investigate",
"selidiki"
],
[
"wait",
"tunggu",
"timing",
"async"
],
[
"data",
"isolat",
"environment",
"lingkungan",
"locator"
],
[
"quarantine",
"karantina",
"retry",
"pipeline"
]
],
"pass": 0.6
},
{
"id": "int-003",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Anda diminta menguji fitur tanpa requirement yang jelas. Apa langkah Anda?",
"en": "You are asked to test a feature without clear requirements. What do you do?"
},
"model": {
"id": "Cari informasi dulu: tanya product owner dan developer, baca desain atau fitur serupa, tulis asumsi dan konfirmasi. Gunakan exploratory testing dan teknik berbasis pengalaman, dokumentasikan temuan, lalu ubah menjadi acceptance criteria yang disepakati.",
"en": "Gather information first: ask the product owner and developers, read designs or similar features, write down and confirm assumptions. Use exploratory and experience-based testing, document findings, then turn them into agreed acceptance criteria."
},
"keywords": [
[
"ask",
"tanya",
"clarif",
"klarifikasi",
"product owner",
"stakeholder"
],
[
"assum",
"asumsi"
],
[
"exploratory",
"eksploratori",
"experience",
"pengalaman"
],
[
"acceptance",
"criteria",
"kriteria",
"document",
"dokumen"
]
],
"pass": 0.6
},
{
"id": "int-004",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Bagaimana Anda melaporkan risiko release kepada stakeholder non-teknis?",
"en": "How do you report release risk to non-technical stakeholders?"
},
"model": {
"id": "Gunakan bahasa dampak bisnis, bukan istilah teknis: apa yang sudah diuji, apa yang belum, defect terbuka beserta tingkat keparahan dan dampak user, serta rekomendasi (release, release dengan mitigasi, tunda). Sajikan ringkas dengan data seperti status pass/fail dan coverage area berisiko.",
"en": "Use business-impact language, not technical jargon: what was tested, what was not, open defects with severity and user impact, and a recommendation (release, release with mitigation, delay). Keep it concise with data such as pass/fail status and coverage of risky areas."
},
"keywords": [
[
"impact",
"dampak",
"business",
"bisnis",
"user",
"pengguna"
],
[
"severity",
"keparahan",
"defect",
"bug",
"open",
"terbuka"
],
[
"recommend",
"rekomendasi",
"mitigat",
"mitigasi",
"decision",
"keputusan"
],
[
"not tested",
"belum diuji",
"coverage",
"cakupan",
"status"
]
],
"pass": 0.6
},
{
"id": "int-005",
"topic": "interview",
"level": 3,
"type": "short",
"q": {
"id": "Ceritakan bug sulit yang pernah Anda temukan dengan format STAR (tanpa data rahasia perusahaan).",
"en": "Describe a hard bug you found using the STAR format (without confidential company data)."
},
"model": {
"id": "Situasi: konteks umum fitur dan masalahnya. Tugas: peran saya. Aksi: bagaimana saya mereproduksi, mempersempit penyebab, berkolaborasi dengan developer, dan menambah pengamanan. Hasil: bug diperbaiki dan dampak terukur, mis. regression yang dicegah atau pelajaran proses.",
"en": "Situation: general context of the feature and the problem. Task: my role. Action: how I reproduced, narrowed down the cause, collaborated with developers and added safeguards. Result: the bug fixed and a measurable effect, e.g. regression prevented or process learning."
},
"keywords": [
[
"situation",
"situasi",
"context",
"konteks"
],
[
"task",
"tugas",
"role",
"peran"
],
[
"action",
"aksi",
"reproduc",
"reproduksi",
"collaborat",
"kolaborasi"
],
[
"result",
"hasil",
"impact",
"dampak",
"regression",
"regresi"
]
],
"pass": 0.5
},
{
"id": "ctfl-125",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tim ingin setiap commit otomatis dibangun dan dites sebelum digabung. Kategori tool apa yang paling sesuai?",
"en": "A team wants every commit to be built and tested automatically before merging. Which tool category fits best?"
},
"options": {
"id": [
"Tool DevOps untuk CI/CD yang menjalankan build dan test otomatis",
"Tool manajemen test yang menyimpan dan mengelola test case",
"Tool static testing yang memeriksa kode tanpa menjalankannya",
"Tool coverage yang mengukur bagian kode yang dieksekusi test"
],
"en": [
"A DevOps tool for CI/CD that runs builds and tests automatically",
"A test management tool that stores and manages test cases",
"A static testing tool that checks code without executing it",
"A coverage tool that measures which code the tests executed"
]
},
"answer": 0,
"exp": {
"id": "Pipeline build-dan-test otomatis pada tiap perubahan adalah peran tool DevOps (CI/CD). Kategori lain mendukung aktivitas berbeda.",
"en": "Automatic build-and-test on every change is the role of DevOps (CI/CD) tools. The other categories support different activities."
}
},
{
"id": "ctfl-126",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Sebuah tool membaca kode sumber tanpa menjalankannya lalu melaporkan variabel yang tidak dipakai dan pelanggaran gaya kode. Tool ini termasuk kategori apa?",
"en": "A tool reads source code without running it and reports unused variables and style violations. Which category is it?"
},
"options": {
"id": [
"Tool eksekusi test yang menjalankan script otomasi pada aplikasi",
"Tool non-fungsional yang mengukur performance di bawah load",
"Tool static testing yang menganalisis kode tanpa eksekusi",
"Tool manajemen test yang melacak hasil dan defect proyek"
],
"en": [
"A test execution tool that runs automation scripts on the application",
"A non-functional tool that measures performance under load",
"A static testing tool that analyses code without executing it",
"A test management tool that tracks project results and defects"
]
},
"answer": 2,
"exp": {
"id": "Menganalisis kode tanpa mengeksekusinya adalah static testing; contohnya linter dan analyzer kode.",
"en": "Analysing code without executing it is static testing; linters and code analysers are examples."
}
},
{
"id": "ctfl-127",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tim ingin tahu waktu respons API ketika ribuan virtual user mengaksesnya bersamaan. Tool kategori mana yang dibutuhkan?",
"en": "A team wants to know API response times when thousands of virtual users access it at once. Which tool category is needed?"
},
"options": {
"id": [
"Tool kolaborasi yang membantu tim berbagi informasi dan komunikasi",
"Tool non-fungsional untuk performance testing dan load",
"Tool static testing yang memeriksa kode sebelum dijalankan",
"Tool desain test yang membantu menurunkan test case dari model"
],
"en": [
"A collaboration tool that helps the team share information and communicate",
"A non-functional tool for performance and load testing",
"A static testing tool that checks code before it is run",
"A test design tool that helps derive test cases from a model"
]
},
"answer": 1,
"exp": {
"id": "Mensimulasikan banyak user dan mengukur waktu respons adalah tool non-fungsional (performance/load).",
"en": "Simulating many users and measuring response time is the job of non-functional (performance/load) tools."
}
},
{
"id": "ctfl-128",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tim butuh satu tempat untuk mencatat test case, menautkannya ke kebutuhan, dan melihat hasil eksekusi serta defect. Tool apa yang sesuai?",
"en": "A team needs one place to record test cases, link them to requirements, and see execution results and defects. Which tool fits?"
},
"options": {
"id": [
"Tool eksekusi test yang menjalankan script secara otomatis",
"Tool coverage yang menghitung persentase kode yang dites",
"Tool performance yang mensimulasikan banyak virtual user",
"Tool manajemen test atau ALM yang menautkan artefak testing"
],
"en": [
"A test execution tool that runs scripts automatically",
"A coverage tool that computes the percentage of code tested",
"A performance tool that simulates many virtual users",
"A test management or ALM tool that links testing work products"
]
},
"answer": 3,
"exp": {
"id": "Pencatatan test case, keterlacakan ke kebutuhan, hasil, dan defect adalah fungsi tool manajemen test/ALM.",
"en": "Recording test cases, traceability to requirements, results and defects is what test management/ALM tools do."
}
},
{
"id": "ctfl-129",
"topic": "istqb",
"lo": "FL-6.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang merupakan manfaat otomasi test?",
"en": "Which is a benefit of test automation?"
},
"options": {
"id": [
"Test tidak lagi memerlukan perawatan setelah dibuat",
"Semua defect pada aplikasi pasti ditemukan otomatis",
"Eksekusi test berulang lebih konsisten dan tidak melewatkan langkah",
"Tim tidak perlu lagi memahami perilaku aplikasi yang dites"
],
"en": [
"Tests no longer need maintenance once they are created",
"All defects in the application are found automatically",
"Repeated test execution is more consistent and does not skip steps",
"The team no longer needs to understand the application behaviour"
]
},
"answer": 2,
"exp": {
"id": "Eksekusi yang konsisten dan berulang adalah manfaat otomasi. Tiga pilihan lain adalah ekspektasi tidak realistis.",
"en": "Consistent, repeatable execution is a benefit of automation. The other three are unrealistic expectations."
}
},
{
"id": "ctfl-130",
"topic": "istqb",
"lo": "FL-6.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang merupakan risiko otomasi test?",
"en": "Which is a risk of test automation?"
},
"options": {
"id": [
"Ekspektasi yang tidak realistis terhadap kemampuan tool",
"Eksekusi yang menjadi lebih konsisten dari waktu ke waktu",
"Penilaian hasil test yang menjadi lebih objektif dan terukur",
"Waktu yang terhemat pada pekerjaan regression yang berulang"
],
"en": [
"Unrealistic expectations of what the tool can do",
"Execution becoming more consistent over time",
"Assessment of test results becoming more objective and measurable",
"Time saved on repetitive regression work"
]
},
"answer": 0,
"exp": {
"id": "Ekspektasi tidak realistis adalah risiko. Opsi lainnya adalah manfaat otomasi.",
"en": "Unrealistic expectations are a risk. The other options are benefits of automation."
}
},
{
"id": "ctfl-131",
"topic": "istqb",
"lo": "FL-6.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Tim menjalankan regression test yang sama setiap release. Manfaat otomasi apa yang paling relevan?",
"en": "A team runs the same regression tests every release. Which automation benefit is most relevant?"
},
"options": {
"id": [
"Tester tidak perlu lagi berpikir tentang risiko produk",
"Script otomasi tidak pernah memerlukan pembaruan lagi",
"Seluruh exploratory testing dapat dihapus dari rencana",
"Waktu terhemat karena pekerjaan berulang dijalankan tool"
],
"en": [
"Testers no longer need to think about product risk",
"Automation scripts never need updating again",
"All exploratory testing can be dropped from the plan",
"Time is saved because repetitive work is run by the tool"
]
},
"answer": 3,
"exp": {
"id": "Pekerjaan berulang seperti regression adalah kandidat utama otomasi; manfaatnya adalah penghematan waktu.",
"en": "Repetitive work such as regression is a prime automation candidate; the benefit is time saved."
}
},
{
"id": "ctfl-132",
"topic": "istqb",
"lo": "FL-6.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Tim mengotomasi UI lalu UI sering berubah dan script terus rusak. Risiko otomasi apa yang terjadi?",
"en": "A team automates the UI, then the UI changes often and scripts keep breaking. Which automation risk occurred?"
},
"options": {
"id": [
"Informasi hasil test menjadi sulit diakses oleh seluruh tim",
"Usaha perawatan script diremehkan saat otomasi direncanakan",
"Penilaian hasil menjadi terlalu objektif untuk dipercaya orang",
"Eksekusi test menjadi kurang konsisten dibanding cara manual"
],
"en": [
"Test result information becomes hard for the whole team to access",
"Script maintenance effort was underestimated when planning automation",
"Result assessment becomes too objective for people to trust",
"Test execution becomes less consistent than doing it manually"
]
},
"answer": 1,
"exp": {
"id": "Meremehkan usaha pembuatan dan perawatan script adalah risiko otomasi yang umum.",
"en": "Underestimating the effort of building and maintaining scripts is a common automation risk."
}
},
{
"id": "ctfl-089",
"topic": "istqb",
"lo": "FL-1.1.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tester menjalankan test dan melihat total keranjang salah. Developer lalu mencari baris kode penyebabnya dan memperbaikinya. Mana pernyataan yang benar?",
"en": "A tester runs a test and sees a wrong cart total. A developer then finds the faulty code line and fixes it. Which statement is correct?"
},
"options": {
"id": [
"Tester melakukan testing (memunculkan failure); developer melakukan debugging (memperbaiki penyebab)",
"Keduanya melakukan debugging karena menemukan failure dan memperbaikinya sama-sama debugging",
"Tester melakukan debugging untuk memperbaiki kode, sedangkan developer melakukan testing tambahan",
"Menemukan failure dan memperbaiki defect adalah satu aktivitas yang sama bernama testing"
],
"en": [
"The tester does testing (exposing the failure); the developer does debugging (fixing the cause)",
"Both do debugging because finding a failure and fixing it are both debugging",
"The tester does debugging to fix the code, while the developer does additional testing",
"Finding a failure and fixing a defect are one and the same activity called testing"
]
},
"answer": 0,
"exp": {
"id": "Testing memicu failure atau menemukan defect; debugging menganalisis dan memperbaiki penyebabnya. Konfirmasi perbaikan kembali menjadi testing.",
"en": "Testing triggers failures or finds defects; debugging analyses and fixes the cause. Verifying the fix is testing again."
}
},
{
"id": "ctfl-090",
"topic": "istqb",
"lo": "FL-1.2.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Analis salah memahami aturan diskon (error), sehingga kode memakai rumus yang keliru (defect), dan customer melihat harga salah (failure). Apa root cause paling awal dalam rantai ini?",
"en": "An analyst misunderstood the discount rule (error), so the code used a wrong formula (defect), and a customer saw a wrong price (failure). What is the earliest root cause in this chain?"
},
"options": {
"id": [
"Kesalahpahaman aturan diskon oleh analis",
"Harga salah yang akhirnya dilihat oleh customer pada halaman pembayaran aplikasi",
"Rumus yang keliru pada kode program yang menghitung diskon untuk setiap pesanan",
"Jumlah test case yang kurang untuk mencakup semua kombinasi aturan diskon yang ada"
],
"en": [
"The analyst's misunderstanding of the discount rule",
"The wrong price the customer finally saw on the application's payment page",
"The wrong formula in the program code that calculates the discount for each order",
"Too few test cases to cover all the combinations of the existing discount rules"
]
},
"answer": 0,
"exp": {
"id": "Root cause adalah penyebab awal yang jika dihilangkan mencegah defect: di sini kesalahpahaman (error). Defect ada di kode; failure yang terlihat user.",
"en": "A root cause is the earliest cause which, if removed, prevents the defect: here the misunderstanding (error). The defect is in the code; the failure is what users see."
}
},
{
"id": "ctfl-091",
"topic": "istqb",
"lo": "FL-1.3.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Sekitar 70% defect release lalu ditemukan di modul pembayaran, sementara modul lain hampir bersih. Prinsip testing mana yang paling menjelaskan ini, dan apa tindakannya?",
"en": "About 70% of the last release's defects were found in the payment module while other modules were almost clean. Which testing principle best explains this, and what follows?"
},
"options": {
"id": [
"Defect clustering: fokuskan lebih banyak testing pada modul pembayaran",
"Absence-of-defects fallacy: berhenti menguji modul lain",
"Testing shows presence of defects: release ditunda selamanya",
"Exhaustive testing: uji semua kombinasi modul pembayaran"
],
"en": [
"Defect clustering: focus more testing on the payment module",
"Absence-of-defects fallacy: stop testing other modules",
"Testing shows the presence of defects: delay the release forever",
"Exhaustive testing: test every combination in the payment module"
]
},
"answer": 0,
"exp": {
"id": "Defect clustering: sejumlah kecil modul memuat sebagian besar defect, jadi alokasi testing berbasis risiko perlu menyesuaikan. Tetap jangan menghentikan testing di modul lain (pesticide paradox dan konteks).",
"en": "Defect clustering: a small number of modules contains most defects, so risk-based allocation should adapt. Still don't stop testing elsewhere."
}
},
{
"id": "ctfl-092",
"topic": "istqb",
"lo": "FL-1.4.4",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Requirement R-12 berubah. Manfaat traceability dua arah antara requirement, test case, dan hasil test dalam situasi ini adalah...",
"en": "Requirement R-12 changes. The benefit of bidirectional traceability between requirements, test cases and results in this situation is..."
},
"options": {
"id": [
"Segera terlihat test case mana yang perlu ditinjau atau diubah (analisis dampak)",
"Seluruh test case otomatis ditulis ulang oleh sistem sesuai requirement yang berubah",
"Requirement itu tidak perlu diuji lagi karena sudah tercatat dalam matriks keterlacakan",
"Defect yang terkait dengan requirement tersebut otomatis diperbaiki oleh tool"
],
"en": [
"It is immediately visible which test cases must be reviewed or changed (impact analysis)",
"All test cases are rewritten automatically by the system to match the changed requirement",
"The requirement no longer needs testing since it is recorded in the traceability matrix",
"Defects tied to that requirement are fixed automatically by the tool"
]
},
"answer": 0,
"exp": {
"id": "Traceability mendukung analisis dampak perubahan, penilaian coverage, dan reporting status terhadap requirement.",
"en": "Traceability supports change impact analysis, coverage assessment and status reporting against requirements."
}
},
{
"id": "ctfl-093",
"topic": "istqb",
"lo": "FL-1.5.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Apa keuntungan utama dan risiko dari tingkat independensi testing yang tinggi (tester dari tim terpisah)?",
"en": "What is the main benefit and risk of a high level of test independence (testers from a separate team)?"
},
"options": {
"id": [
"Keuntungan: sudut pandang berbeda dan bebas bias penulis; risiko: terisolasi dan tanggung jawab kualitas memudar",
"Keuntungan: komunikasi tim tidak diperlukan lagi; risiko: hampir tidak ada risiko berarti",
"Keuntungan: defect dijamin nol setelah testing; risiko: biaya tool menjadi lebih besar",
"Keuntungan: developer tidak perlu menguji kodenya sendiri; risiko: tidak ada sama sekali"
],
"en": [
"Benefit: different perspective and freedom from author bias; risk: isolation and fading ownership of quality",
"Benefit: team communication is no longer needed; risk: hardly any meaningful risk",
"Benefit: zero defects guaranteed after testing; risk: tool costs become larger",
"Benefit: developers need not test their own code; risk: none at all"
]
},
"answer": 0,
"exp": {
"id": "Independensi membantu melihat asumsi yang terlewat, tetapi dapat memutus komunikasi dan membuat tim mengandalkan 'tester akan menemukan'.",
"en": "Independence helps expose missed assumptions but can break communication and breed 'the testers will catch it' thinking."
}
},
{
"id": "ctfl-094",
"topic": "istqb",
"lo": "FL-1.4.5",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Siapa yang umumnya merencanakan, memantau, dan mengendalikan aktivitas test serta melaporkan status, dibanding yang merancang dan menjalankan test?",
"en": "Who typically plans, monitors and controls test activities and reports status, as opposed to designing and executing tests?"
},
"options": {
"id": [
"Peran test management",
"Peran testing",
"Peran product owner saja",
"Peran operasi infrastruktur"
],
"en": [
"The test management role",
"The testing role",
"The product owner role only",
"The infrastructure operations role"
]
},
"answer": 0,
"exp": {
"id": "Dua peran: test management (perencanaan, pemantauan, kontrol) dan testing (analisis, desain, implementasi, eksekusi). Satu orang bisa memegang keduanya.",
"en": "Two roles: test management (planning, monitoring, control) and testing (analysis, design, implementation, execution). One person can hold both."
}
},
{
"id": "ctfl-095",
"topic": "istqb",
"lo": "FL-2.1.3",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Pada TDD (test-driven development), urutan kerja yang benar adalah...",
"en": "In TDD (test-driven development), the correct working order is..."
},
"options": {
"id": [
"Tulis test yang gagal, tulis kode agar lolos, lalu refactor",
"Tulis kode, lalu tulis test di akhir sprint",
"Tulis dokumentasi, lalu test manual",
"Refactor, lalu tulis test"
],
"en": [
"Write a failing test, write code to pass it, then refactor",
"Write code, then write tests at the end of the sprint",
"Write documentation, then manual tests",
"Refactor, then write tests"
]
},
"answer": 0,
"exp": {
"id": "Test-first approaches menulis test sebelum kode (red, green, refactor), sehingga test memandu desain.",
"en": "Test-first approaches write tests before code (red, green, refactor), so tests guide the design."
}
},
{
"id": "ctfl-096",
"topic": "istqb",
"lo": "FL-2.1.4",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Mengapa pipeline CI/CD yang menjalankan regression otomatis pada setiap commit mendukung testing?",
"en": "Why does a CI/CD pipeline that runs automated regression on every commit support testing?"
},
"options": {
"id": [
"Memberi feedback cepat atas perubahan sehingga defect cepat terlihat",
"Menghilangkan kebutuhan test case karena pipeline sudah memeriksa semua perubahan kode",
"Menjamin tidak ada defect yang lolos ke produksi selama pipeline berwarna hijau",
"Menggantikan semua testing manual sehingga tester dapat dialihkan ke pekerjaan lain"
],
"en": [
"Gives fast feedback on changes so defects show up quickly",
"Removes the need for test cases because the pipeline already checks every code change",
"Guarantees no defects reach production as long as the pipeline stays green",
"Replaces all manual testing so testers can be reassigned to other work"
]
},
"answer": 0,
"exp": {
"id": "DevOps menekankan feedback cepat dan otomasi. Pipeline mengurangi risiko tetapi tidak menjamin bebas defect dan tidak menggantikan eksploratori.",
"en": "DevOps stresses fast feedback and automation. A pipeline lowers risk but does not guarantee zero defects or replace exploratory testing."
}
},
{
"id": "ctfl-097",
"topic": "istqb",
"lo": "FL-2.1.6",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Di retrospective sprint, tim menemukan banyak test otomasi flaky yang memperlambat release. Hasil retrospective yang paling sesuai tujuannya adalah...",
"en": "In a sprint retrospective the team finds many flaky automated tests slowing releases. The outcome that best fits a retrospective's purpose is..."
},
"options": {
"id": [
"Menyepakati tindakan perbaikan proses, mis. stabilisasi test dan aturan karantina, lalu meninjaunya",
"Menyalahkan tester yang menulis test yang flaky agar kejadian serupa tidak terulang",
"Menghapus semua test otomasi supaya release tidak lagi terhambat oleh test yang gagal",
"Menunda pembahasan sampai release selesai agar tim tidak terganggu tekanan jadwal"
],
"en": [
"Agreeing process improvement actions, e.g. stabilising tests and a quarantine rule, then reviewing them",
"Blaming the tester who wrote the flaky tests so a similar thing does not happen again",
"Deleting all automated tests so releases are no longer held up by failing tests",
"Postponing the discussion until the release is done so the team is not distracted by schedule pressure"
]
},
"answer": 0,
"exp": {
"id": "Retrospective menghasilkan perbaikan proses dan test yang disepakati tim, tanpa menyalahkan individu.",
"en": "A retrospective yields team-agreed improvements to process and testing, without blaming individuals."
}
},
{
"id": "ctfl-098",
"topic": "istqb",
"lo": "FL-2.2.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tes yang memanggil API layanan pesanan dan layanan pembayaran bersama-sama untuk memastikan data dan kontrak antarlayanan benar termasuk level...",
"en": "A test that calls the order service and payment service APIs together to check data and contracts between services is at the level of..."
},
"options": {
"id": [
"Integration testing",
"Component testing",
"Acceptance testing",
"Maintenance testing"
],
"en": [
"Integration testing",
"Component testing",
"Acceptance testing",
"Maintenance testing"
]
},
"answer": 0,
"exp": {
"id": "Integration testing berfokus pada interaksi antar komponen atau sistem. Component testing menguji satu unit terisolasi; acceptance menilai kesiapan dari sisi bisnis; maintenance testing bukan level, melainkan testing saat sistem berubah.",
"en": "Integration testing focuses on interactions between components or systems. Component testing checks one isolated unit; acceptance judges business readiness; maintenance testing is not a level but testing during system change."
}
},
{
"id": "ctfl-099",
"topic": "istqb",
"lo": "FL-2.2.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang termasuk functional testing, bukan non-functional?",
"en": "Which is functional testing rather than non-functional?"
},
"options": {
"id": [
"Memeriksa perhitungan pajak pada invoice",
"Mengukur waktu respons dengan 1.000 user bersamaan",
"Memeriksa kemudahan dipelajari UI baru",
"Memeriksa data tetap aman saat serangan injeksi"
],
"en": [
"Checking the tax calculation on an invoice",
"Measuring response time with 1,000 concurrent users",
"Checking how easy a new interface is to learn",
"Checking data stays safe under an injection attack"
]
},
"answer": 0,
"exp": {
"id": "Functional testing menilai apa yang dilakukan sistem. Performance, usability, dan security adalah karakteristik non-fungsional.",
"en": "Functional testing evaluates what the system does. Performance, usability and security are non-functional characteristics."
}
},
{
"id": "ctfl-100",
"topic": "istqb",
"lo": "FL-2.3.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Database produksi akan dimigrasikan ke platform baru tanpa perubahan fitur. Testing yang tepat?",
"en": "The production database will be migrated to a new platform with no feature change. What testing fits?"
},
"options": {
"id": [
"Maintenance testing: uji migrasi data, environment baru, dan regression agar fungsi tetap benar",
"Tidak perlu testing karena tidak ada fitur yang berubah selama proses migrasi berlangsung",
"Hanya component testing satu fungsi, karena perubahan terjadi di lapisan penyimpanan",
"Hanya testing performance yang dijalankan setahun setelah migrasi selesai dilakukan"
],
"en": [
"Maintenance testing: test data migration, the new environment, and regression to keep behaviour correct",
"No testing is needed because no feature changes while the migration is under way",
"Only component testing of one function, since the change is in the storage layer",
"Only performance testing run a year after the migration has been completed"
]
},
"answer": 0,
"exp": {
"id": "Migrasi adalah trigger maintenance testing, dengan analisis dampak untuk menentukan coverage regression.",
"en": "Migration is a trigger for maintenance testing, with impact analysis to scope regression."
}
},
{
"id": "ctfl-101",
"topic": "istqb",
"lo": "FL-3.1.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Jenis defect mana yang paling efektif ditemukan oleh static testing pada tahap requirement?",
"en": "Which kind of defect is static testing at the requirement stage most effective at finding?"
},
"options": {
"id": [
"Requirement yang ambigu atau saling bertentangan",
"Kebocoran memori saat load tinggi",
"Lonjakan waktu respons pada jam sibuk",
"Crash pada perangkat tertentu"
],
"en": [
"Ambiguous or contradictory requirements",
"Memory leaks under high load",
"Response-time spikes at peak hours",
"Crashes on a specific device"
]
},
"answer": 0,
"exp": {
"id": "Static testing memeriksa work product tanpa menjalankan kode. Masalah runtime seperti memori, performance, dan perangkat butuh dynamic testing.",
"en": "Static testing examines work products without running code. Runtime issues such as memory, performance and devices need dynamic testing."
}
},
{
"id": "ctfl-102",
"topic": "istqb",
"lo": "FL-3.1.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang lebih mungkin ditemukan oleh static analysis tool daripada oleh dynamic testing biasa?",
"en": "Which is more likely to be found by a static analysis tool than by ordinary dynamic testing?"
},
"options": {
"id": [
"Kode yang tidak pernah dijangkau (unreachable) dan pelanggaran standar penulisan kode",
"Waktu respons lambat pada load tinggi",
"Layout rusak di browser tertentu",
"Salah hitung hanya pada input tertentu saat runtime"
],
"en": [
"Unreachable code and coding-standard violations",
"Slow response time under load",
"Broken layout in a specific browser",
"Miscalculation only for certain runtime inputs"
]
},
"answer": 0,
"exp": {
"id": "Static analysis menemukan masalah struktur kode tanpa menjalankannya. Perilaku runtime muncul lewat dynamic testing.",
"en": "Static analysis finds code-structure problems without executing it. Runtime behaviour surfaces through dynamic testing."
}
},
{
"id": "ctfl-103",
"topic": "istqb",
"lo": "FL-3.2.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Urutan aktivitas review yang benar adalah...",
"en": "The correct order of review activities is..."
},
"options": {
"id": [
"Planning, review initiation, individual review, issue communication and analysis, fixing and reporting",
"Individual review, planning, fixing, review initiation, communication",
"Planning, fixing and reporting, individual review, initiation, communication",
"Review initiation, planning, communication, individual review, fixing"
],
"en": [
"Planning, review initiation, individual review, issue communication and analysis, fixing and reporting",
"Individual review, planning, fixing, review initiation, communication",
"Planning, fixing and reporting, individual review, initiation, communication",
"Review initiation, planning, communication, individual review, fixing"
]
},
"answer": 0,
"exp": {
"id": "Mulai dari perencanaan, memulai review, review individual, diskusi dan analisis temuan, lalu perbaikan dan reporting.",
"en": "Start with planning, initiate the review, individual review, discuss and analyse findings, then fix and report."
}
},
{
"id": "ctfl-104",
"topic": "istqb",
"lo": "FL-3.2.4",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Review yang dipimpin penulis untuk menjelaskan work product kepada peserta dan mengumpulkan feedback, tanpa proses formal ketat, disebut...",
"en": "A review led by the author to explain the work product to participants and gather feedback, without a strict formal process, is called a..."
},
"options": {
"id": [
"Walkthrough",
"Inspection",
"Technical review oleh pakar saja",
"Informal review tanpa peserta"
],
"en": [
"Walkthrough",
"Inspection",
"Technical review by experts only",
"Informal review with no participants"
]
},
"answer": 0,
"exp": {
"id": "Walkthrough dipimpin penulis. Inspection paling formal dengan peran, aturan masuk/keluar, dan metrik, serta dipimpin fasilitator terlatih.",
"en": "A walkthrough is author-led. An inspection is the most formal, with roles, entry/exit rules and metrics, led by a trained facilitator."
}
},
{
"id": "ctfl-105",
"topic": "istqb",
"lo": "FL-3.2.3",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Dalam review formal, siapa yang mencatat isu dan keputusan yang muncul selama pertemuan?",
"en": "In a formal review, who records the issues and decisions raised during the meeting?"
},
"options": {
"id": [
"Scribe (pencatat)",
"Author",
"Manager",
"Reviewer lain secara bergilir tanpa peran"
],
"en": [
"The scribe",
"The author",
"The manager",
"Any reviewer in turn with no role"
]
},
"answer": 0,
"exp": {
"id": "Peran review: manager, author, facilitator/moderator, review leader, reviewer, dan scribe yang mencatat temuan.",
"en": "Review roles: manager, author, facilitator/moderator, review leader, reviewer and the scribe who records findings."
}
},
{
"id": "ctfl-106",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Pendaftaran menerima umur 18 sampai 64 (bilangan bulat, inklusif). Nilai uji BVA dua nilai yang tepat?",
"en": "Registration accepts ages 18 to 64 (integers, inclusive). The correct two-value BVA test values?"
},
"options": {
"id": [
"17, 18, 64, 65",
"18, 19, 63, 64",
"17, 18, 19, 63, 64, 65",
"18, 64"
],
"en": [
"17, 18, 64, 65",
"18, 19, 63, 64",
"17, 18, 19, 63, 64, 65",
"18, 64"
]
},
"answer": 0,
"exp": {
"id": "BVA dua nilai: tiap batas bersama tetangganya di partisi tidak valid: 18 dengan 17, 64 dengan 65.",
"en": "Two-value BVA: each boundary with its neighbour in the invalid partition: 18 with 17, 64 with 65."
}
},
{
"id": "ctfl-107",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Aturan ongkir: Jika Ekspres = Ya dan berat > 5 kg, biaya Rp50.000. Ekspres = Ya dan berat <= 5 kg, Rp30.000. Ekspres = Tidak dan berat > 5 kg, Rp20.000. Ekspres = Tidak dan berat <= 5 kg, Rp10.000. Paket 3 kg dikirim non-ekspres. Biayanya?",
"en": "Shipping rules: Express = Yes and weight > 5 kg costs Rp50,000. Express = Yes and weight <= 5 kg, Rp30,000. Express = No and weight > 5 kg, Rp20,000. Express = No and weight <= 5 kg, Rp10,000. A 3 kg parcel is sent non-express. The cost?"
},
"options": {
"id": [
"Rp10.000",
"Rp20.000",
"Rp30.000",
"Rp50.000"
],
"en": [
"Rp10.000",
"Rp20.000",
"Rp30.000",
"Rp50.000"
]
},
"answer": 0,
"exp": {
"id": "Kondisi: Ekspres = Tidak, berat > 5 = Tidak, cocok dengan rule keempat: Rp10.000.",
"en": "Conditions: Express = No, weight > 5 = No match rule four: Rp10,000."
}
},
{
"id": "ctfl-108",
"topic": "istqb",
"lo": "FL-4.3.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Fungsi memiliki 10 statement yang dapat dieksekusi. Suite test mengeksekusi 8 di antaranya. Berapa statement coverage?",
"en": "A function has 10 executable statements. The test suite executes 8 of them. What is the statement coverage?"
},
"options": {
"id": [
"8%",
"20%",
"80%",
"100%"
],
"en": [
"8%",
"20%",
"80%",
"100%"
]
},
"answer": 2,
"exp": {
"id": "Statement coverage = statement yang dieksekusi / total = 8 / 10 = 80%.",
"en": "Statement coverage = executed statements / total = 8 / 10 = 80%."
}
},
{
"id": "ctfl-109",
"topic": "istqb",
"lo": "FL-4.3.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Kode memiliki dua keputusan if/else yang berurutan dan independen (total 4 branch). Test yang ada menjalankan 3 branch. Berapa branch coverage?",
"en": "The code has two independent consecutive if/else decisions (4 branches in total). Existing tests exercise 3 branches. What is the branch coverage?"
},
"options": {
"id": [
"25%",
"50%",
"75%",
"100%"
],
"en": [
"25%",
"50%",
"75%",
"100%"
]
},
"answer": 2,
"exp": {
"id": "Branch coverage = branch yang dijalankan / total branch = 3 / 4 = 75%. 100% branch coverage selalu menjamin 100% statement coverage, tetapi tidak sebaliknya.",
"en": "Branch coverage = executed branches / total = 3 / 4 = 75%. 100% branch coverage guarantees 100% statement coverage, but not vice versa."
}
},
{
"id": "ctfl-110",
"topic": "istqb",
"lo": "FL-4.4.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tester menguji form dengan input kosong, spasi, emoji, dan string sangat panjang karena pengalaman bahwa input seperti itu sering memicu bug. Teknik apa ini?",
"en": "A tester tries a form with empty input, spaces, emoji and a very long string because experience shows such inputs often trigger bugs. Which technique is this?"
},
"options": {
"id": [
"Error guessing",
"Boundary value analysis",
"Decision table testing",
"Statement testing"
],
"en": [
"Error guessing",
"Boundary value analysis",
"Decision table testing",
"Statement testing"
]
},
"answer": 0,
"exp": {
"id": "Error guessing memakai pengetahuan dan pengalaman tester tentang di mana defect biasanya muncul, tanpa model formal.",
"en": "Error guessing uses the tester's knowledge and experience of where defects typically occur, with no formal model."
}
},
{
"id": "ctfl-111",
"topic": "istqb",
"lo": "FL-4.5.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Acceptance criteria mana yang paling baik untuk story 'login'?",
"en": "Which acceptance criterion is best for a 'login' story?"
},
"options": {
"id": [
"Setelah 5 kali password salah berturut-turut, akun dikunci 15 menit dan muncul pesan penguncian",
"Login harus aman, nyaman, dan cepat bagi seluruh jenis user aplikasi",
"Sistem harus bagus dan berfungsi dengan baik dalam semua kondisi penggunaan",
"Developer menulis kode login dengan rapi serta mengikuti standar penulisan kode"
],
"en": [
"After 5 consecutive wrong passwords the account is locked for 15 minutes and a lock message shows",
"Login must be secure, pleasant and fast for every kind of application user",
"The system must be good and work well under all conditions of use",
"The developer writes tidy login code and follows the coding standard"
]
},
"answer": 0,
"exp": {
"id": "Acceptance criteria baik spesifik, dapat diuji, dan tidak ambigu sehingga langsung menjadi test.",
"en": "Good acceptance criteria are specific, testable and unambiguous so they turn straight into tests."
}
},
{
"id": "ctfl-112",
"topic": "istqb",
"lo": "FL-5.1.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang merupakan contoh exit criteria, bukan entry criteria?",
"en": "Which is an example of exit criteria rather than entry criteria?"
},
"options": {
"id": [
"Semua test kritis lolos dan tidak ada defect kritis yang masih terbuka",
"Test environment sudah siap dan dapat diakses",
"Test data sudah tersedia",
"Build sudah lolos smoke test"
],
"en": [
"All critical tests pass and no critical defects remain open",
"The test environment is ready and accessible",
"Test data is available",
"The build has passed smoke testing"
]
},
"answer": 0,
"exp": {
"id": "Entry criteria menentukan kesiapan memulai; exit criteria menentukan kapan testing dianggap cukup selesai.",
"en": "Entry criteria define readiness to start; exit criteria define when testing is considered done enough."
}
},
{
"id": "ctfl-113",
"topic": "istqb",
"lo": "FL-5.1.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Tiga sprint lalu, tim menyelesaikan testing 20, 24, dan 22 test case per sprint. Masih ada 66 test case yang harus diuji. Dengan ekstrapolasi dari rata-rata, perkiraan jumlah sprint?",
"en": "In the last three sprints the team finished testing 20, 24 and 22 test cases per sprint. 66 test cases remain. Extrapolating from the average, about how many sprints are needed?"
},
"options": {
"id": [
"2",
"3",
"4",
"5"
],
"en": [
"2",
"3",
"4",
"5"
]
},
"answer": 1,
"exp": {
"id": "Rata-rata (20+24+22)/3 = 22 per sprint. 66 / 22 = 3 sprint. Ekstrapolasi memakai data historis proyek yang sama.",
"en": "Average (20+24+22)/3 = 22 per sprint. 66 / 22 = 3 sprints. Extrapolation uses historical data from the same project."
}
},
{
"id": "ctfl-114",
"topic": "istqb",
"lo": "FL-5.1.5",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Risiko = kemungkinan x dampak (skala 1-5). TC-A: 4 x 5, TC-B: 5 x 2, TC-C: 3 x 4, TC-D: 2 x 2. Urutan eksekusi berbasis risiko dari tertinggi?",
"en": "Risk = likelihood x impact (scale 1-5). TC-A: 4 x 5, TC-B: 5 x 2, TC-C: 3 x 4, TC-D: 2 x 2. Risk-based execution order from highest?"
},
"options": {
"id": [
"A, C, B, D",
"B, A, C, D",
"A, B, C, D",
"D, B, C, A"
],
"en": [
"A, C, B, D",
"B, A, C, D",
"A, B, C, D",
"D, B, C, A"
]
},
"answer": 0,
"exp": {
"id": "A = 20, C = 12, B = 10, D = 4, jadi A, C, B, D.",
"en": "A = 20, C = 12, B = 10, D = 4, so A, C, B, D."
}
},
{
"id": "ctfl-115",
"topic": "istqb",
"lo": "FL-5.1.7",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Dalam testing quadrants, exploratory testing dan user acceptance testing yang mengkritik produk dari sisi bisnis berada di kuadran...",
"en": "In the testing quadrants, exploratory testing and user acceptance testing that critique the product from the business side belong to the quadrant..."
},
"options": {
"id": [
"Business-facing, critique product (Q3)",
"Technology-facing, support the team (Q1)",
"Business-facing, support the team (Q2)",
"Technology-facing, critique product (Q4)"
],
"en": [
"Business-facing, critique product (Q3)",
"Technology-facing, support the team (Q1)",
"Business-facing, support the team (Q2)",
"Technology-facing, critique product (Q4)"
]
},
"answer": 0,
"exp": {
"id": "Q1: component/integration; Q2: functional examples dan story tests; Q3: eksploratori, usability, UAT; Q4: performance, security, dan karakteristik non-fungsional lain.",
"en": "Q1: component/integration; Q2: functional examples and story tests; Q3: exploratory, usability, UAT; Q4: performance, security and other non-functional characteristics."
}
},
{
"id": "ctfl-116",
"topic": "istqb",
"lo": "FL-5.2.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang merupakan product risk (bukan project risk)?",
"en": "Which is a product risk (not a project risk)?"
},
"options": {
"id": [
"Pembulatan salah pada hitungan cicilan yang merugikan customer",
"Anggota tim kunci pindah ke perusahaan lain di tengah proyek yang sedang berjalan",
"Test environment terlambat tersedia sehingga jadwal eksekusi tes bergeser dua minggu",
"Anggaran untuk tool testing dipotong oleh manajemen pada kuartal berikutnya"
],
"en": [
"A rounding error in instalment calculation that harms customers",
"A key team member leaves for another company in the middle of the running project",
"The test environment arrives late so the test execution schedule slips by two weeks",
"The budget for testing tools is cut by management in the following quarter"
]
},
"answer": 0,
"exp": {
"id": "Product risk menyangkut kualitas produk; project risk menyangkut manajemen dan kontrol proyek (orang, jadwal, anggaran, environment).",
"en": "Product risks concern product quality; project risks concern project management and control (people, schedule, budget, environment)."
}
},
{
"id": "ctfl-117",
"topic": "istqb",
"lo": "FL-5.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Tingkat risiko ditentukan oleh kombinasi...",
"en": "Risk level is determined by the combination of..."
},
"options": {
"id": [
"Kemungkinan (likelihood) dan dampak (impact)",
"Jumlah tester dan jumlah developer",
"Jumlah baris kode dan jumlah test",
"Harga tool dan lama sprint"
],
"en": [
"Likelihood and impact",
"Number of testers and developers",
"Lines of code and number of tests",
"Tool price and sprint length"
]
},
"answer": 0,
"exp": {
"id": "Risiko dinilai dari seberapa mungkin kejadiannya dan seberapa besar akibatnya.",
"en": "Risk is assessed by how likely the event is and how severe its consequence would be."
}
},
{
"id": "ctfl-118",
"topic": "istqb",
"lo": "FL-5.3.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang merupakan metrik progres testing?",
"en": "Which is a test progress metric?"
},
"options": {
"id": [
"Persentase test case yang sudah dieksekusi dari yang direncanakan",
"Gaji tester yang dihitung per orang untuk setiap bulan selama proyek berjalan",
"Warna dashboard yang dipilih tim untuk menampilkan hasil testing kepada stakeholder",
"Jumlah rapat yang diadakan setiap bulan oleh tim selama iterasi berlangsung"
],
"en": [
"Percentage of planned test cases executed",
"Tester salaries calculated per person for each month while the project is running",
"The dashboard colour the team picked to present testing results to stakeholders",
"The number of meetings the team holds every month during the iteration"
]
},
"answer": 0,
"exp": {
"id": "Metrik umum: kemajuan eksekusi test, defect ditemukan dan diperbaiki, requirement coverage atau kode, usaha dan biaya.",
"en": "Common metrics: test execution progress, defects found and fixed, requirement or code coverage, effort and cost."
}
},
{
"id": "ctfl-119",
"topic": "istqb",
"lo": "FL-5.3.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Apa yang sebaiknya ada di test progress/summary report untuk manajer?",
"en": "What should a test progress/summary report for managers contain?"
},
"options": {
"id": [
"Ringkasan testing, deviasi dari rencana, status terhadap exit criteria, metrik, dan risiko tersisa",
"Seluruh log eksekusi mentah dari setiap test case yang dijalankan selama iterasi berlangsung",
"Hanya jumlah test yang lolos tanpa konteks apa pun tentang coverage maupun risikonya",
"Kode sumber seluruh test otomasi beserta riwayat perubahannya di repositori"
],
"en": [
"A summary of testing, deviations from plan, status against exit criteria, metrics and remaining risks",
"All raw execution logs of every test case run during the iteration",
"Only the number of passed tests, with no context about coverage or risks",
"The source code of all automated tests together with their change history in the repository"
]
},
"answer": 0,
"exp": {
"id": "Laporan disesuaikan dengan pembacanya: ringkas, bermakna, dan mendukung keputusan.",
"en": "Reports are tailored to the reader: concise, meaningful and decision-supporting."
}
},
{
"id": "ctfl-120",
"topic": "istqb",
"lo": "FL-5.4.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Peran configuration management dalam testing adalah...",
"en": "The role of configuration management in testing is..."
},
"options": {
"id": [
"Mengidentifikasi dan mengendalikan versi testware dan test item agar hasil test dapat ditelusuri",
"Menentukan prioritas bisnis fitur dan urutan pengerjaannya bagi tim pengembangan",
"Menulis test case baru secara otomatis dari perubahan kode yang di-commit hari ini",
"Menghitung estimasi usaha testing dari jumlah requirement pada iterasi berjalan"
],
"en": [
"Identifying and controlling versions of testware and test items so results are traceable",
"Setting the business priority of features and the order in which the team builds them",
"Writing new test cases automatically from the code changes committed today",
"Calculating testing effort estimates from the number of requirements in the iteration"
]
},
"answer": 0,
"exp": {
"id": "Tanpa version control, hasil test tidak dapat direproduksi atau dikaitkan dengan build yang benar.",
"en": "Without version control, results cannot be reproduced or tied to the correct build."
}
},
{
"id": "ctfl-121",
"topic": "istqb",
"lo": "FL-5.5.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Salah ketik nama merek di halaman checkout, sehari sebelum kampanye besar. Penentuan severity dan priority yang paling masuk akal?",
"en": "A brand-name typo on the checkout page, one day before a major campaign. The most sensible severity and priority?"
},
"options": {
"id": [
"Severity rendah, priority tinggi",
"Severity tinggi, priority rendah",
"Severity dan priority rendah",
"Severity kritis karena sistem crash"
],
"en": [
"Low severity, high priority",
"High severity, low priority",
"Low severity and low priority",
"Critical severity because the system crashes"
]
},
"answer": 0,
"exp": {
"id": "Severity menyatakan dampak teknis pada fungsi; priority menyatakan urgensi perbaikan dari sisi bisnis. Typo tidak merusak fungsi tetapi mendesak diperbaiki sebelum kampanye.",
"en": "Severity states technical impact on function; priority states business urgency of the fix. A typo breaks no function but must be fixed before the campaign."
}
},
{
"id": "ctfl-122",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tool yang melaporkan baris dan branch mana yang dijalankan oleh suite test termasuk kategori...",
"en": "A tool that reports which lines and branches the test suite executed falls into the category of..."
},
"options": {
"id": [
"Test execution dan coverage tools",
"Test management tools",
"Performance testing tools",
"Collaboration tools"
],
"en": [
"Test execution and coverage tools",
"Test management tools",
"Performance testing tools",
"Collaboration tools"
]
},
"answer": 0,
"exp": {
"id": "Coverage tool mengukur seberapa besar kode terlaksana oleh test, dan dikelompokkan dengan tool eksekusi test.",
"en": "Coverage tools measure how much code the tests exercise and are grouped with test execution tools."
}
},
{
"id": "ctfl-123",
"topic": "istqb",
"lo": "FL-6.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang merupakan risiko umum otomasi test?",
"en": "Which is a common risk of test automation?"
},
"options": {
"id": [
"Usaha perawatan script diremehkan",
"Eksekusi menjadi lebih konsisten",
"Waktu berkurang untuk tugas berulang",
"Penilaian lebih objektif"
],
"en": [
"Script maintenance effort is underestimated",
"Execution becomes more consistent",
"Less time is spent on repetitive tasks",
"Assessment is more objective"
]
},
"answer": 0,
"exp": {
"id": "Tiga lainnya adalah manfaat. Risiko termasuk ekspektasi tidak realistis, perawatan diremehkan, dan ketergantungan berlebihan pada tool.",
"en": "The other three are benefits. Risks include unrealistic expectations, underestimated maintenance and over-reliance on the tool."
}
},
{
"id": "ctfl-124",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tool CI/CD yang membangun dan menjalankan test setiap ada perubahan kode termasuk kategori dukungan...",
"en": "A CI/CD tool that builds and runs tests on every code change belongs to the support category of..."
},
"options": {
"id": [
"DevOps tools",
"Static testing tools",
"Defect prediction",
"Hanya tool dokumentasi"
],
"en": [
"DevOps tools",
"Static testing tools",
"Defect prediction",
"Documentation tools only"
]
},
"answer": 0,
"exp": {
"id": "Tool DevOps mendukung build, integrasi, dan deployment otomatis sehingga test dijalankan konsisten.",
"en": "DevOps tools support automated build, integration and deployment so tests run consistently."
}
},
{
"id": "ctfl-001",
"topic": "istqb",
"lo": "FL-1.1.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Manakah yang merupakan tujuan umum testing?",
"en": "Which is a typical test objective?"
},
"options": {
"id": [
"Memperbaiki defect yang ditemukan di kode setelah testing dinamis selesai dijalankan",
"Mengevaluasi work product seperti requirement dan desain",
"Men-deploy aplikasi ke produksi setelah semua test otomatis dinyatakan lolos",
"Menulis kode untuk fitur baru berdasarkan hasil analisis requirement oleh tim"
],
"en": [
"Fixing the defects found in the code after dynamic testing has been run",
"Evaluating work products such as requirements and design",
"Deploying the application to production once all automated tests are declared passed",
"Writing code for a new feature based on the team's requirement analysis results"
]
},
"answer": 1,
"exp": {
"id": "Mengevaluasi work product termasuk tujuan testing. Memperbaiki defect adalah debugging (developer), deploy dan menulis kode bukan tujuan testing.",
"en": "Evaluating work products is a test objective. Fixing defects is debugging (developers); deploying and writing code are not test objectives."
}
},
{
"id": "ctfl-002",
"topic": "istqb",
"lo": "FL-1.1.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pernyataan mana yang membedakan testing dan debugging dengan benar?",
"en": "Which statement correctly distinguishes testing from debugging?"
},
"options": {
"id": [
"Testing memperbaiki defect, sedangkan debugging menemukan failure pada saat sistem berjalan",
"Testing memicu failure akibat defect; debugging menemukan dan memperbaiki penyebabnya",
"Keduanya sama-sama selalu dilakukan oleh tester karena tujuan dan hasilnya identik",
"Debugging hanya dilakukan setelah release, ketika user sudah melaporkan masalah di produksi"
],
"en": [
"Testing fixes defects, while debugging finds failures while the system is running",
"Testing triggers failures caused by defects; debugging finds and fixes their causes",
"Both are always done by testers because their purpose and results are identical",
"Debugging is only done after release, once users have reported problems in production"
]
},
"answer": 1,
"exp": {
"id": "Testing menampakkan failure; debugging (oleh developer) menelusuri dan memperbaiki penyebab. Confirmation testing lalu memastikan perbaikannya berhasil.",
"en": "Testing exposes failures; debugging (by developers) traces and fixes causes. Confirmation testing then checks the fix."
}
},
{
"id": "ctfl-003",
"topic": "istqb",
"lo": "FL-1.2.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Bagaimana testing berkontribusi pada kesuksesan proyek?",
"en": "How does testing contribute to project success?"
},
"options": {
"id": [
"Menjamin sistem bebas defect sehingga tidak ada failure yang akan terjadi di produksi",
"Mengurangi risiko failure saat beroperasi dengan menemukan defect lebih dulu",
"Menghilangkan kebutuhan review karena semua masalah pasti ditemukan oleh testing",
"Menggantikan requirement karena test case sudah menjelaskan perilaku yang diharapkan"
],
"en": [
"Guarantees the system is defect-free so no failure will occur in production",
"Reduces the risk of failures in operation by finding defects beforehand",
"Removes the need for reviews because testing is certain to find every problem",
"Replaces requirements because the test cases already describe the expected behaviour"
]
},
"answer": 1,
"exp": {
"id": "Testing tidak bisa menjamin bebas defect (prinsip 1). Kontribusinya adalah mengurangi risiko dan meningkatkan kualitas.",
"en": "Testing cannot guarantee zero defects (principle 1). Its contribution is reducing risk and improving quality."
}
},
{
"id": "ctfl-004",
"topic": "istqb",
"lo": "FL-1.2.2",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Testing merupakan contoh dari...",
"en": "Testing is an example of..."
},
"options": {
"id": [
"Quality assurance",
"Quality control",
"Configuration management",
"Process improvement"
],
"en": [
"Quality assurance",
"Quality control",
"Configuration management",
"Process improvement"
]
},
"answer": 1,
"exp": {
"id": "Testing adalah bentuk quality control (berorientasi produk). QA berorientasi proses dan pencegahan.",
"en": "Testing is a form of quality control (product-oriented). QA is process-oriented and preventive."
}
},
{
"id": "ctfl-005",
"topic": "istqb",
"lo": "FL-1.2.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Total di invoice tampil salah. Penyelidikan: rumus di kode salah karena developer salah membaca requirement yang ambigu. Mana yang merupakan FAILURE?",
"en": "An invoice shows a wrong total. Investigation: the code formula is wrong because the developer misread an ambiguous requirement. Which is the FAILURE?"
},
"options": {
"id": [
"Rumus yang salah di kode",
"Requirement yang ambigu",
"Developer salah membaca requirement",
"Total yang salah yang terlihat oleh user"
],
"en": [
"The wrong formula in the code",
"The ambiguous requirement",
"The developer misreading the requirement",
"The wrong total the user sees"
]
},
"answer": 3,
"exp": {
"id": "Failure = perilaku salah saat dijalankan (total salah). Rumus salah = defect, salah baca = error, requirement ambigu = root cause.",
"en": "Failure = wrong behaviour at run time (the wrong total). Wrong formula = defect, misreading = error, ambiguous requirement = root cause."
}
},
{
"id": "ctfl-006",
"topic": "istqb",
"lo": "FL-1.3.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tim menguji sistem kendali penerbangan jauh lebih ketat daripada situs pemasaran. Prinsip apa yang tercermin?",
"en": "A team tests an airline control system far more rigorously than a marketing site. Which principle is reflected?"
},
"options": {
"id": [
"Defects cluster together",
"Tests wear out",
"Testing is context dependent",
"Early testing saves time and money"
],
"en": [
"Defects cluster together",
"Tests wear out",
"Testing is context dependent",
"Early testing saves time and money"
]
},
"answer": 2,
"exp": {
"id": "Pendekatan testing bergantung pada konteks dan risiko; sistem kritis keselamatan butuh usaha lebih besar.",
"en": "The test approach depends on context and risk; safety-critical systems need more effort."
}
},
{
"id": "ctfl-007",
"topic": "istqb",
"lo": "FL-1.3.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Menguji semua kombinasi input dan precondition tidak mungkin kecuali kasus sepele, sehingga dipakai analisis risiko dan prioritas. Prinsip apa ini?",
"en": "Testing all combinations of inputs and preconditions is impossible except for trivial cases, so risk analysis and priorities are used. Which principle is this?"
},
"options": {
"id": [
"Exhaustive testing is impossible",
"Absence-of-defects is a fallacy",
"Testing shows the presence of defects",
"Defects cluster together"
],
"en": [
"Exhaustive testing is impossible",
"Absence-of-defects is a fallacy",
"Testing shows the presence of defects",
"Defects cluster together"
]
},
"answer": 0,
"exp": {
"id": "Itulah prinsip exhaustive testing is impossible; solusinya memilih tes lewat teknik dan risiko.",
"en": "That is the exhaustive-testing-is-impossible principle; the answer is choosing tests via techniques and risk."
}
},
{
"id": "ctfl-008",
"topic": "istqb",
"lo": "FL-1.4.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Aktivitas test mana yang menjawab pertanyaan \"APA yang perlu diuji\" dengan mengidentifikasi test condition?",
"en": "Which test activity answers \"WHAT to test\" by identifying test conditions?"
},
"options": {
"id": [
"Test planning",
"Test analysis",
"Test design",
"Test implementation"
],
"en": [
"Test planning",
"Test analysis",
"Test design",
"Test implementation"
]
},
"answer": 1,
"exp": {
"id": "Test analysis menentukan apa yang diuji (test condition); test design menentukan bagaimana mengujinya (test case).",
"en": "Test analysis decides what to test (test conditions); test design decides how (test cases)."
}
},
{
"id": "ctfl-009",
"topic": "istqb",
"lo": "FL-1.4.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Testware mana yang umumnya dihasilkan pada test implementation?",
"en": "Which testware is typically produced during test implementation?"
},
"options": {
"id": [
"Test completion report",
"Test procedures dan test suite",
"Test plan",
"Progress report"
],
"en": [
"Test completion report",
"Test procedures and test suites",
"Test plan",
"Progress report"
]
},
"answer": 1,
"exp": {
"id": "Implementation menghasilkan test procedure, test suite, data, dan jadwal eksekusi. Completion report dari test completion, plan dari planning.",
"en": "Implementation produces test procedures, suites, data and an execution schedule. Completion report comes from test completion; plan from planning."
}
},
{
"id": "ctfl-010",
"topic": "istqb",
"lo": "FL-1.4.4",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Manfaat traceability antara requirement dan test case adalah...",
"en": "A benefit of traceability between requirements and test cases is..."
},
"options": {
"id": [
"Menjamin semua test case selalu otomatis sehingga eksekusi tidak butuh tenaga manusia",
"Menilai coverage requirement oleh tes dan menganalisis dampak perubahan",
"Menghilangkan perlunya test plan karena semua hubungan sudah tercatat dalam matriks",
"Mempercepat eksekusi tes dengan menjalankan hanya test yang terhubung ke requirement baru"
],
"en": [
"Guarantees all test cases are always automated so execution needs no human effort",
"Assessing requirement coverage by tests and analysing the impact of changes",
"Removes the need for a test plan because every relationship is already recorded in the matrix",
"Speeds up test execution by running only the tests linked to the new requirements"
]
},
"answer": 1,
"exp": {
"id": "Traceability mendukung evaluasi coverage, impact analysis, dan audit.",
"en": "Traceability supports coverage evaluation, impact analysis and audits."
}
},
{
"id": "ctfl-011",
"topic": "istqb",
"lo": "FL-1.4.5",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tugas mana yang termasuk peran test management?",
"en": "Which task belongs to the test management role?"
},
"options": {
"id": [
"Mendesain test case berdasarkan kondisi test yang sudah dianalisis",
"Menjalankan test case dan membandingkan hasil aktual dengan hasil yang diharapkan",
"Memantau kemajuan dan mengontrol aktivitas test",
"Menyiapkan data tes dan environment yang dibutuhkan untuk eksekusi"
],
"en": [
"Designing test cases from the test conditions that were analysed",
"Executing test cases and comparing actual results with expected results",
"Monitoring progress and controlling test activities",
"Preparing test data and the environment needed for execution"
]
},
"answer": 2,
"exp": {
"id": "Test management: planning, monitoring, control, completion. Analysis, design, implementation, execution adalah peran testing.",
"en": "Test management: planning, monitoring, control, completion. Analysis, design, implementation, execution are the testing role."
}
},
{
"id": "ctfl-012",
"topic": "istqb",
"lo": "FL-1.5.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Kekurangan potensial dari tester yang independen adalah...",
"en": "A potential drawback of independent testers is..."
},
"options": {
"id": [
"Mereka menemukan jenis defect yang sama persis dengan yang ditemukan developer",
"Mereka bisa terisolasi dari tim dan developer merasa kualitas bukan tanggung jawabnya",
"Mereka sama sekali tidak bisa menulis test case karena tidak memahami kode aplikasi",
"Mereka selalu bias terhadap hasil kerja developer sehingga laporannya tidak bisa dipercaya"
],
"en": [
"They find exactly the same kinds of defects as developers do",
"They may become isolated from the team, and developers may feel quality is not their job",
"They cannot write test cases at all because they do not understand the application code",
"They are always biased against the developers' work so their reports cannot be trusted"
]
},
"answer": 1,
"exp": {
"id": "Independensi memberi pandangan segar tetapi berisiko isolasi dan berkurangnya rasa tanggung jawab developer.",
"en": "Independence gives a fresh view but risks isolation and reduced developer ownership."
}
},
{
"id": "ctfl-013",
"topic": "istqb",
"lo": "FL-1.5.2",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Whole-team approach berarti...",
"en": "The whole-team approach means..."
},
"options": {
"id": [
"Hanya tester yang bertanggung jawab atas kualitas, sedangkan anggota tim lain fokus pada fitur",
"Siapa pun dengan keahlian yang dibutuhkan bisa mengerjakan tugas; seluruh tim bertanggung jawab atas kualitas",
"Semua orang di tim harus menjadi tester bersertifikat sebelum boleh ikut mengerjakan tugas",
"Developer dilarang menguji agar pekerjaan testing tetap independen dari pengembangan"
],
"en": [
"Only testers are responsible for quality, while other team members focus on features",
"Anyone with the needed skills can do the tasks; the whole team is responsible for quality",
"Everyone on the team must be a certified tester before taking part in any tasks",
"Developers are forbidden from testing so that testing stays independent of development"
]
},
"answer": 1,
"exp": {
"id": "Kualitas adalah tanggung jawab bersama, memanfaatkan keahlian seluruh tim.",
"en": "Quality is a shared responsibility using the skills of the whole team."
}
},
{
"id": "ctfl-014",
"topic": "istqb",
"lo": "FL-1.5.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Keterampilan umum mana yang penting bagi tester?",
"en": "Which generic skill is important for a tester?"
},
"options": {
"id": [
"Menyampaikan defect secara konstruktif kepada developer",
"Menghindari diskusi dengan stakeholder",
"Mengabaikan konteks bisnis",
"Hanya fokus pada tool"
],
"en": [
"Reporting defects constructively to developers",
"Avoiding discussions with stakeholders",
"Ignoring the business context",
"Focusing only on tools"
]
},
"answer": 0,
"exp": {
"id": "Komunikasi yang baik, ketelitian, pemikiran kritis, dan pengetahuan domain adalah keterampilan umum tester.",
"en": "Good communication, thoroughness, critical thinking and domain knowledge are generic tester skills."
}
},
{
"id": "ctfl-015",
"topic": "istqb",
"lo": "FL-2.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Dibandingkan model sekuensial, testing pada proyek Agile umumnya...",
"en": "Compared with a sequential model, testing in an Agile project is generally..."
},
"options": {
"id": [
"Dilakukan hanya setelah semua coding selesai",
"Dilakukan di setiap iterasi berdampingan dengan pengembangan",
"Tidak melibatkan tester",
"Tidak memerlukan regression test"
],
"en": [
"Done only after all coding is finished",
"Done in every iteration alongside development",
"Without testers",
"Free of regression testing"
]
},
"answer": 1,
"exp": {
"id": "Model iteratif menguji di tiap iterasi; regression test justru semakin penting karena perubahan sering.",
"en": "Iterative models test in each iteration; regression testing matters even more because change is frequent."
}
},
{
"id": "ctfl-016",
"topic": "istqb",
"lo": "FL-2.1.2",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Praktik testing yang baik di SDLC apa pun adalah...",
"en": "A good testing practice in any SDLC is..."
},
"options": {
"id": [
"Setiap aktivitas pengembangan punya aktivitas test yang sepadan",
"Testing hanya dimulai setelah release",
"Satu test level cukup untuk semua tujuan",
"Tester tidak ikut membahas requirement"
],
"en": [
"Each development activity has a corresponding test activity",
"Testing starts only after release",
"One test level is enough for every objective",
"Testers do not take part in requirement discussions"
]
},
"answer": 0,
"exp": {
"id": "Itu praktik pertama; juga setiap test level punya tujuan khusus dan tester ikut mengulas requirement.",
"en": "That is the first practice; also each test level has specific objectives and testers join requirement reviews."
}
},
{
"id": "ctfl-017",
"topic": "istqb",
"lo": "FL-2.1.3",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Pendekatan mana yang menulis perilaku dengan format Given/When/Then yang dipahami stakeholder bisnis?",
"en": "Which approach expresses behaviour in Given/When/Then format understandable to business stakeholders?"
},
"options": {
"id": [
"TDD",
"BDD",
"Exploratory testing",
"Fault attack"
],
"en": [
"TDD",
"BDD",
"Exploratory testing",
"Fault attack"
]
},
"answer": 1,
"exp": {
"id": "BDD memakai bahasa alami Given/When/Then. TDD memakai tes unit yang ditulis lebih dulu.",
"en": "BDD uses natural-language Given/When/Then. TDD uses unit tests written first."
}
},
{
"id": "ctfl-018",
"topic": "istqb",
"lo": "FL-2.1.4",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Manfaat DevOps bagi testing adalah...",
"en": "A benefit of DevOps for testing is..."
},
"options": {
"id": [
"Menghilangkan semua manual testing karena pipeline menjalankan semua jenis testing",
"Feedback kualitas cepat lewat pipeline CI/CD yang menjalankan tes otomatis",
"Tidak perlu lagi merawat otomasi karena pipeline memperbaiki test yang rusak sendiri",
"Test environment tidak lagi dibutuhkan karena semua tes berjalan di mesin developer"
],
"en": [
"Removes all manual testing because the pipeline runs every kind of test",
"Fast quality feedback through CI/CD pipelines that run automated tests",
"Automation no longer needs maintenance because the pipeline repairs broken tests itself",
"Test environments are no longer needed because all tests run on developers' machines"
]
},
"answer": 1,
"exp": {
"id": "CI/CD memberi feedback cepat dan mendorong shift-left; manual testing tetap dibutuhkan dan pipeline perlu dirawat.",
"en": "CI/CD gives fast feedback and promotes shift-left; manual testing remains and pipelines need maintenance."
}
},
{
"id": "ctfl-019",
"topic": "istqb",
"lo": "FL-2.1.5",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Contoh shift left yang tepat adalah...",
"en": "A correct example of shift left is..."
},
"options": {
"id": [
"Menunda test sampai tahap akhir proyek ketika semua fitur sudah selesai dibuat",
"Mereview user story dan acceptance criteria sebelum coding dimulai",
"Menambah jumlah tester setelah release agar defect produksi bisa diperbaiki lebih cepat",
"Menghapus static analysis dari pipeline supaya proses build berjalan lebih singkat"
],
"en": [
"Postponing tests to the final phase of the project when every feature is finished",
"Reviewing user stories and acceptance criteria before coding begins",
"Adding more testers after release so production defects can be fixed more quickly",
"Removing static analysis from the pipeline so the build process runs more briefly"
]
},
"answer": 1,
"exp": {
"id": "Shift left = aktivitas test lebih awal; review dini dan TDD adalah contohnya.",
"en": "Shift left = test activities earlier; early reviews and TDD are examples."
}
},
{
"id": "ctfl-020",
"topic": "istqb",
"lo": "FL-2.1.6",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Retrospective umumnya diadakan...",
"en": "A retrospective is generally held..."
},
"options": {
"id": [
"Sebelum proyek dimulai untuk menetapkan jadwal dan pembagian tugas seluruh anggota tim",
"Di akhir proyek atau iterasi untuk membahas keberhasilan dan perbaikan",
"Hanya ketika produksi gagal total, sebagai bagian dari analisis insiden yang formal",
"Setiap kuartal untuk menilai performance individu dan menentukan kenaikan gaji anggota tim"
],
"en": [
"Before the project starts to set the schedule and the division of tasks for all team members",
"At the end of a project or iteration to discuss successes and improvements",
"Only when production fails completely, as part of a formal incident analysis",
"Each quarter to evaluate individual performance and decide pay raises for team members"
]
},
"answer": 1,
"exp": {
"id": "Tujuan retrospective adalah perbaikan proses tim, bukan menilai individu.",
"en": "A retrospective is for team process improvement, not for judging individuals."
}
},
{
"id": "ctfl-021",
"topic": "istqb",
"lo": "FL-2.2.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Menguji interaksi antara aplikasi web dan layanan pembayaran eksternal termasuk test level...",
"en": "Testing the interaction between a web app and an external payment service belongs to the test level..."
},
"options": {
"id": [
"Component testing",
"Component integration testing",
"System testing",
"System integration testing"
],
"en": [
"Component testing",
"Component integration testing",
"System testing",
"System integration testing"
]
},
"answer": 3,
"exp": {
"id": "Interaksi antar sistem (termasuk layanan eksternal) = system integration. Component integration hanya antar komponen dalam satu sistem.",
"en": "Interaction between systems (including external services) = system integration. Component integration is between components within one system."
}
},
{
"id": "ctfl-022",
"topic": "istqb",
"lo": "FL-2.2.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Testing oleh administrator untuk backup/restore dan disaster recovery termasuk...",
"en": "Testing by administrators for backup/restore and disaster recovery is..."
},
"options": {
"id": [
"User acceptance testing",
"Operational acceptance testing",
"Alpha testing",
"Component testing"
],
"en": [
"User acceptance testing",
"Operational acceptance testing",
"Alpha testing",
"Component testing"
]
},
"answer": 1,
"exp": {
"id": "Operational acceptance testing menguji kesiapan operasional: backup, recovery, pemeliharaan, security.",
"en": "Operational acceptance testing checks operational readiness: backup, recovery, maintenance, security."
}
},
{
"id": "ctfl-023",
"topic": "istqb",
"lo": "FL-2.2.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pernyataan mana yang benar tentang white-box testing sebagai test type?",
"en": "Which statement about white-box testing as a test type is true?"
},
"options": {
"id": [
"Didasarkan pada struktur internal sistem seperti kode atau arsitektur",
"Hanya dilakukan pada acceptance level oleh user bisnis sebelum release dilakukan",
"Didasarkan hanya pada spesifikasi tanpa melihat bagaimana sistem dibangun di dalamnya",
"Tidak mengukur coverage apa pun karena fokusnya hanya pada perilaku dari luar"
],
"en": [
"It is based on the internal structure of the system such as code or architecture",
"It is done only at acceptance level by business users before the release happens",
"It is based only on the specification, without looking at how the system is built inside",
"It does not measure any coverage because it focuses only on behaviour seen from outside"
]
},
"answer": 0,
"exp": {
"id": "White-box = berbasis struktur dan dapat dilakukan di semua level; mengukur coverage struktur.",
"en": "White-box = structure-based, applicable at all levels, measuring structural coverage."
}
},
{
"id": "ctfl-024",
"topic": "istqb",
"lo": "FL-2.2.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Setelah bug login diperbaiki, tester menjalankan ulang test case yang gagal tadi, lalu menjalankan tes fitur lain untuk memeriksa efek samping. Kedua langkah ini berturut-turut disebut...",
"en": "After a login bug is fixed, the tester re-runs the failed test case, then runs tests on other features to check side effects. These two steps are called, in order..."
},
"options": {
"id": [
"Regression testing lalu confirmation testing",
"Confirmation testing lalu regression testing",
"Smoke testing lalu sanity testing",
"Retesting lalu debugging"
],
"en": [
"Regression testing then confirmation testing",
"Confirmation testing then regression testing",
"Smoke testing then sanity testing",
"Retesting then debugging"
]
},
"answer": 1,
"exp": {
"id": "Menjalankan ulang tes yang gagal = confirmation; memeriksa efek samping = regression.",
"en": "Re-running the failed test = confirmation; checking side effects = regression."
}
},
{
"id": "ctfl-025",
"topic": "istqb",
"lo": "FL-2.3.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pemindahan aplikasi ke platform atau database baru adalah trigger maintenance testing berupa...",
"en": "Moving an application to a new platform or database is a maintenance testing trigger of type..."
},
"options": {
"id": [
"Modification",
"Migration",
"Retirement",
"Regression"
],
"en": [
"Modification",
"Migration",
"Retirement",
"Regression"
]
},
"answer": 1,
"exp": {
"id": "Trigger: modification (perubahan fitur/perbaikan), migration (pindah platform/data), retirement (pensiun sistem).",
"en": "Triggers: modification (changes/fixes), migration (platform/data move), retirement (system decommissioning)."
}
},
{
"id": "ctfl-026",
"topic": "istqb",
"lo": "FL-3.1.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang dapat diperiksa dengan static testing?",
"en": "Which can be examined with static testing?"
},
"options": {
"id": [
"Waktu respons sistem yang berjalan",
"Kebocoran memori saat runtime",
"Kode sumber",
"Perilaku UI saat eksekusi"
],
"en": [
"Response time of a running system",
"Memory leak at runtime",
"Source code",
"UI behaviour during execution"
]
},
"answer": 2,
"exp": {
"id": "Static testing memeriksa work product tanpa menjalankannya (kode, requirement). Tiga lainnya butuh eksekusi (dynamic).",
"en": "Static testing examines work products without running them (code, requirements). The other three need execution (dynamic)."
}
},
{
"id": "ctfl-027",
"topic": "istqb",
"lo": "FL-3.1.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Nilai utama static testing adalah...",
"en": "The main value of static testing is..."
},
"options": {
"id": [
"Menemukan defect lebih awal sehingga lebih murah diperbaiki",
"Menjamin kode bebas bug sebelum masuk ke tahap testing dinamis maupun release",
"Menggantikan dynamic testing sepenuhnya sehingga eksekusi kode tidak lagi diperlukan",
"Mengukur performance aplikasi di bawah load nyata dengan banyak user sekaligus"
],
"en": [
"Finding defects early so they are cheaper to fix",
"Guaranteeing bug-free code before it enters dynamic testing or release",
"Replacing dynamic testing completely so executing the code is no longer necessary",
"Measuring application performance under real load with many users at the same time"
]
},
"answer": 0,
"exp": {
"id": "Static dan dynamic saling melengkapi; static unggul menemukan defect dini.",
"en": "Static and dynamic testing complement each other; static excels at early defects."
}
},
{
"id": "ctfl-028",
"topic": "istqb",
"lo": "FL-3.1.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Jenis defect mana yang lebih mudah ditemukan lewat static testing daripada dynamic testing?",
"en": "Which defect type is easier to find by static testing than by dynamic testing?"
},
"options": {
"id": [
"Memory leak",
"Waktu respons lambat",
"Ambiguitas pada requirement",
"Crash saat load tinggi"
],
"en": [
"Memory leak",
"Slow response time",
"Ambiguity in requirements",
"Crash under heavy load"
]
},
"answer": 2,
"exp": {
"id": "Ambiguitas, inkonsistensi, dan pelanggaran standar ditemukan lewat review/analisis; masalah runtime butuh dynamic.",
"en": "Ambiguity, inconsistency and standard violations are found by review/analysis; runtime problems need dynamic testing."
}
},
{
"id": "ctfl-029",
"topic": "istqb",
"lo": "FL-3.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Manfaat feedback awal dan sering dari stakeholder adalah...",
"en": "A benefit of early and frequent stakeholder feedback is..."
},
"options": {
"id": [
"Risiko salah paham requirement berkurang",
"Dokumentasi tidak diperlukan lagi",
"Tester tidak perlu terlibat",
"Jadwal selalu lebih lama"
],
"en": [
"Less risk of misunderstanding requirements",
"Documentation is no longer needed",
"Testers need not be involved",
"The schedule is always longer"
]
},
"answer": 0,
"exp": {
"id": "Feedback dini mengurangi salah paham dan pengerjaan ulang mahal.",
"en": "Early feedback reduces misunderstanding and costly rework."
}
},
{
"id": "ctfl-030",
"topic": "istqb",
"lo": "FL-3.2.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pada aktivitas review mana reviewer membaca work product sendiri dan mencatat temuan?",
"en": "In which review activity do reviewers read the work product alone and note findings?"
},
"options": {
"id": [
"Planning",
"Review initiation",
"Individual review",
"Fixing and reporting"
],
"en": [
"Planning",
"Review initiation",
"Individual review",
"Fixing and reporting"
]
},
"answer": 2,
"exp": {
"id": "Individual review (persiapan individu) mendahului komunikasi dan analisis temuan.",
"en": "Individual review (preparation) precedes communication and analysis of findings."
}
},
{
"id": "ctfl-031",
"topic": "istqb",
"lo": "FL-3.2.3",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Siapa yang mencatat temuan selama rapat review?",
"en": "Who records the findings during a review meeting?"
},
"options": {
"id": [
"Scribe",
"Manager",
"Author",
"Moderator"
],
"en": [
"Scribe",
"Manager",
"Author",
"Moderator"
]
},
"answer": 0,
"exp": {
"id": "Scribe mencatat. Author membuat work product, facilitator memimpin, manager menyediakan sumber daya.",
"en": "The scribe records. The author creates the work product, the facilitator leads, the manager provides resources."
}
},
{
"id": "ctfl-032",
"topic": "istqb",
"lo": "FL-3.2.4",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Jenis review mana yang dipimpin author dengan tujuan edukasi dan meminta feedback?",
"en": "Which review type is led by the author to educate and gather feedback?"
},
"options": {
"id": [
"Inspection",
"Technical review",
"Walkthrough",
"Informal review"
],
"en": [
"Inspection",
"Technical review",
"Walkthrough",
"Informal review"
]
},
"answer": 2,
"exp": {
"id": "Walkthrough dipimpin author. Inspection paling formal dengan peran, checklist, dan metrik.",
"en": "A walkthrough is author-led. Inspection is the most formal, with roles, checklists and metrics."
}
},
{
"id": "ctfl-033",
"topic": "istqb",
"lo": "FL-3.2.5",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Faktor sukses review adalah...",
"en": "A success factor for reviews is..."
},
"options": {
"id": [
"Hasil review dipakai untuk menilai performance author",
"Peserta punya waktu cukup dan tujuan review jelas",
"Review dilakukan atas seluruh dokumen sekaligus",
"Hanya manajer yang menjadi reviewer"
],
"en": [
"Review results are used to judge the author's performance",
"Participants have enough time and the review objectives are clear",
"The whole document is reviewed at once",
"Only managers act as reviewers"
]
},
"answer": 1,
"exp": {
"id": "Tujuan jelas, waktu cukup, potongan kecil, budaya konstruktif. Menilai performance author merusak budaya review.",
"en": "Clear objectives, enough time, small chunks, constructive culture. Judging authors damages review culture."
}
},
{
"id": "ctfl-034",
"topic": "istqb",
"lo": "FL-4.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pasangan teknik dan kategori mana yang benar?",
"en": "Which technique-category pairing is correct?"
},
"options": {
"id": [
"Equivalence partitioning - white-box",
"Statement testing - black-box",
"Error guessing - experience-based",
"Decision table - experience-based"
],
"en": [
"Equivalence partitioning - white-box",
"Statement testing - black-box",
"Error guessing - experience-based",
"Decision table - experience-based"
]
},
"answer": 2,
"exp": {
"id": "EP dan decision table = black-box; statement testing = white-box; error guessing = experience-based.",
"en": "EP and decision tables = black-box; statement testing = white-box; error guessing = experience-based."
}
},
{
"id": "ctfl-035",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Tarif tiket ditentukan umur (bilangan bulat): 0-12 anak, 13-64 dewasa, 65-120 lansia. Nilai di luar 0-120 ditolak. Berapa tes minimum untuk 100% equivalence partitioning coverage (valid dan invalid)?",
"en": "A ticket fare depends on age (integers): 0-12 child, 13-64 adult, 65-120 senior. Values outside 0-120 are rejected. What is the minimum number of tests for 100% equivalence partitioning coverage (valid and invalid)?"
},
"options": {
"id": [
"3",
"4",
"5",
"6"
],
"en": [
"3",
"4",
"5",
"6"
]
},
"answer": 2,
"exp": {
"id": "Partisi valid: 3 (anak, dewasa, lansia). Invalid: di bawah 0 dan di atas 120 = 2. Total 5 partisi, satu tes per partisi = 5.",
"en": "Valid partitions: 3 (child, adult, senior). Invalid: below 0 and above 120 = 2. Five partitions, one test each = 5."
}
},
{
"id": "ctfl-036",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Kuantitas valid adalah 1-99. Pasangan nilai mana yang berada di partisi ekuivalen yang SAMA?",
"en": "Valid quantity is 1-99. Which pair of values lies in the SAME equivalence partition?"
},
"options": {
"id": [
"0 dan 1",
"99 dan 100",
"1 dan 99",
"-5 dan 100"
],
"en": [
"0 and 1",
"99 and 100",
"1 and 99",
"-5 and 100"
]
},
"answer": 2,
"exp": {
"id": "1 dan 99 sama-sama valid. 0 invalid (bawah), 100 invalid (atas); -5 dan 100 berada di dua partisi invalid yang berbeda.",
"en": "1 and 99 are both valid. 0 is invalid (below), 100 is invalid (above); -5 and 100 are in two different invalid partitions."
}
},
{
"id": "ctfl-037",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Rentang valid bilangan bulat adalah 10-20. Himpunan nilai tes yang lengkap untuk 3-value boundary value analysis adalah...",
"en": "The valid integer range is 10-20. The complete set of test values for 3-value boundary value analysis is..."
},
"options": {
"id": [
"9, 10, 20, 21",
"9, 10, 11, 19, 20, 21",
"10, 15, 20",
"9, 11, 19, 21"
],
"en": [
"9, 10, 20, 21",
"9, 10, 11, 19, 20, 21",
"10, 15, 20",
"9, 11, 19, 21"
]
},
"answer": 1,
"exp": {
"id": "3-value BVA: tiap batas ditambah kedua tetangganya (9,10,11 dan 19,20,21). Opsi pertama adalah 2-value BVA.",
"en": "3-value BVA: each boundary plus both neighbours (9,10,11 and 19,20,21). The first option is 2-value BVA."
}
},
{
"id": "ctfl-038",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Diskon berlaku jika total belanja 100 atau lebih (bilangan bulat, minimal 0). Pasangan nilai mana yang diperlukan untuk 2-value BVA pada batas diskon?",
"en": "A discount applies when the order total is 100 or more (integers, minimum 0). Which pair of values is needed for 2-value BVA at the discount boundary?"
},
"options": {
"id": [
"100 dan 101",
"99 dan 100",
"90 dan 110",
"0 dan 100"
],
"en": [
"100 and 101",
"99 and 100",
"90 and 110",
"0 and 100"
]
},
"answer": 1,
"exp": {
"id": "Batas partisi non-diskon/diskon adalah 99 | 100. 2-value BVA memakai batas 100 dan tetangga di partisi sebelah, 99.",
"en": "The non-discount/discount boundary is 99 | 100. 2-value BVA uses boundary 100 and its neighbour in the other partition, 99."
}
},
{
"id": "ctfl-039",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Aturan diskon: Member dan total >= 100 = 20%; Member dan total < 100 = 10%; Bukan member dan total >= 100 = 5%; Bukan member dan total < 100 = 0%. Hasil yang diharapkan untuk bukan member dengan total 100?",
"en": "Discount rules: Member and total >= 100 = 20%; Member and total < 100 = 10%; Non-member and total >= 100 = 5%; Non-member and total < 100 = 0%. Expected result for a non-member with total 100?"
},
"options": {
"id": [
"0%",
"5%",
"10%",
"20%"
],
"en": [
"0%",
"5%",
"10%",
"20%"
]
},
"answer": 1,
"exp": {
"id": "Total 100 memenuhi >= 100, bukan member, maka rule ketiga: 5%.",
"en": "Total 100 satisfies >= 100 and the user is a non-member, so rule three applies: 5%."
}
},
{
"id": "ctfl-040",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Sebuah decision table lengkap memiliki 3 kondisi boolean. Berapa jumlah rule-nya?",
"en": "A complete decision table has 3 boolean conditions. How many rules does it have?"
},
"options": {
"id": [
"3",
"6",
"8",
"9"
],
"en": [
"3",
"6",
"8",
"9"
]
},
"answer": 2,
"exp": {
"id": "Jumlah rule = 2^n = 2^3 = 8.",
"en": "Number of rules = 2^n = 2^3 = 8."
}
},
{
"id": "ctfl-041",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Mesin penjual: Idle --(masukkan koin)--> Ready --(pilih)--> Dispensing --(selesai)--> Idle; Ready --(refund)--> Idle. Tes mana yang menguji transisi TIDAK VALID?",
"en": "Vending machine: Idle --(insert coin)--> Ready --(select)--> Dispensing --(done)--> Idle; Ready --(refund)--> Idle. Which test exercises an INVALID transition?"
},
"options": {
"id": [
"Memasukkan koin saat mesin sedang Idle dan belum ada produk yang dipilih",
"Memilih produk saat mesin berada pada state Ready setelah koin dimasukkan",
"Memilih produk saat mesin Idle",
"Meminta refund saat mesin Ready setelah koin dimasukkan tetapi belum ada produk dipilih"
],
"en": [
"Inserting a coin while the machine is Idle and no product has been selected yet",
"Selecting a product while the machine is in the Ready state after a coin was inserted",
"Selecting a product while the machine is Idle",
"Requesting a refund while Ready after a coin was inserted but no product was selected"
]
},
"answer": 2,
"exp": {
"id": "Event 'pilih' hanya valid di state Ready. Memilih saat Idle tidak ada di model, sehingga merupakan transisi tidak valid.",
"en": "The 'select' event is only valid in the Ready state. Selecting while Idle is not in the model, so it is an invalid transition."
}
},
{
"id": "ctfl-042",
"topic": "istqb",
"lo": "FL-4.3.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Program punya 4 statement: S1 baca a; S2 jika a>0; S3 cetak 'pos' (cabang true); S4 cetak 'neg' (cabang false). Satu tes a=5 menghasilkan statement coverage...",
"en": "A program has 4 statements: S1 read a; S2 if a>0; S3 print 'pos' (true branch); S4 print 'neg' (false branch). One test a=5 gives statement coverage of..."
},
"options": {
"id": [
"50%",
"75%",
"80%",
"100%"
],
"en": [
"50%",
"75%",
"80%",
"100%"
]
},
"answer": 1,
"exp": {
"id": "a=5 menjalankan S1, S2, S3 = 3 dari 4 statement = 75%.",
"en": "a=5 executes S1, S2, S3 = 3 of 4 statements = 75%."
}
},
{
"id": "ctfl-043",
"topic": "istqb",
"lo": "FL-4.3.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pada program yang sama (satu keputusan if a>0), satu tes a=5 menghasilkan branch coverage...",
"en": "For the same program (one decision if a>0), a single test a=5 gives branch coverage of..."
},
"options": {
"id": [
"25%",
"50%",
"75%",
"100%"
],
"en": [
"25%",
"50%",
"75%",
"100%"
]
},
"answer": 1,
"exp": {
"id": "Keputusan punya 2 cabang (true dan false). a=5 hanya menjalankan cabang true = 1 dari 2 = 50%.",
"en": "The decision has 2 outcomes (true and false). a=5 covers only true = 1 of 2 = 50%."
}
},
{
"id": "ctfl-044",
"topic": "istqb",
"lo": "FL-4.3.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Kekuatan utama white-box testing adalah...",
"en": "A key strength of white-box testing is..."
},
"options": {
"id": [
"Menemukan fungsi yang hilang dari kode tetapi sudah ada di spesifikasi dengan jelas",
"Mempertimbangkan seluruh implementasi sehingga defect bisa ditemukan meski spesifikasi kabur",
"Tidak memerlukan akses ke kode maupun pengetahuan tentang struktur internal sistem",
"Selalu menggantikan black-box testing karena cakupannya pasti lebih lengkap dan murah"
],
"en": [
"Finding functionality missing from the code even though it is clearly in the specification",
"Considering the whole implementation so defects can be found even if the specification is vague",
"Needing no access to the code or knowledge of the system's internal structure",
"Always replacing black-box testing because its coverage is certainly more complete and cheaper"
]
},
"answer": 1,
"exp": {
"id": "White-box melihat implementasi, tetapi tidak bisa menemukan fungsi yang tidak ada di kode; itu kekuatan black-box.",
"en": "White-box looks at the implementation but cannot find functionality absent from the code; that is a black-box strength."
}
},
{
"id": "ctfl-045",
"topic": "istqb",
"lo": "FL-4.4.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tester membuat daftar kesalahan yang mungkin (pembagian nol, input kosong) dari pengalaman lalu merancang tes. Teknik apa ini?",
"en": "A tester lists likely faults (divide by zero, empty input) from experience and designs tests. Which technique is this?"
},
"options": {
"id": [
"Equivalence partitioning",
"Error guessing",
"Statement testing",
"State transition testing"
],
"en": [
"Equivalence partitioning",
"Error guessing",
"Statement testing",
"State transition testing"
]
},
"answer": 1,
"exp": {
"id": "Itu error guessing; versi terstrukturnya disebut fault attack.",
"en": "That is error guessing; the structured version is a fault attack."
}
},
{
"id": "ctfl-046",
"topic": "istqb",
"lo": "FL-4.4.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pernyataan mana yang menggambarkan exploratory testing?",
"en": "Which statement describes exploratory testing?"
},
"options": {
"id": [
"Desain dan eksekusi tes dipisah jauh dan didokumentasikan penuh sebelum dijalankan",
"Desain, eksekusi, dan pembelajaran dilakukan bersamaan, dipandu test charter dan sering dibatasi waktu",
"Tes hanya dijalankan oleh tool otomatis berdasarkan script yang ditulis jauh sebelumnya",
"Hanya dipakai pada unit level oleh developer yang menulis kode yang sedang diuji"
],
"en": [
"Test design and execution are kept far apart and fully documented before being run",
"Design, execution and learning happen together, guided by a test charter and often time-boxed",
"Tests are run only by automated tools following scripts written long beforehand",
"Only used at unit level by the developers who wrote the code being tested"
]
},
"answer": 1,
"exp": {
"id": "Ciri exploratory: simultan, charter, time-boxed, melengkapi tes formal.",
"en": "Exploratory traits: simultaneous activities, charter, time-boxed, complements formal tests."
}
},
{
"id": "ctfl-047",
"topic": "istqb",
"lo": "FL-4.4.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Pernyataan mana yang benar tentang checklist-based testing?",
"en": "Which statement about checklist-based testing is true?"
},
"options": {
"id": [
"Item checklist harus berisi langkah rinci agar siapa pun dapat menjalankannya persis sama",
"Item checklist bersifat tingkat tinggi dan checklist perlu diperbarui berkala",
"Checklist tidak boleh berasal dari data defect karena akan membuat tester menjadi bias",
"Checklist menggantikan test condition sehingga analisis test tidak diperlukan lagi"
],
"en": [
"Checklist items must contain detailed steps so anyone can run them in exactly the same way",
"Checklist items are high-level and the checklist should be updated regularly",
"A checklist must not come from defect data because that would make testers biased",
"A checklist replaces test conditions so test analysis is no longer needed"
]
},
"answer": 1,
"exp": {
"id": "Item tingkat tinggi memberi variasi eksekusi; checklist berasal dari pengalaman dan data defect dan dirawat.",
"en": "High-level items allow variation; checklists come from experience and defect data and are maintained."
}
},
{
"id": "ctfl-048",
"topic": "istqb",
"lo": "FL-4.5.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Dalam konsep 3 C pada user story, \"Confirmation\" mengacu pada...",
"en": "In the 3 Cs of a user story, \"Confirmation\" refers to..."
},
"options": {
"id": [
"Ringkasan story pada kartu",
"Diskusi antara developer dan bisnis",
"Acceptance criteria dan acceptance test",
"Persetujuan manajer"
],
"en": [
"The story summary on the card",
"The discussion between developers and the business",
"Acceptance criteria and acceptance tests",
"Manager approval"
]
},
"answer": 2,
"exp": {
"id": "Card = ringkasan, Conversation = diskusi, Confirmation = acceptance criteria dan tes.",
"en": "Card = summary, Conversation = discussion, Confirmation = acceptance criteria and tests."
}
},
{
"id": "ctfl-049",
"topic": "istqb",
"lo": "FL-4.5.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Format acceptance criteria yang tergolong scenario-oriented adalah...",
"en": "Which acceptance criteria format is scenario-oriented?"
},
"options": {
"id": [
"Given/When/Then",
"Daftar bullet aturan",
"Tabel aturan bisnis",
"Diagram state"
],
"en": [
"Given/When/Then",
"Bullet list of rules",
"Table of business rules",
"State diagram"
]
},
"answer": 0,
"exp": {
"id": "Given/When/Then = scenario-oriented; daftar atau tabel aturan = rule-oriented.",
"en": "Given/When/Then = scenario-oriented; bullet lists or rule tables = rule-oriented."
}
},
{
"id": "ctfl-050",
"topic": "istqb",
"lo": "FL-4.5.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Story: \"Sebagai customer, saya ingin ongkir gratis untuk pesanan minimal $50.\" Test case acceptance mana yang diturunkan dengan benar?",
"en": "Story: \"As a customer I want free shipping for orders of at least $50.\" Which acceptance test case is derived correctly?"
},
"options": {
"id": [
"Keranjang $49.99, checkout, ongkir $0",
"Keranjang $50.00, checkout, ongkir $0",
"Keranjang $50.00, checkout, ongkir $5",
"Keranjang $0, checkout, ongkir gratis"
],
"en": [
"Cart $49.99, checkout, shipping $0",
"Cart $50.00, checkout, shipping $0",
"Cart $50.00, checkout, shipping $5",
"Cart $0, checkout, shipping free"
]
},
"answer": 1,
"exp": {
"id": "Pesanan tepat $50 memenuhi kriteria 'minimal $50' sehingga ongkir $0. $49.99 seharusnya berbayar.",
"en": "An order of exactly $50 meets 'at least $50' so shipping is $0. $49.99 should be charged."
}
},
{
"id": "ctfl-051",
"topic": "istqb",
"lo": "FL-5.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang umumnya ada di dalam test plan?",
"en": "What is typically included in a test plan?"
},
"options": {
"id": [
"Pendekatan test dan jadwal",
"Kode sumber aplikasi",
"Hasil eksekusi tiap test case",
"Daftar password user"
],
"en": [
"Test approach and schedule",
"Application source code",
"Execution results of each test case",
"User passwords"
]
},
"answer": 0,
"exp": {
"id": "Test plan memuat konteks, asumsi, risiko, pendekatan, sumber daya, anggaran, dan jadwal.",
"en": "A test plan covers context, assumptions, risks, approach, resources, budget and schedule."
}
},
{
"id": "ctfl-052",
"topic": "istqb",
"lo": "FL-5.1.2",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Kontribusi tester dalam iteration planning adalah...",
"en": "A tester's contribution to iteration planning is..."
},
"options": {
"id": [
"Menulis seluruh kode iterasi bersama developer supaya pekerjaan selesai lebih cepat",
"Membantu membuat user story yang dapat diuji beserta acceptance criteria",
"Menentukan anggaran proyek dan jumlah anggota tim untuk iterasi yang akan datang",
"Menghapus semua risiko dari backlog sebelum iterasi dimulai agar tim tenang"
],
"en": [
"Writing all the iteration's code together with developers so work finishes sooner",
"Helping create testable user stories with acceptance criteria",
"Setting the project budget and the number of team members for the coming iteration",
"Removing every risk from the backlog before the iteration starts so the team can relax"
]
},
"answer": 1,
"exp": {
"id": "Tester juga membantu analisis risiko dan estimasi usaha testing.",
"en": "Testers also help with risk analysis and test effort estimation."
}
},
{
"id": "ctfl-053",
"topic": "istqb",
"lo": "FL-5.1.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Contoh ENTRY criteria yang tepat adalah...",
"en": "A suitable example of ENTRY criteria is..."
},
"options": {
"id": [
"Semua defect kritis sudah ditutup dan tidak ada yang tersisa pada daftar defect terbuka",
"Test environment siap dan data tes tersedia",
"Coverage target tercapai berdasarkan laporan alat pengukur coverage pada build terakhir",
"Laporan akhir sudah dikirim kepada seluruh stakeholder yang terlibat dalam proyek ini"
],
"en": [
"All critical defects are closed and none remain on the open defect list",
"The test environment is ready and test data is available",
"The coverage target is met according to the coverage tool report on the last build",
"The final report has been sent to all the stakeholders involved in this project"
]
},
"answer": 1,
"exp": {
"id": "Entry criteria adalah prasyarat memulai. Tiga opsi lain adalah exit criteria (syarat selesai).",
"en": "Entry criteria are preconditions to start. The other three are exit criteria (conditions to finish)."
}
},
{
"id": "ctfl-054",
"topic": "istqb",
"lo": "FL-5.1.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Estimasi three-point untuk sebuah tugas test: optimis 6 hari, paling mungkin 9 hari, pesimis 18 hari. Estimasi E = (a + 4m + b) / 6 adalah...",
"en": "A three-point estimate for a test task: optimistic 6 days, most likely 9 days, pessimistic 18 days. The estimate E = (a + 4m + b) / 6 is..."
},
"options": {
"id": [
"9 hari",
"10 hari",
"11 hari",
"12 hari"
],
"en": [
"9 days",
"10 days",
"11 days",
"12 days"
]
},
"answer": 1,
"exp": {
"id": "E = (6 + 4x9 + 18) / 6 = (6 + 36 + 18) / 6 = 60 / 6 = 10 hari.",
"en": "E = (6 + 4x9 + 18) / 6 = (6 + 36 + 18) / 6 = 60 / 6 = 10 days."
}
},
{
"id": "ctfl-055",
"topic": "istqb",
"lo": "FL-5.1.5",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Tes dan requirement yang dicakup: T1 = R1,R2; T2 = R2; T3 = R3,R4,R5; T4 = R1. Dengan coverage-based prioritization (coverage terbanyak dulu, lalu yang menambah coverage), urutan eksekusi yang benar adalah...",
"en": "Tests and the requirements they cover: T1 = R1,R2; T2 = R2; T3 = R3,R4,R5; T4 = R1. With coverage-based prioritization (most coverage first, then additional coverage), the correct execution order is..."
},
"options": {
"id": [
"T1, T2, T3, T4",
"T3, T1, T2, T4",
"T2, T4, T1, T3",
"T4, T2, T1, T3"
],
"en": [
"T1, T2, T3, T4",
"T3, T1, T2, T4",
"T2, T4, T1, T3",
"T4, T2, T1, T3"
]
},
"answer": 1,
"exp": {
"id": "T3 mencakup 3 requirement terbanyak; lalu T1 menambah R1 dan R2. T2 dan T4 tidak menambah coverage baru sehingga di akhir.",
"en": "T3 covers the most (3 requirements); then T1 adds R1 and R2. T2 and T4 add no new coverage so they go last."
}
},
{
"id": "ctfl-056",
"topic": "istqb",
"lo": "FL-5.1.6",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Pada test pyramid, tes di lapisan atas (UI/end-to-end) umumnya...",
"en": "In the test pyramid, tests at the top layers (UI/end-to-end) are generally..."
},
"options": {
"id": [
"Banyak, cepat, dan murah",
"Sedikit, lebih lambat, dan lebih mahal",
"Dihapus dari proyek",
"Hanya white-box"
],
"en": [
"Many, fast and cheap",
"Few, slower and more expensive",
"Removed from the project",
"White-box only"
]
},
"answer": 1,
"exp": {
"id": "Semakin ke atas, coverage lebih luas tetapi tes lebih sedikit, lambat, dan rapuh.",
"en": "Higher up, scope is broader but tests should be fewer, slower and more brittle."
}
},
{
"id": "ctfl-057",
"topic": "istqb",
"lo": "FL-5.1.7",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tes mana yang berada di kuadran Q4 (technology-facing, mengkritik produk)?",
"en": "Which tests belong to quadrant Q4 (technology-facing, critiquing the product)?"
},
"options": {
"id": [
"Component tests",
"Functional tests untuk user story",
"Performance dan security tests",
"Usability exploratory tests"
],
"en": [
"Component tests",
"Functional tests for user stories",
"Performance and security tests",
"Usability exploratory tests"
]
},
"answer": 2,
"exp": {
"id": "Q1 component/integration; Q2 fungsional; Q3 exploratory/usability/UAT; Q4 performance dan security.",
"en": "Q1 component/integration; Q2 functional; Q3 exploratory/usability/UAT; Q4 performance and security."
}
},
{
"id": "ctfl-058",
"topic": "istqb",
"lo": "FL-5.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Tingkat risiko ditentukan oleh...",
"en": "The risk level is determined by..."
},
"options": {
"id": [
"Jumlah tester dan jadwal",
"Likelihood dan impact",
"Biaya dan durasi",
"Jumlah baris kode"
],
"en": [
"Number of testers and schedule",
"Likelihood and impact",
"Cost and duration",
"Lines of code"
]
},
"answer": 1,
"exp": {
"id": "Risk level = kombinasi kemungkinan terjadi dan dampaknya.",
"en": "Risk level = combination of probability of occurring and its impact."
}
},
{
"id": "ctfl-059",
"topic": "istqb",
"lo": "FL-5.2.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang merupakan PROJECT risk?",
"en": "Which is a PROJECT risk?"
},
"options": {
"id": [
"Perhitungan pajak salah",
"Test environment terlambat tersedia",
"Waktu respons halaman lambat",
"Fitur login mudah dibobol"
],
"en": [
"Tax calculation is wrong",
"The test environment is delivered late",
"Page response time is slow",
"The login feature is easily compromised"
]
},
"answer": 1,
"exp": {
"id": "Project risk menyangkut jalannya proyek (jadwal, sumber daya, environment). Tiga opsi lain adalah product risk.",
"en": "Project risks concern how the project runs (schedule, resources, environment). The other three are product risks."
}
},
{
"id": "ctfl-060",
"topic": "istqb",
"lo": "FL-5.2.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Hasil analisis risiko produk dipakai untuk...",
"en": "Product risk analysis results are used to..."
},
"options": {
"id": [
"Menentukan coverage, teknik, dan usaha testing serta prioritas tes",
"Menggantikan semua test case dengan satu dokumen ringkasan yang disetujui manajer",
"Menghapus test plan lama setelah setiap iterasi supaya tidak membingungkan tim",
"Menentukan gaji dan jenjang karier tester berdasarkan jumlah defect yang ditemukan"
],
"en": [
"Decide test scope, techniques and effort, and prioritise tests",
"Replace all test cases with one summary document approved by the manager",
"Delete the old test plan after each iteration so it does not confuse the team",
"Decide testers' salaries and career levels based on the number of defects found"
]
},
"answer": 0,
"exp": {
"id": "Risiko tinggi mendapat testing lebih mendalam dan lebih awal.",
"en": "Higher risks get deeper and earlier testing."
}
},
{
"id": "ctfl-061",
"topic": "istqb",
"lo": "FL-5.3.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang merupakan metrik kemajuan test (test progress)?",
"en": "Which is a test progress metric?"
},
"options": {
"id": [
"Persentase test case yang sudah dijalankan atau lulus dari yang direncanakan",
"Jumlah baris kode yang ditulis developer pada iterasi yang sedang berjalan",
"Total gaji tim yang terlibat dalam proyek selama satu kuartal penuh",
"Jumlah karyawan di perusahaan pada saat dilakukannya testing berlangsung"
],
"en": [
"Percentage of planned test cases executed or passed",
"Lines of code written by developers in the current iteration",
"Total salaries of the team involved in the project over a full quarter",
"Number of employees at the company when the testing takes place"
]
},
"answer": 0,
"exp": {
"id": "Test progress mengukur kemajuan eksekusi tes. Defect count adalah metrik defect.",
"en": "Test progress measures execution progress. Defect count is a defect metric."
}
},
{
"id": "ctfl-062",
"topic": "istqb",
"lo": "FL-5.3.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Test completion report dibuat...",
"en": "A test completion report is created..."
},
"options": {
"id": [
"Setiap hari tanpa pengecualian, termasuk saat testing baru dimulai sedikit",
"Di akhir proyek, fase, atau iterasi untuk merangkum testing dan penyimpangan dari rencana",
"Sebelum requirement ditulis, agar tim tahu apa yang akan dilaporkan nanti",
"Hanya jika semua tes gagal, sebagai bukti kepada manajemen proyek"
],
"en": [
"Every day without exception, even when testing has only just started",
"At the end of a project, phase or iteration to summarise testing and deviations from plan",
"Before requirements are written, so the team knows what will be reported later",
"Only if all tests fail, as evidence for project management"
]
},
"answer": 1,
"exp": {
"id": "Progress report berkala; completion report di akhir dan memuat pembelajaran.",
"en": "Progress reports are periodic; the completion report comes at the end and includes lessons learned."
}
},
{
"id": "ctfl-063",
"topic": "istqb",
"lo": "FL-5.3.3",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Cara umum mengomunikasikan status test pada tim Agile adalah...",
"en": "A common way to communicate test status in an Agile team is..."
},
"options": {
"id": [
"Daily stand-up dan task board",
"Surat resmi bulanan saja",
"Tidak dikomunikasikan",
"Hanya lewat kontrak"
],
"en": [
"Daily stand-up and a task board",
"Monthly formal letters only",
"It is not communicated",
"Only through contracts"
]
},
"answer": 0,
"exp": {
"id": "Pilih kanal sesuai konteks: stand-up, dashboard, task board, atau laporan formal.",
"en": "Choose channels by context: stand-ups, dashboards, task boards or formal reports."
}
},
{
"id": "ctfl-064",
"topic": "istqb",
"lo": "FL-5.4.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Bagaimana configuration management mendukung testing?",
"en": "How does configuration management support testing?"
},
"options": {
"id": [
"Memastikan item test dan testware teridentifikasi unik, terkontrol versinya, dan saling terhubung",
"Menggantikan test plan dengan daftar versi build yang disetujui manajemen proyek",
"Menjalankan ulang seluruh tes otomatis setiap kali ada versi baru dari testware",
"Menentukan prioritas defect berdasarkan versi yang dilaporkan oleh user"
],
"en": [
"Ensuring test items and testware are uniquely identified, version controlled and related",
"Replacing the test plan with a list of build versions approved by project management",
"Re-running all automated tests every time a new version of the testware appears",
"Setting defect priority based on the version reported by users"
]
},
"answer": 0,
"exp": {
"id": "CM menjaga integritas dan traceability testware selama proyek.",
"en": "CM keeps testware integrity and traceability throughout the project."
}
},
{
"id": "ctfl-065",
"topic": "istqb",
"lo": "FL-5.5.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Laporan defect mana yang paling baik?",
"en": "Which defect report is the best?"
},
"options": {
"id": [
"Pencarian rusak, tolong diperbaiki secepatnya karena sangat mengganggu kami semua",
"Pencarian 'laptop' di /products: 0 hasil (harapan 12). Build 2.4.1, Chrome 120. Buka /products, ketik, Enter",
"Developer salah menulis query pencarian, jadi sebaiknya dia memperbaikinya sendiri hari ini",
"Tolong cek kenapa pencarian tidak jalan, saya sudah mencoba beberapa kali sejak pagi tadi"
],
"en": [
"Search is broken, please fix it as soon as possible because it annoys all of us",
"Searching 'laptop' on /products: 0 results (expected 12). Build 2.4.1, Chrome 120. Open /products, type, Enter",
"The developer wrote a bad search query, so they should fix it themselves today",
"Please check why search does not work, I have tried several times since this morning"
]
},
"answer": 1,
"exp": {
"id": "Laporan baik memuat langkah reproduksi, expected vs actual, dan environment. Opsi lain samar atau menyalahkan orang.",
"en": "A good report has steps to reproduce, expected vs actual, and environment. The others are vague or blame people."
}
},
{
"id": "ctfl-066",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tool yang mendukung manajemen test case, pelacakan requirement, dan reporting tergolong...",
"en": "A tool supporting test case management, requirement tracking and reporting is classified as..."
},
"options": {
"id": [
"Test management tool",
"Static analysis tool",
"Performance testing tool",
"Coverage tool"
],
"en": [
"Test management tool",
"Static analysis tool",
"Performance testing tool",
"Coverage tool"
]
},
"answer": 0,
"exp": {
"id": "Tool manajemen test mencakup test case, traceability, dan laporan (mis. TestRail, Zephyr).",
"en": "Test management tools cover test cases, traceability and reports (e.g. TestRail, Zephyr)."
}
},
{
"id": "ctfl-067",
"topic": "istqb",
"lo": "FL-6.1.1",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Tool pipeline CI/CD (mis. Jenkins, GitHub Actions) termasuk kategori...",
"en": "CI/CD pipeline tools (e.g. Jenkins, GitHub Actions) belong to the category..."
},
"options": {
"id": [
"Static testing tools",
"DevOps tools",
"Test design tools",
"Non-functional testing tools"
],
"en": [
"Static testing tools",
"DevOps tools",
"Test design tools",
"Non-functional testing tools"
]
},
"answer": 1,
"exp": {
"id": "Tool DevOps mendukung build, integrasi, dan deployment otomatis.",
"en": "DevOps tools support automated build, integration and deployment."
}
},
{
"id": "ctfl-068",
"topic": "istqb",
"lo": "FL-6.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang merupakan RISIKO otomasi test?",
"en": "Which is a RISK of test automation?"
},
"options": {
"id": [
"Eksekusi lebih konsisten karena langkah yang sama dijalankan persis setiap kali",
"Usaha dan perawatan otomasi yang diremehkan",
"Hemat waktu pada tes berulang, terutama untuk regression yang dijalankan tiap release",
"Penilaian hasil lebih objektif karena tidak bergantung pada penilaian manusia"
],
"en": [
"More consistent execution because the same steps are run exactly every time",
"Underestimated effort and maintenance of the automation",
"Time saved on repeated tests, especially regression that runs for every release",
"More objective assessment of results because it does not depend on human judgement"
]
},
"answer": 1,
"exp": {
"id": "Tiga lainnya adalah manfaat. Risiko lain: ekspektasi tidak realistis dan ketergantungan pada tool.",
"en": "The other three are benefits. Other risks: unrealistic expectations and over-reliance on the tool."
}
},
{
"id": "ctfl-069",
"topic": "istqb",
"lo": "FL-6.2.1",
"k": 1,
"level": 1,
"type": "mcq",
"q": {
"id": "Mana yang merupakan MANFAAT otomasi test?",
"en": "Which is a BENEFIT of test automation?"
},
"options": {
"id": [
"Mengurangi pekerjaan manual berulang dan eksekusi lebih konsisten",
"Tidak memerlukan perawatan script",
"Menggantikan kebutuhan exploratory testing",
"Selalu menemukan lebih banyak defect"
],
"en": [
"Less repetitive manual work and more consistent execution",
"No script maintenance needed",
"Replacing the need for exploratory testing",
"Always finding more defects"
]
},
"answer": 0,
"exp": {
"id": "Otomasi unggul untuk tes berulang; exploratory dan penilaian manusia tetap dibutuhkan.",
"en": "Automation excels at repeated tests; exploratory testing and human judgement are still needed."
}
},
{
"id": "ctfl-070",
"topic": "istqb",
"lo": "FL-1.4.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Faktor mana yang memengaruhi test process dalam suatu konteks?",
"en": "Which factor influences the test process in a given context?"
},
"options": {
"id": [
"Model SDLC dan risiko produk",
"Warna logo perusahaan",
"Merek laptop tester",
"Jumlah file di repositori saja"
],
"en": [
"The SDLC model and product risks",
"The company logo colour",
"The tester's laptop brand",
"Only the number of files in the repository"
]
},
"answer": 0,
"exp": {
"id": "Konteks mencakup model SDLC, test level dan type, risiko, domain bisnis, batasan operasional, kebijakan, dan standar.",
"en": "Context includes the SDLC model, test levels and types, risks, business domain, operational constraints, policies and standards."
}
},
{
"id": "ctfl-071",
"topic": "istqb",
"lo": "FL-5.2.4",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Analisis risiko produk menunjukkan modul pembayaran berisiko tinggi. Respons yang sesuai adalah...",
"en": "Product risk analysis shows the payment module is high risk. A suitable response is..."
},
"options": {
"id": [
"Mengurangi testing pada modul itu agar usaha tim beralih ke modul yang lebih aman",
"Menambah testing, menugaskan tester berpengalaman, dan memakai teknik lebih ketat",
"Menghapus modul dari test plan karena risikonya sudah diterima oleh manajemen",
"Menunda semua testing ke akhir proyek ketika modul lain sudah selesai diuji"
],
"en": [
"Reduce testing on that module so the team's effort shifts to safer modules",
"Add more testing, assign experienced testers and use stricter techniques",
"Remove the module from the test plan because management has already accepted the risk",
"Postpone all testing to the end of the project when other modules have been tested"
]
},
"answer": 1,
"exp": {
"id": "Risiko tinggi direspons dengan mitigasi: lebih banyak dan lebih ketat testing serta sumber daya yang tepat.",
"en": "High risk is answered with mitigation: more and stricter testing plus the right resources."
}
},
{
"id": "ctfl-133",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Ongkir menurut berat (kg, bilangan bulat): 1-5 = Rp10.000, 6-20 = Rp25.000, 21-50 = Rp60.000. Berat di bawah 1 atau di atas 50 ditolak. Berapa test minimal agar setiap partisi (valid dan tidak valid) tercakup sekali?",
"en": "Shipping fee by weight (kg, integers): 1-5 = 10,000, 6-20 = 25,000, 21-50 = 60,000. Weights below 1 or above 50 are rejected. What is the minimum number of tests to cover each partition (valid and invalid) once?"
},
"options": {
"id": [
"5",
"3",
"4",
"7"
],
"en": [
"5",
"3",
"4",
"7"
]
},
"answer": 0,
"exp": {
"id": "Ada tiga partisi valid dan dua partisi tidak valid (di bawah 1, di atas 50), total lima. Satu nilai wakil per partisi: misalnya 0, 3, 10, 30, 51.",
"en": "There are three valid and two invalid partitions (below 1, above 50), five in total. One representative per partition, e.g. 0, 3, 10, 30, 51."
}
},
{
"id": "ctfl-134",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Panjang password valid 8 sampai 16 karakter. Kumpulan nilai panjang mana yang mencakup semua partisi dengan EP?",
"en": "A password is valid with 8 to 16 characters. Which set of lengths covers all partitions using EP?"
},
"options": {
"id": [
"5, 10, 20",
"8, 10, 16",
"7, 8, 9",
"1, 2, 3"
],
"en": [
"5, 10, 20",
"8, 10, 16",
"7, 8, 9",
"1, 2, 3"
]
},
"answer": 0,
"exp": {
"id": "Ada tiga partisi: di bawah 8 (tidak valid), 8-16 (valid), di atas 16 (tidak valid). Nilai 5, 10, 20 masing-masing mewakili satu partisi. Set lain hanya menyentuh satu atau dua partisi.",
"en": "There are three partitions: below 8 (invalid), 8-16 (valid), above 16 (invalid). The values 5, 10, 20 each represent one partition. The other sets touch only one or two partitions."
}
},
{
"id": "ctfl-135",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Diskon belanja (Rupiah, bilangan bulat): total < 100.000 = 0%, 100.000-499.999 = 5%, >= 500.000 = 10%. Total negatif tidak valid. Set input mana yang mencakup semua partisi dengan jumlah test paling sedikit?",
"en": "Shopping discount (Rupiah, integers): total < 100,000 = 0%, 100,000-499,999 = 5%, >= 500,000 = 10%. A negative total is invalid. Which input set covers all partitions with the fewest tests?"
},
"options": {
"id": [
"-1, 50.000, 250.000, 600.000",
"50.000, 250.000, 600.000",
"0, 100.000, 500.000, 1.000.000",
"-1, 0, 99.999, 100.000, 500.000"
],
"en": [
"-1, 50,000, 250,000, 600,000",
"50,000, 250,000, 600,000",
"0, 100,000, 500,000, 1,000,000",
"-1, 0, 99,999, 100,000, 500,000"
]
},
"answer": 0,
"exp": {
"id": "Partisinya: negatif (tidak valid), 0-99.999, 100.000-499.999, dan >= 500.000, jadi empat nilai wakil sudah cukup. Opsi kedua melewatkan partisi tidak valid; opsi ketiga mengandung dua nilai pada partisi yang sama dan tidak ada yang negatif; opsi keempat memakai lima nilai.",
"en": "The partitions are negative (invalid), 0-99,999, 100,000-499,999 and >= 500,000, so four representatives suffice. The second option misses the invalid partition; the third has no negative value; the fourth uses five values."
}
},
{
"id": "ctfl-136",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Partisi usia untuk tarif tiket: 0-17, 17-64, 65 ke atas. Apa kelemahan pembagian ini?",
"en": "Age partitions for ticket prices: 0-17, 17-64, 65 and above. What is wrong with this split?"
},
"options": {
"id": [
"Usia 17 masuk dua partisi: partisinya tumpang tindih",
"Jumlah partisinya terlalu sedikit untuk tarif tiket",
"Usia 65 sama sekali tidak tercakup oleh partisi",
"Partisi ekuivalen dilarang memuat rentang nilai"
],
"en": [
"Age 17 is in two partitions: they overlap",
"The number of partitions is too few for ticket pricing",
"Age 65 is not covered by any partition at all",
"Equivalence partitions are forbidden from holding ranges"
]
},
"answer": 0,
"exp": {
"id": "Partisi ekuivalen harus saling lepas (tidak tumpang tindih) dan lengkap. Nilai 17 ambigu: masuk 0-17 atau 17-64? Perbaiki menjadi 0-17, 18-64, 65 ke atas.",
"en": "Equivalence partitions must be disjoint (no overlap) and complete. The value 17 is ambiguous: 0-17 or 17-64? Fix as 0-17, 18-64, 65 and above."
}
},
{
"id": "ctfl-137",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Syarat: usia harus lebih dari 17 dan kurang dari 66 (bilangan bulat). Nilai uji BVA dua nilai yang benar?",
"en": "Rule: age must be greater than 17 and less than 66 (integers). Which are the correct two-value BVA test values?"
},
"options": {
"id": [
"17, 18, 65, 66",
"17, 18, 66, 67",
"16, 17, 65, 66",
"18, 19, 64, 65"
],
"en": [
"17, 18, 65, 66",
"17, 18, 66, 67",
"16, 17, 65, 66",
"18, 19, 64, 65"
]
},
"answer": 0,
"exp": {
"id": "Rentang valid bilangan bulat adalah 18-65. Dua-nilai BVA: batas dan tetangga di luar rentang, yaitu 17, 18 dan 65, 66. Kesalahan umum adalah memakai angka dalam kalimat (17 dan 66) sebagai batas valid.",
"en": "The valid integer range is 18-65. Two-value BVA: each boundary and its neighbour outside the range, i.e. 17, 18 and 65, 66. A common slip is treating the numbers in the sentence (17 and 66) as the valid boundaries."
}
},
{
"id": "ctfl-138",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Tarif jarak (km, bilangan bulat): 0-10, 11-25, 26-100; di luar itu tidak valid. Berapa nilai berbeda yang diperlukan untuk BVA dua nilai di seluruh partisi?",
"en": "Distance fee (km, integers): 0-10, 11-25, 26-100; anything else is invalid. How many distinct values are needed for two-value BVA across all partitions?"
},
"options": {
"id": [
"8",
"6",
"10",
"12"
],
"en": [
"8",
"6",
"10",
"12"
]
},
"answer": 0,
"exp": {
"id": "Nilai: -1, 0, 10, 11, 25, 26, 100, 101. Batas yang bersebelahan (10|11 dan 25|26) berbagi nilai sehingga totalnya 8, bukan 12.",
"en": "Values: -1, 0, 10, 11, 25, 26, 100, 101. Adjacent boundaries (10|11 and 25|26) share values, so the total is 8, not 12."
}
},
{
"id": "ctfl-139",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Kolom harga menerima 0,01 sampai 999,99 (dua desimal). Nilai uji BVA dua nilai yang benar?",
"en": "A price field accepts 0.01 to 999.99 (two decimals). Which are the correct two-value BVA test values?"
},
"options": {
"id": [
"0,00; 0,01; 999,99; 1000,00",
"0; 1; 999; 1000",
"0,01; 0,02; 999,98; 999,99",
"0,00; 0,01; 999,99; 1000,99"
],
"en": [
"0.00; 0.01; 999.99; 1000.00",
"0; 1; 999; 1000",
"0.01; 0.02; 999.98; 999.99",
"0.00; 0.01; 999.99; 1000.99"
]
},
"answer": 0,
"exp": {
"id": "Tetangga ditentukan oleh presisi (dua desimal), jadi tetangga 0,01 adalah 0,00 dan tetangga 999,99 adalah 1000,00. Memakai bilangan bulat mengabaikan presisi kolom.",
"en": "Neighbours are set by precision (two decimals), so the neighbour of 0.01 is 0.00 and of 999.99 is 1000.00. Using integers ignores the field's precision."
}
},
{
"id": "ctfl-140",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Spesifikasi: 'user berusia 18 tahun atau lebih boleh mendaftar'. Developer menulis if (usia > 18). Nilai uji mana yang mendeteksi defect ini?",
"en": "Spec: 'users aged 18 or older may register'. The developer wrote if (age > 18). Which test value detects this defect?"
},
"options": {
"id": [
"18",
"17",
"19",
"40"
],
"en": [
"18",
"17",
"19",
"40"
]
},
"answer": 0,
"exp": {
"id": "Defect off-by-one: 18 seharusnya diterima tetapi ditolak. BVA menargetkan tepat jenis defect ini. Nilai 17, 19, dan 40 berperilaku sama pada kode benar maupun salah.",
"en": "An off-by-one defect: 18 should be accepted but is rejected. BVA targets exactly this kind of defect. 17, 19 and 40 behave the same on correct and faulty code."
}
},
{
"id": "ctfl-141",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Persetujuan pinjaman: tiga kondisi (kredit baik, pendapatan cukup, punya utang lain), semua Ya/Tidak. Bila kredit tidak baik, hasil selalu 'tolak' apa pun kondisi lain. Berapa kolom aturan setelah kolom digabung?",
"en": "Loan approval: three conditions (good credit, enough income, other debt), all Yes/No. If credit is not good, the outcome is always 'reject' whatever the other conditions. How many rule columns remain after collapsing?"
},
"options": {
"id": [
"5",
"8",
"4",
"6"
],
"en": [
"5",
"8",
"4",
"6"
]
},
"answer": 0,
"exp": {
"id": "Kredit tidak baik digabung menjadi satu kolom (kondisi lain 'tidak peduli'). Kredit baik memakai 2 x 2 = 4 kolom. Total 1 + 4 = 5, bukan 8.",
"en": "Bad credit collapses into a single column (the others are 'don't care'). Good credit uses 2 x 2 = 4 columns. Total 1 + 4 = 5, not 8."
}
},
{
"id": "ctfl-142",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Decision table memakai dua kondisi: 'pesanan sudah dibayar' dan 'pesanan sudah dikirim'. Kombinasi 'dikirim tetapi belum dibayar' mustahil menurut aturan bisnis. Berapa test case untuk coverage semua aturan yang layak?",
"en": "A decision table uses two conditions: 'order is paid' and 'order is shipped'. The combination 'shipped but unpaid' is impossible by business rules. How many test cases cover all feasible rules?"
},
"options": {
"id": [
"3",
"4",
"2",
"1"
],
"en": [
"3",
"4",
"2",
"1"
]
},
"answer": 0,
"exp": {
"id": "Tabel penuh punya 4 kolom, satu di antaranya tidak mungkin terjadi sehingga dikeluarkan. Sisa 3 aturan layak, masing-masing diuji.",
"en": "The full table has 4 columns, one of which cannot occur and is dropped. The remaining 3 feasible rules are each tested."
}
},
{
"id": "ctfl-143",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Premi asuransi: pengemudi di bawah 25 tahun dan punya riwayat kecelakaan = +50%; hanya salah satu dari keduanya = +25%; tidak keduanya = tarif dasar. Seorang pengemudi 30 tahun punya riwayat kecelakaan. Hasil yang diharapkan?",
"en": "Insurance premium: a driver under 25 with an accident history = +50%; only one of the two = +25%; neither = base rate. A 30-year-old driver has an accident history. Expected result?"
},
"options": {
"id": [
"+25%",
"+50%",
"Tarif dasar",
"Ditolak"
],
"en": [
"+25%",
"+50%",
"Base rate",
"Rejected"
]
},
"answer": 0,
"exp": {
"id": "Usia 30 berarti kondisi 'di bawah 25' tidak terpenuhi, sedangkan riwayat kecelakaan terpenuhi. Tepat satu kondisi benar sehingga +25%.",
"en": "Age 30 means 'under 25' is not met while the accident history is. Exactly one condition is true, so +25%."
}
},
{
"id": "ctfl-144",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Sebuah decision table dengan tiga kondisi Ya/Tidak hanya punya tujuh kolom: YYY, YYN, YNY, YNN, NYY, NYN, NNY. Apa masalahnya?",
"en": "A decision table with three Yes/No conditions has only seven columns: YYY, YYN, YNY, YNN, NYY, NYN, NNY. What is the problem?"
},
"options": {
"id": [
"NNN hilang, jadi tabel tidak lengkap",
"Ada satu kolom yang muncul sebagai duplikat",
"Tabel seharusnya hanya memiliki enam kolom saja",
"Tidak ada masalah; tabel itu sudah lengkap"
],
"en": [
"NNN is missing, so the table is incomplete",
"One column appears as a duplicate of another",
"The table should only have six columns in total",
"No problem; the table is already complete"
]
},
"answer": 0,
"exp": {
"id": "Tiga kondisi biner menghasilkan 2^3 = 8 kombinasi. Yang hilang adalah NNN; kombinasi yang terlewat berarti perilaku tidak terdefinisi dan tidak teruji.",
"en": "Three binary conditions give 2^3 = 8 combinations. NNN is missing; a missing combination means undefined, untested behaviour."
}
},
{
"id": "ctfl-145",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Akun: Active -(3x gagal login)-> Locked; Locked -(unlock)-> Active; Active -(close)-> Closed; Locked -(close)-> Closed. Closed tidak punya transisi keluar. Ada 3 state dan 3 event. Berapa pasangan (state, event) yang tidak valid?",
"en": "Account: Active -(3 failed logins)-> Locked; Locked -(unlock)-> Active; Active -(close)-> Closed; Locked -(close)-> Closed. Closed has no outgoing transitions. There are 3 states and 3 events. How many (state, event) pairs are invalid?"
},
"options": {
"id": [
"5",
"4",
"9",
"3"
],
"en": [
"5",
"4",
"9",
"3"
]
},
"answer": 0,
"exp": {
"id": "Total pasangan 3 x 3 = 9; transisi valid ada 4, sehingga 5 tidak valid (mis. unlock saat Active, gagal login saat Locked, semua event saat Closed). Pasangan tidak valid ini diuji sebagai negative test.",
"en": "Total pairs 3 x 3 = 9; there are 4 valid transitions, so 5 are invalid (e.g. unlock while Active, failed login while Locked, every event while Closed). These invalid pairs are tested as negative tests."
}
},
{
"id": "ctfl-146",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Artikel: Draft -(submit)-> Submitted; Submitted -(approve)-> Approved; Approved -(publish)-> Published; Submitted -(reject)-> Rejected; Rejected -(edit)-> Draft. Setiap urutan dimulai dari Draft. Berapa urutan test minimal agar semua transisi valid tercakup?",
"en": "Article: Draft -(submit)-> Submitted; Submitted -(approve)-> Approved; Approved -(publish)-> Published; Submitted -(reject)-> Rejected; Rejected -(edit)-> Draft. Every sequence starts at Draft. What is the minimum number of test sequences to cover all valid transitions?"
},
"options": {
"id": [
"2",
"1",
"3",
"5"
],
"en": [
"2",
"1",
"3",
"5"
]
},
"answer": 0,
"exp": {
"id": "Urutan 1: submit, approve, publish. Urutan 2: submit, reject, edit. Keduanya bersama menutup kelima transisi. Satu urutan tidak cukup karena reject dan approve keluar dari state yang sama.",
"en": "Sequence 1: submit, approve, publish. Sequence 2: submit, reject, edit. Together they cover all five transitions. One sequence is not enough because reject and approve leave the same state."
}
},
{
"id": "ctfl-147",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Pada model artikel di atas, sebuah test menjalankan: Draft, Submitted, Rejected, Draft, Submitted, Approved. Berapa transisi berbeda yang tercakup?",
"en": "In the article model above, a test runs: Draft, Submitted, Rejected, Draft, Submitted, Approved. How many distinct transitions does it cover?"
},
"options": {
"id": [
"4",
"5",
"6",
"3"
],
"en": [
"4",
"5",
"6",
"3"
]
},
"answer": 0,
"exp": {
"id": "Ada 5 langkah, tetapi submit dari Draft ke Submitted terjadi dua kali. Transisi berbeda: submit, reject, edit, approve = 4.",
"en": "There are 5 steps, but submit from Draft to Submitted occurs twice. Distinct transitions: submit, reject, edit, approve = 4."
}
},
{
"id": "ctfl-148",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Model pesanan: Pending -(pay)-> Paid; Paid -(refund)-> Refunded; Pending -(cancel)-> Cancelled. Test mengirim event pay, refund, lalu pay lagi. Perilaku yang benar untuk event pay terakhir?",
"en": "Order model: Pending -(pay)-> Paid; Paid -(refund)-> Refunded; Pending -(cancel)-> Cancelled. A test sends pay, refund, then pay again. What is the correct behaviour for the last pay event?"
},
"options": {
"id": [
"Ditolak: Refunded tidak punya transisi pay",
"Diterima, lalu pesanan kembali ke state Paid",
"Diterima, lalu pesanan masuk ke state Pending",
"Event itu menghapus seluruh data pesanan"
],
"en": [
"Rejected: Refunded has no pay transition",
"Accepted, and the order returns to the Paid state",
"Accepted, and the order moves to the Pending state",
"The event deletes the whole order record"
]
},
"answer": 0,
"exp": {
"id": "Model tidak punya transisi pay dari Refunded, jadi event itu harus ditolak dan state tetap Refunded. Ini negative test klasik untuk transisi tidak valid.",
"en": "The model has no pay transition from Refunded, so the event must be rejected and the state stay Refunded. A classic negative test for an invalid transition."
}
},
{
"id": "ctfl-149",
"topic": "istqb",
"lo": "FL-4.3.2",
"k": 2,
"level": 2,
"type": "mcq",
"q": {
"id": "Kode: if (A) { s1 } lalu if (B) { s2 } (tanpa else). Satu test dijalankan dengan A = benar dan B = benar. Berapa statement coverage dan branch coverage?",
"en": "Code: if (A) { s1 } then if (B) { s2 } (no else). One test runs with A = true and B = true. What are the statement and branch coverage?"
},
"options": {
"id": [
"Statement 100%, branch 50%",
"Statement 100%, branch 100%",
"Statement 50%, branch 50%",
"Statement 50%, branch 100%"
],
"en": [
"Statement 100%, branch 50%",
"Statement 100%, branch 100%",
"Statement 50%, branch 50%",
"Statement 50%, branch 100%"
]
},
"answer": 0,
"exp": {
"id": "Kedua statement dieksekusi (100%). Ada dua keputusan, masing-masing dua cabang (benar/salah) = 4 cabang; test hanya menjalankan dua cabang 'benar' = 50%. Perlu test kedua dengan A dan B salah.",
"en": "Both statements run (100%). There are two decisions with two branches each (true/false) = 4 branches; the test only takes the two 'true' branches = 50%. A second test with A and B false is needed."
}
},
{
"id": "ctfl-072",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Field umur menerima bilangan bulat 0-120. Partisi valid: 0-12 (anak), 13-64 (dewasa), 65-120 (senior). Berapa jumlah partisi ekuivalen (valid dan tidak valid) yang harus diuji minimal satu kali?",
"en": "An age field accepts integers 0-120. Valid partitions: 0-12 (child), 13-64 (adult), 65-120 (senior). How many equivalence partitions (valid and invalid) must be tested at least once?"
},
"options": {
"id": [
"3",
"4",
"5",
"6"
],
"en": [
"3",
"4",
"5",
"6"
]
},
"answer": 2,
"exp": {
"id": "Tiga partisi valid, ditambah dua partisi tidak valid: di bawah 0 dan di atas 120. Total 5.",
"en": "Three valid partitions plus two invalid ones: below 0 and above 120. Total 5."
}
},
{
"id": "ctfl-073",
"topic": "istqb",
"lo": "FL-4.2.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Transfer diterima untuk nominal 10.000 sampai 50.000 (bilangan bulat). Himpunan nilai mana yang mencakup setiap partisi tepat satu kali?",
"en": "A transfer is accepted for amounts 10,000 to 50,000 (integers). Which set of values covers each partition exactly once?"
},
"options": {
"id": [
"{5.000, 25.000, 60.000}",
"{10.000, 25.000, 50.000}",
"{9.999, 10.000, 50.000}",
"{10.000, 20.000, 30.000}"
],
"en": [
"{5,000, 25,000, 60,000}",
"{10,000, 25,000, 50,000}",
"{9,999, 10,000, 50,000}",
"{10,000, 20,000, 30,000}"
]
},
"answer": 0,
"exp": {
"id": "Ada tiga partisi: di bawah 10.000, 10.000-50.000, di atas 50.000. Satu wakil per partisi: 5.000, 25.000, 60.000. Opsi lain menguji partisi valid berulang dan melewatkan partisi tidak valid.",
"en": "There are three partitions: below 10,000, 10,000-50,000, above 50,000. One representative each: 5,000, 25,000, 60,000. The other sets repeat the valid partition and miss invalid ones."
}
},
{
"id": "ctfl-074",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Jumlah voucher per pesanan valid untuk 1 sampai 10 (bilangan bulat). Nilai uji BVA dua nilai (2-value) yang tepat adalah...",
"en": "Vouchers per order are valid for 1 to 10 (integers). The correct two-value BVA test values are..."
},
"options": {
"id": [
"0, 1, 10, 11",
"1, 2, 9, 10",
"0, 1, 2, 9, 10, 11",
"1, 10"
],
"en": [
"0, 1, 10, 11",
"1, 2, 9, 10",
"0, 1, 2, 9, 10, 11",
"1, 10"
]
},
"answer": 0,
"exp": {
"id": "BVA dua nilai: tiap batas diuji bersama tetangganya di partisi sebelah. Batas bawah 1 dengan 0, batas atas 10 dengan 11. Opsi 3 adalah BVA tiga nilai.",
"en": "Two-value BVA tests each boundary with its neighbour in the adjacent partition: 1 with 0, 10 with 11. Option 3 is three-value BVA."
}
},
{
"id": "ctfl-075",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Dengan BVA tiga nilai (3-value) pada rentang valid 1 sampai 10, berapa nilai uji yang dipakai?",
"en": "With three-value BVA on the valid range 1 to 10, how many test values are used?"
},
"options": {
"id": [
"3",
"4",
"6",
"8"
],
"en": [
"3",
"4",
"6",
"8"
]
},
"answer": 2,
"exp": {
"id": "Tiap batas menghasilkan tiga nilai: sebelum, pada, dan sesudah. Batas bawah 0, 1, 2; batas atas 9, 10, 11. Total 6.",
"en": "Each boundary gives three values: before, on, after. Lower: 0, 1, 2; upper: 9, 10, 11. Total 6."
}
},
{
"id": "ctfl-076",
"topic": "istqb",
"lo": "FL-4.2.2",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Field persentase menerima 0,0 sampai 100,0 dengan satu desimal. Nilai uji BVA dua nilai yang tepat adalah...",
"en": "A percentage field accepts 0.0 to 100.0 with one decimal. The correct two-value BVA test values are..."
},
"options": {
"id": [
"-0.1, 0.0, 100.0, 100.1",
"-1, 0, 100, 101",
"0.0, 0.1, 99.9, 100.0",
"0.0, 50.0, 100.0"
],
"en": [
"-0.1, 0.0, 100.0, 100.1",
"-1, 0, 100, 101",
"0.0, 0.1, 99.9, 100.0",
"0.0, 50.0, 100.0"
]
},
"answer": 0,
"exp": {
"id": "Ketelitian satu desimal berarti nilai terdekat di luar batas adalah -0,1 dan 100,1, bukan -1 dan 101. Ketelitian field menentukan tetangga batas.",
"en": "One-decimal precision means the nearest values outside are -0.1 and 100.1, not -1 and 101. The field's precision defines the boundary neighbour."
}
},
{
"id": "ctfl-077",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Sebuah decision table lengkap memiliki 3 kondisi biner (Ya/Tidak). Berapa jumlah rule (kolom) sebelum disederhanakan?",
"en": "A full decision table has 3 binary (Yes/No) conditions. How many rules (columns) are there before simplification?"
},
"options": {
"id": [
"3",
"6",
"8",
"9"
],
"en": [
"3",
"6",
"8",
"9"
]
},
"answer": 2,
"exp": {
"id": "Kombinasi kondisi biner: 2 pangkat 3 = 8.",
"en": "Combinations of binary conditions: 2 to the power of 3 = 8."
}
},
{
"id": "ctfl-078",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Login: kondisi (a) username valid, (b) password valid, (c) akun terkunci. Jika akun terkunci, hasilnya selalu ditolak apa pun isian lain. Jika tidak terkunci, masuk berhasil hanya bila (a) dan (b) valid; selain itu pesan error. Berapa rule minimal setelah digabungkan?",
"en": "Login: conditions (a) valid username, (b) valid password, (c) account locked. If locked, the result is always denied regardless of the others. If not locked, login succeeds only when (a) and (b) are valid; otherwise an error message. How many rules remain after minimising?"
},
"options": {
"id": [
"2",
"3",
"4",
"8"
],
"en": [
"2",
"3",
"4",
"8"
]
},
"answer": 2,
"exp": {
"id": "Terkunci = Ya: satu rule (a dan b diabaikan). Terkunci = Tidak: (a Tidak), (a Ya dan b Tidak), (a Ya dan b Ya) = tiga rule, dengan nilai 'tidak peduli' dipakai. Total 4.",
"en": "Locked = Yes: one rule (a and b irrelevant). Locked = No: (a No), (a Yes and b No), (a Yes and b Yes) = three rules using don't-care values. Total 4."
}
},
{
"id": "ctfl-079",
"topic": "istqb",
"lo": "FL-4.2.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Decision table diskon: anggota+kupon = 20%; anggota tanpa kupon = 10%; bukan anggota+kupon = 5%; bukan anggota tanpa kupon = 0%. Customer bukan anggota memakai kupon. Hasil yang diharapkan?",
"en": "Discount decision table: member+coupon = 20%; member without coupon = 10%; non-member+coupon = 5%; non-member without coupon = 0%. A non-member uses a coupon. Expected result?"
},
"options": {
"id": [
"0%",
"5%",
"10%",
"20%"
],
"en": [
"0%",
"5%",
"10%",
"20%"
]
},
"answer": 1,
"exp": {
"id": "Kombinasi kondisi bukan anggota dan kupon sama dengan rule 3: 5%.",
"en": "The combination non-member and coupon matches rule 3: 5%."
}
},
{
"id": "ctfl-080",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "State pesanan: Created -> Paid (bayar) -> Shipped (kirim) -> Delivered (terima). Created -> Cancelled dan Paid -> Cancelled (batal). Berapa test case minimal agar semua state tercakup (all-states)?",
"en": "Order states: Created -> Paid (pay) -> Shipped (ship) -> Delivered (deliver). Created -> Cancelled and Paid -> Cancelled (cancel). Minimum number of test cases to cover all states?"
},
"options": {
"id": [
"1",
"2",
"3",
"5"
],
"en": [
"1",
"2",
"3",
"5"
]
},
"answer": 1,
"exp": {
"id": "Satu jalur Created, Paid, Shipped, Delivered mencakup empat state, tetapi Cancelled butuh jalur lain. Minimal 2.",
"en": "One path Created, Paid, Shipped, Delivered covers four states, but Cancelled needs another path. Minimum 2."
}
},
{
"id": "ctfl-081",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Dengan model state pesanan yang sama (lima transisi: bayar, kirim, terima, batal-dari-Created, batal-dari-Paid), berapa test case minimal untuk mencakup semua transisi (all-transitions)?",
"en": "Using the same order state model (five transitions: pay, ship, deliver, cancel-from-Created, cancel-from-Paid), minimum test cases to cover all transitions?"
},
"options": {
"id": [
"2",
"3",
"4",
"5"
],
"en": [
"2",
"3",
"4",
"5"
]
},
"answer": 1,
"exp": {
"id": "Tes 1: bayar, kirim, terima. Tes 2: batal dari Created. Tes 3: bayar lalu batal dari Paid. Total 3.",
"en": "Test 1: pay, ship, deliver. Test 2: cancel from Created. Test 3: pay then cancel from Paid. Total 3."
}
},
{
"id": "ctfl-082",
"topic": "istqb",
"lo": "FL-4.2.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Pada model state pesanan, tidak ada transisi 'batal' dari state Shipped. Tes mana yang menguji transisi tidak valid ini?",
"en": "In the order state model there is no 'cancel' transition from Shipped. Which test exercises this invalid transition?"
},
"options": {
"id": [
"Mencoba batal saat pesanan Shipped, lalu memeriksa permintaan ditolak dan state tetap Shipped",
"Membatalkan pesanan yang masih berstatus Created, lalu memeriksa statusnya menjadi Cancelled",
"Membayar pesanan lalu mengirimnya, kemudian memeriksa status akhirnya menjadi Shipped",
"Memeriksa bahwa pesanan Delivered tidak bisa dibayar lagi setelah proses selesai"
],
"en": [
"Try to cancel while the order is Shipped, then check the request is rejected and the state stays Shipped",
"Cancel an order still in Created, then check its status becomes Cancelled",
"Pay an order and then ship it, then check that its final status becomes Shipped",
"Check that a Delivered order cannot be paid again after the process is complete"
]
},
"answer": 0,
"exp": {
"id": "Tes transisi tidak valid memicu event yang tidak diizinkan pada state tertentu dan memeriksa penolakan serta state tidak berubah. Opsi lain menguji transisi valid atau state/event lain.",
"en": "An invalid-transition test triggers an event not allowed in a given state and checks rejection and unchanged state. The others test valid transitions or other state/event pairs."
}
},
{
"id": "ctfl-083",
"topic": "istqb",
"lo": "FL-5.1.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Estimasi tiga titik: optimistis 2 hari, paling mungkin 5 hari, pesimistis 14 hari. Dengan rumus (a + 4m + b) / 6, estimasinya...",
"en": "Three-point estimate: optimistic 2 days, most likely 5 days, pessimistic 14 days. Using (a + 4m + b) / 6, the estimate is..."
},
"options": {
"id": [
"5 hari / 5 days",
"6 hari / 6 days",
"7 hari / 7 days",
"8 hari / 8 days"
],
"en": [
"5 hari / 5 days",
"6 hari / 6 days",
"7 hari / 7 days",
"8 hari / 8 days"
]
},
"answer": 1,
"exp": {
"id": "(2 + 4x5 + 14) / 6 = 36 / 6 = 6.",
"en": "(2 + 4x5 + 14) / 6 = 36 / 6 = 6."
}
},
{
"id": "ctfl-084",
"topic": "istqb",
"lo": "FL-5.1.4",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Data proyek lalu menunjukkan usaha testing sekitar 30% dari usaha pengembangan. Estimasi pengembangan proyek baru 40 person-day. Estimasi testing berbasis rasio?",
"en": "Past projects show test effort is about 30% of development effort. The new project's development estimate is 40 person-days. The ratio-based test estimate?"
},
"options": {
"id": [
"8",
"12",
"30",
"52"
],
"en": [
"8",
"12",
"30",
"52"
]
},
"answer": 1,
"exp": {
"id": "Estimasi berbasis rasio (metrik historis): 30% x 40 = 12 person-day. 52 adalah total dev + test, bukan usaha testing.",
"en": "Ratio-based estimation (historical metrics): 30% x 40 = 12 person-days. 52 is dev plus test, not test effort."
}
},
{
"id": "ctfl-085",
"topic": "istqb",
"lo": "FL-5.1.5",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "TC1: risiko tinggi, tanpa dependensi. TC2: risiko tinggi, butuh data hasil TC3. TC3: risiko sedang, tanpa dependensi. Urutan eksekusi yang paling masuk akal?",
"en": "TC1: high risk, no dependency. TC2: high risk, needs data produced by TC3. TC3: medium risk, no dependency. Most sensible execution order?"
},
"options": {
"id": [
"TC1, TC2, TC3",
"TC1, TC3, TC2",
"TC3, TC2, TC1",
"TC2, TC1, TC3"
],
"en": [
"TC1, TC2, TC3",
"TC1, TC3, TC2",
"TC3, TC2, TC1",
"TC2, TC1, TC3"
]
},
"answer": 1,
"exp": {
"id": "Prioritisasi berbasis risiko tetap harus menghormati dependensi. TC2 tidak bisa jalan sebelum TC3, jadi TC1, TC3, TC2.",
"en": "Risk-based prioritisation must still respect dependencies. TC2 cannot run before TC3, so TC1, TC3, TC2."
}
},
{
"id": "ctfl-086",
"topic": "istqb",
"lo": "FL-5.1.5",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Requirement coverage: T1 = R1,R2,R3; T2 = R3,R4,R6; T3 = R1,R2; T4 = R5. Urutan prioritisasi 'additional coverage' (tiap langkah memilih yang menambah coverage baru terbanyak)?",
"en": "Requirement coverage: T1 = R1,R2,R3; T2 = R3,R4,R6; T3 = R1,R2; T4 = R5. 'Additional coverage' prioritisation order (each step picks the test adding most new coverage)?"
},
"options": {
"id": [
"T1, T2, T4, T3",
"T1, T3, T2, T4",
"T2, T1, T4, T3",
"T4, T3, T2, T1"
],
"en": [
"T1, T2, T4, T3",
"T1, T3, T2, T4",
"T2, T1, T4, T3",
"T4, T3, T2, T1"
]
},
"answer": 0,
"exp": {
"id": "T1 menambah 3 (R1-R3). Lalu T2 menambah 2 baru (R4, R6), T4 menambah 1 (R5), dan T3 tidak menambah apa pun. Urutan T1, T2, T4, T3.",
"en": "T1 adds 3 (R1-R3). Then T2 adds 2 new (R4, R6), T4 adds 1 (R5), and T3 adds nothing. Order T1, T2, T4, T3."
}
},
{
"id": "ctfl-087",
"topic": "istqb",
"lo": "FL-5.5.1",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "Laporan defect mana yang paling membantu developer mereproduksi masalah?",
"en": "Which defect report best helps a developer reproduce the problem?"
},
"options": {
"id": [
"Checkout error, tolong dicek, sudah terjadi beberapa kali sejak kemarin sore sampai hari ini",
"Checkout rusak di build 2.4.1 (Chrome 126). Langkah: tambah 2 item, pakai voucher X, Bayar. Aktual: HTTP 500. Harapan: halaman konfirmasi",
"Checkout selalu gagal, sangat buruk, harus segera diperbaiki hari ini juga oleh developer yang bertugas",
"Mungkin voucher bermasalah karena dulu pernah error, sebaiknya dicek oleh tim backend secepatnya"
],
"en": [
"Checkout error, please check, it has happened several times since yesterday afternoon until today",
"Checkout broken on build 2.4.1 (Chrome 126). Steps: add 2 items, apply voucher X, Pay. Actual: HTTP 500. Expected: confirmation page",
"Checkout always fails, very bad, must be fixed today by whichever developer is on duty",
"Maybe the voucher is broken because it errored before, the backend team should check it soon"
]
},
"answer": 1,
"exp": {
"id": "Laporan yang baik memuat environment/versi, langkah reproduksi, hasil aktual vs harapan, dan bukti. Opsi lain samar, emosional, atau berupa dugaan.",
"en": "A good report has environment/version, reproduction steps, actual vs expected results and evidence. The others are vague, emotional or speculative."
}
},
{
"id": "ctfl-088",
"topic": "istqb",
"lo": "FL-4.5.3",
"k": 3,
"level": 3,
"type": "mcq",
"q": {
"id": "User story: 'Sebagai customer, saya ingin memakai voucher agar membayar lebih murah.' Acceptance test ATDD mana yang paling baik?",
"en": "User story: 'As a customer, I want to apply a voucher so that I pay less.' Which ATDD acceptance test is best?"
},
"options": {
"id": [
"Voucher harus bekerja dengan baik di semua kondisi keranjang customer",
"Given keranjang Rp200.000 dan voucher HEMAT10 (10%, min. Rp100.000), When voucher diterapkan, Then total Rp180.000",
"Developer memeriksa kode fungsi diskon untuk memastikan rumusnya sudah benar",
"Tampilan voucher harus bagus dan konsisten dengan desain aplikasi terbaru"
],
"en": [
"The voucher must work well under all conditions of the customer's cart",
"Given a Rp200,000 cart and voucher SAVE10 (10%, min. Rp100,000), When applied, Then total is Rp180,000",
"The developer reviews the discount function code to make sure the formula is correct",
"The voucher UI must look good and match the latest application design"
]
},
"answer": 1,
"exp": {
"id": "Acceptance test yang baik konkret, terukur, dan ditulis dari sudut pandang bisnis (Given/When/Then dengan data jelas), sebelum implementasi.",
"en": "A good acceptance test is concrete, measurable and business-facing (Given/When/Then with clear data), written before implementation."
}
},
{
"id": "istqb-001",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Urutan yang benar: manusia berbuat salah, lalu muncul di kode, lalu terlihat saat dijalankan.",
"en": "The correct sequence: a human makes a mistake, it appears in the code, then shows up when executed."
},
"options": {
"id": [
"Failure → Defect → Error",
"Error → Defect → Failure",
"Defect → Error → Failure",
"Error → Failure → Defect"
],
"en": [
"Failure → Defect → Error",
"Error → Defect → Failure",
"Defect → Error → Failure",
"Error → Failure → Defect"
]
},
"answer": 1,
"exp": {
"id": "Error (kesalahan manusia) menghasilkan defect (bug) di kode; defect yang dieksekusi dapat menyebabkan failure.",
"en": "An error (human mistake) produces a defect (bug) in code; an executed defect may cause a failure."
},
"lo": "FL-1.2.3",
"k": 2
},
{
"id": "istqb-002",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Prinsip testing yang menyatakan test yang sama berulang lama-lama tidak menemukan bug baru:",
"en": "The testing principle stating that repeating the same tests eventually stops finding new bugs:"
},
"options": {
"id": [
"Defect clustering",
"Pesticide paradox",
"Early testing",
"Exhaustive testing"
],
"en": [
"Defect clustering",
"Pesticide paradox",
"Early testing",
"Exhaustive testing"
]
},
"answer": 1,
"exp": {
"id": "Solusinya: tinjau dan perbarui test case, tambahkan data dan skenario baru.",
"en": "Fix: review and update test cases, add new data and scenarios."
},
"lo": "FL-1.3.1",
"k": 2
},
{
"id": "istqb-003",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Defect clustering berarti...",
"en": "Defect clustering means..."
},
"options": {
"id": [
"Bug tersebar merata di semua modul sehingga alokasi testing sebaiknya dibagi rata pula",
"Sebagian kecil modul memuat sebagian besar defect",
"Defect hanya ada di lapisan UI karena logika bisnis di backend selalu terjaga",
"Defect hanya muncul saat produksi karena test environment tidak pernah sama dengan produksi"
],
"en": [
"Bugs are spread evenly across all modules so testing effort should be split evenly too",
"A small number of modules contain most of the defects",
"Defects exist only in the UI layer because the backend business logic is always safe",
"Defects only appear in production because test environments are never the same as production"
]
},
"answer": 1,
"exp": {
"id": "Mirip prinsip Pareto (80/20). Fokuskan testing pada modul berisiko tinggi.",
"en": "Similar to the Pareto principle (80/20). Focus testing on high-risk modules."
},
"lo": "FL-1.3.1",
"k": 2
},
{
"id": "istqb-004",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "\"Are we building the right product?\" adalah pertanyaan untuk...",
"en": "\"Are we building the right product?\" is the question for..."
},
"options": {
"id": [
"Verification",
"Validation",
"Debugging",
"Regression"
],
"en": [
"Verification",
"Validation",
"Debugging",
"Regression"
]
},
"answer": 1,
"exp": {
"id": "Validation: sesuai kebutuhan user. Verification: \"building the product right\", sesuai spesifikasi.",
"en": "Validation: meets user needs. Verification: \"building the product right\", meets the specification."
},
"lo": null,
"k": 2
},
{
"id": "istqb-005",
"topic": "istqb",
"level": 2,
"type": "short",
"q": {
"id": "Apa beda confirmation testing (re-test) dan regression testing?",
"en": "What is the difference between confirmation testing (re-test) and regression testing?"
},
"model": {
"id": "Confirmation memastikan defect yang diperbaiki benar-benar sudah beres. Regression memastikan perubahan tidak merusak fungsi lain yang sebelumnya berjalan.",
"en": "Confirmation verifies a fixed defect is truly resolved. Regression verifies that changes did not break previously working functionality."
},
"keywords": [
[
"confirmation",
"re-test",
"retest",
"konfirmasi",
"perbaikan",
"fixed",
"diperbaiki"
],
[
"regression",
"regresi"
],
[
"break",
"merusak",
"side effect",
"dampak",
"fitur lain",
"other",
"unchanged"
]
],
"pass": 0.66,
"lo": "FL-2.2.3",
"k": 2
},
{
"id": "istqb-006",
"topic": "istqb",
"level": 3,
"type": "mcq",
"q": {
"id": "Input umur valid 18-60. Nilai uji BVA (2-value) yang tepat adalah...",
"en": "Valid age input is 18-60. The correct BVA (2-value) test values are..."
},
"options": {
"id": [
"17, 18, 60, 61",
"18, 19, 59, 60",
"1, 30, 100",
"0, 18, 61"
],
"en": [
"17, 18, 60, 61",
"18, 19, 59, 60",
"1, 30, 100",
"0, 18, 61"
]
},
"answer": 0,
"exp": {
"id": "Uji batas bawah dan atas beserta tetangga di luar rentang: 17/18 dan 60/61.",
"en": "Test lower and upper boundaries plus their out-of-range neighbours: 17/18 and 60/61."
},
"lo": "FL-4.2.2",
"k": 3
},
{
"id": "istqb-007",
"topic": "istqb",
"level": 3,
"type": "mcq",
"q": {
"id": "Input valid 1-100. Berapa partisi ekuivalen (valid + invalid)?",
"en": "Valid input is 1-100. How many equivalence partitions (valid + invalid)?"
},
"options": {
"id": [
"1",
"2",
"3",
"100"
],
"en": [
"1",
"2",
"3",
"100"
]
},
"answer": 2,
"exp": {
"id": "Kurang dari 1 (invalid), 1-100 (valid), lebih dari 100 (invalid) = 3 partisi.",
"en": "Less than 1 (invalid), 1-100 (valid), more than 100 (invalid) = 3 partitions."
},
"lo": "FL-4.2.1",
"k": 3
},
{
"id": "istqb-008",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Teknik yang cocok untuk logika dengan kombinasi beberapa kondisi:",
"en": "The technique suited for logic with combinations of several conditions:"
},
"options": {
"id": [
"Decision table",
"Error guessing",
"Statement coverage",
"Smoke test"
],
"en": [
"Decision table",
"Error guessing",
"Statement coverage",
"Smoke test"
]
},
"answer": 0,
"exp": {
"id": "Decision table memetakan kombinasi kondisi ke aksi yang diharapkan.",
"en": "A decision table maps combinations of conditions to expected actions."
},
"lo": "FL-4.2.3",
"k": 2
},
{
"id": "istqb-009",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Skenario kartu ATM terblokir setelah 3 kali PIN salah paling cocok diuji dengan...",
"en": "A card-blocked-after-3-wrong-PINs scenario is best tested with..."
},
"options": {
"id": [
"State transition testing",
"Boundary value saja",
"Statement coverage",
"Code review"
],
"en": [
"State transition testing",
"Boundary value only",
"Statement coverage",
"Code review"
]
},
"answer": 0,
"exp": {
"id": "Sistem berpindah state berdasarkan event (PIN salah) sehingga state transition cocok.",
"en": "The system changes state based on events (wrong PIN), so state transition fits."
},
"lo": "FL-4.2.4",
"k": 2
},
{
"id": "istqb-010",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Typo pada logo di halaman utama perusahaan: kombinasi severity-priority yang tepat?",
"en": "A typo in the company logo on the homepage: the right severity-priority combination?"
},
"options": {
"id": [
"Severity rendah, priority tinggi",
"Severity tinggi, priority rendah",
"Keduanya rendah",
"Keduanya tinggi"
],
"en": [
"Low severity, high priority",
"High severity, low priority",
"Both low",
"Both high"
]
},
"answer": 0,
"exp": {
"id": "Dampak teknis kecil tetapi merusak citra, perlu diperbaiki cepat. Severity = dampak, priority = urgensi.",
"en": "Small technical impact but brand-damaging, needs a quick fix. Severity = impact, priority = urgency."
},
"lo": "FL-5.5.1",
"k": 2
},
{
"id": "istqb-011",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Smoke testing adalah...",
"en": "Smoke testing is..."
},
"options": {
"id": [
"Pengecekan awal luas dan dangkal untuk memastikan build layak diuji lebih lanjut",
"Testing mendalam pada satu fitur sampai semua kombinasi inputnya terpenuhi",
"Performance testing dengan banyak user bersamaan pada production environment",
"Security testing menyeluruh untuk mencari celah sebelum release ke customer"
],
"en": [
"A broad, shallow initial check that a build is stable enough for further testing",
"Deep testing of one feature until all its input combinations are covered",
"Performance testing with many concurrent users on the production environment",
"Thorough security testing to find vulnerabilities before release to customers"
]
},
"answer": 0,
"exp": {
"id": "Sanity testing sempit dan dalam, dilakukan setelah perubahan kecil/bugfix.",
"en": "Sanity testing is narrow and deep, done after small changes/bugfixes."
},
"lo": null,
"k": 2
},
{
"id": "istqb-012",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Urutan test level dari terkecil ke terbesar:",
"en": "Test levels from smallest to largest:"
},
"options": {
"id": [
"Component, Integration, System, Acceptance",
"System, Component, Acceptance, Integration",
"Acceptance, System, Integration, Component",
"Integration, Component, System, Acceptance"
],
"en": [
"Component, Integration, System, Acceptance",
"System, Component, Acceptance, Integration",
"Acceptance, System, Integration, Component",
"Integration, Component, System, Acceptance"
]
},
"answer": 0,
"exp": {
"id": "Component (unit) → Integration → System → Acceptance (UAT).",
"en": "Component (unit) → Integration → System → Acceptance (UAT)."
},
"lo": "FL-2.2.1",
"k": 2
},
{
"id": "istqb-013",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Mana yang termasuk static testing?",
"en": "Which is static testing?"
},
"options": {
"id": [
"Menjalankan test otomatis",
"Code review",
"Load test",
"Exploratory testing"
],
"en": [
"Running automated tests",
"Code review",
"Load test",
"Exploratory testing"
]
},
"answer": 1,
"exp": {
"id": "Static testing tidak menjalankan kode: review, walkthrough, inspection, static analysis.",
"en": "Static testing does not execute code: review, walkthrough, inspection, static analysis."
},
"lo": "FL-3.1.3",
"k": 2
},
{
"id": "istqb-014",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Statement coverage mengukur...",
"en": "Statement coverage measures..."
},
"options": {
"id": [
"Persentase statement kode yang dieksekusi oleh test",
"Persentase requirement yang diuji",
"Jumlah bug",
"Kecepatan eksekusi"
],
"en": [
"The percentage of code statements executed by tests",
"The percentage of requirements tested",
"Number of bugs",
"Execution speed"
]
},
"answer": 0,
"exp": {
"id": "Statement coverage termasuk teknik white-box.",
"en": "Statement coverage is a white-box technique."
},
"lo": "FL-4.3.1",
"k": 2
},
{
"id": "istqb-015",
"topic": "istqb",
"level": 2,
"type": "tf",
"q": {
"id": "Branch (decision) coverage 100% menjamin statement coverage 100%.",
"en": "100% branch (decision) coverage guarantees 100% statement coverage."
},
"answer": true,
"exp": {
"id": "Branch coverage lebih kuat; ia mencakup statement coverage. Kebalikannya tidak berlaku.",
"en": "Branch coverage is stronger and subsumes statement coverage. The reverse does not hold."
},
"lo": "FL-4.3.2",
"k": 2
},
{
"id": "istqb-016",
"topic": "istqb",
"level": 2,
"type": "short",
"q": {
"id": "Apa itu test oracle?",
"en": "What is a test oracle?"
},
"model": {
"id": "Sumber atau mekanisme untuk menentukan hasil yang diharapkan sebuah test, sehingga hasil aktual bisa dibandingkan.",
"en": "A source or mechanism used to determine the expected result of a test so actual results can be compared."
},
"keywords": [
[
"expected",
"diharapkan",
"benar",
"correct"
],
[
"determine",
"menentukan",
"source",
"sumber",
"mechanism",
"mekanisme",
"compare",
"bandingkan"
]
],
"pass": 1,
"lo": null,
"k": 2
},
{
"id": "istqb-017",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Exploratory testing termasuk kategori...",
"en": "Exploratory testing belongs to the category of..."
},
"options": {
"id": [
"White-box",
"Experience-based",
"Static analysis",
"Formal inspection"
],
"en": [
"White-box",
"Experience-based",
"Static analysis",
"Formal inspection"
]
},
"answer": 1,
"exp": {
"id": "Desain dan eksekusi test berjalan bersamaan, memakai pengalaman tester.",
"en": "Test design and execution happen together, using tester experience."
},
"lo": "FL-4.4.2",
"k": 2
},
{
"id": "istqb-018",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Teknik black-box didasarkan pada...",
"en": "Black-box techniques are based on..."
},
"options": {
"id": [
"Struktur kode internal dan arsitektur yang dibangun oleh tim pengembang",
"Spesifikasi dan perilaku yang terlihat dari luar",
"Hanya pengalaman dan intuisi tester tanpa memakai dokumen apa pun sebagai acuan",
"Hasil review kode yang dilakukan sesama developer sebelum perubahan digabungkan"
],
"en": [
"Internal code structure and architecture built by the development team",
"Specification and externally observable behaviour",
"Only the tester's experience and intuition, without using any document as a reference",
"Results of code reviews carried out by fellow developers before changes are merged"
]
},
"answer": 1,
"exp": {
"id": "Contoh: EP, BVA, decision table, state transition, use case testing.",
"en": "Examples: EP, BVA, decision table, state transition, use case testing."
},
"lo": "FL-4.1.1",
"k": 2
},
{
"id": "istqb-019",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Prinsip early testing menyatakan...",
"en": "The early testing principle states..."
},
"options": {
"id": [
"Testing dimulai setelah seluruh coding selesai agar tidak mengganggu pekerjaan developer",
"Testing dimulai sedini mungkin karena defect lebih murah diperbaiki di awal",
"Testing hanya dilakukan di akhir sprint ketika seluruh fitur sudah terintegrasi",
"Testing tidak memerlukan requirement karena tester cukup mengandalkan intuisi"
],
"en": [
"Testing starts after all coding is finished so it does not disturb developers' work",
"Testing starts as early as possible because defects are cheaper to fix early",
"Testing happens only at the end of the sprint once every feature is integrated",
"Testing needs no requirements since testers can simply rely on intuition"
]
},
"answer": 1,
"exp": {
"id": "Dikenal juga sebagai shift-left.",
"en": "Also known as shift-left."
},
"lo": "FL-2.1.5",
"k": 2
},
{
"id": "istqb-020",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Absence-of-errors fallacy artinya...",
"en": "The absence-of-errors fallacy means..."
},
"options": {
"id": [
"Sistem tanpa defect pasti sukses di pasar karena kualitas teknisnya sempurna",
"Sistem tanpa defect tetap bisa gagal bila tidak memenuhi kebutuhan user",
"Tidak ada satu pun sistem tanpa defect, jadi testing tidak pernah bisa dianggap selesai",
"Semua bug pasti ditemukan bila tim melakukan testing cukup lama dengan teknik yang tepat"
],
"en": [
"A defect-free system is certain to succeed in the market because its technical quality is perfect",
"A defect-free system can still fail if it does not meet user needs",
"No system is ever defect-free, so testing can never be considered finished",
"All bugs will certainly be found if the team tests long enough with the right techniques"
]
},
"answer": 1,
"exp": {
"id": "Bebas bug bukan berarti berguna bagi user.",
"en": "Being bug-free does not mean useful to users."
},
"lo": "FL-1.3.1",
"k": 2
},
{
"id": "istqb-021",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Test plan umumnya memuat...",
"en": "A test plan typically contains..."
},
"options": {
"id": [
"Scope, pendekatan, sumber daya, jadwal",
"Hanya daftar bug yang ditemukan beserta tingkat keparahan masing-masing defect",
"Hanya kode test otomasi yang akan dijalankan pada pipeline untuk iterasi berjalan",
"Hanya hasil eksekusi test dari iterasi sebelumnya beserta tanggal dan nama tester"
],
"en": [
"Scope, approach, resources, schedule",
"Only the list of bugs found along with the severity of each defect",
"Only the automated test code to be run in the pipeline for the current iteration",
"Only the test execution results from the previous iteration with date and tester name"
]
},
"answer": 0,
"exp": {
"id": "Plus kriteria masuk/keluar dan risiko.",
"en": "Plus entry/exit criteria and risks."
},
"lo": "FL-5.1.1",
"k": 2
},
{
"id": "istqb-022",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Jenis review yang paling formal adalah...",
"en": "The most formal type of review is..."
},
"options": {
"id": [
"Informal review",
"Walkthrough",
"Technical review",
"Inspection"
],
"en": [
"Informal review",
"Walkthrough",
"Technical review",
"Inspection"
]
},
"answer": 3,
"exp": {
"id": "Inspection punya peran, proses, dan metrik yang terdefinisi.",
"en": "Inspection has defined roles, process, and metrics."
},
"lo": "FL-3.2.4",
"k": 2
},
{
"id": "istqb-023",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Testing ulang bug yang sudah diperbaiki disebut...",
"en": "Re-testing a fixed bug is called..."
},
"options": {
"id": [
"Regression testing",
"Confirmation testing",
"Smoke testing",
"Load testing"
],
"en": [
"Regression testing",
"Confirmation testing",
"Smoke testing",
"Load testing"
]
},
"answer": 1,
"exp": {
"id": "Confirmation = re-test; regression = cek efek samping ke fitur lain.",
"en": "Confirmation = re-test; regression = check side effects elsewhere."
},
"lo": "FL-2.2.3",
"k": 2
},
{
"id": "istqb-024",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Risk-based testing memprioritaskan test berdasarkan...",
"en": "Risk-based testing prioritises tests based on..."
},
"options": {
"id": [
"Urutan alfabet",
"Likelihood × impact",
"Jumlah baris kode",
"Preferensi tester"
],
"en": [
"Alphabetical order",
"Likelihood × impact",
"Lines of code",
"Tester preference"
]
},
"answer": 1,
"exp": {
"id": "Risiko = kemungkinan terjadi dikali dampaknya.",
"en": "Risk = likelihood of occurring times its impact."
},
"lo": "FL-5.2.3",
"k": 2
},
{
"id": "istqb-025",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Contoh non-functional testing:",
"en": "An example of non-functional testing:"
},
"options": {
"id": [
"Menguji kalkulasi diskon",
"Menguji waktu respons di 1000 user",
"Menguji login berhasil",
"Menguji validasi email"
],
"en": [
"Testing discount calculation",
"Testing response time with 1000 users",
"Testing a successful login",
"Testing email validation"
]
},
"answer": 1,
"exp": {
"id": "Non-functional: performance, usability, security, reliabilitas, compatibility.",
"en": "Non-functional: performance, usability, security, reliability, compatibility."
},
"lo": "FL-2.2.2",
"k": 2
},
{
"id": "istqb-026",
"topic": "istqb",
"level": 2,
"type": "short",
"q": {
"id": "Jelaskan pesticide paradox dan cara mengatasinya.",
"en": "Explain the pesticide paradox and how to mitigate it."
},
"model": {
"id": "Test yang sama dijalankan berulang akan berhenti menemukan defect baru. Atasi dengan meninjau dan memperbarui test dan data secara berkala.",
"en": "Running the same tests repeatedly stops finding new defects. Mitigate by regularly reviewing and updating tests and data."
},
"keywords": [
[
"repeat",
"berulang",
"sama",
"same"
],
[
"review",
"update",
"perbarui",
"tinjau",
"revise",
"tambah",
"new",
"baru"
],
[
"test",
"tes",
"uji"
]
],
"pass": 0.66,
"lo": "FL-1.3.1",
"k": 2
},
{
"id": "istqb-027",
"topic": "istqb",
"level": 2,
"type": "tf",
"q": {
"id": "Exhaustive testing (menguji semua kombinasi) mungkin dilakukan pada hampir semua sistem.",
"en": "Exhaustive testing (testing all combinations) is feasible for almost all systems."
},
"answer": false,
"exp": {
"id": "Tidak praktis; gunakan risk analysis dan teknik desain test untuk memilih test.",
"en": "Impractical; use risk analysis and test design techniques to choose tests."
},
"lo": "FL-1.3.1",
"k": 2
},
{
"id": "istqb-028",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Setelah perbaikan bug diverifikasi lolos, status defect menjadi...",
"en": "After a fix is verified, the defect status becomes..."
},
"options": {
"id": [
"New",
"Closed",
"Rejected",
"Deferred"
],
"en": [
"New",
"Closed",
"Rejected",
"Deferred"
]
},
"answer": 1,
"exp": {
"id": "Jika masih gagal: Reopened.",
"en": "If it still fails: Reopened."
},
"lo": "FL-5.5.1",
"k": 2
},
{
"id": "istqb-029",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Traceability matrix berguna untuk...",
"en": "A traceability matrix is used to..."
},
"options": {
"id": [
"Melacak hubungan requirement dengan test case dan defect",
"Mengukur kecepatan CPU dan memori server selama tes berjalan di environment staging",
"Menjadwalkan sprint dan membagi tugas anggota tim berdasarkan kapasitas tiap orang",
"Menyimpan password dan kredensial uji secara aman di repositori bersama"
],
"en": [
"Trace the relationship between requirements, test cases, and defects",
"Measure server CPU and memory speed while tests run in staging",
"Schedule sprints and split tasks among team members by each person's capacity",
"Store test passwords and credentials safely in a shared repository"
]
},
"answer": 0,
"exp": {
"id": "Membantu melihat coverage requirement dan analisis dampak perubahan.",
"en": "Helps see requirement coverage and change impact analysis."
},
"lo": "FL-1.4.4",
"k": 2
},
{
"id": "istqb-030",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Beta testing dilakukan oleh...",
"en": "Beta testing is performed by..."
},
"options": {
"id": [
"Developer di environment developer",
"User nyata di environment mereka sendiri",
"Tim security saja",
"Kompiler"
],
"en": [
"Developers in the developer environment",
"Real users in their own environment",
"The security team only",
"The compiler"
]
},
"answer": 1,
"exp": {
"id": "Alpha: internal di environment pengembang. Beta: user eksternal di environment sendiri.",
"en": "Alpha: internal at the developer's site. Beta: external users in their own environment."
},
"lo": "FL-2.2.1",
"k": 2
},
{
"id": "istqb-031",
"topic": "istqb",
"level": 2,
"type": "mcq",
"q": {
"id": "Contoh exit criteria yang masuk akal:",
"en": "A reasonable example of exit criteria:"
},
"options": {
"id": [
"Semua defect critical sudah ditutup dan coverage target tercapai",
"Developer sudah menyelesaikan seluruh pekerjaan pengembangan dan pulang untuk hari itu",
"Build baru berhasil dibuat dan siap dipasang pada environment testing berikutnya",
"Sprint baru dimulai sehingga tim perlu segera menyiapkan test case untuk fitur baru"
],
"en": [
"All critical defects are closed and the coverage target is met",
"The developer has finished all development work and gone home for the day",
"A new build was created successfully and is ready to install in the next test environment",
"A new sprint started so the team must quickly prepare test cases for the new features"
]
},
"answer": 0,
"exp": {
"id": "Exit criteria menentukan kapan testing dianggap selesai.",
"en": "Exit criteria define when testing is considered done."
},
"lo": "FL-5.1.3",
"k": 2
},
{
"id": "istqb-032",
"topic": "istqb",
"level": 1,
"type": "short",
"q": {
"id": "Apa beda Quality Assurance (QA) dan Quality Control (QC)?",
"en": "What is the difference between Quality Assurance (QA) and Quality Control (QC)?"
},
"model": {
"id": "QA berorientasi proses dan pencegahan defect. QC berorientasi produk dan mendeteksi defect.",
"en": "QA is process-oriented and prevents defects. QC is product-oriented and detects defects."
},
"keywords": [
[
"process",
"proses"
],
[
"product",
"produk"
],
[
"prevent",
"mencegah",
"pencegahan"
],
[
"detect",
"mendeteksi",
"menemukan",
"identify"
]
],
"pass": 0.5,
"lo": "FL-1.2.2",
"k": 1
},
{
"id": "gen-001",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Pada test automation pyramid, lapisan mana yang seharusnya paling banyak?",
"en": "In the test automation pyramid, which layer should have the most tests?"
},
"options": {
"id": [
"Unit test",
"UI/E2E test",
"Manual test",
"Performance test"
],
"en": [
"Unit tests",
"UI/E2E tests",
"Manual tests",
"Performance tests"
]
},
"answer": 0,
"exp": {
"id": "Unit cepat dan murah; UI lambat dan rapuh sehingga sedikit saja.",
"en": "Unit tests are fast and cheap; UI tests are slow and brittle so keep them few."
}
},
{
"id": "gen-002",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Query SQL untuk mengambil user dengan email tertentu:",
"en": "SQL query to fetch a user with a given email:"
},
"options": {
"id": [
"SELECT * FROM users WHERE email = 'a@b.com';",
"GET users WHERE email = 'a@b.com';",
"FETCH users email 'a@b.com';",
"SELECT users.email == 'a@b.com';"
],
"en": [
"SELECT * FROM users WHERE email = 'a@b.com';",
"GET users WHERE email = 'a@b.com';",
"FETCH users email 'a@b.com';",
"SELECT users.email == 'a@b.com';"
]
},
"answer": 0,
"exp": {
"id": "QA sering memverifikasi data di database setelah aksi di UI/API.",
"en": "QA often verifies database data after a UI/API action."
}
},
{
"id": "gen-003",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "INNER JOIN mengembalikan...",
"en": "INNER JOIN returns..."
},
"options": {
"id": [
"Baris yang cocok di kedua tabel",
"Semua baris tabel kiri",
"Semua baris tabel kanan",
"Semua baris kedua tabel"
],
"en": [
"Rows that match in both tables",
"All rows from the left table",
"All rows from the right table",
"All rows from both tables"
]
},
"answer": 0,
"exp": {
"id": "LEFT JOIN: semua kiri + yang cocok kanan. FULL OUTER JOIN: semua kedua tabel.",
"en": "LEFT JOIN: all left + matching right. FULL OUTER JOIN: all from both."
}
},
{
"id": "gen-004",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Git: membuat branch baru sekaligus pindah ke branch itu:",
"en": "Git: create a new branch and switch to it:"
},
"options": {
"id": [
"git checkout -b fitur-x",
"git branch -d fitur-x",
"git merge fitur-x",
"git push fitur-x"
],
"en": [
"git checkout -b feature-x",
"git branch -d feature-x",
"git merge feature-x",
"git push feature-x"
]
},
"answer": 0,
"exp": {
"id": "Alternatif modern: git switch -c fitur-x.",
"en": "Modern alternative: git switch -c feature-x."
}
},
{
"id": "gen-005",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Elemen bug report yang paling penting agar developer bisa mereproduksi:",
"en": "The most important bug report element for developers to reproduce:"
},
"options": {
"id": [
"Steps to reproduce",
"Nama tester",
"Warna laporan",
"Jam makan siang"
],
"en": [
"Steps to reproduce",
"Tester name",
"Report colour",
"Lunch time"
]
},
"answer": 0,
"exp": {
"id": "Sertakan juga expected vs actual, environment, severity, dan bukti (screenshot/log).",
"en": "Also include expected vs actual, environment, severity, and evidence (screenshot/log)."
}
},
{
"id": "gen-006",
"topic": "qa-general",
"level": 1,
"type": "short",
"q": {
"id": "Sebutkan komponen bug report yang baik.",
"en": "List the components of a good bug report."
},
"model": {
"id": "Judul jelas, langkah reproduksi, expected result, actual result, environment (versi/browser/device), severity, dan bukti (screenshot/log).",
"en": "Clear title, steps to reproduce, expected result, actual result, environment (version/browser/device), severity, and evidence (screenshot/log)."
},
"keywords": [
[
"step",
"langkah"
],
[
"expected",
"harapan",
"diharapkan"
],
[
"actual",
"aktual",
"sebenarnya"
],
[
"environment",
"lingkungan",
"versi",
"browser",
"device"
]
],
"pass": 0.75
},
{
"id": "gen-007",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Event Scrum berikut yang BUKAN bagian resmi Scrum:",
"en": "Which of these is NOT an official Scrum event?"
},
"options": {
"id": [
"Sprint Planning",
"Daily Scrum",
"Sprint Retrospective",
"Weekly Bug Party"
],
"en": [
"Sprint Planning",
"Daily Scrum",
"Sprint Retrospective",
"Weekly Bug Party"
]
},
"answer": 3,
"exp": {
"id": "Event Scrum: Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective.",
"en": "Scrum events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective."
}
},
{
"id": "gen-008",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Kata kunci Gherkin untuk skenario BDD:",
"en": "Gherkin keywords for a BDD scenario:"
},
"options": {
"id": [
"Given, When, Then",
"If, Else, End",
"Start, Run, Stop",
"Setup, Act, Close"
],
"en": [
"Given, When, Then",
"If, Else, End",
"Start, Run, Stop",
"Setup, Act, Close"
]
},
"answer": 0,
"exp": {
"id": "Given = kondisi awal, When = aksi, Then = hasil. Dipakai di Cucumber.",
"en": "Given = precondition, When = action, Then = outcome. Used in Cucumber."
}
},
{
"id": "gen-009",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Tujuan utama CI/CD bagi QA:",
"en": "The main purpose of CI/CD for QA:"
},
"options": {
"id": [
"Menjalankan build dan test otomatis pada setiap perubahan untuk feedback cepat",
"Menggantikan tester sepenuhnya karena semua testing sudah dilakukan oleh pipeline",
"Menghapus kebutuhan code review karena pipeline sudah memeriksa seluruh perubahan",
"Mempercepat koneksi internet tim pengembang saat mengunduh dependensi proyek"
],
"en": [
"Run builds and tests automatically on every change for fast feedback",
"Replace testers entirely because the pipeline already performs all the testing",
"Remove the need for code review because the pipeline already checks every change",
"Speed up the developers' internet connection when downloading project dependencies"
]
},
"answer": 0,
"exp": {
"id": "Contoh: GitHub Actions, GitLab CI, Jenkins.",
"en": "Examples: GitHub Actions, GitLab CI, Jenkins."
}
},
{
"id": "gen-010",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Flaky test adalah test yang...",
"en": "A flaky test is one that..."
},
"options": {
"id": [
"Kadang lolos kadang gagal tanpa perubahan kode",
"Selalu gagal setelah deploy terbaru, walau kodenya tidak berubah",
"Selalu lolos di environment lokal tetapi tidak pernah dijalankan di CI",
"Terlalu cepat selesai sehingga hasilnya sulit dipercaya"
],
"en": [
"Sometimes passes and sometimes fails without code changes",
"Always fails after the latest deploy, even though the code did not change",
"Always passes locally but is never run in CI",
"Finishes too quickly, so the result is hard to trust"
]
},
"answer": 0,
"exp": {
"id": "Penyebab: timing/wait buruk, data bersama, ketergantungan antar test, environment tidak stabil.",
"en": "Causes: poor timing/waits, shared data, test inter-dependence, unstable environments."
}
},
{
"id": "gen-011",
"topic": "qa-general",
"level": 2,
"type": "short",
"q": {
"id": "Apa penyebab umum flaky test dan cara mengatasinya?",
"en": "What are common causes of flaky tests and how do you fix them?"
},
"model": {
"id": "Penyebab: sinkronisasi/wait buruk, data test bersama atau tidak terisolasi, environment/dependensi eksternal tidak stabil. Solusi: explicit wait, data terisolasi, mock dependensi, stabilkan environment.",
"en": "Causes: poor synchronisation/waits, shared or non-isolated test data, unstable environment/external dependencies. Fixes: explicit waits, isolated data, mock dependencies, stabilise environment."
},
"keywords": [
[
"wait",
"tunggu",
"sinkron",
"synchron",
"timing"
],
[
"data"
],
[
"environment",
"lingkungan",
"dependency",
"dependensi",
"external",
"eksternal"
]
],
"pass": 0.66
},
{
"id": "gen-012",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Anotasi TestNG yang berjalan sebelum setiap method test:",
"en": "The TestNG annotation that runs before each test method:"
},
"options": {
"id": [
"@BeforeMethod",
"@BeforeClass",
"@BeforeSuite",
"@BeforeAll"
],
"en": [
"@BeforeMethod",
"@BeforeClass",
"@BeforeSuite",
"@BeforeAll"
]
},
"answer": 0,
"exp": {
"id": "@BeforeClass sekali per class, @BeforeSuite sekali per suite.",
"en": "@BeforeClass once per class, @BeforeSuite once per suite."
}
},
{
"id": "gen-013",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Padanan @BeforeMethod di JUnit 5:",
"en": "The JUnit 5 equivalent of @BeforeMethod:"
},
"options": {
"id": [
"@BeforeEach",
"@Before",
"@BeforeAll",
"@Setup"
],
"en": [
"@BeforeEach",
"@Before",
"@BeforeAll",
"@Setup"
]
},
"answer": 0,
"exp": {
"id": "@Before adalah JUnit 4. @BeforeAll = sekali sebelum semua test (static).",
"en": "@Before is JUnit 4. @BeforeAll = once before all tests (static)."
}
},
{
"id": "gen-014",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Fungsi @DataProvider di TestNG:",
"en": "The purpose of @DataProvider in TestNG:"
},
"options": {
"id": [
"Menjalankan test yang sama dengan banyak set data",
"Mengambil data langsung dari database produksi secara otomatis sebelum setiap test dijalankan",
"Membuat laporan ringkasan hasil test dalam format yang mudah dibaca oleh manajer proyek",
"Menghapus seluruh data test setelah eksekusi selesai supaya environment tetap bersih"
],
"en": [
"Run the same test with multiple data sets",
"Automatically fetch data straight from the production database before each test runs",
"Produce summary test result reports in a format that project managers can read easily",
"Delete all test data after execution finishes so the environment stays clean"
]
},
"answer": 0,
"exp": {
"id": "Data-driven testing. Padanan JUnit 5: @ParameterizedTest.",
"en": "Data-driven testing. JUnit 5 equivalent: @ParameterizedTest."
}
},
{
"id": "gen-015",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Fitur Playwright yang mengurangi flaky test:",
"en": "A Playwright feature that reduces flaky tests:"
},
"options": {
"id": [
"Auto-waiting sebelum aksi",
"Hanya mendukung satu browser",
"Tidak bisa headless",
"Wajib sleep"
],
"en": [
"Auto-waiting before actions",
"Supports only one browser",
"Cannot run headless",
"Requires sleeps"
]
},
"answer": 0,
"exp": {
"id": "Playwright mendukung Chromium, Firefox, WebKit dan menunggu elemen siap (actionability) otomatis.",
"en": "Playwright supports Chromium, Firefox, WebKit and auto-waits for actionability."
}
},
{
"id": "gen-016",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Cypress ditulis dengan bahasa...",
"en": "Cypress tests are written in..."
},
"options": {
"id": [
"JavaScript/TypeScript",
"Java",
"Python",
"Golang"
],
"en": [
"JavaScript/TypeScript",
"Java",
"Python",
"Go"
]
},
"answer": 0,
"exp": {
"id": "Cypress berjalan di dalam browser; Selenium dan Playwright mendukung banyak bahasa.",
"en": "Cypress runs inside the browser; Selenium and Playwright support multiple languages."
}
},
{
"id": "gen-017",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Stress testing bertujuan...",
"en": "Stress testing aims to..."
},
"options": {
"id": [
"Menguji sistem melampaui kapasitas normal untuk mencari titik patah dan pemulihan",
"Menguji tampilan UI di berbagai warna, ukuran layar, dan tema yang berbeda",
"Menguji perilaku sistem untuk satu user saja dalam kondisi yang sangat ideal",
"Menguji ketepatan terjemahan teks aplikasi ke beberapa bahasa yang didukung"
],
"en": [
"Push the system beyond normal capacity to find breaking point and recovery",
"Test the interface across various colours, screen sizes and themes",
"Test system behaviour for a single user under very ideal conditions",
"Test the accuracy of the app text translations in several supported languages"
]
},
"answer": 0,
"exp": {
"id": "Load testing: load yang diharapkan. Spike: lonjakan mendadak. Soak: load lama.",
"en": "Load testing: expected load. Spike: sudden surge. Soak: prolonged load."
}
},
{
"id": "gen-018",
"topic": "qa-general",
"level": 3,
"type": "mcq",
"q": {
"id": "Contoh input untuk menguji kerentanan SQL injection:",
"en": "An example input to test for SQL injection:"
},
"options": {
"id": [
"' OR '1'='1",
"<b>halo</b>",
"12345",
"admin@test.com"
],
"en": [
"' OR '1'='1",
"<b>hello</b>",
"12345",
"admin@test.com"
]
},
"answer": 0,
"exp": {
"id": "Aplikasi yang aman memakai parameterized query. Lakukan hanya di environment yang Anda berwenang untuk menguji.",
"en": "A secure application uses parameterized queries. Only test in environments you are authorised to test."
}
},
{
"id": "gen-019",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Cross-Site Scripting (XSS) adalah...",
"en": "Cross-Site Scripting (XSS) is..."
},
"options": {
"id": [
"Menyisipkan script berbahaya yang dieksekusi di browser korban",
"Serangan yang hanya menargetkan database melalui query yang dimanipulasi penyerang",
"Serangan DDoS yang membanjiri server dengan lalu lintas hingga layanan tidak bisa diakses",
"Failure CSS yang membuat tampilan halaman rusak pada sebagian perangkat user"
],
"en": [
"Injecting malicious script that runs in a victim's browser",
"An attack that targets only the database through queries manipulated by the attacker",
"A DDoS attack that floods the server with traffic until the service becomes unreachable",
"A CSS failure that breaks the page layout on some of the users' devices"
]
},
"answer": 0,
"exp": {
"id": "Mitigasi: output encoding, validasi input, Content Security Policy.",
"en": "Mitigation: output encoding, input validation, Content Security Policy."
}
},
{
"id": "gen-020",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Tujuan mock atau stub dalam testing:",
"en": "The purpose of a mock or stub in testing:"
},
"options": {
"id": [
"Mengganti dependensi eksternal agar test terisolasi dan deterministik",
"Mempercepat koneksi internet dengan memblokir seluruh permintaan ke layanan eksternal",
"Menghapus bug dari kode produksi sebelum test dijalankan oleh pipeline CI",
"Mengganti database produksi dengan salinan lama yang sudah tidak dipakai user"
],
"en": [
"Replace external dependencies so tests are isolated and deterministic",
"Speed up the internet connection by blocking every request to external services",
"Remove bugs from production code before the CI pipeline runs the tests",
"Replace the production database with an old copy that users no longer use"
]
},
"answer": 0,
"exp": {
"id": "Contoh: WireMock, Mockito, MSW.",
"en": "Examples: WireMock, Mockito, MSW."
}
},
{
"id": "gen-021",
"topic": "qa-general",
"level": 2,
"type": "short",
"q": {
"id": "Kapan sebaiknya sebuah test TIDAK diotomasi?",
"en": "When should a test NOT be automated?"
},
"model": {
"id": "Jika hanya dijalankan sekali/jarang, fiturnya sering berubah (tidak stabil), atau butuh penilaian manusia seperti exploratory dan usability.",
"en": "If it runs once or rarely, the feature changes often (unstable), or it needs human judgement such as exploratory and usability testing."
},
"keywords": [
[
"once",
"sekali",
"jarang",
"rarely"
],
[
"unstable",
"berubah",
"changing",
"change",
"tidak stabil"
],
[
"exploratory",
"usability",
"manual",
"human",
"manusia"
]
],
"pass": 0.34
},
{
"id": "gen-022",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Otomasi paling menguntungkan (ROI tinggi) untuk...",
"en": "Automation has the highest ROI for..."
},
"options": {
"id": [
"Regression test yang berulang dan stabil",
"Test yang dijalankan sekali",
"Eksplorasi fitur baru",
"Penilaian estetika desain"
],
"en": [
"Repetitive, stable regression tests",
"One-off tests",
"Exploring new features",
"Judging design aesthetics"
]
},
"answer": 0,
"exp": {
"id": "Semakin sering dijalankan dan semakin stabil, semakin cepat biaya otomasi terbayar.",
"en": "The more often it runs and the more stable it is, the sooner automation pays off."
}
},
{
"id": "gen-023",
"topic": "qa-general",
"level": 2,
"type": "short",
"q": {
"id": "Sebutkan fase Software Testing Life Cycle (STLC).",
"en": "List the phases of the Software Testing Life Cycle (STLC)."
},
"model": {
"id": "Analisis requirement, perencanaan test, desain test case, setup environment, eksekusi test, dan penutupan test (closure).",
"en": "Requirement analysis, test planning, test case design, environment setup, test execution, and test closure."
},
"keywords": [
[
"requirement",
"kebutuhan"
],
[
"plan",
"perencanaan",
"rencana"
],
[
"design",
"desain"
],
[
"execution",
"eksekusi",
"execute"
],
[
"closure",
"penutupan",
"report",
"laporan"
]
],
"pass": 0.6
},
{
"id": "gen-024",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Newman adalah...",
"en": "Newman is..."
},
"options": {
"id": [
"CLI untuk menjalankan Postman collection",
"Library Selenium",
"Framework unit test Java",
"Tool desain UI"
],
"en": [
"A CLI to run Postman collections",
"A Selenium library",
"A Java unit test framework",
"A UI design tool"
]
},
"answer": 0,
"exp": {
"id": "Cocok dipakai di pipeline CI.",
"en": "Well suited for CI pipelines."
}
},
{
"id": "gen-025",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Manfaat Docker bagi QA:",
"en": "A benefit of Docker for QA:"
},
"options": {
"id": [
"Test environment konsisten dan mudah diulang",
"Menghilangkan kebutuhan test karena kontainer sudah memastikan aplikasi pasti berjalan benar",
"Membuat bug otomatis hilang saat aplikasi dipaketkan ke dalam image yang baru",
"Mengganti Git sebagai sistem version control untuk seluruh kode dan konfigurasi"
],
"en": [
"Consistent, reproducible test environments",
"Eliminates the need for tests because containers already make sure the app runs correctly",
"Makes bugs vanish automatically when the app is packaged into a new image",
"Replaces Git as the version control system for all code and configuration"
]
},
"answer": 0,
"exp": {
"id": "Juga untuk menjalankan Selenium Grid lewat container.",
"en": "Also for running Selenium Grid in containers."
}
},
{
"id": "gen-026",
"topic": "qa-general",
"level": 1,
"type": "mcq",
"q": {
"id": "Apache JMeter terutama dipakai untuk...",
"en": "Apache JMeter is mainly used for..."
},
"options": {
"id": [
"Performance/load testing",
"UI visual regression",
"Static code analysis",
"Manajemen proyek"
],
"en": [
"Performance/load testing",
"UI visual regression",
"Static code analysis",
"Project management"
]
},
"answer": 0,
"exp": {
"id": "Alternatif: k6, Gatling, Locust.",
"en": "Alternatives: k6, Gatling, Locust."
}
},
{
"id": "gen-027",
"topic": "qa-general",
"level": 1,
"type": "tf",
"q": {
"id": "Unit test biasanya ditulis oleh developer, bukan hanya oleh QA.",
"en": "Unit tests are usually written by developers, not only by QA."
},
"answer": true,
"exp": {
"id": "QA berperan mendorong kualitas, mereview coverage, dan menulis test level lebih tinggi.",
"en": "QA helps drive quality, reviews coverage, and writes higher-level tests."
}
},
{
"id": "gen-028",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Perbedaan test case dan test scenario:",
"en": "Difference between a test case and a test scenario:"
},
"options": {
"id": [
"Scenario: gambaran tinggi apa yang diuji; test case: langkah, data, dan hasil yang diharapkan",
"Keduanya sama persis dan hanya dibedakan oleh nama yang dipakai tiap tim berbeda-beda",
"Test case lebih umum dan ringkas daripada scenario yang selalu memuat langkah rinci",
"Scenario hanya dipakai pada performance testing, sedangkan test case dipakai untuk fungsional"
],
"en": [
"Scenario: high-level what to test; test case: steps, data and expected result",
"They are exactly the same and differ only in the name each team happens to use",
"A test case is more general and concise than a scenario, which always holds detailed steps",
"Scenarios are used only in performance testing, while test cases are used for functional testing"
]
},
"answer": 0,
"exp": {
"id": "Satu scenario bisa menghasilkan banyak test case (positif dan negatif).",
"en": "One scenario can yield many test cases (positive and negative)."
}
},
{
"id": "gen-029",
"topic": "qa-general",
"level": 2,
"type": "mcq",
"q": {
"id": "Contoh negative test case untuk form login:",
"en": "An example negative test case for a login form:"
},
"options": {
"id": [
"Login dengan password salah",
"Login dengan kredensial valid",
"Login lalu logout normal",
"Membuka halaman login"
],
"en": [
"Login with a wrong password",
"Login with valid credentials",
"Normal login then logout",
"Opening the login page"
]
},
"answer": 0,
"exp": {
"id": "Negative test memeriksa penanganan input/kondisi tidak valid.",
"en": "Negative tests check handling of invalid input/conditions."
}
},
{
"id": "gen-030",
"topic": "qa-general",
"level": 3,
"type": "short",
"q": {
"id": "Bagaimana Anda memprioritaskan test saat waktu sangat terbatas?",
"en": "How do you prioritise tests when time is very limited?"
},
"model": {
"id": "Berbasis risiko: utamakan fitur kritis bisnis, area dengan perubahan terbaru, dan area yang sering bermasalah; jalankan smoke dan regression inti dulu.",
"en": "Risk-based: prioritise business-critical features, recently changed areas, and historically defect-prone areas; run smoke and core regression first."
},
"keywords": [
[
"risk",
"risiko"
],
[
"critical",
"kritis",
"penting",
"core",
"inti",
"business",
"bisnis"
],
[
"change",
"perubahan",
"regression",
"regresi",
"smoke"
]
],
"pass": 0.66
},
{
"id": "api-001",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Untuk mengganti seluruh data resource yang sudah ada, HTTP method yang tepat adalah...",
"en": "To fully replace an existing resource, the correct HTTP method is..."
},
"options": {
"id": [
"POST",
"PUT",
"GET",
"OPTIONS"
],
"en": [
"POST",
"PUT",
"GET",
"OPTIONS"
]
},
"answer": 1,
"exp": {
"id": "PUT mengganti resource secara penuh dan idempotent. POST membuat resource baru.",
"en": "PUT replaces the whole resource and is idempotent. POST creates a new resource."
}
},
{
"id": "api-002",
"topic": "rest-api",
"level": 1,
"type": "tf",
"q": {
"id": "UPDATE adalah salah satu HTTP method standar.",
"en": "UPDATE is a standard HTTP method."
},
"answer": false,
"exp": {
"id": "UPDATE adalah perintah SQL, bukan HTTP method. Untuk memperbarui data gunakan PUT atau PATCH.",
"en": "UPDATE is a SQL command, not an HTTP method. Use PUT or PATCH to update data."
}
},
{
"id": "api-003",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Status code yang paling tepat setelah POST berhasil membuat resource baru adalah...",
"en": "The most appropriate status code after a POST successfully creates a new resource is..."
},
"options": {
"id": [
"200 OK",
"201 Created",
"204 No Content",
"202 Accepted"
],
"en": [
"200 OK",
"201 Created",
"204 No Content",
"202 Accepted"
]
},
"answer": 1,
"exp": {
"id": "201 Created menandakan resource baru berhasil dibuat. 200 umum untuk sukses biasa, 204 tanpa body, 202 untuk proses asinkron yang belum selesai.",
"en": "201 Created signals a new resource was created. 200 is generic success, 204 has no body, 202 means accepted for async processing."
}
},
{
"id": "api-004",
"topic": "rest-api",
"level": 1,
"type": "short",
"q": {
"id": "Login dengan email terdaftar tetapi password salah. Status code apa yang umumnya dikembalikan?",
"en": "Logging in with a registered email but a wrong password. Which status code is commonly returned?"
},
"model": {
"id": "401 Unauthorized, karena kredensial tidak valid.",
"en": "401 Unauthorized, because the credentials are invalid."
},
"keywords": [
[
"401"
]
],
"pass": 1
},
{
"id": "api-005",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "User sudah login dengan token valid tetapi mengakses endpoint khusus admin. Status code yang tepat?",
"en": "A logged-in user with a valid token calls an admin-only endpoint. Which status code is correct?"
},
"options": {
"id": [
"401",
"403",
"404",
"400"
],
"en": [
"401",
"403",
"404",
"400"
]
},
"answer": 1,
"exp": {
"id": "403 Forbidden: identitas dikenali tetapi tidak punya hak akses. 401 berarti belum terautentikasi atau token tidak valid.",
"en": "403 Forbidden: identity is known but lacks permission. 401 means not authenticated or invalid token."
}
},
{
"id": "api-006",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "GET /orders/9999 untuk order yang tidak ada seharusnya mengembalikan...",
"en": "GET /orders/9999 for a non-existent order should return..."
},
"options": {
"id": [
"200 dengan body kosong",
"404 Not Found",
"500",
"403"
],
"en": [
"200 with empty body",
"404 Not Found",
"500",
"403"
]
},
"answer": 1,
"exp": {
"id": "Resource tidak ditemukan = 404. 500 hanya untuk failure server yang tidak terduga.",
"en": "Resource not found = 404. 500 is only for unexpected server failures."
}
},
{
"id": "api-007",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Method mana yang BUKAN idempotent?",
"en": "Which method is NOT idempotent?"
},
"options": {
"id": [
"GET",
"PUT",
"DELETE",
"POST"
],
"en": [
"GET",
"PUT",
"DELETE",
"POST"
]
},
"answer": 3,
"exp": {
"id": "Memanggil POST berulang bisa membuat banyak resource. GET, PUT, DELETE menghasilkan keadaan akhir yang sama bila diulang.",
"en": "Repeating POST can create multiple resources. GET, PUT, DELETE leave the same final state when repeated."
}
},
{
"id": "api-008",
"topic": "rest-api",
"level": 2,
"type": "short",
"q": {
"id": "Jelaskan perbedaan PUT dan PATCH.",
"en": "Explain the difference between PUT and PATCH."
},
"model": {
"id": "PUT mengganti resource secara penuh (semua field dikirim). PATCH hanya mengubah sebagian field.",
"en": "PUT replaces the entire resource (all fields sent). PATCH modifies only some fields."
},
"keywords": [
[
"put"
],
[
"patch"
],
[
"full",
"penuh",
"seluruh",
"entire",
"replace",
"ganti",
"semua",
"whole"
],
[
"partial",
"sebagian",
"some",
"beberapa"
]
],
"pass": 0.75
},
{
"id": "api-009",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "204 No Content berarti...",
"en": "204 No Content means..."
},
"options": {
"id": [
"Request gagal karena ada kesalahan pada sisi client",
"Request sukses dan tidak ada body di response",
"Resource dipindahkan permanen ke URL lain dan client perlu mengikuti",
"Server sedang sibuk dan client diminta mencoba lagi nanti"
],
"en": [
"The request failed because of an error on the client side",
"The request succeeded and the response has no body",
"The resource moved permanently to another URL and the client should follow it",
"The server is busy and the client is asked to try again later"
]
},
"answer": 1,
"exp": {
"id": "Sering dipakai untuk DELETE atau PUT yang sukses tanpa perlu mengembalikan data.",
"en": "Often used for a successful DELETE or PUT that does not need to return data."
}
},
{
"id": "api-010",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Register dengan format email tidak valid (mis. \"abc@\"). Status code yang paling umum?",
"en": "Registering with an invalid email format (e.g. \"abc@\"). The most common status code?"
},
"options": {
"id": [
"200 OK",
"400 Bad Request",
"401 Unauthorized",
"500 Internal Server Error"
],
"en": [
"200 OK",
"400 Bad Request",
"401 Unauthorized",
"500 Internal Server Error"
]
},
"answer": 1,
"exp": {
"id": "Input tidak valid = 400 (sebagian API memakai 422 Unprocessable Entity). Tidak boleh 500 karena itu kesalahan client, bukan server.",
"en": "Invalid input = 400 (some APIs use 422 Unprocessable Entity). Not 500, since it is a client error, not a server error."
}
},
{
"id": "api-011",
"topic": "rest-api",
"level": 3,
"type": "short",
"q": {
"id": "Mengapa banyak API memberi pesan yang sama untuk \"email tidak ditemukan\" dan \"password salah\"?",
"en": "Why do many APIs return the same message for \"email not found\" and \"wrong password\"?"
},
"model": {
"id": "Untuk mencegah user enumeration: penyerang tidak bisa mengetahui email mana yang terdaftar.",
"en": "To prevent user enumeration: attackers cannot learn which emails are registered."
},
"keywords": [
[
"enumeration",
"enumerasi",
"enumerate",
"terdaftar",
"registered",
"exist",
"ada"
],
[
"attack",
"penyerang",
"security",
"keamanan",
"hacker",
"brute"
]
],
"pass": 0.5
},
{
"id": "api-012",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Header yang menyatakan body response berformat JSON adalah...",
"en": "The header that states the response body is JSON is..."
},
"options": {
"id": [
"Accept-Language: json",
"Content-Type: application/json",
"Authorization: json",
"Cache-Control: json"
],
"en": [
"Accept-Language: json",
"Content-Type: application/json",
"Authorization: json",
"Cache-Control: json"
]
},
"answer": 1,
"exp": {
"id": "Content-Type menjelaskan format body. Accept dipakai client untuk meminta format tertentu.",
"en": "Content-Type describes the body format. Accept is used by the client to request a format."
}
},
{
"id": "api-013",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Kelompok status code 5xx menunjukkan...",
"en": "The 5xx status code family indicates..."
},
"options": {
"id": [
"Sukses",
"Redirect",
"Kesalahan client",
"Kesalahan server"
],
"en": [
"Success",
"Redirect",
"Client error",
"Server error"
]
},
"answer": 3,
"exp": {
"id": "2xx sukses, 3xx redirect, 4xx kesalahan client, 5xx kesalahan server.",
"en": "2xx success, 3xx redirect, 4xx client error, 5xx server error."
}
},
{
"id": "api-014",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Client terlalu sering memanggil API dan terkena rate limit. Status code-nya?",
"en": "A client calls the API too often and is rate limited. The status code is..."
},
"options": {
"id": [
"408",
"429",
"423",
"503"
],
"en": [
"408",
"429",
"423",
"503"
]
},
"answer": 1,
"exp": {
"id": "429 Too Many Requests, sering disertai header Retry-After.",
"en": "429 Too Many Requests, often with a Retry-After header."
}
},
{
"id": "api-015",
"topic": "rest-api",
"level": 1,
"type": "tf",
"q": {
"id": "GET adalah safe method: tidak seharusnya mengubah data di server.",
"en": "GET is a safe method: it should not change data on the server."
},
"answer": true,
"exp": {
"id": "Safe artinya read-only. GET, HEAD, OPTIONS termasuk safe.",
"en": "Safe means read-only. GET, HEAD, OPTIONS are safe."
}
},
{
"id": "api-016",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Register dengan email yang sudah dipakai. Status code yang paling sering dipakai?",
"en": "Registering with an email that already exists. The most commonly used status code?"
},
"options": {
"id": [
"409 Conflict",
"404 Not Found",
"401 Unauthorized",
"204 No Content"
],
"en": [
"409 Conflict",
"404 Not Found",
"401 Unauthorized",
"204 No Content"
]
},
"answer": 0,
"exp": {
"id": "409 Conflict untuk konflik dengan state resource. Sebagian API memakai 400 atau 422, sebutkan trade-off-nya.",
"en": "409 Conflict for a clash with resource state. Some APIs use 400 or 422; mention the trade-off."
}
},
{
"id": "api-017",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Perbedaan 401 dan 403 yang benar adalah...",
"en": "The correct difference between 401 and 403 is..."
},
"options": {
"id": [
"Sama saja; keduanya berarti user tidak boleh mengakses resource itu",
"401 = belum terautentikasi/token invalid; 403 = terautentikasi tapi tidak berhak",
"401 = server error di sisi backend; 403 = client error karena permintaan salah format",
"401 = resource tidak ada di server; 403 = resource ada tetapi sedang dipindahkan"
],
"en": [
"The same; both mean the user may not access that resource",
"401 = unauthenticated/invalid token; 403 = authenticated but not permitted",
"401 = server error on the backend; 403 = client error because the request was malformed",
"401 = resource missing on the server; 403 = resource exists but is being relocated"
]
},
"answer": 1,
"exp": {
"id": "Nama 401 \"Unauthorized\" menyesatkan; maknanya unauthenticated.",
"en": "The name 401 \"Unauthorized\" is misleading; it really means unauthenticated."
}
},
{
"id": "api-018",
"topic": "rest-api",
"level": 1,
"type": "short",
"q": {
"id": "Sebutkan tiga bagian utama HTTP response.",
"en": "Name the three main parts of an HTTP response."
},
"model": {
"id": "Status line (status code), headers, dan body.",
"en": "Status line (status code), headers, and body."
},
"keywords": [
[
"status"
],
[
"header"
],
[
"body"
]
],
"pass": 1
},
{
"id": "api-019",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Cancel order yang riwayatnya tetap harus tersimpan. Desain yang paling masuk akal?",
"en": "Cancelling an order whose history must be kept. The most sensible design?"
},
"options": {
"id": [
"DELETE /orders/{id}, karena pembatalan berarti pesanan dihapus dari sistem",
"PATCH /orders/{id} dengan status=cancelled, atau POST /orders/{id}/cancel",
"GET /orders/{id}/cancel, karena cukup membuka URL pembatalan dari browser",
"PUT /orders tanpa id, dengan seluruh daftar pesanan sebagai body request"
],
"en": [
"DELETE /orders/{id}, since cancelling means the order is removed from the system",
"PATCH /orders/{id} with status=cancelled, or POST /orders/{id}/cancel",
"GET /orders/{id}/cancel, since just opening the cancel URL in a browser is enough",
"PUT /orders without an id, with the whole list of orders as the request body"
]
},
"answer": 1,
"exp": {
"id": "Cancel adalah perubahan status, bukan penghapusan data. DELETE hanya jika order memang dihapus dari sistem. GET tidak boleh mengubah state.",
"en": "Cancel is a status change, not data deletion. Use DELETE only if the order is truly removed. GET must not change state."
}
},
{
"id": "api-020",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Server sedang maintenance atau kelebihan load. Status code yang tepat?",
"en": "The server is under maintenance or overloaded. The correct status code?"
},
"options": {
"id": [
"503 Service Unavailable",
"400 Bad Request",
"404 Not Found",
"201 Created"
],
"en": [
"503 Service Unavailable",
"400 Bad Request",
"404 Not Found",
"201 Created"
]
},
"answer": 0,
"exp": {
"id": "503 menandakan layanan sementara tidak tersedia. 502 berarti gateway menerima response buruk dari upstream.",
"en": "503 means temporarily unavailable. 502 means a gateway got a bad response from upstream."
}
},
{
"id": "api-021",
"topic": "rest-api",
"level": 2,
"type": "short",
"q": {
"id": "Apa saja yang perlu diverifikasi pada response API saat testing?",
"en": "What should you verify in an API response when testing?"
},
"model": {
"id": "Status code, body (data dan schema), headers, dan response time.",
"en": "Status code, body (data and schema), headers, and response time."
},
"keywords": [
[
"status code",
"kode status",
"status"
],
[
"body",
"schema",
"payload",
"data"
],
[
"header"
],
[
"time",
"waktu",
"latency",
"performa",
"performance"
]
],
"pass": 0.5
},
{
"id": "api-022",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Format header untuk mengirim bearer token adalah...",
"en": "The header format for sending a bearer token is..."
},
"options": {
"id": [
"Authorization: Bearer <token>",
"Token: <token>",
"Content-Type: Bearer",
"Bearer: <token>"
],
"en": [
"Authorization: Bearer <token>",
"Token: <token>",
"Content-Type: Bearer",
"Bearer: <token>"
]
},
"answer": 0,
"exp": {
"id": "Standar OAuth 2.0 / JWT memakai header Authorization dengan skema Bearer.",
"en": "OAuth 2.0 / JWT standard uses the Authorization header with the Bearer scheme."
}
},
{
"id": "api-023",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Di Postman, assertion untuk memastikan status code 200 adalah...",
"en": "In Postman, the assertion to verify status code 200 is..."
},
"options": {
"id": [
"pm.response.to.have.status(200)",
"pm.status == 200",
"assert.status(200)",
"pm.check(200)"
],
"en": [
"pm.response.to.have.status(200)",
"pm.status == 200",
"assert.status(200)",
"pm.check(200)"
]
},
"answer": 0,
"exp": {
"id": "Dibungkus dalam pm.test(\"nama\", function(){ ... }).",
"en": "Wrapped inside pm.test(\"name\", function(){ ... })."
}
},
{
"id": "api-024",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Di Postman, cara membaca body JSON response adalah...",
"en": "In Postman, the way to read the JSON response body is..."
},
"options": {
"id": [
"pm.response.json()",
"pm.body.parse()",
"response.getJson()",
"pm.json()"
],
"en": [
"pm.response.json()",
"pm.body.parse()",
"response.getJson()",
"pm.json()"
]
},
"answer": 0,
"exp": {
"id": "Contoh: pm.expect(pm.response.json().data.id).to.eql(101).",
"en": "Example: pm.expect(pm.response.json().data.id).to.eql(101)."
}
},
{
"id": "api-025",
"topic": "rest-api",
"level": 1,
"type": "short",
"q": {
"id": "Apa itu REST API?",
"en": "What is a REST API?"
},
"model": {
"id": "Gaya arsitektur API berbasis HTTP yang memodelkan data sebagai resource, bersifat stateless.",
"en": "An HTTP-based API architectural style that models data as resources and is stateless."
},
"keywords": [
[
"stateless",
"tanpa state"
],
[
"resource",
"sumber daya"
],
[
"http"
]
],
"pass": 0.6
},
{
"id": "api-026",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Pada GET /users/5, angka 5 adalah...",
"en": "In GET /users/5, the number 5 is a..."
},
"options": {
"id": [
"Path parameter",
"Query parameter",
"Header",
"Cookie"
],
"en": [
"Path parameter",
"Query parameter",
"Header",
"Cookie"
]
},
"answer": 0,
"exp": {
"id": "Query parameter ditulis setelah ?, misalnya /users?page=5.",
"en": "A query parameter comes after ?, e.g. /users?page=5."
}
},
{
"id": "api-027",
"topic": "rest-api",
"level": 1,
"type": "mcq",
"q": {
"id": "Memanggil endpoint yang dilindungi tanpa token. Hasil yang diharapkan?",
"en": "Calling a protected endpoint without a token. The expected result?"
},
"options": {
"id": [
"200",
"401",
"404",
"201"
],
"en": [
"200",
"401",
"404",
"201"
]
},
"answer": 1,
"exp": {
"id": "Tanpa autentikasi = 401. Ini test case negatif wajib untuk endpoint terproteksi.",
"en": "No authentication = 401. A mandatory negative test for protected endpoints."
}
},
{
"id": "api-028",
"topic": "rest-api",
"level": 2,
"type": "mcq",
"q": {
"id": "Email tidak terdaftar saat login. Praktik yang aman dan umum?",
"en": "Email not registered on login. A safe and common practice?"
},
"options": {
"id": [
"401 dengan pesan generik \"Email atau password salah\"",
"200 dengan pesan \"Email tidak terdaftar di sistem kami\" agar user segera mendaftar",
"500 Internal Server Error karena data akun yang dicari tidak ditemukan di database",
"403 dengan menyebutkan nama user yang ditemukan agar user tahu akun mana yang benar"
],
"en": [
"401 with a generic message \"Email or password is incorrect\"",
"200 with the message \"Email is not registered in our system\" so users sign up right away",
"500 Internal Server Error because the requested account data was not found in the database",
"403 naming the user that was found so people know which account is the right one"
]
},
"answer": 0,
"exp": {
"id": "Pesan generik mencegah user enumeration. Sebagian API memakai 404; ikuti spesifikasi dan sebutkan trade-off.",
"en": "A generic message prevents user enumeration. Some APIs use 404; follow the spec and mention the trade-off."
}
},
{
"id": "sel-001",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Import Python yang benar untuk class By di Selenium 4:",
"en": "The correct Python import for the By class in Selenium 4:"
},
"options": {
"id": [
"from selenium.webdriver.common.by import By",
"from selenium import By",
"import selenium.by",
"from selenium.webdriver.by import By"
],
"en": [
"from selenium.webdriver.common.by import By",
"from selenium import By",
"import selenium.by",
"from selenium.webdriver.by import By"
]
},
"answer": 0,
"exp": {
"id": "By berada di modul selenium.webdriver.common.by.",
"en": "By lives in selenium.webdriver.common.by."
}
},
{
"id": "sel-002",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Import Python yang benar untuk WebDriverWait:",
"en": "The correct Python import for WebDriverWait:"
},
"options": {
"id": [
"from selenium.webdriver.support.ui import WebDriverWait",
"from selenium.webdriver.wait import WebDriverWait",
"from selenium import WebDriverWait",
"from selenium.support import WebDriverWait"
],
"en": [
"from selenium.webdriver.support.ui import WebDriverWait",
"from selenium.webdriver.wait import WebDriverWait",
"from selenium import WebDriverWait",
"from selenium.support import WebDriverWait"
]
},
"answer": 0,
"exp": {
"id": "Select juga diimpor dari modul yang sama (support.ui).",
"en": "Select is imported from the same module (support.ui)."
}
},
{
"id": "sel-003",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Import yang benar untuk expected conditions (Python):",
"en": "The correct import for expected conditions (Python):"
},
"options": {
"id": [
"from selenium.webdriver.support import expected_conditions as EC",
"from selenium import expected_conditions",
"import EC from selenium",
"from selenium.conditions import EC"
],
"en": [
"from selenium.webdriver.support import expected_conditions as EC",
"from selenium import expected_conditions",
"import EC from selenium",
"from selenium.conditions import EC"
]
},
"answer": 0,
"exp": {
"id": "Alias EC adalah konvensi umum.",
"en": "The EC alias is a common convention."
}
},
{
"id": "sel-004",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Cara mencari elemen berdasarkan id di Selenium 4 (Python):",
"en": "How to find an element by id in Selenium 4 (Python):"
},
"options": {
"id": [
"driver.find_element(By.ID, \"login\")",
"driver.find_element_by_id(\"login\")",
"driver.findById(\"login\")",
"driver.get_element(\"login\")"
],
"en": [
"driver.find_element(By.ID, \"login\")",
"driver.find_element_by_id(\"login\")",
"driver.findById(\"login\")",
"driver.get_element(\"login\")"
]
},
"answer": 0,
"exp": {
"id": "Sintaks find_element_by_* sudah dihapus di Selenium 4.",
"en": "The find_element_by_* syntax was removed in Selenium 4."
}
},
{
"id": "sel-005",
"topic": "selenium",
"level": 1,
"type": "tf",
"q": {
"id": "find_element_by_id masih valid dan direkomendasikan di Selenium 4.",
"en": "find_element_by_id is still valid and recommended in Selenium 4."
},
"answer": false,
"exp": {
"id": "Sudah dihapus. Pakai find_element(By.ID, ...).",
"en": "It was removed. Use find_element(By.ID, ...)."
}
},
{
"id": "sel-006",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Argumen untuk menjalankan Chrome headless di Selenium 4:",
"en": "The argument to run Chrome headless in Selenium 4:"
},
"options": {
"id": [
"options.add_argument(\"--headless=new\")",
"options.headless()",
"options.add_argument(\"headless:true\")",
"options.set_mode(\"hidden\")"
],
"en": [
"options.add_argument(\"--headless=new\")",
"options.headless()",
"options.add_argument(\"headless:true\")",
"options.set_mode(\"hidden\")"
]
},
"answer": 0,
"exp": {
"id": "Mode headless baru dipakai lewat --headless=new (versi lama: --headless).",
"en": "The new headless mode uses --headless=new (older: --headless)."
}
},
{
"id": "sel-007",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Import class Options untuk Chrome (Python):",
"en": "Importing the Options class for Chrome (Python):"
},
"options": {
"id": [
"from selenium.webdriver.chrome.options import Options",
"from selenium.options import ChromeOptions",
"from selenium import Options",
"from selenium.webdriver import chrome_options"
],
"en": [
"from selenium.webdriver.chrome.options import Options",
"from selenium.options import ChromeOptions",
"from selenium import Options",
"from selenium.webdriver import chrome_options"
]
},
"answer": 0,
"exp": {
"id": "Untuk Firefox: selenium.webdriver.firefox.options.",
"en": "For Firefox: selenium.webdriver.firefox.options."
}
},
{
"id": "sel-008",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Port default Selenium Grid / Standalone Server:",
"en": "Default port of Selenium Grid / Standalone Server:"
},
"options": {
"id": [
"4444",
"9515",
"9222",
"4723"
],
"en": [
"4444",
"9515",
"9222",
"4723"
]
},
"answer": 0,
"exp": {
"id": "4444 Selenium Grid; 9515 ChromeDriver; 9222 Chrome remote debugging; 4723 Appium.",
"en": "4444 Selenium Grid; 9515 ChromeDriver; 9222 Chrome remote debugging; 4723 Appium."
}
},
{
"id": "sel-009",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Port default ChromeDriver:",
"en": "Default ChromeDriver port:"
},
"options": {
"id": [
"9515",
"4444",
"8080",
"9222"
],
"en": [
"9515",
"4444",
"8080",
"9222"
]
},
"answer": 0,
"exp": {
"id": "Dapat diubah lewat Service(port=...).",
"en": "Can be changed via Service(port=...)."
}
},
{
"id": "sel-010",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Argumen Chrome untuk membuka remote debugging port:",
"en": "The Chrome argument to open a remote debugging port:"
},
"options": {
"id": [
"--remote-debugging-port=9222",
"--debug-port=4444",
"--selenium-port=9515",
"--grid=4444"
],
"en": [
"--remote-debugging-port=9222",
"--debug-port=4444",
"--selenium-port=9515",
"--grid=4444"
]
},
"answer": 0,
"exp": {
"id": "Berguna untuk attach ke browser yang sudah berjalan lewat debuggerAddress.",
"en": "Useful for attaching to an already running browser via debuggerAddress."
}
},
{
"id": "sel-011",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Beda explicit wait dan implicit wait yang benar:",
"en": "The correct difference between explicit and implicit wait:"
},
"options": {
"id": [
"Implicit berlaku global untuk pencarian elemen; explicit menunggu kondisi tertentu pada elemen tertentu",
"Keduanya sama persis, hanya berbeda nama method pada binding bahasa yang dipakai",
"Explicit berlaku global untuk semua elemen; implicit hanya untuk satu elemen tertentu",
"Implicit hanya dipakai untuk menangani alert dan dialog JavaScript pada halaman"
],
"en": [
"Implicit applies globally to element lookups; explicit waits for a specific condition on a specific element",
"They are exactly the same, differing only in method name across language bindings",
"Explicit applies globally to all elements; implicit is only for one specific element",
"Implicit is used only to handle alerts and JavaScript dialogs on the page"
]
},
"answer": 0,
"exp": {
"id": "Hindari mencampur implicit dan explicit karena bisa menghasilkan waktu tunggu tak terduga.",
"en": "Avoid mixing implicit and explicit waits; it can cause unpredictable timeouts."
}
},
{
"id": "sel-012",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Mengapa time.sleep() sebaiknya dihindari?",
"en": "Why should time.sleep() be avoided?"
},
"options": {
"id": [
"Menunggu waktu tetap: lambat jika elemen cepat siap, dan bisa gagal jika lebih lambat",
"Tidak bisa dipakai di Python karena hanya tersedia pada binding Java",
"Menghapus cookie dan sesi browser setiap kali sebelum menunggu elemen",
"Menutup browser lalu membukanya lagi sampai elemen akhirnya muncul"
],
"en": [
"Fixed wait: slow if the element is ready early, and can fail if it is slower",
"Cannot be used in Python because it only exists in the Java bindings",
"Deletes cookies and the browser session each time before waiting for the element",
"Closes the browser and reopens it until the element finally appears"
]
},
"answer": 0,
"exp": {
"id": "Gunakan WebDriverWait dengan expected condition.",
"en": "Use WebDriverWait with an expected condition."
}
},
{
"id": "sel-013",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Memilih opsi dropdown <select> berdasarkan teks yang tampil:",
"en": "Selecting a <select> dropdown option by visible text:"
},
"options": {
"id": [
"Select(el).select_by_visible_text(\"Indonesia\")",
"el.click(\"Indonesia\")",
"el.select(\"Indonesia\")",
"Select(el).choose(\"Indonesia\")"
],
"en": [
"Select(el).select_by_visible_text(\"Indonesia\")",
"el.click(\"Indonesia\")",
"el.select(\"Indonesia\")",
"Select(el).choose(\"Indonesia\")"
]
},
"answer": 0,
"exp": {
"id": "Tersedia juga select_by_value dan select_by_index. Hanya untuk elemen <select> asli.",
"en": "Also select_by_value and select_by_index. Only for real <select> elements."
}
},
{
"id": "sel-014",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Berpindah ke iframe lalu kembali ke halaman utama:",
"en": "Switching into an iframe and back to the main page:"
},
"options": {
"id": [
"driver.switch_to.frame(x) lalu driver.switch_to.default_content()",
"driver.frame(x) lalu driver.back()",
"driver.switch_to.iframe(x) lalu driver.parent()",
"driver.enter(x) lalu driver.exit()"
],
"en": [
"driver.switch_to.frame(x) then driver.switch_to.default_content()",
"driver.frame(x) then driver.back()",
"driver.switch_to.iframe(x) then driver.parent()",
"driver.enter(x) then driver.exit()"
]
},
"answer": 0,
"exp": {
"id": "Elemen di dalam iframe tidak bisa dijangkau sebelum berpindah konteks.",
"en": "Elements inside an iframe are unreachable until you switch context."
}
},
{
"id": "sel-015",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Menerima (OK) JavaScript alert:",
"en": "Accepting (OK) a JavaScript alert:"
},
"options": {
"id": [
"driver.switch_to.alert.accept()",
"driver.alert.ok()",
"driver.accept_alert()",
"driver.find_element(By.ID,\"ok\").click()"
],
"en": [
"driver.switch_to.alert.accept()",
"driver.alert.ok()",
"driver.accept_alert()",
"driver.find_element(By.ID,\"ok\").click()"
]
},
"answer": 0,
"exp": {
"id": "Gunakan dismiss() untuk Cancel, text untuk membaca pesan, send_keys untuk prompt.",
"en": "Use dismiss() for Cancel, text to read the message, send_keys for prompts."
}
},
{
"id": "sel-016",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Berpindah ke tab/jendela baru yang baru saja dibuka:",
"en": "Switching to a newly opened tab/window:"
},
"options": {
"id": [
"driver.switch_to.window(driver.window_handles[-1])",
"driver.switch_to.tab(1)",
"driver.next_window()",
"driver.window_handles.switch()"
],
"en": [
"driver.switch_to.window(driver.window_handles[-1])",
"driver.switch_to.tab(1)",
"driver.next_window()",
"driver.window_handles.switch()"
]
},
"answer": 0,
"exp": {
"id": "Simpan handle awal supaya bisa kembali.",
"en": "Store the original handle so you can switch back."
}
},
{
"id": "sel-017",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "ElementClickInterceptedException biasanya disebabkan oleh...",
"en": "ElementClickInterceptedException is typically caused by..."
},
"options": {
"id": [
"Elemen lain (overlay/modal/loader) menutupi elemen target",
"Elemen target belum ada di DOM sehingga tidak bisa ditemukan oleh locator mana pun",
"Driver browser belum terpasang atau versinya tidak cocok dengan versi browser",
"Port server driver salah sehingga perintah tidak pernah sampai ke browser"
],
"en": [
"Another element (overlay/modal/loader) covers the target element",
"The target element is not in the DOM yet so no locator can find it",
"The browser driver is not installed or its version does not match the browser",
"The driver server port is wrong so the command never reaches the browser"
]
},
"answer": 0,
"exp": {
"id": "Tunggu overlay hilang (invisibility_of_element_located) atau scroll ke elemen.",
"en": "Wait for the overlay to disappear (invisibility_of_element_located) or scroll to the element."
}
},
{
"id": "sel-018",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "StaleElementReferenceException terjadi ketika...",
"en": "StaleElementReferenceException occurs when..."
},
"options": {
"id": [
"Elemen yang direferensikan sudah tidak valid karena DOM berubah atau di-refresh",
"Locator salah ketik sehingga Selenium tidak menemukan elemen sama sekali",
"Browser yang dipakai tidak mendukung versi WebDriver yang terpasang saat ini",
"Timeout koneksi ke server driver sebelum perintah sempat dijalankan"
],
"en": [
"The referenced element is no longer valid because the DOM changed or refreshed",
"The locator has a typo so Selenium finds no element at all",
"The browser in use does not support the installed WebDriver version",
"A connection timeout to the driver server before the command could run"
]
},
"answer": 0,
"exp": {
"id": "Solusi: cari ulang elemen setelah DOM berubah.",
"en": "Fix: re-locate the element after the DOM changes."
}
},
{
"id": "sel-019",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "NoSuchElementException berarti...",
"en": "NoSuchElementException means..."
},
"options": {
"id": [
"Elemen tidak ditemukan dengan locator itu saat pencarian",
"Elemen ditemukan tetapi tidak bisa diklik karena tertutup elemen lain di atasnya",
"Alert yang ditunggu tidak muncul dalam batas waktu yang ditentukan oleh test",
"Driver crash di tengah sesi sehingga seluruh perintah berikutnya ikut gagal"
],
"en": [
"The element was not found with that locator at lookup time",
"The element was found but cannot be clicked because another element covers it",
"The alert being waited for did not appear within the time limit set by the test",
"The driver crashed mid-session so all following commands failed as well"
]
},
"answer": 0,
"exp": {
"id": "Penyebab umum: locator salah, elemen belum muncul (butuh wait), atau berada di iframe.",
"en": "Common causes: wrong locator, element not yet present (needs wait), or inside an iframe."
}
},
{
"id": "sel-020",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Import ChromeOptions di Java:",
"en": "Importing ChromeOptions in Java:"
},
"options": {
"id": [
"org.openqa.selenium.chrome.ChromeOptions",
"org.selenium.chrome.Options",
"selenium.chrome.ChromeOptions",
"org.openqa.selenium.ChromeOptions"
],
"en": [
"org.openqa.selenium.chrome.ChromeOptions",
"org.selenium.chrome.Options",
"selenium.chrome.ChromeOptions",
"org.openqa.selenium.ChromeOptions"
]
},
"answer": 0,
"exp": {
"id": "Package dasar: org.openqa.selenium.",
"en": "Base package: org.openqa.selenium."
}
},
{
"id": "sel-021",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Membuat WebDriverWait di Selenium 4 (Java):",
"en": "Creating a WebDriverWait in Selenium 4 (Java):"
},
"options": {
"id": [
"new WebDriverWait(driver, Duration.ofSeconds(10))",
"new WebDriverWait(driver, 10)",
"WebDriverWait.create(driver,10)",
"new Wait(driver, 10s)"
],
"en": [
"new WebDriverWait(driver, Duration.ofSeconds(10))",
"new WebDriverWait(driver, 10)",
"WebDriverWait.create(driver,10)",
"new Wait(driver, 10s)"
]
},
"answer": 0,
"exp": {
"id": "Selenium 4 memakai java.time.Duration; konstruktor dengan int sudah deprecated/dihapus.",
"en": "Selenium 4 uses java.time.Duration; the int constructor is deprecated/removed."
}
},
{
"id": "sel-022",
"topic": "selenium",
"level": 3,
"type": "mcq",
"q": {
"id": "Menghubungkan test ke Selenium Grid di localhost:4444 (Python):",
"en": "Connecting a test to Selenium Grid at localhost:4444 (Python):"
},
"options": {
"id": [
"webdriver.Remote(command_executor=\"http://localhost:4444\", options=options)",
"webdriver.Grid(\"localhost:4444\")",
"webdriver.Chrome(port=4444)",
"webdriver.Connect(\"4444\")"
],
"en": [
"webdriver.Remote(command_executor=\"http://localhost:4444\", options=options)",
"webdriver.Grid(\"localhost:4444\")",
"webdriver.Chrome(port=4444)",
"webdriver.Connect(\"4444\")"
]
},
"answer": 0,
"exp": {
"id": "Remote WebDriver dipakai untuk Grid dan cloud (BrowserStack dsb.).",
"en": "Remote WebDriver is used for Grid and cloud providers (BrowserStack etc.)."
}
},
{
"id": "sel-023",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Perbedaan driver.close() dan driver.quit():",
"en": "Difference between driver.close() and driver.quit():"
},
"options": {
"id": [
"close menutup jendela aktif; quit mengakhiri sesi dan semua jendela",
"Keduanya sama saja dan bisa dipakai bergantian tanpa perbedaan hasil pada sesi driver",
"close mengakhiri seluruh sesi dan semua jendela, sedangkan quit hanya menutup satu tab",
"quit hanya membersihkan cache dan cookie browser tanpa menutup jendela apa pun"
],
"en": [
"close closes the current window; quit ends the session and all windows",
"They are the same and can be used interchangeably with no difference to the driver session",
"close ends the whole session and all windows, while quit only closes one tab",
"quit only clears the browser cache and cookies without closing any window"
]
},
"answer": 0,
"exp": {
"id": "Selalu panggil quit() di teardown agar proses driver tidak menggantung.",
"en": "Always call quit() in teardown so driver processes do not linger."
}
},
{
"id": "sel-024",
"topic": "selenium",
"level": 2,
"type": "short",
"q": {
"id": "Jelaskan Page Object Model (POM) dan manfaatnya.",
"en": "Explain the Page Object Model (POM) and its benefits."
},
"model": {
"id": "POM memodelkan tiap halaman sebagai class yang menyimpan locator dan aksinya, dipisahkan dari test, sehingga mengurangi duplikasi dan mempermudah maintenance.",
"en": "POM models each page as a class holding its locators and actions, separate from tests, reducing duplication and easing maintenance."
},
"keywords": [
[
"page",
"halaman"
],
[
"class",
"kelas"
],
[
"locator",
"elemen",
"element"
],
[
"reuse",
"reusable",
"maintain",
"pemeliharaan",
"perawatan",
"duplikasi",
"duplication",
"dipakai ulang"
]
],
"pass": 0.75
},
{
"id": "sel-025",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Locator yang umumnya paling stabil dan cepat:",
"en": "The locator generally most stable and fast:"
},
"options": {
"id": [
"ID (jika unik)",
"XPath absolut panjang",
"Index elemen",
"Teks yang sering berubah"
],
"en": [
"ID (if unique)",
"A long absolute XPath",
"Element index",
"Frequently changing text"
]
},
"answer": 0,
"exp": {
"id": "Urutan umum: ID > name/data-testid > CSS > XPath relatif. Hindari XPath absolut.",
"en": "General order: ID > name/data-testid > CSS > relative XPath. Avoid absolute XPath."
}
},
{
"id": "sel-026",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Melakukan hover mouse di Selenium (Python):",
"en": "Performing a mouse hover in Selenium (Python):"
},
"options": {
"id": [
"ActionChains(driver).move_to_element(el).perform()",
"el.hover()",
"driver.hover(el)",
"el.mouse_over()"
],
"en": [
"ActionChains(driver).move_to_element(el).perform()",
"el.hover()",
"driver.hover(el)",
"el.mouse_over()"
]
},
"answer": 0,
"exp": {
"id": "Import: from selenium.webdriver.common.action_chains import ActionChains.",
"en": "Import: from selenium.webdriver.common.action_chains import ActionChains."
}
},
{
"id": "sel-027",
"topic": "selenium",
"level": 3,
"type": "mcq",
"q": {
"id": "Klik lewat JavaScript (opsi terakhir) di Python:",
"en": "Clicking via JavaScript (last resort) in Python:"
},
"options": {
"id": [
"driver.execute_script(\"arguments[0].click();\", el)",
"driver.js_click(el)",
"el.run_js(\"click\")",
"driver.script(\"click\", el)"
],
"en": [
"driver.execute_script(\"arguments[0].click();\", el)",
"driver.js_click(el)",
"el.run_js(\"click\")",
"driver.script(\"click\", el)"
]
},
"answer": 0,
"exp": {
"id": "JS click melewati pengecekan visibilitas; bisa menutupi bug UI nyata, jadi pakai seperlunya.",
"en": "A JS click bypasses visibility checks and can hide real UI bugs, so use sparingly."
}
},
{
"id": "sel-028",
"topic": "selenium",
"level": 2,
"type": "mcq",
"q": {
"id": "Selenium Manager (Selenium 4.6+) berfungsi untuk...",
"en": "Selenium Manager (Selenium 4.6+) is used to..."
},
"options": {
"id": [
"Mengunduh dan mengelola browser driver secara otomatis",
"Menjalankan Selenium Grid untuk eksekusi test secara paralel di banyak mesin",
"Membuat laporan hasil test dalam format HTML yang siap dibagikan",
"Merekam video layar selama test berjalan untuk keperluan debugging"
],
"en": [
"Automatically download and manage browser drivers",
"Run Selenium Grid to execute tests in parallel across many machines",
"Generate test result reports in a ready-to-share HTML format",
"Record screen video while tests run for debugging purposes"
]
},
"answer": 0,
"exp": {
"id": "Tidak perlu lagi webdriver-manager atau mengunduh chromedriver manual pada kebanyakan kasus.",
"en": "No need for webdriver-manager or manual chromedriver downloads in most cases."
}
},
{
"id": "sel-029",
"topic": "selenium",
"level": 2,
"type": "short",
"q": {
"id": "Jelaskan perbedaan implicit wait dan explicit wait.",
"en": "Explain the difference between implicit wait and explicit wait."
},
"model": {
"id": "Implicit wait berlaku global untuk semua pencarian elemen. Explicit wait menunggu kondisi tertentu pada elemen tertentu hingga timeout.",
"en": "Implicit wait applies globally to all element lookups. Explicit wait waits for a specific condition on a specific element until timeout."
},
"keywords": [
[
"implicit"
],
[
"explicit"
],
[
"global",
"seluruh",
"semua",
"all"
],
[
"condition",
"kondisi",
"specific",
"tertentu"
]
],
"pass": 0.75
},
{
"id": "sel-030",
"topic": "selenium",
"level": 1,
"type": "mcq",
"q": {
"id": "Mengambil screenshot di Selenium (Python):",
"en": "Taking a screenshot in Selenium (Python):"
},
"options": {
"id": [
"driver.save_screenshot(\"a.png\")",
"driver.capture(\"a.png\")",
"driver.screenshot()",
"driver.snap(\"a.png\")"
],
"en": [
"driver.save_screenshot(\"a.png\")",
"driver.capture(\"a.png\")",
"driver.screenshot()",
"driver.snap(\"a.png\")"
]
},
"answer": 0,
"exp": {
"id": "Lakukan otomatis saat test gagal untuk membantu debugging.",
"en": "Do it automatically on test failure to aid debugging."
}
},
{
"id": "sel-031",
"topic": "selenium",
"level": 3,
"type": "mcq",
"q": {
"id": "Mengatur ChromeDriver agar berjalan di port tertentu (Python):",
"en": "Making ChromeDriver run on a specific port (Python):"
},
"options": {
"id": [
"Service(port=9516) lalu webdriver.Chrome(service=service)",
"webdriver.Chrome(port=\"9516\")",
"options.port = 9516",
"driver.set_port(9516)"
],
"en": [
"Service(port=9516) then webdriver.Chrome(service=service)",
"webdriver.Chrome(port=\"9516\")",
"options.port = 9516",
"driver.set_port(9516)"
]
},
"answer": 0,
"exp": {
"id": "Import: from selenium.webdriver.chrome.service import Service.",
"en": "Import: from selenium.webdriver.chrome.service import Service."
}
}
];
