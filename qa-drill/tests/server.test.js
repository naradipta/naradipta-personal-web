// Tes API login + sinkronisasi (server di proses ini, DB di memori). Jalankan: node tests/server.test.js
const assert = require("assert");
const { createServer } = require("../server/server");

const server = createServer({ DB_PATH: ":memory:", COOKIE_SECURE: "0", MAX_USERS: 3 });

function call(base, method, path, body, cookie, headers) {
  return fetch(base + path, {
    method, redirect: "manual",
    headers: Object.assign({ "Content-Type": "application/json" }, cookie ? { Cookie: cookie } : {}, headers || {}),
    body: body === undefined ? undefined : JSON.stringify(body),
  }).then(async (r) => ({ status: r.status, json: await r.json().catch(() => null), setCookie: r.headers.get("set-cookie") }));
}
const sessionOf = (r) => /qd_session=[^;]+/.exec(r.setCookie || "")[0];

server.listen(0, "127.0.0.1", async () => {
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    assert.strictEqual((await call(base, "GET", "/api/health")).status, 200);
    assert.strictEqual((await call(base, "GET", "/api/me")).json.email, null, "belum login -> email null");

    // validasi
    assert.strictEqual((await call(base, "POST", "/api/register", { email: "bukan-email", password: "password123" })).json.error, "invalid_email");
    assert.strictEqual((await call(base, "POST", "/api/register", { email: "a@b.co", password: "pendek" })).json.error, "invalid_password");
    assert.strictEqual((await call(base, "POST", "/api/register", { email: "a@b.co", password: "x".repeat(201) })).json.error, "invalid_password");

    // daftar: tanpa verifikasi, langsung login; email dinormalisasi
    const reg = await call(base, "POST", "/api/register", { email: "  Rafi@Example.COM ", password: "rahasia-123" });
    assert.strictEqual(reg.status, 201); assert.strictEqual(reg.json.email, "rafi@example.com");
    assert.ok(/HttpOnly/.test(reg.setCookie) && /SameSite=Lax/.test(reg.setCookie), "cookie HttpOnly + SameSite");
    assert.ok(Number.isInteger(reg.json.id) && reg.json.verified === false, "daftar mengembalikan id dan status verifikasi (dipakai klien untuk ruang penyimpanan per akun)");
    const cookie = sessionOf(reg);
    assert.strictEqual((await call(base, "GET", "/api/me", undefined, cookie)).json.email, "rafi@example.com");
    const me = (await call(base, "GET", "/api/me", undefined, cookie)).json;
    assert.ok(Number.isInteger(me.id) && me.verified === false, "me memuat id dan status verifikasi");
    assert.strictEqual((await call(base, "POST", "/api/register", { email: "rafi@example.com", password: "lain-lain-123" })).status, 409, "email ganda");

    // password tidak disimpan polos
    const row = server.db.userByEmail("rafi@example.com");
    assert.ok(row.pw_hash.startsWith("scrypt$") && !row.pw_hash.includes("rahasia"), "password di-hash");
    const sess = server.db.raw.prepare("SELECT token_hash FROM sessions").get();
    assert.ok(sess.token_hash !== cookie.split("=")[1], "hanya hash token yang tersimpan");

    // login
    assert.strictEqual((await call(base, "POST", "/api/login", { email: "rafi@example.com", password: "salah-salah" })).status, 401);
    assert.strictEqual((await call(base, "POST", "/api/login", { email: "tidak@ada.com", password: "salah-salah" })).status, 401, "tanpa membedakan email tak ada");
    const login = await call(base, "POST", "/api/login", { email: "RAFI@example.com", password: "rahasia-123" });
    assert.strictEqual(login.status, 200); const cookie2 = sessionOf(login);

    // progres: perlu login, versi optimistik
    assert.strictEqual((await call(base, "PUT", "/api/progress", { data: { q: {}, cards: {} }, baseVersion: 0 })).status, 401);
    const empty = await call(base, "PUT", "/api/progress", { data: { q: { a: 1 }, cards: {} }, baseVersion: 0 }, cookie);
    assert.deepStrictEqual(empty.json, { version: 1 });
    const got = await call(base, "GET", "/api/progress", undefined, cookie);
    assert.deepStrictEqual([got.status, got.json.version, got.json.data.q], [200, 1, { a: 1 }], "GET progres");
    assert.strictEqual((await call(base, "GET", "/api/progress")).status, 401);
    const stale = await call(base, "PUT", "/api/progress", { data: { q: { b: 2 }, cards: {} }, baseVersion: 0 }, cookie2);
    assert.strictEqual(stale.status, 409); assert.strictEqual(stale.json.version, 1); assert.deepStrictEqual(stale.json.data.q, { a: 1 }, "konflik mengembalikan data server");
    assert.deepStrictEqual((await call(base, "PUT", "/api/progress", { data: { q: { b: 2 }, cards: {} }, baseVersion: 1 }, cookie2)).json, { version: 2 });
    assert.strictEqual((await call(base, "PUT", "/api/progress", { data: [], baseVersion: 2 }, cookie)).status, 400, "bentuk salah");
    assert.strictEqual((await call(base, "PUT", "/api/progress", { data: { q: { big: "x".repeat(1_100_000) }, cards: {} }, baseVersion: 2 }, cookie)).status, 413, "terlalu besar");

    // CSRF: origin asing dan content-type bukan JSON ditolak
    assert.strictEqual((await call(base, "POST", "/api/login", { email: "rafi@example.com", password: "rahasia-123" }, undefined, { Origin: "https://evil.example" })).status, 403);
    const form = await fetch(base + "/api/logout", { method: "POST", headers: { "Content-Type": "text/plain", Cookie: cookie }, body: "x" });
    assert.strictEqual(form.status, 403);

    // logout mencabut sesi
    assert.strictEqual((await call(base, "POST", "/api/logout", {}, cookie)).status, 200);
    assert.strictEqual((await call(base, "GET", "/api/me", undefined, cookie)).json.email, null, "sesi dicabut");
    assert.strictEqual((await call(base, "GET", "/api/me", undefined, cookie2)).status, 200, "sesi perangkat lain tetap");

    // batas pengguna
    await call(base, "POST", "/api/register", { email: "b@x.co", password: "password-b1" });
    await call(base, "POST", "/api/register", { email: "c@x.co", password: "password-c1" });
    assert.strictEqual((await call(base, "POST", "/api/register", { email: "d@x.co", password: "password-d1" })).status, 503);

    // pembatas laju per email (10) dan per IP
    for (let i = 0; i < 10; i++) assert.strictEqual((await call(base, "POST", "/api/login", { email: "korban@x.co", password: "salah-salah" })).status, 401);
    assert.strictEqual((await call(base, "POST", "/api/login", { email: "korban@x.co", password: "salah-salah" })).status, 429, "email dibatasi");
    server.close();
    const lim = createServer({ DB_PATH: ":memory:", RATE_LIMIT_IP: "3" });
    await new Promise((r) => lim.listen(0, "127.0.0.1", r));
    const lb = "http://127.0.0.1:" + lim.address().port;
    const codes = [];
    for (let i = 0; i < 5; i++) codes.push((await call(lb, "POST", "/api/login", { email: "e" + i + "@x.co", password: "salah-salah" })).status);
    assert.deepStrictEqual(codes, [401, 401, 401, 429, 429], "IP dibatasi");
    lim.close();

    {
      const cs = createServer({ DB_PATH: ":memory:", COOKIE_SECURE: "0" });
      await new Promise((r) => cs.listen(0, "127.0.0.1", r));
      const base = "http://127.0.0.1:" + cs.address().port;
      const cookie = sessionOf(await call(base, "POST", "/api/register", { email: "rafi@example.com", password: "rahasia-123" }));
      // komunitas (opt-in): default tidak tampil; hanya nama tampilan + angka ringkas
    assert.strictEqual((await call(base, "GET", "/api/community")).status, 401, "komunitas butuh login");
    const me0 = (await call(base, "GET", "/api/me", undefined, cookie)).json; assert.strictEqual(me0.share, false); assert.strictEqual(me0.displayName, null);
    assert.strictEqual((await call(base, "PUT", "/api/profile", { displayName: "rafi@example.com", share: true }, cookie)).json.error, "invalid_display_name", "nama tidak boleh berbentuk email");
    assert.strictEqual((await call(base, "PUT", "/api/profile", { displayName: "x", share: true }, cookie)).json.error, "invalid_display_name");
    const day = Date.now();
    const prog = { q: { a: { box: 3 }, b: { box: 1 }, c: { box: 4 } }, cards: {}, history: [{ t: day, total: 5, correct: 4 }, { t: day - 86400000, total: 5, correct: 5 }], mocks: [] };
    assert.strictEqual((await call(base, "PUT", "/api/progress", { data: prog, baseVersion: 0 }, cookie)).status, 200);
    let com = (await call(base, "GET", "/api/community", undefined, cookie)).json;
    assert.strictEqual(com.rows.length, 0, "belum ikut -> tidak muncul");
    assert.strictEqual((await call(base, "PUT", "/api/profile", { displayName: "  Rafi  QA ", share: true }, cookie)).json.displayName, "Rafi QA");
    com = (await call(base, "GET", "/api/community", undefined, cookie)).json;
    assert.deepStrictEqual(Object.keys(com.rows[0]).sort(), ["active7", "mastered", "name", "seen", "streak", "you"], "hanya angka kasar, tanpa email/akurasi");
    assert.ok(com.rows[0].you && com.rows[0].mastered === 2 && com.rows[0].seen === 3 && com.rows[0].streak >= 2 && com.rows[0].active7 >= 2, JSON.stringify(com.rows[0]));
    assert.strictEqual((await call(base, "PUT", "/api/profile", { share: false }, cookie)).json.share, false);
    assert.strictEqual((await call(base, "GET", "/api/community", undefined, cookie)).json.rows.length, 0, "berhenti berbagi -> hilang");

      // hari aktif dari klien (days) dihitung walau tanpa sesi selesai; format tanggal divalidasi
      const today = new Date(Date.now() + 420 * 60000).toISOString().slice(0, 10);
      await call(base, "PUT", "/api/profile", { displayName: "Rafi QA", share: true }, cookie);
      await call(base, "PUT", "/api/progress", { data: { q: {}, cards: {}, history: [], mocks: [], days: [today, "bukan-tanggal"] }, baseVersion: 1 }, cookie);
      const act = (await call(base, "GET", "/api/community", undefined, cookie)).json.rows[0];
      assert.ok(act.active7 === 1 && act.streak === 1, "days klien dihitung: " + JSON.stringify(act));
      cs.close();
    }

    // email: verifikasi dan reset password (mailer palsu menangkap pesan)
    {
      const sent = [];
      const ms = createServer({ DB_PATH: ":memory:", COOKIE_SECURE: "0", APP_URL: "https://learn.example.org", mailer: { enabled: true, send: async (m) => { sent.push(m); } } });
      await new Promise((r) => ms.listen(0, "127.0.0.1", r));
      const base = "http://127.0.0.1:" + ms.address().port;
      const tok = (kind) => { const m = sent.map((x) => new RegExp("https://learn\\.example\\.org/#/" + kind + "/([\\w-]+)").exec(x.text)).filter(Boolean).pop(); return m && m[1]; };
      const reg = await call(base, "POST", "/api/register", { email: "mail@example.com", password: "rahasia-123" });
      const ck = sessionOf(reg);
      assert.strictEqual(sent.length, 1, "register mengirim email verifikasi"); assert.strictEqual(sent[0].to, "mail@example.com");
      const me1 = (await call(base, "GET", "/api/me", undefined, ck)).json;
      assert.ok(me1.emailEnabled === true && me1.verified === false);
      assert.strictEqual((await call(base, "PUT", "/api/profile", { displayName: "Mail Uji", share: true }, ck)).json.error, "verify_required", "komunitas butuh verifikasi");
      assert.strictEqual((await call(base, "GET", "/api/community", undefined, ck)).status, 403);
      assert.strictEqual((await call(base, "POST", "/api/verify/confirm", { token: "ngawur" })).json.error, "invalid_token");
      const vt = tok("verify"); assert.ok(vt, "tautan verifikasi memuat token di fragment");
      assert.ok(!ms.db.raw.prepare("SELECT 1 FROM email_tokens WHERE token_hash = ?").get(vt), "token tidak disimpan polos");
      assert.strictEqual((await call(base, "POST", "/api/verify/confirm", { token: vt })).status, 200);
      assert.strictEqual((await call(base, "POST", "/api/verify/confirm", { token: vt })).json.error, "invalid_token", "sekali pakai");
      assert.strictEqual((await call(base, "GET", "/api/me", undefined, ck)).json.verified, true);
      assert.strictEqual((await call(base, "POST", "/api/verify/send", {}, ck)).json.alreadyVerified, true);
      assert.strictEqual((await call(base, "PUT", "/api/profile", { displayName: "Mail Uji", share: true }, ck)).status, 200, "setelah verifikasi boleh bergabung");

      // lupa password: jawaban sama untuk email tak dikenal, tidak ada email terkirim
      const before = sent.length;
      assert.strictEqual((await call(base, "POST", "/api/password/forgot", { email: "tidak-ada@example.com" })).status, 200);
      assert.strictEqual(sent.length, before, "email tak dikenal tidak dikirimi apa pun");
      assert.strictEqual((await call(base, "POST", "/api/password/forgot", { email: "MAIL@example.com" })).status, 200);
      assert.strictEqual(sent.length, before + 1);
      const rt = tok("reset"); assert.ok(rt);
      assert.strictEqual((await call(base, "POST", "/api/password/reset", { token: rt, password: "pendek" })).json.error, "invalid_password");
      assert.strictEqual((await call(base, "POST", "/api/password/reset", { token: "ngawur", password: "password-baru-1" })).json.error, "invalid_token");
      assert.strictEqual((await call(base, "POST", "/api/password/reset", { token: rt, password: "password-baru-1" })).status, 200);
      assert.strictEqual((await call(base, "POST", "/api/password/reset", { token: rt, password: "password-baru-2" })).json.error, "invalid_token", "sekali pakai");
      assert.strictEqual((await call(base, "GET", "/api/me", undefined, ck)).json.email, null, "sesi lama dicabut setelah reset");
      assert.strictEqual((await call(base, "POST", "/api/login", { email: "mail@example.com", password: "rahasia-123" })).status, 401, "password lama tidak berlaku");
      assert.strictEqual((await call(base, "POST", "/api/login", { email: "mail@example.com", password: "password-baru-1" })).status, 200);
      // pembatas laju lupa password per email (3/jam)
      await call(base, "POST", "/api/password/forgot", { email: "mail@example.com" }); await call(base, "POST", "/api/password/forgot", { email: "mail@example.com" });
      assert.strictEqual((await call(base, "POST", "/api/password/forgot", { email: "mail@example.com" })).status, 429);
      // token kedaluwarsa ditolak
      sent.length = 0;
      ms.db.raw.prepare("DELETE FROM email_tokens").run();
      ms.db.createToken(1, "reset", require("../server/auth").tokenHash("kedaluwarsa"), -1000);
      assert.strictEqual((await call(base, "POST", "/api/password/reset", { token: "kedaluwarsa", password: "password-baru-3" })).json.error, "invalid_token", "token kedaluwarsa");
      ms.close();
      // tanpa mailer: fitur email dimatikan dengan jelas
      const nm = createServer({ DB_PATH: ":memory:", COOKIE_SECURE: "0" });
      await new Promise((r) => nm.listen(0, "127.0.0.1", r));
      assert.strictEqual((await call("http://127.0.0.1:" + nm.address().port, "POST", "/api/password/forgot", { email: "a@b.co" })).status, 503);
      nm.close();
    }

    // moderasi nama: aturan nama, laporan, penyembunyian otomatis, dan perintah admin
    {
      const ms = createServer({ DB_PATH: ":memory:", COOKIE_SECURE: "0", REPORT_AUTOHIDE: "2", ADMIN_EMAILS: "bos@example.com", BLOCKED_NAME_WORDS: "katakasarlokal" });
      await new Promise((r) => ms.listen(0, "127.0.0.1", r));
      const base = "http://127.0.0.1:" + ms.address().port;
      const mk = async (email) => sessionOf(await call(base, "POST", "/api/register", { email, password: "rahasia-123" }));
      const join = (ck, name) => call(base, "PUT", "/api/profile", { displayName: name, share: true }, ck);
      const [a, b, c, d, bos] = [await mk("a@example.com"), await mk("b@example.com"), await mk("c@example.com"), await mk("d@example.com"), await mk("bos@example.com")];
      for (const bad of ["Admin", "Adm1n QA", "ad min", "Moderator 1", "NaraDipta", "fuck you", "Anj1ng", "Katakasar Lokal"])
        assert.strictEqual((await join(a, bad)).json.error, "name_not_allowed", "nama ditolak: " + bad);
      assert.strictEqual((await join(bos, "Admin")).status, 200, "pemilik (ADMIN_EMAILS) boleh memakai nama dicadangkan");
      assert.strictEqual((await join(a, "Sari QA")).status, 200);
      assert.strictEqual((await join(b, "sari  qa")).json.error, "name_taken", "nama unik (abaikan huruf besar dan spasi)");
      assert.strictEqual((await join(b, "S4ri-QA")).json.error, "name_taken", "leetspeak disamakan");
      assert.strictEqual((await join(b, "Budi QA")).status, 200); assert.strictEqual((await join(c, "Cici QA")).status, 200); assert.strictEqual((await join(d, "Dedi QA")).status, 200);
      const rep = (ck, body) => call(base, "POST", "/api/community/report", body, ck);
      assert.strictEqual((await rep(a, { name: "Sari QA", reason: "other" })).json.error, "cannot_report_self");
      assert.strictEqual((await rep(a, { name: "Tidak Ada", reason: "other" })).status, 404);
      assert.strictEqual((await rep(a, { name: "Budi QA", reason: "ngawur" })).json.error, "invalid_report");
      assert.strictEqual((await rep(a, { name: "Budi QA", reason: "inappropriate", note: "x".repeat(500) })).status, 200);
      assert.strictEqual((await rep(a, { name: "budi qa", reason: "inappropriate" })).json.duplicate, true, "satu laporan terbuka per pelapor");
      assert.ok((await call(base, "GET", "/api/community", undefined, c)).json.rows.some((r) => r.name === "Budi QA"), "1 pelapor: belum disembunyikan");
      assert.strictEqual((await rep(c, { name: "Budi QA", reason: "impersonation" })).status, 200);
      const names = (ck) => call(base, "GET", "/api/community", undefined, ck).then((r) => r.json.rows.map((x) => x.name));
      assert.ok(!(await names(d)).includes("Budi QA"), "2 pelapor berbeda (batas) menyembunyikan otomatis");
      assert.ok((await names(d)).includes("Cici QA"));
      // perintah admin lewat CLI pada berkas DB sementara
      const { execFileSync } = require("child_process"); const os = require("os"); const path = require("path"); const fs = require("fs");
      const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "qd-admin-")), "t.sqlite");
      const db2 = require("../server/db").open(f);
      const uid = db2.createUser("x@example.com", "h"); const rid = db2.createUser("y@example.com", "h");
      db2.setProfile(uid, "Xena", true); db2.addReport(rid, uid, "other", "");
      db2.raw.close();
      const cli = (...args) => execFileSync(process.execPath, [path.join(__dirname, "../server/admin.js"), ...args], { env: { ...process.env, DB_PATH: f } }).toString();
      assert.ok(/x@example.com.*Xena.*pelapor=1/.test(cli("reports")), "reports mendaftar laporan terbuka");
      cli("hide-name", "x@example.com");
      const db3 = require("../server/db").open(f); const u3 = db3.userByEmail("x@example.com");
      assert.strictEqual(db3.userById(u3.id).display_name, null); assert.strictEqual(db3.userById(u3.id).name_locked, 1);
      assert.strictEqual(db3.openReports().length, 0, "hide-name menutup laporan"); db3.raw.close();
      cli("unhide-name", "x@example.com");
      assert.ok(/Tidak ada laporan/.test(cli("reports")));
      ms.close();
    }

    console.log("server.test.js: semua tes lulus");
    process.exit(0);
  } catch (e) { console.error("GAGAL:", e.message); server.close(); process.exit(1); }
});
