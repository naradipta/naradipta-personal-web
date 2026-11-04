// Uji kualitas data soal (Node murni): node tests/data.test.js
const assert = require("assert");
const fs = require("fs"), path = require("path"), vm = require("vm");
const app = path.join(__dirname, "..", "..", "public", "learn");
const win = { QA: {} };
["data/lo.js", "data/materi.js", "data/materi-karir.js", "data/questions.js"].forEach((f) => vm.runInNewContext(fs.readFileSync(path.join(app, f), "utf8"), { window: win, QA: win.QA }, { filename: f }));
const QA = win.QA, qs = QA.questions;
const errs = [];
const bad = (id, msg) => errs.push(id + ": " + msg);
const dupIds = new Set();
qs.forEach((q) => {
  if (dupIds.has(q.id)) bad(q.id, "ID ganda"); dupIds.add(q.id);
  ["id", "en"].forEach((l) => { if (!q.q[l] || !q.q[l].trim()) bad(q.id, "teks " + l + " kosong"); });
  if (q.type === "mcq") {
    ["id", "en"].forEach((l) => {
      const o = q.options[l];
      if (o.length !== 4) bad(q.id, "jumlah opsi " + l + " = " + o.length);
      if (o.some((x) => !x || !x.trim())) bad(q.id, "opsi kosong " + l);
      if (new Set(o.map((x) => x.trim().toLowerCase())).size !== o.length) bad(q.id, "opsi ganda " + l);
    });
    if (q.options.id.length !== q.options.en.length) bad(q.id, "jumlah opsi ID != EN");
    if (!(q.answer >= 0 && q.answer < q.options.en.length)) bad(q.id, "indeks jawaban");
    if (!q.exp || !q.exp.id || !q.exp.en) bad(q.id, "penjelasan (exp) kosong");
  }
  if (q.type === "tf") { if (typeof q.answer !== "boolean") bad(q.id, "jawaban tf"); if (!q.exp || !q.exp.id || !q.exp.en) bad(q.id, "exp kosong"); }
  if (q.type === "short") {
    if (!q.model || !q.model.id || !q.model.en) bad(q.id, "model jawaban kosong");
    if (!q.keywords || !q.keywords.length || q.keywords.some((g) => !g.length)) bad(q.id, "keywords");
    if (!(q.pass > 0 && q.pass <= 1)) bad(q.id, "pass");
  }
  if (q.lo) {
    const lo = QA.byLo[q.lo];
    if (!lo) bad(q.id, "LO tidak dikenal " + q.lo); else if (q.k > lo.k) bad(q.id, "K melebihi K LO");
    if (q.level !== undefined && q.level !== q.k) bad(q.id, "level != k");
  }
});
// setiap LO punya minimal 1 soal; mock butuh cukup soal mcq ber-LO tiap bab/K-level
QA.los.forEach((l) => { if (!qs.some((q) => q.lo === l.code)) bad(l.code, "LO tanpa soal"); });
QA.chapters.forEach((ch) => [1, 2, 3].forEach((k) => {
  const have = qs.filter((q) => q.type === "mcq" && q.lo && parseInt(q.lo.split("-")[1], 10) === ch.n && q.k === k).length;
  if (have < ch.mix[k]) bad("bab " + ch.n, "soal K" + k + " (" + have + ") kurang dari kebutuhan mock (" + ch.mix[k] + ")");
}));
// materi lengkap: tiap bab punya bagian berjudul dan berisi
QA.chapters.forEach((ch) => {
  const secs = (QA.materi || {})[ch.n];
  if (!secs || !secs.length) return bad("bab " + ch.n, "materi kosong");
  secs.forEach((s, i) => { if (!s.h || !(s.p || s.ul || s.pre)) bad("materi bab " + ch.n + " #" + (i + 1), "bagian kosong"); });
});
// materi karir: tiap topik non-ISTQB yang punya soal wajib punya materi
[...new Set(qs.filter((q) => !q.lo && q.topic !== "istqb").map((q) => q.topic))].forEach((tp) => {
  const secs = (QA.materiKarir || {})[tp];
  if (!secs || !secs.length) return bad("topik " + tp, "materi karir kosong");
  secs.forEach((s, i) => { if (!s.h || !(s.p || s.ul || s.pre)) bad("materi " + tp + " #" + (i + 1), "bagian kosong"); });
});
assert.deepStrictEqual(errs, [], "\n" + errs.join("\n"));
console.log("data.test.js: semua tes lulus (" + qs.length + " soal)");
