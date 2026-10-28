// Uji asap alur utama di browser simulasi. Opsional: npm i jsdom lalu node tests/smoke.test.js
const { JSDOM } = require("jsdom");
const path = require("path");
const assert = require("assert");

const file = path.join(__dirname, "..", "index.html");
JSDOM.fromFile(file, { runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, url: "file://" + file })
  .then((dom) => new Promise((res) => dom.window.addEventListener("load", () => setTimeout(() => res(dom), 50))))
  .then((dom) => {
    const w = dom.window, d = w.document, QA = w.QA;
    w.confirm = () => true;
    const errors = [];
    w.addEventListener("error", (e) => errors.push(e.message));
    const text = () => d.getElementById("app").textContent;
    const go = (h) => { w.location.hash = "#/" + h; };
    const click = (el) => el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    const btns = (cls) => Array.from(d.querySelectorAll("#app button" + (cls || "")));

    // data valid
    w.scrollTo = () => {};
    assert.strictEqual(QA.validateData().length, 0, "data soal valid");
    assert.ok(QA.questions.length >= 190, "jumlah soal");
    assert.strictEqual(QA.los.length, 64);

    // beranda
    QA.render();
    assert.ok(/ISTQB/.test(text()), "beranda tampil");
    assert.strictEqual(d.querySelectorAll(".chip").length >= 64, true, "chip LO tampil");

    // semua rute dapat dirender tanpa error
    ["dashboard", "study", "study/ch4", "study/ch5", "practice", "mock", "cards", "plan", "settings"].forEach((r) => {
      go(r); QA.render();
      assert.ok(d.getElementById("app").children.length > 0, "rute " + r);
      assert.ok(!/Error:/.test(text()), "rute error " + r + ": " + text().slice(0, 120));
    });

    // pengaturan bahasa
    QA.store.state.lang = "en"; QA.render(); assert.ok(/Settings|Reset/.test(text()));
    QA.store.state.lang = "id"; QA.render();

    // latihan: bab 4, jawab sampai selesai (benar untuk genap, salah untuk ganjil)
    go("practice/ch4"); QA.render();
    assert.ok(/Soal 1\//.test(text()), "sesi latihan mulai: " + text().slice(0, 100));
    const seenQ = new Set();
    for (let i = 0; i < 40 && !/Ringkasan sesi/.test(text()); i++) {
      const opts = btns(".opt");
      if (!opts.length) break;
      // temukan indeks jawaban benar lewat state: klik opsi sesuai urutan acak
      const q = d.querySelector(".qtext").textContent;
      const item = QA.questions.find((x) => x.q.id === q || x.q.en === q);
      assert.ok(item, "soal ditemukan");
      const labelOf = (o) => o.textContent.replace(/^[A-D]\.\s*/, "");
      const correctText = item.type === "tf" ? (item.answer ? "Benar" : "Salah") : item.options.id[item.answer];
      const again = seenQ.has(item.id); seenQ.add(item.id);
      const wantRight = again || (seenQ.size % 2 === 1); // soal ulangan dijawab benar
      const pick = wantRight ? opts.find((o) => labelOf(o) === correctText) : opts.find((o) => labelOf(o) !== correctText);
      click(pick);
      // mode keyakinan: jawaban belum dibuka sebelum tingkat keyakinan dipilih
      assert.ok(d.querySelector(".conf"), "pertanyaan keyakinan tampil");
      assert.ok(!d.querySelector(".opt.right"), "jawaban belum dibuka sebelum memilih keyakinan");
      click(btns(".conf-sure")[0]);
      assert.ok(d.querySelector(".opt.right"), "umpan balik benar tampil");
      click(btns(".primary").pop()); // Berikutnya / Lihat ringkasan
    }
    assert.ok(/Ringkasan sesi/.test(text()), "ringkasan sesi");
    assert.ok(/Akurasi/.test(text()));

    // SRS tersimpan (soal ulangan tidak mencatat ulang)
    const recs = Object.keys(QA.store.state.q);
    assert.strictEqual(recs.length, 10);
    assert.ok(/Pembahasan soal yang salah/.test(text()), "pembahasan soal salah tampil di akhir sesi");
    assert.ok(/Jawaban benar:/.test(text()) && /Jawaban Anda:/.test(text()), "jawaban Anda dan jawaban benar tampil");
    assert.ok(/Mengapa:/.test(text()), "penjelasan tampil");
    assert.ok(/Berhasil saat diulang/.test(text()), "soal salah diulang dalam sesi");

    assert.ok(recs.some((id) => QA.store.state.q[id].box > 0) && recs.some((id) => QA.store.state.q[id].box === 0));

    // soal jatuh tempo: yang salah (box 0) harus due
    assert.ok(QA.dueQuestions().length >= 5, "soal salah jatuh tempo");

    // aturan keyakinan pada jadwal ulang
    const St = QA.store;
    const saved = JSON.parse(JSON.stringify(St.state));
    St.reset();
    St.record("t-guess", true, "guess");  assert.strictEqual(St.state.q["t-guess"].box, 0, "benar menebak tidak naik box");
    assert.ok(St.state.q["t-guess"].due > Date.now(), "benar menebak dijadwalkan >= 1 hari");
    St.record("t-unsure", true, "unsure"); assert.strictEqual(St.state.q["t-unsure"].box, 1);
    St.record("t-unsure", true, "unsure"); assert.strictEqual(St.state.q["t-unsure"].box, 1, "ragu tidak naik dari box 1");
    St.record("t-sure", true, "sure");     St.record("t-sure", true, "sure"); assert.strictEqual(St.state.q["t-sure"].box, 2);
    St.record("t-sure", false, "sure");    assert.strictEqual(St.state.q["t-sure"].box, 0);
    assert.strictEqual(St.state.q["t-sure"].hyper, 1, "salah tapi yakin tercatat");
    St.state = saved;

    // isian singkat
    const shortQ = QA.questions.find((q) => q.id === "api-004");
    const s = QA.makeItem(shortQ);
    s.draft = "401 Unauthorized";
    assert.ok(QA.grade.gradeShort(s.draft, shortQ).pass);

    // mock exam: 40 soal sesuai sebaran
    const pick = QA.pickMock();
    assert.strictEqual(pick.questions.length, 40, "mock 40 soal");
    const perCh = {};
    pick.questions.forEach((q) => { const c = QA.chapterOf(q); perCh[c] = (perCh[c] || 0) + 1; });
    assert.deepStrictEqual(perCh, { 1: 8, 2: 6, 3: 4, 4: 11, 5: 9, 6: 2 }, "sebaran bab " + JSON.stringify(perCh));
    assert.strictEqual(pick.shortage, 0);
    assert.strictEqual(new Set(pick.questions.map((q) => q.id)).size, 40, "tanpa duplikat");

    go("mock"); QA.render();
    click(btns(".primary")[0]); // mulai ujian
    assert.ok(/Soal 1\/40/.test(text()), "ujian mulai");
    assert.ok(d.getElementById("mock-timer"), "timer ada");
    click(btns(".opt")[0]); // jawab satu
    click(btns(".primary").filter((b) => /Berikutnya/.test(b.textContent))[0]);
    assert.ok(/Soal 2\/40/.test(text()));
    click(btns(".danger")[0]); // serahkan
    assert.ok(/Hasil mock exam/.test(text()), "hasil tampil");
    assert.strictEqual(QA.store.state.mocks.length, 1);
    assert.ok(/BELUM|LULUS/.test(text()));

    // kartu istilah
    go("cards"); QA.render();
    click(btns(".primary")[0]);
    assert.ok(/1\/\d+/.test(text()));
    click(btns(".primary")[0]); // tampilkan definisi
    click(btns(".good")[0]);
    assert.ok(Object.keys(QA.store.state.cards).length === 1);

    // rencana belajar
    const today = new Date(2026, 9, 23);
    const plan = QA.buildPlan("2026-12-23", today);
    assert.strictEqual(plan.days, 61);
    const studyRows = plan.rows.filter((r) => r.kind === "study");
    assert.strictEqual(studyRows.length, 6);
    assert.strictEqual(plan.studyDays + plan.reviewDays, 61);
    const ch4 = studyRows[3], ch6 = studyRows[5];
    const len = (r) => Math.round((r.to - r.from) / 86400000) + 1;
    assert.ok(len(ch4) > len(ch6), "bab 4 lebih lama dari bab 6");
    assert.strictEqual(QA.buildPlan("2026-10-23", today), null);
    const short = QA.buildPlan("2026-10-28", today);
    assert.ok(short && short.rows.length >= 6, "jadwal pendek tetap valid");

    // ekspor dan impor progres
    const json = QA.store.exportJSON();
    QA.store.reset(); assert.strictEqual(Object.keys(QA.store.state.q).length, 0);
    QA.store.importJSON(json); assert.ok(Object.keys(QA.store.state.q).length > 0);
    assert.throws(() => QA.store.importJSON("{\"x\":1}"));

    assert.deepStrictEqual(errors, [], "tanpa error runtime: " + errors.join("; "));
    console.log("smoke.test.js: semua tes lulus (" + QA.questions.length + " soal, " + QA.los.length + " LO)");
    process.exit(0);
  })
  .catch((e) => { console.error("GAGAL:", e.message); process.exit(1); });
