// Tes sinkronisasi klien: edit yang datang saat push berjalan harus tetap terkirim setelah push selesai.
// Butuh jsdom (npm i --no-save jsdom). Jalankan: node tests/sync.test.js (~6 detik: ada debounce 1,5 detik).
const { JSDOM } = require("jsdom");
const path = require("path");
const assert = require("assert");

const file = path.join(__dirname, "..", "..", "public", "learn", "index.html");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

JSDOM.fromFile(file, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, url: "file://" + file })
  .then((dom) => new Promise((res) => dom.window.addEventListener("load", () => setTimeout(() => res(dom), 50))))
  .then(async (dom) => {
    const w = dom.window, QA = w.QA, acct = QA.account;
    w.scrollTo = () => {};
    const puts = [];
    let release;
    w.fetch = (url, opt) => {
      if (opt && opt.method === "PUT") {
        puts.push(url);
        // PUT pertama tertahan sampai dilepas (mensimulasikan round trip yang lambat)
        if (puts.length === 1) return new Promise((r) => { release = () => r({ status: 200, json: () => Promise.resolve({ version: 1 }) }); });
        return Promise.resolve({ status: 200, json: () => Promise.resolve({ version: puts.length }) });
      }
      return Promise.resolve({ status: 200, json: () => Promise.resolve({}) });
    };
    acct.status = "in"; acct.version = 0; acct.error = ""; acct.dirty = false; acct.syncing = false;

    QA.store.save();                       // edit 1 -> push dimulai setelah debounce
    await wait(1700);
    assert.strictEqual(puts.length, 1, "push pertama dimulai dan tertahan");
    QA.store.save();                       // edit 2 saat push berjalan
    await wait(1700);                      // timer debounce habis, tetapi push masih berjalan
    assert.strictEqual(puts.length, 1, "tidak ada push paralel");
    assert.strictEqual(acct.dirty, true, "edit ditandai dirty");
    release();                             // push pertama selesai
    await wait(1900);                      // debounce untuk push susulan
    assert.strictEqual(puts.length, 2, "edit saat push berjalan dikirim setelah push selesai");
    assert.strictEqual(acct.dirty, false, "setelah terkirim tidak dirty");
    await wait(1700);
    assert.strictEqual(puts.length, 2, "tidak berulang tanpa henti");
    console.log("sync.test.js: semua tes lulus");
    process.exit(0);
  })
  .catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
