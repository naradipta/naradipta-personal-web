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
    const cookie = sessionOf(reg);
    assert.strictEqual((await call(base, "GET", "/api/me", undefined, cookie)).json.email, "rafi@example.com");
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

    console.log("server.test.js: semua tes lulus");
    process.exit(0);
  } catch (e) { console.error("GAGAL:", e.message); server.close(); process.exit(1); }
});
