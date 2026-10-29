// Inti aplikasi: bahasa, router berbasis hash, statistik bersama.
(function () {
  var QA = window.QA, S = QA.store, h = QA.h;

  // Teks UI dwibahasa: QA.t("Bahasa Indonesia", "English")
  QA.t = function (id, en) { return S.state.lang === "id" ? id : en; };
  // Ambil teks dari objek {id, en}
  QA.L = function (o) { return o ? (o[S.state.lang] || o.en || o.id || "") : ""; };

  QA.routes = {};
  QA.nav = [
    ["dashboard", "Beranda", "Home"],
    ["study", "Belajar", "Study"],
    ["practice", "Latihan", "Practice"],
    ["mock", "Mock Exam", "Mock Exam"],
    ["cards", "Kartu Istilah", "Glossary Cards"],
    ["plan", "Rencana", "Plan"],
    ["settings", "Pengaturan", "Settings"]
  ];

  QA.go = function (hash) {
    if (window.location.hash === "#/" + hash) QA.render();
    else window.location.hash = "#/" + hash;
  };

  // ---------- statistik bersama ----------
  var byLo = {};
  QA.questions.forEach(function (q) {
    if (q.lo) (byLo[q.lo] = byLo[q.lo] || []).push(q);
  });
  QA.qByLo = byLo;
  QA.chapterOf = function (q) { return q.lo ? parseInt(q.lo.split("-")[1], 10) : null; };

  QA.chapterStats = function (n) {
    var qs = QA.questions.filter(function (q) { return QA.chapterOf(q) === n; });
    var seen = 0, mastered = 0, due = 0;
    qs.forEach(function (q) {
      var r = S.state.q[q.id];
      if (r) seen++;
      if (S.mastered(r)) mastered++;
      if (S.isDue(r)) due++;
    });
    return { total: qs.length, seen: seen, mastered: mastered, due: due };
  };

  // Status satu LO: none (belum ada soal), new, weak, learning, strong
  QA.loState = function (code) {
    var qs = byLo[code];
    if (!qs || !qs.length) return "none";
    var seen = 0, strong = 0, weak = 0;
    qs.forEach(function (q) {
      var r = S.state.q[q.id];
      if (!r) return;
      seen++;
      if (S.mastered(r)) strong++;
      else if (r.last === 0 || r.box <= 1) weak++;
    });
    if (!seen) return "new";
    if (strong === qs.length) return "strong";
    if (weak > 0 && strong < qs.length / 2) return "weak";
    return "learning";
  };

  QA.dueQuestions = function () {
    return QA.questions.filter(function (q) { return S.isDue(S.state.q[q.id]); });
  };

  QA.overall = function () {
    var seen = 0, correct = 0, wrong = 0, mastered = 0;
    QA.questions.forEach(function (q) {
      var r = S.state.q[q.id];
      if (!r) return;
      seen++; correct += r.correct; wrong += r.wrong;
      if (S.mastered(r)) mastered++;
    });
    return { seen: seen, total: QA.questions.length, correct: correct, wrong: wrong, mastered: mastered };
  };

  // ---------- render ----------
  function parse() {
    var raw = (window.location.hash || "#/dashboard").replace(/^#\/?/, "");
    var parts = raw.split("/");
    return { name: parts[0] || "dashboard", arg: parts.slice(1).join("/") };
  }

  function buildHeader(active) {
    var head = document.getElementById("topbar");
    while (head.firstChild) head.removeChild(head.firstChild);
    head.appendChild(h("a", { class: "back", href: "/" }, QA.t("\u2190 naradipta.com", "\u2190 naradipta.com")));
    head.appendChild(h("div", { class: "brand" }, "QA Drill"));
    var nav = h("nav", { class: "nav" });
    QA.nav.forEach(function (n) {
      nav.appendChild(h("a", { href: "#/" + n[0], class: n[0] === active ? "active" : "" }, QA.t(n[1], n[2])));
    });
    head.appendChild(nav);
    head.appendChild(h("button", {
      class: "lang", title: "Language",
      onclick: function () { S.state.lang = S.state.lang === "id" ? "en" : "id"; S.save(); QA.render(); }
    }, S.state.lang === "id" ? "ID | en" : "id | EN"));
  }

  QA.render = function (keepScroll) {
    var y = window.pageYOffset || 0;
    var r = parse();
    if (!QA.routes[r.name]) r = { name: "dashboard", arg: "" };
    buildHeader(r.name);
    if (QA.onRoute) QA.onRoute(r.name);
    var app = document.getElementById("app");
    while (app.firstChild) app.removeChild(app.firstChild);
    var view;
    try { view = QA.routes[r.name](r.arg); }
    catch (e) { view = h("div", { class: "card error" }, "Error: " + e.message); if (window.console) console.error(e); }
    if (QA.dataWarnings && QA.dataWarnings.length) {
      app.appendChild(h("div", { class: "card warn small", role: "status" },
        h("b", null, QA.t("Beberapa soal dilewati karena datanya bermasalah: ", "Some questions were skipped because their data is invalid: ")),
        h("ul", null, QA.dataWarnings.slice(0, 10).map(function (e) { return h("li", null, e); }))));
    }
    app.appendChild(view);
    window.scrollTo(0, keepScroll === true ? y : 0);
    // Render ulang membangun DOM baru: kembalikan fokus keyboard ke elemen yang relevan.
    var f = app.querySelector("[data-autofocus]");
    if (f && QA.started) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
  };

  // Pengumuman untuk pembaca layar (aria-live) tanpa mengubah tampilan.
  // Ingatkan ekspor bila sudah ada progres berarti dan cadangan terakhir lebih dari 7 hari (atau belum pernah).
  QA.backupDue = function () {
    var seen = Object.keys(QA.store.state.q).length;
    var last = QA.store.state.lastExport;
    return seen >= 20 && (!last || Date.now() - last > 7 * QA.dayMs);
  };

  QA.announce = function (msg) {
    var el = document.getElementById("live");
    if (el) { el.textContent = ""; window.setTimeout(function () { el.textContent = msg; }, 30); }
  };

  // ---------- validasi data saat load ----------
  QA.validateData = function () {
    var ids = {}, errs = [];
    QA.invalid = {};
    QA.questions.forEach(function (q, i) {
      function bad(msg) { errs.push(msg); QA.invalid[i] = true; }
      if (ids[q.id]) bad("ID ganda: " + q.id);
      ids[q.id] = 1;
      if (!q.q || !q.q.id || !q.q.en) bad("Teks soal kosong: " + q.id);
      if (q.type === "mcq" && !(q.options && q.options.id.length === q.options.en.length && q.answer >= 0 && q.answer < q.options.id.length)) bad("Opsi/jawaban tidak valid: " + q.id);
      if (q.type === "short" && !(q.keywords && q.keywords.length)) bad("Kata kunci kosong: " + q.id);
      if (q.lo && !QA.byLo[q.lo]) bad("LO tidak dikenal: " + q.id + " -> " + q.lo);
    });
    return errs;
  };

  // Soal yang rusak dilewati dan diberi peringatan; aplikasi tetap bisa dipakai.
  QA.sanitize = function () {
    var errs = QA.validateData();
    QA.dataWarnings = errs;
    if (errs.length) QA.questions = QA.questions.filter(function (_, i) { return !QA.invalid[i]; });
    return errs;
  };

  window.addEventListener("hashchange", function () { QA.render(); });
  window.addEventListener("DOMContentLoaded", function () {
    QA.sanitize();
    if (!window.location.hash) window.location.hash = "#/dashboard";
    QA.render();
    QA.started = true;
  });
})();
