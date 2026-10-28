// Dibuat otomatis oleh tools/build-data.py. Jangan diedit; edit file di questions/ lalu jalankan ulang.
window.QA = window.QA || {};
QA.questions = [
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
"Langsung klik tanpa menunggu apa pun",
"Selalu menunggu 30 detik tetap",
"Menunggu networkidle lalu klik"
],
"en": [
"Waits for the element to be visible, stable, enabled and able to receive events (actionability checks)",
"Clicks immediately without waiting",
"Always waits a fixed 30 seconds",
"Waits for networkidle then clicks"
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
"id": "Locator berbasis role, label, atau test id mencerminkan cara pengguna melihat halaman dan jarang patah. Selector posisi dan kelas gaya rapuh terhadap perubahan struktur.",
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
"Web-first assertion mencoba ulang sampai timeout, sedangkan isVisible() hanya membaca sekali sehingga rawan flaky",
"Keduanya identik",
"toBeVisible() lebih cepat karena tidak menunggu",
"isVisible() tidak bisa dipakai di TypeScript"
],
"en": [
"The web-first assertion retries until timeout, while isVisible() reads once and is prone to flakiness",
"They are identical",
"toBeVisible() is faster because it does not wait",
"isVisible() cannot be used in TypeScript"
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
"Cookie, storage, dan sesi terisolasi antar test tanpa perlu membuka browser baru",
"Semua test berbagi login yang sama secara otomatis",
"Test otomatis berjalan berurutan",
"Browser tidak perlu dipasang"
],
"en": [
"Cookies, storage and sessions are isolated between tests without launching a new browser",
"All tests automatically share the same login",
"Tests automatically run sequentially",
"No browser needs to be installed"
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
"Matikan server backend secara manual",
"Ubah kode aplikasi agar melempar error",
"Tidak bisa diuji di Playwright"
],
"en": [
"page.route('**/api/products', route => route.fulfill({ status: 500 }))",
"Shut the backend server down manually",
"Change app code to throw an error",
"It cannot be tested in Playwright"
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
"Command Cypress dijalankan async dalam antrean dan mengembalikan chainable, bukan nilai; gunakan .then() atau alias",
"Karena cy.get hanya mendukung ID kelas",
"Karena Cypress tidak punya fungsi text()",
"Karena harus memakai await"
],
"en": [
"Cypress commands are queued and asynchronous and return a chainable, not a value; use .then() or an alias",
"Because cy.get only supports class IDs",
"Because Cypress has no text() function",
"Because you must use await"
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
"Seluruh test diulang jika gagal tanpa konfigurasi",
"Command yang mengubah state (mis. click) diulang berkali-kali",
"Cypress mengulang test sampai hijau"
],
"en": [
"Queries and assertions are retried automatically until they pass or time out (default 4 seconds)",
"The whole test is rerun on failure without configuration",
"State-changing commands (e.g. click) are retried repeatedly",
"Cypress reruns tests until green"
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
"cy.session() untuk menyimpan dan memulihkan sesi login (login lewat API bila memungkinkan)",
"Login manual lalu jalankan Cypress",
"Nonaktifkan autentikasi di aplikasi",
"Pakai cy.wait(10000) saat login"
],
"en": [
"cy.session() to cache and restore the login session (log in via API where possible)",
"Log in manually and then run Cypress",
"Disable authentication in the app",
"Use cy.wait(10000) when logging in"
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
"Tidak ada batasan apa pun",
"Cypress tidak bisa menguji aplikasi yang memakai SSO",
"Cukup ganti baseUrl di tengah test"
],
"en": [
"Use cy.origin() for commands on another domain; Cypress does not support multiple tabs",
"There is no limitation",
"Cypress cannot test apps that use SSO",
"Just change baseUrl mid-test"
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
"Menyalin test case dan mengganti URL manual",
"Menulis URL langsung di tiap langkah",
"Dua project berbeda"
],
"en": [
"An Execution Profile with global variables (e.g. baseUrl) selected at run time",
"Copying test cases and changing URLs manually",
"Hard-coding the URL in every step",
"Two separate projects"
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
"Menjalankan beberapa test suite sekaligus, mis. di beberapa browser atau profile, secara berurutan atau paralel",
"Menyimpan locator elemen",
"Menyimpan data uji CSV",
"Membuat laporan bug otomatis"
],
"en": [
"Running several test suites together, e.g. across browsers or profiles, sequentially or in parallel",
"Storing element locators",
"Storing CSV test data",
"Creating bug reports automatically"
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
"Menyalin langkah login ke setiap test case",
"Merekam ulang tiap kali",
"Menghapus login dari test"
],
"en": [
"Create a custom keyword (Groovy) or a reusable test case that is called",
"Copy the login steps into every test case",
"Re-record each time",
"Remove login from the tests"
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
"Locator disimpan terpusat sehingga satu perubahan memperbaiki semua test yang memakainya; self-healing dapat memakai locator alternatif",
"Karena membuat test berjalan lebih cepat",
"Karena menghilangkan kebutuhan assertion",
"Karena otomatis menulis data uji"
],
"en": [
"Locators are kept centrally so one change fixes every test using them; self-healing can use alternative locators",
"Because it makes tests run faster",
"Because it removes the need for assertions",
"Because it writes test data automatically"
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
"id": "Query mana yang menemukan pelanggan yang belum pernah membuat pesanan?",
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
"id": "LEFT JOIN mempertahankan semua pelanggan; yang tidak punya pesanan memiliki kolom o.id NULL. NOT EXISTS juga valid. '= NULL' tidak pernah benar.",
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
"Keduanya sama persis",
"WHERE hanya untuk angka; HAVING hanya untuk teks",
"HAVING dijalankan sebelum WHERE"
],
"en": [
"WHERE filters rows before grouping; HAVING filters groups after aggregation",
"They are exactly the same",
"WHERE is for numbers only; HAVING is for text only",
"HAVING runs before WHERE"
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
"Beri ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC), lalu ambil yang bernomor 1",
"SELECT MAX(*) FROM orders",
"ORDER BY created_at lalu LIMIT 1 untuk semua user",
"GROUP BY user_id tanpa fungsi agregat"
],
"en": [
"Use ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC), then keep row number 1",
"SELECT MAX(*) FROM orders",
"ORDER BY created_at then LIMIT 1 for all users",
"GROUP BY user_id without aggregate functions"
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
"Perbandingan dengan NULL menghasilkan UNKNOWN, sehingga baris NULL terlewat; tambahkan OR status IS NULL",
"Operator <> tidak ada di SQL",
"Karena huruf kecil/besar selalu diabaikan",
"Tidak ada masalah"
],
"en": [
"Comparison with NULL yields UNKNOWN, so NULL rows are missed; add OR status IS NULL",
"The <> operator does not exist in SQL",
"Because case is always ignored",
"There is no problem"
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
"id": "Reproduksi dan cari akar masalah: timing/waiting, data uji yang saling mengganggu, lingkungan tidak stabil, atau locator rapuh. Perbaiki dengan wait berbasis kondisi, isolasi data, mock dependensi tak stabil; karantina sementara agar tidak menghalangi pipeline, dan jangan sekadar menambah retry.",
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
"id": "Bagaimana Anda melaporkan risiko rilis kepada stakeholder non-teknis?",
"en": "How do you report release risk to non-technical stakeholders?"
},
"model": {
"id": "Gunakan bahasa dampak bisnis, bukan istilah teknis: apa yang sudah diuji, apa yang belum, defect terbuka beserta tingkat keparahan dan dampak pengguna, serta rekomendasi (rilis, rilis dengan mitigasi, tunda). Sajikan ringkas dengan data seperti status pass/fail dan cakupan area berisiko.",
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
"id": "Situasi: konteks umum fitur dan masalahnya. Tugas: peran saya. Aksi: bagaimana saya mereproduksi, mempersempit penyebab, berkolaborasi dengan developer, dan menambah pengamanan. Hasil: bug diperbaiki dan dampak terukur, mis. regresi yang dicegah atau pelajaran proses.",
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
"Tester melakukan testing (menunjukkan failure); developer melakukan debugging (menemukan dan memperbaiki penyebab)",
"Keduanya melakukan debugging",
"Tester melakukan debugging; developer melakukan testing",
"Menemukan failure dan memperbaiki defect adalah aktivitas yang sama"
],
"en": [
"The tester does testing (showing the failure); the developer does debugging (finding and fixing the cause)",
"Both do debugging",
"The tester does debugging; the developer does testing",
"Finding a failure and fixing a defect are the same activity"
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
"id": "Analis salah memahami aturan diskon (error), sehingga kode memakai rumus yang keliru (defect), dan pelanggan melihat harga salah (failure). Apa root cause paling awal dalam rantai ini?",
"en": "An analyst misunderstood the discount rule (error), so the code used a wrong formula (defect), and a customer saw a wrong price (failure). What is the earliest root cause in this chain?"
},
"options": {
"id": [
"Kesalahpahaman aturan diskon oleh analis",
"Harga salah yang dilihat pelanggan",
"Rumus yang keliru di kode",
"Test case yang kurang"
],
"en": [
"The analyst's misunderstanding of the discount rule",
"The wrong price the customer saw",
"The wrong formula in the code",
"Too few test cases"
]
},
"answer": 0,
"exp": {
"id": "Root cause adalah penyebab awal yang jika dihilangkan mencegah defect: di sini kesalahpahaman (error). Defect ada di kode; failure yang terlihat pengguna.",
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
"id": "Sekitar 70% defect rilis lalu ditemukan di modul pembayaran, sementara modul lain hampir bersih. Prinsip testing mana yang paling menjelaskan ini, dan apa tindakannya?",
"en": "About 70% of the last release's defects were found in the payment module while other modules were almost clean. Which testing principle best explains this, and what follows?"
},
"options": {
"id": [
"Defect clustering: fokuskan lebih banyak testing pada modul pembayaran",
"Absence-of-defects fallacy: berhenti menguji modul lain",
"Testing shows presence of defects: rilis ditunda selamanya",
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
"Test case otomatis ditulis ulang",
"Requirement tidak perlu diuji lagi",
"Defect otomatis diperbaiki"
],
"en": [
"It is immediately visible which test cases must be reviewed or changed (impact analysis)",
"Test cases are rewritten automatically",
"The requirement no longer needs testing",
"Defects are fixed automatically"
]
},
"answer": 0,
"exp": {
"id": "Traceability mendukung analisis dampak perubahan, penilaian cakupan, dan pelaporan status terhadap requirement.",
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
"Keuntungan: sudut pandang berbeda dan bebas bias penulis; risiko: terisolasi dan developer merasa tidak lagi bertanggung jawab atas kualitas",
"Keuntungan: tidak butuh komunikasi; risiko: tidak ada",
"Keuntungan: defect pasti nol; risiko: biaya tool",
"Keuntungan: developer tidak perlu menguji; risiko: tidak ada"
],
"en": [
"Benefit: different perspective and freedom from author bias; risk: isolation, and developers may stop feeling responsible for quality",
"Benefit: no communication needed; risk: none",
"Benefit: zero defects guaranteed; risk: tool cost",
"Benefit: developers need not test; risk: none"
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
"Memberi umpan balik cepat atas perubahan sehingga defect ditemukan segera setelah diperkenalkan",
"Menghilangkan kebutuhan test case",
"Menjamin tidak ada defect di produksi",
"Menggantikan semua testing manual"
],
"en": [
"It gives fast feedback on changes so defects are found soon after introduction",
"It removes the need for test cases",
"It guarantees no defects in production",
"It replaces all manual testing"
]
},
"answer": 0,
"exp": {
"id": "DevOps menekankan umpan balik cepat dan otomasi. Pipeline mengurangi risiko tetapi tidak menjamin bebas defect dan tidak menggantikan eksploratori.",
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
"id": "Di retrospective sprint, tim menemukan banyak test otomasi flaky yang memperlambat rilis. Hasil retrospective yang paling sesuai tujuannya adalah...",
"en": "In a sprint retrospective the team finds many flaky automated tests slowing releases. The outcome that best fits a retrospective's purpose is..."
},
"options": {
"id": [
"Menyepakati tindakan perbaikan proses, mis. stabilisasi test dan aturan karantina, lalu meninjau hasilnya sprint berikutnya",
"Menyalahkan tester yang menulis test",
"Menghapus semua test otomasi",
"Menunda retrospective sampai rilis selesai"
],
"en": [
"Agreeing improvement actions, e.g. stabilising tests and a quarantine rule, and reviewing the result next sprint",
"Blaming the tester who wrote the tests",
"Deleting all automated tests",
"Postponing the retrospective until after release"
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
"id": "Integration testing berfokus pada interaksi antar komponen atau sistem. Component testing menguji satu unit terisolasi; acceptance menilai kesiapan dari sisi bisnis; maintenance testing bukan level, melainkan pengujian saat sistem berubah.",
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
"Mengukur waktu respons dengan 1.000 pengguna bersamaan",
"Memeriksa kemudahan dipelajari antarmuka baru",
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
"id": "Functional testing menilai apa yang dilakukan sistem. Performa, usability, dan keamanan adalah karakteristik non-fungsional.",
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
"id": "Basis data produksi akan dimigrasikan ke platform baru tanpa perubahan fitur. Testing yang tepat?",
"en": "The production database will be migrated to a new platform with no feature change. What testing fits?"
},
"options": {
"id": [
"Maintenance testing: uji migrasi data, lingkungan baru, dan regression untuk memastikan fungsi tetap benar",
"Tidak perlu testing karena fitur tidak berubah",
"Hanya component testing satu fungsi",
"Hanya testing performa setahun setelahnya"
],
"en": [
"Maintenance testing: test data migration, the new environment, and regression to confirm behaviour is unchanged",
"No testing needed since features did not change",
"Only component testing of one function",
"Only performance testing a year later"
]
},
"answer": 0,
"exp": {
"id": "Migrasi adalah pemicu maintenance testing, dengan analisis dampak untuk menentukan cakupan regression.",
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
"Kebocoran memori saat beban tinggi",
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
"id": "Static testing memeriksa work product tanpa menjalankan kode. Masalah runtime seperti memori, performa, dan perangkat butuh dynamic testing.",
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
"Waktu respons lambat pada beban tinggi",
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
"id": "Mulai dari perencanaan, memulai review, review individual, diskusi dan analisis temuan, lalu perbaikan dan pelaporan.",
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
"id": "Review yang dipimpin penulis untuk menjelaskan work product kepada peserta dan mengumpulkan umpan balik, tanpa proses formal ketat, disebut...",
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
"Setelah 5 kali password salah berturut-turut, akun dikunci 15 menit dan pengguna melihat pesan penguncian",
"Login harus aman dan nyaman",
"Sistem harus bagus",
"Developer menulis kode login dengan rapi"
],
"en": [
"After 5 consecutive wrong passwords the account is locked for 15 minutes and the user sees a lock message",
"Login must be secure and pleasant",
"The system must be good",
"The developer writes tidy login code"
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
"Lingkungan test sudah siap dan dapat diakses",
"Data uji sudah tersedia",
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
"id": "Tiga sprint lalu, tim menyelesaikan pengujian 20, 24, dan 22 test case per sprint. Masih ada 66 test case yang harus diuji. Dengan ekstrapolasi dari rata-rata, perkiraan jumlah sprint?",
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
"id": "Q1: component/integration; Q2: functional examples dan story tests; Q3: eksploratori, usability, UAT; Q4: performa, keamanan, dan karakteristik non-fungsional lain.",
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
"Pembulatan salah pada perhitungan cicilan yang merugikan pelanggan",
"Anggota tim kunci pindah di tengah proyek",
"Lingkungan test terlambat tersedia",
"Anggaran tool dipotong"
],
"en": [
"A rounding error in instalment calculation that harms customers",
"A key team member leaves mid-project",
"The test environment arrives late",
"The tool budget is cut"
]
},
"answer": 0,
"exp": {
"id": "Product risk menyangkut kualitas produk; project risk menyangkut manajemen dan kontrol proyek (orang, jadwal, anggaran, lingkungan).",
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
"Gaji tester",
"Warna dashboard",
"Jumlah rapat per bulan"
],
"en": [
"Percentage of planned test cases executed",
"Tester salary",
"Dashboard colour",
"Number of meetings per month"
]
},
"answer": 0,
"exp": {
"id": "Metrik umum: kemajuan eksekusi test, defect ditemukan dan diperbaiki, cakupan requirement atau kode, usaha dan biaya.",
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
"Ringkasan testing, deviasi dari rencana, status terhadap exit criteria, metrik, dan risiko yang tersisa",
"Seluruh log eksekusi mentah",
"Hanya jumlah test lolos tanpa konteks",
"Kode sumber test"
],
"en": [
"A summary of testing, deviations from plan, status against exit criteria, metrics and remaining risks",
"All raw execution logs",
"Only the number of passed tests with no context",
"The test source code"
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
"Mengidentifikasi dan mengendalikan versi testware dan test item agar hasil test dapat ditelusuri ke versi yang diuji",
"Menentukan prioritas bisnis fitur",
"Menulis test case baru",
"Menghitung estimasi usaha"
],
"en": [
"Identifying and controlling versions of testware and test items so results trace back to the version tested",
"Setting business priority of features",
"Writing new test cases",
"Calculating effort estimates"
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
"Memperbaiki defect yang ditemukan di kode",
"Mengevaluasi work product seperti requirement dan desain",
"Men-deploy aplikasi ke produksi",
"Menulis kode fitur baru"
],
"en": [
"Fixing the defects found in code",
"Evaluating work products such as requirements and design",
"Deploying the application to production",
"Writing code for a new feature"
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
"Testing memperbaiki defect, debugging menemukan failure",
"Testing memicu failure akibat defect, debugging menemukan dan memperbaiki penyebabnya",
"Keduanya sama-sama dilakukan tester",
"Debugging hanya dilakukan setelah rilis"
],
"en": [
"Testing fixes defects, debugging finds failures",
"Testing triggers failures caused by defects; debugging finds and fixes their causes",
"Both are always done by testers",
"Debugging is only done after release"
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
"Menjamin sistem bebas defect",
"Mengurangi risiko failure saat sistem beroperasi dengan menemukan defect lebih dulu",
"Menghilangkan kebutuhan review",
"Menggantikan kebutuhan requirement"
],
"en": [
"It guarantees the system is defect-free",
"It reduces the risk of failures in operation by finding defects beforehand",
"It removes the need for reviews",
"It replaces requirements"
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
"Menjamin test case selalu otomatis",
"Menilai coverage requirement oleh tes dan analisis dampak perubahan",
"Menghilangkan perlunya test plan",
"Mempercepat eksekusi tes"
],
"en": [
"It guarantees test cases are always automated",
"Assessing requirement coverage by tests and analysing the impact of changes",
"It removes the need for a test plan",
"It speeds up test execution"
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
"Mendesain test case",
"Menjalankan test case",
"Memantau kemajuan dan mengontrol aktivitas test",
"Menyiapkan data tes"
],
"en": [
"Designing test cases",
"Executing test cases",
"Monitoring progress and controlling test activities",
"Preparing test data"
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
"Mereka menemukan jenis defect yang sama dengan developer",
"Mereka bisa terisolasi dari tim dan developer merasa kualitas bukan tanggung jawabnya",
"Mereka tidak bisa menulis test case",
"Mereka selalu bias"
],
"en": [
"They find the same kinds of defects as developers",
"They may be isolated from the team and developers may feel quality is not their responsibility",
"They cannot write test cases",
"They are always biased"
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
"Hanya tester yang bertanggung jawab atas kualitas",
"Siapa pun dengan keahlian yang dibutuhkan dapat mengerjakan tugas dan seluruh tim bertanggung jawab atas kualitas",
"Semua orang harus menjadi tester bersertifikat",
"Developer dilarang menguji"
],
"en": [
"Only testers are responsible for quality",
"Anyone with the needed skills can do the tasks and the whole team is responsible for quality",
"Everyone must be a certified tester",
"Developers are forbidden from testing"
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
"Testing hanya dimulai setelah rilis",
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
"Menghilangkan semua manual testing",
"Umpan balik cepat atas kualitas lewat pipeline CI/CD yang menjalankan tes otomatis",
"Tidak perlu merawat otomasi",
"Test environment tidak lagi dibutuhkan"
],
"en": [
"It removes all manual testing",
"Fast quality feedback via CI/CD pipelines running automated tests",
"Automation no longer needs maintenance",
"Test environments are no longer needed"
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
"Menunda test sampai tahap akhir",
"Mereview user story dan acceptance criteria sebelum coding dimulai",
"Menambah tester setelah rilis",
"Menghapus static analysis"
],
"en": [
"Postponing tests to the final phase",
"Reviewing user stories and acceptance criteria before coding begins",
"Adding testers after release",
"Removing static analysis"
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
"Sebelum proyek dimulai untuk menentukan jadwal",
"Di akhir proyek atau iterasi untuk membahas keberhasilan dan perbaikan",
"Hanya ketika produksi gagal",
"Untuk menilai kinerja individu"
],
"en": [
"Before the project starts to set the schedule",
"At the end of a project or iteration to discuss successes and improvements",
"Only when production fails",
"To evaluate individual performance"
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
"id": "Pengujian oleh administrator untuk backup/restore dan disaster recovery termasuk...",
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
"id": "Operational acceptance testing menguji kesiapan operasional: backup, recovery, pemeliharaan, keamanan.",
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
"Hanya dilakukan pada acceptance level",
"Didasarkan hanya pada spesifikasi",
"Tidak mengukur coverage"
],
"en": [
"It is based on the internal structure of the system such as code or architecture",
"It is done only at acceptance level",
"It is based only on the specification",
"It does not measure coverage"
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
"id": "Pemindahan aplikasi ke platform atau database baru adalah pemicu maintenance testing berupa...",
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
"id": "Pemicu: modification (perubahan fitur/perbaikan), migration (pindah platform/data), retirement (pensiun sistem).",
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
"Menjamin kode bebas bug",
"Menggantikan dynamic testing",
"Mengukur performa"
],
"en": [
"Finding defects early so they are cheaper to fix",
"Guaranteeing bug-free code",
"Replacing dynamic testing",
"Measuring performance"
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
"Crash saat beban tinggi"
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
"id": "Manfaat umpan balik awal dan sering dari stakeholder adalah...",
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
"id": "Umpan balik dini mengurangi salah paham dan pengerjaan ulang mahal.",
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
"id": "Jenis review mana yang dipimpin author dengan tujuan edukasi dan meminta umpan balik?",
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
"Hasil review dipakai untuk menilai kinerja author",
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
"id": "Tujuan jelas, waktu cukup, potongan kecil, budaya konstruktif. Menilai kinerja author merusak budaya review.",
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
"Memasukkan koin saat Idle",
"Memilih produk saat Ready",
"Memilih produk saat mesin Idle",
"Refund saat Ready"
],
"en": [
"Inserting a coin while Idle",
"Selecting a product while Ready",
"Selecting a product while the machine is Idle",
"Refund while Ready"
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
"Menemukan fungsi yang hilang dari kode",
"Mempertimbangkan seluruh implementasi sehingga defect dapat ditemukan meski spesifikasi kabur",
"Tidak memerlukan akses ke kode",
"Selalu menggantikan black-box"
],
"en": [
"Finding functionality missing from the code",
"Considering the whole implementation so defects can be found even if the specification is vague",
"Needing no access to code",
"Always replacing black-box testing"
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
"Desain dan eksekusi tes dipisah jauh dan didokumentasikan penuh",
"Desain, eksekusi, dan pembelajaran dilakukan bersamaan, dipandu test charter dan sering dibatasi waktu",
"Tes hanya dijalankan oleh tool",
"Hanya dipakai pada unit level"
],
"en": [
"Test design and execution are far apart and fully documented",
"Design, execution and learning happen together, guided by a test charter and often time-boxed",
"Tests are only run by tools",
"Only used at unit level"
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
"Item checklist harus berisi langkah rinci",
"Item checklist bersifat tingkat tinggi dan checklist perlu diperbarui berkala",
"Checklist tidak boleh berasal dari data defect",
"Checklist menggantikan test condition"
],
"en": [
"Checklist items must contain detailed steps",
"Checklist items are high-level and the checklist should be updated regularly",
"A checklist must not come from defect data",
"A checklist replaces test conditions"
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
"id": "Story: \"Sebagai pelanggan, saya ingin ongkir gratis untuk pesanan minimal $50.\" Test case acceptance mana yang diturunkan dengan benar?",
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
"Daftar password pengguna"
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
"Menulis seluruh kode iterasi",
"Membantu membuat user story yang dapat diuji beserta acceptance criteria",
"Menentukan anggaran proyek",
"Menghapus risiko dari backlog"
],
"en": [
"Writing all the iteration's code",
"Helping create testable user stories with acceptance criteria",
"Setting the project budget",
"Removing risks from the backlog"
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
"Semua defect kritis sudah ditutup",
"Test environment siap dan data tes tersedia",
"Coverage target tercapai",
"Laporan akhir sudah dikirim"
],
"en": [
"All critical defects are closed",
"The test environment is ready and test data is available",
"The coverage target is met",
"The final report has been sent"
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
"id": "Semakin ke atas, cakupan lebih luas tetapi tes lebih sedikit, lambat, dan rapuh.",
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
"id": "Q1 component/integration; Q2 fungsional; Q3 exploratory/usability/UAT; Q4 performa dan keamanan.",
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
"id": "Project risk menyangkut jalannya proyek (jadwal, sumber daya, lingkungan). Tiga opsi lain adalah product risk.",
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
"Menentukan cakupan, teknik, dan usaha testing serta prioritas tes",
"Menggantikan semua test case",
"Menghapus test plan",
"Menentukan gaji tester"
],
"en": [
"Decide test scope, techniques and effort, and prioritise tests",
"Replace all test cases",
"Remove the test plan",
"Decide testers' salaries"
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
"Persentase test case yang sudah dijalankan atau lulus",
"Jumlah baris kode",
"Gaji tim",
"Jumlah karyawan"
],
"en": [
"Percentage of test cases executed or passed",
"Lines of code",
"Team salaries",
"Number of employees"
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
"Setiap hari tanpa pengecualian",
"Di akhir proyek, fase, atau iterasi untuk merangkum testing dan penyimpangan dari rencana",
"Sebelum requirement ditulis",
"Hanya jika semua tes gagal"
],
"en": [
"Every day without exception",
"At the end of a project, phase or iteration to summarise testing and deviations from plan",
"Before requirements are written",
"Only if all tests fail"
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
"Memastikan item test dan testware punya identitas unik, terkontrol versinya, dan saling terhubung",
"Menggantikan test plan",
"Menjalankan tes otomatis",
"Menentukan prioritas defect"
],
"en": [
"Ensuring test items and testware are uniquely identified, version controlled and related to each other",
"Replacing the test plan",
"Running automated tests",
"Setting defect priority"
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
"Pencarian rusak",
"Pencarian 'laptop' di halaman produk menghasilkan 0 hasil (harapan: 12). Build 2.4.1, Chrome 120. Langkah: 1) buka /products 2) ketik 'laptop' 3) tekan Enter",
"Developer salah menulis query",
"Tolong cek kenapa tidak jalan"
],
"en": [
"Search is broken",
"Searching 'laptop' on the products page returns 0 results (expected: 12). Build 2.4.1, Chrome 120. Steps: 1) open /products 2) type 'laptop' 3) press Enter",
"Developer wrote a bad query",
"Please check why it does not work"
]
},
"answer": 1,
"exp": {
"id": "Laporan baik memuat langkah reproduksi, expected vs actual, dan lingkungan. Opsi lain samar atau menyalahkan orang.",
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
"id": "Tool yang mendukung manajemen test case, pelacakan requirement, dan pelaporan tergolong...",
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
"Eksekusi lebih konsisten",
"Usaha dan perawatan otomasi yang diremehkan",
"Hemat waktu pada tes berulang",
"Penilaian hasil lebih objektif"
],
"en": [
"More consistent execution",
"Underestimated effort and maintenance of the automation",
"Time saved on repeated tests",
"More objective assessment of results"
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
"Tidak memerlukan perawatan skrip",
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
"Mengurangi testing pada modul itu",
"Menambah testing, memakai tester berpengalaman, dan teknik yang lebih ketat",
"Menghapus modul dari test plan",
"Menunda semua testing ke akhir"
],
"en": [
"Reduce testing on that module",
"Add more testing, assign experienced testers and use stricter techniques",
"Remove the module from the test plan",
"Postpone all testing to the end"
]
},
"answer": 1,
"exp": {
"id": "Risiko tinggi direspons dengan mitigasi: lebih banyak dan lebih ketat testing serta sumber daya yang tepat.",
"en": "High risk is answered with mitigation: more and stricter testing plus the right resources."
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
"id": "Decision table diskon: anggota+kupon = 20%; anggota tanpa kupon = 10%; bukan anggota+kupon = 5%; bukan anggota tanpa kupon = 0%. Pelanggan bukan anggota memakai kupon. Hasil yang diharapkan?",
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
"Membatalkan pesanan saat masih Created",
"Membayar pesanan lalu mengirimnya",
"Memeriksa pesanan Delivered tidak bisa dibayar lagi"
],
"en": [
"Try to cancel while the order is Shipped, then check the request is rejected and the state stays Shipped",
"Cancel an order while it is still Created",
"Pay an order and then ship it",
"Check that a Delivered order cannot be paid again"
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
"id": "Cakupan requirement: T1 = R1,R2,R3; T2 = R3,R4,R6; T3 = R1,R2; T4 = R5. Urutan prioritisasi 'additional coverage' (tiap langkah memilih yang menambah cakupan baru terbanyak)?",
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
"Checkout error, tolong dicek",
"Checkout rusak di build 2.4.1 (Chrome 126, akun uji A). Langkah: tambah 2 item, pakai voucher X, klik Bayar. Aktual: HTTP 500, pesanan tidak terbentuk. Harapan: halaman konfirmasi. Log dan screenshot terlampir",
"Checkout selalu gagal, sangat buruk, harus segera diperbaiki",
"Mungkin voucher bermasalah karena dulu pernah error"
],
"en": [
"Checkout error, please check",
"Checkout broken on build 2.4.1 (Chrome 126, test account A). Steps: add 2 items, apply voucher X, click Pay. Actual: HTTP 500, no order created. Expected: confirmation page. Logs and screenshot attached",
"Checkout always fails, very bad, must be fixed immediately",
"Maybe the voucher is broken because it errored before"
]
},
"answer": 1,
"exp": {
"id": "Laporan yang baik memuat lingkungan/versi, langkah reproduksi, hasil aktual vs harapan, dan bukti. Opsi lain samar, emosional, atau berupa dugaan.",
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
"id": "User story: 'Sebagai pelanggan, saya ingin memakai voucher agar membayar lebih murah.' Acceptance test ATDD mana yang paling baik?",
"en": "User story: 'As a customer, I want to apply a voucher so that I pay less.' Which ATDD acceptance test is best?"
},
"options": {
"id": [
"Voucher harus bekerja dengan baik",
"Given keranjang Rp200.000 dan voucher HEMAT10 (10%, min. Rp100.000), When saya menerapkan voucher, Then total menjadi Rp180.000",
"Developer memeriksa kode fungsi diskon",
"Tampilan voucher harus bagus"
],
"en": [
"The voucher must work well",
"Given a Rp200,000 cart and voucher SAVE10 (10%, min. Rp100,000), When I apply the voucher, Then the total becomes Rp180,000",
"The developer reviews the discount function code",
"The voucher UI must look good"
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
"level": 1,
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
"level": 1,
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
"level": 1,
"type": "mcq",
"q": {
"id": "Defect clustering berarti...",
"en": "Defect clustering means..."
},
"options": {
"id": [
"Bug tersebar merata",
"Sebagian kecil modul memuat sebagian besar defect",
"Defect hanya ada di UI",
"Defect hanya muncul saat produksi"
],
"en": [
"Bugs are evenly spread",
"A small number of modules contain most of the defects",
"Defects only exist in the UI",
"Defects only appear in production"
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
"level": 1,
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
"level": 1,
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
"level": 2,
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
"level": 2,
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
"level": 1,
"type": "mcq",
"q": {
"id": "Smoke testing adalah...",
"en": "Smoke testing is..."
},
"options": {
"id": [
"Pengecekan awal luas dan dangkal untuk memastikan build layak diuji lebih lanjut",
"Pengujian mendalam satu fitur",
"Pengujian performa",
"Pengujian keamanan"
],
"en": [
"A broad, shallow initial check that a build is stable enough for further testing",
"Deep testing of one feature",
"Performance testing",
"Security testing"
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
"level": 1,
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
"level": 1,
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
"level": 3,
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
"level": 1,
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
"level": 1,
"type": "mcq",
"q": {
"id": "Teknik black-box didasarkan pada...",
"en": "Black-box techniques are based on..."
},
"options": {
"id": [
"Struktur kode internal",
"Spesifikasi dan perilaku yang terlihat dari luar",
"Hanya pengalaman",
"Hasil review"
],
"en": [
"Internal code structure",
"Specification and externally observable behaviour",
"Experience only",
"Review results"
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
"level": 1,
"type": "mcq",
"q": {
"id": "Prinsip early testing menyatakan...",
"en": "The early testing principle states..."
},
"options": {
"id": [
"Testing dimulai setelah coding selesai",
"Aktivitas testing dimulai sedini mungkin karena defect lebih murah diperbaiki di awal",
"Testing hanya di akhir sprint",
"Testing tidak perlu requirement"
],
"en": [
"Testing starts after coding is done",
"Testing should start as early as possible because defects are cheaper to fix early",
"Testing happens only at sprint end",
"Testing needs no requirements"
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
"Sistem tanpa defect pasti sukses",
"Sistem tanpa defect tetap gagal jika tidak memenuhi kebutuhan user",
"Tidak ada sistem tanpa defect",
"Bug pasti ditemukan semua"
],
"en": [
"A defect-free system is always a success",
"A defect-free system can still fail if it does not meet user needs",
"No system is defect-free",
"All bugs will be found"
]
},
"answer": 1,
"exp": {
"id": "Bebas bug bukan berarti berguna bagi pengguna.",
"en": "Being bug-free does not mean useful to users."
},
"lo": "FL-1.3.1",
"k": 2
},
{
"id": "istqb-021",
"topic": "istqb",
"level": 1,
"type": "mcq",
"q": {
"id": "Test plan umumnya memuat...",
"en": "A test plan typically contains..."
},
"options": {
"id": [
"Scope, pendekatan, sumber daya, jadwal",
"Hanya daftar bug",
"Hanya kode test",
"Hanya hasil eksekusi"
],
"en": [
"Scope, approach, resources, schedule",
"Only a bug list",
"Only test code",
"Only execution results"
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
"level": 1,
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
"level": 1,
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
"id": "Non-functional: performa, usability, keamanan, reliabilitas, kompatibilitas.",
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
"level": 1,
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
"level": 1,
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
"Mengukur kecepatan CPU",
"Menjadwalkan sprint",
"Menyimpan password"
],
"en": [
"Trace the relationship between requirements, test cases, and defects",
"Measure CPU speed",
"Schedule sprints",
"Store passwords"
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
"Developer di lingkungan developer",
"Pengguna nyata di lingkungan mereka sendiri",
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
"id": "Alpha: internal di lingkungan pengembang. Beta: pengguna eksternal di lingkungan sendiri.",
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
"Developer sudah pulang",
"Build baru dibuat",
"Sprint dimulai"
],
"en": [
"All critical defects are closed and the coverage target is met",
"The developer has gone home",
"A new build was made",
"The sprint has started"
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
"level": 2,
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
"Menggantikan tester",
"Menghapus kebutuhan code review",
"Mempercepat internet"
],
"en": [
"Run builds and tests automatically on every change for fast feedback",
"Replace testers",
"Remove the need for code review",
"Speed up the internet"
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
"Selalu gagal",
"Selalu lolos",
"Terlalu cepat"
],
"en": [
"Sometimes passes and sometimes fails without code changes",
"Always fails",
"Always passes",
"Is too fast"
]
},
"answer": 0,
"exp": {
"id": "Penyebab: timing/wait buruk, data bersama, ketergantungan antar test, lingkungan tidak stabil.",
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
"id": "Penyebab: sinkronisasi/wait buruk, data test bersama atau tidak terisolasi, lingkungan/dependensi eksternal tidak stabil. Solusi: explicit wait, data terisolasi, mock dependensi, stabilkan environment.",
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
"Mengambil data dari database otomatis",
"Membuat laporan",
"Menghapus data test"
],
"en": [
"Run the same test with multiple data sets",
"Automatically fetch DB data",
"Generate reports",
"Delete test data"
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
"Menguji sistem melampaui kapasitas normal untuk melihat titik patah dan pemulihan",
"Menguji warna UI",
"Menguji satu user",
"Menguji terjemahan"
],
"en": [
"Push the system beyond normal capacity to find breaking point and recovery",
"Test UI colours",
"Test a single user",
"Test translations"
]
},
"answer": 0,
"exp": {
"id": "Load testing: beban yang diharapkan. Spike: lonjakan mendadak. Soak: beban lama.",
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
"id": "Aplikasi yang aman memakai parameterized query. Lakukan hanya di lingkungan yang Anda berwenang untuk menguji.",
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
"Penyisipan script berbahaya yang dieksekusi di browser korban",
"Serangan pada database saja",
"Serangan DDoS",
"Kegagalan CSS"
],
"en": [
"Injection of malicious script executed in a victim's browser",
"An attack on the database only",
"A DDoS attack",
"A CSS failure"
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
"Menggantikan dependensi eksternal agar test terisolasi dan deterministik",
"Mempercepat internet",
"Menghapus bug",
"Mengganti database produksi"
],
"en": [
"Replace external dependencies so tests are isolated and deterministic",
"Speed up the internet",
"Remove bugs",
"Replace the production database"
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
"Lingkungan test konsisten dan mudah diulang",
"Menghilangkan kebutuhan test",
"Membuat bug otomatis hilang",
"Mengganti Git"
],
"en": [
"Consistent, reproducible test environments",
"Eliminates the need for tests",
"Makes bugs vanish",
"Replaces Git"
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
"Scenario: gambaran tinggi apa yang diuji; test case: langkah, data, dan expected result detail",
"Sama persis",
"Test case lebih umum daripada scenario",
"Scenario hanya untuk performa"
],
"en": [
"Scenario: high-level what to test; test case: detailed steps, data, and expected result",
"Exactly the same",
"A test case is more general than a scenario",
"Scenarios are only for performance"
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
"id": "Resource tidak ditemukan = 404. 500 hanya untuk kegagalan server yang tidak terduga.",
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
"Request gagal",
"Request sukses dan tidak ada body di response",
"Resource dipindahkan",
"Server sibuk"
],
"en": [
"Request failed",
"Request succeeded and the response has no body",
"Resource moved",
"Server busy"
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
"200",
"400 Bad Request",
"401",
"500"
],
"en": [
"200",
"400 Bad Request",
"401",
"500"
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
"404",
"401",
"204"
],
"en": [
"409 Conflict",
"404",
"401",
"204"
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
"Sama saja",
"401 = belum terautentikasi/token invalid; 403 = terautentikasi tapi tidak berhak",
"401 = server error; 403 = client error",
"401 = resource tidak ada; 403 = resource ada"
],
"en": [
"They are the same",
"401 = unauthenticated/invalid token; 403 = authenticated but not permitted",
"401 = server error; 403 = client error",
"401 = resource missing; 403 = resource exists"
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
"DELETE /orders/{id}",
"PATCH /orders/{id} dengan status=cancelled, atau POST /orders/{id}/cancel",
"GET /orders/{id}/cancel",
"PUT /orders tanpa id"
],
"en": [
"DELETE /orders/{id}",
"PATCH /orders/{id} with status=cancelled, or POST /orders/{id}/cancel",
"GET /orders/{id}/cancel",
"PUT /orders without id"
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
"id": "Server sedang maintenance atau kelebihan beban. Status code yang tepat?",
"en": "The server is under maintenance or overloaded. The correct status code?"
},
"options": {
"id": [
"503 Service Unavailable",
"400",
"404",
"201"
],
"en": [
"503 Service Unavailable",
"400",
"404",
"201"
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
"id": "Tanpa autentikasi = 401. Ini kasus uji negatif wajib untuk endpoint terproteksi.",
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
"200 dengan pesan \"Email tidak ada\"",
"500",
"403 dengan nama user"
],
"en": [
"401 with a generic message \"Email or password is incorrect\"",
"200 with message \"Email not found\"",
"500",
"403 with the username"
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
"Keduanya sama",
"Explicit berlaku global; implicit per elemen",
"Implicit hanya untuk alert"
],
"en": [
"Implicit applies globally to element lookups; explicit waits for a specific condition on a specific element",
"They are the same",
"Explicit is global; implicit is per element",
"Implicit is only for alerts"
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
"Menunggu waktu tetap: lambat jika elemen cepat siap, dan tetap bisa gagal jika lambat",
"Tidak bisa dipakai di Python",
"Menghapus cookie",
"Menutup browser"
],
"en": [
"Fixed wait: slow if the element is ready early, and can still fail if slower",
"Cannot be used in Python",
"Deletes cookies",
"Closes the browser"
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
"Elemen tidak ada di DOM",
"Driver tidak terpasang",
"Port salah"
],
"en": [
"Another element (overlay/modal/loader) covering the target",
"The element is not in the DOM",
"The driver is not installed",
"A wrong port"
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
"Elemen yang direferensikan sudah tidak valid karena DOM berubah/di-refresh",
"Locator salah ketik",
"Browser tidak mendukung",
"Timeout koneksi"
],
"en": [
"The referenced element is no longer valid because the DOM changed/refreshed",
"The locator has a typo",
"The browser is unsupported",
"Connection timeout"
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
"Elemen tidak ditemukan dengan locator tersebut saat pencarian",
"Elemen tidak bisa diklik",
"Alert tidak muncul",
"Driver crash"
],
"en": [
"The element was not found with that locator at lookup time",
"The element cannot be clicked",
"No alert appeared",
"The driver crashed"
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
"Sama saja",
"close mengakhiri semua; quit hanya satu tab",
"quit hanya membersihkan cache"
],
"en": [
"close closes the current window; quit ends the session and all windows",
"They are the same",
"close ends everything; quit only one tab",
"quit only clears cache"
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
"Menjalankan Grid",
"Membuat laporan",
"Merekam video"
],
"en": [
"Automatically download and manage browser drivers",
"Run the Grid",
"Generate reports",
"Record video"
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
