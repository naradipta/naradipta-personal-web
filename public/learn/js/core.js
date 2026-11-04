// Inti aplikasi: bahasa, router berbasis hash, statistik bersama.
(function () {
  var QA = window.QA, S = QA.store, h = QA.h;

  // Teks UI dwibahasa: QA.t("Bahasa Indonesia", "English")
  QA.t = function (id, en) { return S.state.lang === "id" ? id : en; };
  // Ambil teks dari objek {id, en}
  QA.L = function (o) { return o ? (o[S.state.lang] || o.en || o.id || "") : ""; };

  QA.routes = {};
  // [rute, label ID, label EN, ikon]. Sidebar (desktop) menampilkan semuanya; tab bar (mobile) hanya 4 utama + "Lainnya".
  QA.nav = [
    ["dashboard", "Beranda", "Home", "home"],
    ["study", "Materi", "Study material", "book", "Materi", "Material"],
    ["practice", "Latihan", "Practice", "target"],
    ["mock", "Mock Exam", "Mock Exam", "clock"],
    ["cards", "Kartu Istilah", "Glossary Cards", "layers"],
    ["plan", "Rencana", "Plan", "calendar"],
    ["community", "Komunitas", "Community", "users"],
    ["settings", "Pengaturan", "Settings", "sliders"]
  ];
  QA.navMore = ["more", "cards", "plan", "community", "account", "settings"]; // rute yang menyalakan tab "Lainnya"

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

  // Hari beruntun (streak) dari riwayat lokal: sesi latihan dan mock exam. Hari ini yang belum belajar tidak memutus streak.
  QA.streak = function () {
    var days = {};
    S.state.history.concat(S.state.mocks).forEach(function (e) { if (e && e.t) days[QA.dateStr(new Date(e.t))] = 1; });
    S.state.days.forEach(function (d) { days[d] = 1; });
    var n = 0, d = new Date();
    if (!days[QA.dateStr(d)]) d.setDate(d.getDate() - 1);
    while (days[QA.dateStr(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
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

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function langToggle(cls) {
    return h("button", {
      class: "lang " + (cls || ""), type: "button", "aria-label": QA.t("Ganti bahasa ke English", "Switch language to Indonesian"),
      onclick: function () { S.state.lang = S.state.lang === "id" ? "en" : "id"; S.save(); QA.render(); }
    }, h("b", null, S.state.lang === "id" ? "ID" : "EN"), h("span", { class: "lang-alt" }, S.state.lang === "id" ? " / EN" : " / ID"));
  }
  QA.langToggle = langToggle;
  QA.brandMark = function () { return h("span", { class: "mark", "aria-hidden": "true" }, "QA"); };

  // Kerangka halaman: sidebar (>= 900px), top bar ringkas + tab bar bawah (mobile). Saat gerbang masuk aktif semuanya disembunyikan.
  function buildShell(active, gated) {
    document.body.classList.toggle("gated", !!gated);
    var side = clear(document.getElementById("side")), top = clear(document.getElementById("topbar")), tab = clear(document.getElementById("tabbar"));
    if (gated) return;

    // Sidebar
    side.appendChild(h("a", { class: "brand", href: "#/dashboard" }, QA.brandMark(), h("span", null, h("span", null, "QA Drill"), h("small", { class: "tagline" }, QA.t("Belajar QA bareng", "Learning QA together")))));
    var nav = h("nav", { class: "side-nav", "aria-label": QA.t("Menu utama", "Main menu") });
    QA.nav.forEach(function (n) {
      nav.appendChild(h("a", { href: "#/" + n[0], class: n[0] === active ? "active" : "", "aria-current": n[0] === active ? "page" : null },
        QA.icon(n[3]), h("span", null, QA.t(n[1], n[2]))));
    });
    side.appendChild(nav);
    side.appendChild(h("div", { class: "side-foot" },
      QA.accountBlock ? QA.accountBlock() : null,
      h("div", { class: "side-row" }, langToggle(),
        h("a", { class: "back", href: "https://naradipta.com/" }, QA.icon("back", 14), h("span", null, "naradipta.com")))));

    // Top bar mobile
    top.appendChild(h("a", { class: "brand", href: "#/dashboard" }, QA.brandMark(), h("span", null, "QA Drill")));
    top.appendChild(h("div", { class: "top-actions" }, langToggle(),
      QA.accountChip ? QA.accountChip() : null));

    // Tab bar mobile (maksimal 5 item)
    QA.nav.slice(0, 4).concat([["more", "Lainnya", "More", "more"]]).forEach(function (n) {
      var on = n[0] === "more" ? QA.navMore.indexOf(active) >= 0 : n[0] === active;
      tab.appendChild(h("a", { href: "#/" + n[0], class: on ? "active" : "", "aria-current": on ? "page" : null },
        QA.icon(n[3], 22), h("span", null, QA.t(n[4] || n[1], n[5] || n[2]))));
    });
  }

  // Halaman "Lainnya" (mobile): menu sekunder, akun, bahasa.
  QA.routes.more = function () {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, QA.t("Lainnya", "More")));
    var list = h("div", { class: "card list" });
    [["cards", "Kartu Istilah", "Glossary Cards", "layers"], ["plan", "Rencana belajar", "Study plan", "calendar"], ["community", "Komunitas", "Community", "users"],
     ["account", "Akun", "Account", "user"], ["settings", "Pengaturan", "Settings", "sliders"]].forEach(function (n) {
      list.appendChild(h("a", { href: "#/" + n[0], class: "list-item" }, QA.icon(n[3]), h("span", null, QA.t(n[1], n[2]))));
    });
    list.appendChild(h("a", { href: "https://naradipta.com/", class: "list-item" }, QA.icon("back"), h("span", null, QA.t("Kembali ke naradipta.com", "Back to naradipta.com"))));
    root.appendChild(list);
    return root;
  };

  var TITLES = { dashboard: ["Beranda", "Home"], study: ["Materi", "Study material"], practice: ["Latihan", "Practice"], mock: ["Mock Exam", "Mock Exam"],
    cards: ["Kartu Istilah", "Glossary Cards"], plan: ["Rencana", "Plan"], settings: ["Pengaturan", "Settings"], account: ["Akun", "Account"],
    community: ["Komunitas", "Community"], more: ["Lainnya", "More"], career: ["Materi karir", "Career material"], welcome: ["Masuk", "Sign in"], loading: ["Memuat", "Loading"] };
  QA.pageTitle = function (name) { var x = TITLES[name]; return x ? QA.t(x[0], x[1]) : "QA Drill"; };

  QA.render = function (keepScroll) {
    var y = window.pageYOffset || 0;
    var r = parse();
    if (!QA.routes[r.name]) r = { name: "dashboard", arg: "" };
    var gate = QA.gate ? QA.gate() : null; // layar masuk/daftar menggantikan halaman apa pun sampai login atau pilih tamu
    if (gate) r = { name: gate, arg: r.name === gate ? r.arg : "" };
    buildShell(r.name, !!gate);
    document.documentElement.lang = S.state.lang;
    document.title = QA.pageTitle(r.name) + " | QA Drill";
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
    if (QA.account && QA.account.status === "in") return false; // sudah tersinkron ke akun
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
  document.getElementById("skip").addEventListener("click", function () { document.getElementById("app").focus(); });
  window.addEventListener("DOMContentLoaded", function () {
    QA.sanitize();
    if (!window.location.hash) window.location.hash = "#/dashboard";
    QA.render();
    QA.started = true;
  });
})();
