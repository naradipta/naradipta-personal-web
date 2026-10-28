// Jalankan: node tests/grade.test.js
const assert = require("assert");
const G = require("../js/grade.js");

const put = { keywords: [["put"], ["patch"], ["full", "penuh", "seluruh", "entire", "replace", "ganti"], ["partial", "sebagian"]], pass: 0.75 };

// benar penuh (campuran ID/EN)
let r = G.gradeShort("PUT mengganti seluruh resource, sedangkan PATCH hanya mengubah sebagian field.", put);
assert.strictEqual(r.score, 1); assert.ok(r.pass);

// "input" tidak boleh dianggap "put"
r = G.gradeShort("Saya tidak tahu, mungkin input data saja", put);
assert.strictEqual(r.matched.length, 0); assert.ok(!r.pass);

// sebagian benar di bawah ambang
r = G.gradeShort("PUT dan PATCH sama saja", put);
assert.strictEqual(r.matched.length, 2); assert.ok(!r.pass);

// kosong atau terlalu pendek
assert.strictEqual(G.gradeShort("", put).score, 0);
assert.strictEqual(G.gradeShort("ab", put).score, 0);

// angka: 401 sebagai kata utuh
const code = { keywords: [["401"]], pass: 1 };
assert.ok(G.gradeShort("Status code 401 Unauthorized.", code).pass);
assert.ok(!G.gradeShort("status 4010", code).pass);

// huruf besar dan aksen
assert.ok(G.gradeShort("Enumerasi user", { keywords: [["enumeration", "enumerasi"]], pass: 1 }).pass);

// ambang bawaan 0.6 bila pass tidak diisi
r = G.gradeShort("stateless resource", { keywords: [["stateless"], ["resource"], ["http"]] });
assert.ok(Math.abs(r.score - 2 / 3) < 1e-9); assert.ok(r.pass);

// pilihan ganda dan benar/salah
assert.ok(G.gradeChoice({ answer: 2 }, 2)); assert.ok(!G.gradeChoice({ answer: 2 }, 1));
assert.ok(G.gradeTF({ answer: false }, false)); assert.ok(!G.gradeTF({ answer: false }, true));

console.log("grade.test.js: semua tes lulus");
