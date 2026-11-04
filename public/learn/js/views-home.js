// Tampilan: Beranda, Belajar, Rencana, Pengaturan.
(function () {
  var QA = window.QA, S = QA.store, h = QA.h, t = QA.t, L = QA.L;

  function bar(a, b, cls) {
    var w = b ? Math.round((a / b) * 100) : 0;
    return h("div", { class: "bar " + (cls || "") }, h("span", { style: "width:" + w + "%" }));
  }

  function stat(label, value, sub) {
    return h("div", { class: "stat" }, h("div", { class: "v" }, value), h("div", { class: "l" }, label), sub ? h("div", { class: "s" }, sub) : null);
  }

  function weightOf(ch) { return ch.mix[1] + ch.mix[2] + ch.mix[3]; }

  function pathStats(path) {
    var seen = 0, mastered = 0, total = 0;
    QA.questions.forEach(function (q) {
      if ((path === "istqb") !== !!q.lo) return;
      total++;
      var r = S.state.q[q.id];
      if (r) seen++;
      if (S.mastered(r)) mastered++;
    });
    return { total: total, seen: seen, mastered: mastered };
  }

  // Hari menuju ujian ISTQB (null bila belum diatur atau sudah lewat).
  function examDays() {
    var ex = S.state.examDate;
    if (!ex) return null;
    var d = Math.ceil((new Date(ex + "T00:00:00") - new Date().setHours(0, 0, 0, 0)) / QA.dayMs);
    return d >= 0 ? d : null;
  }
  function mockWithin(days) {
    var since = Date.now() - days * QA.dayMs;
    return S.state.mocks.some(function (m) { return m.t >= since; });
  }

  // Saran satu langkah paling penting hari ini, menurut tanggal ujian (bila ada), soal jatuh tempo, dan fokus belajar (istqb | career | both).
  function nextAction() {
    var due = QA.dueQuestions().length;
    var focus = S.state.focus || "both";
    var dd = focus === "career" ? null : examDays();
    var pre = dd === null ? "" : dd === 0 ? "" : t("H-" + dd + " menuju ujian. ", dd + " days to the exam. ");
    if (dd === 0) {
      return { text: t("Hari ini hari ujian. Istirahat cukup dan baca ringkas saja; jangan belajar materi baru.", "Today is exam day. Rest well and only skim; do not start new material."), label: null, hash: null };
    }
    // Seminggu terakhir: ukur kesiapan dengan mock exam bila belum ada dalam 3 hari terakhir.
    if (dd !== null && dd <= 7 && !mockWithin(3)) {
      return { text: pre + t("Kerjakan mock exam untuk mengukur kesiapan dan melihat bab yang masih lemah.", "Take a mock exam to gauge readiness and spot weak chapters."), label: t("Mulai mock exam", "Start a mock exam"), hash: "mock" };
    }
    if (due > 0) {
      return {
        text: pre + t("Ada " + due + " soal jatuh tempo untuk diulang.", due + " questions are due for review."),
        label: t("Ulangi sekarang", "Review now"), hash: "practice/due"
      };
    }
    function istqbStep() {
      var best = null, bestScore = -1;
      QA.chapters.forEach(function (ch) {
        var st = QA.chapterStats(ch.n);
        if (!st.total) return;
        var score = (1 - st.mastered / st.total) * (weightOf(ch) / 40);
        if (score > bestScore) { bestScore = score; best = ch; }
      });
      if (!best) return null;
      return {
        text: pre + t("Fokus berikutnya: Bab " + best.n + " (" + L(best.title) + "), bobot ujian terbesar yang belum dikuasai.",
                "Next focus: Chapter " + best.n + " (" + L(best.title) + "), the biggest exam weight not yet mastered."),
        label: t("Latihan bab ini", "Practice this chapter"), hash: "practice/ch" + best.n
      };
    }
    function careerStep() {
      var best = null, bestRatio = 2;
      CAREER.forEach(function (c) {
        var st = topicStats(c[0]);
        if (!st.total) return;
        var ratio = st.mastered / st.total;
        if (ratio < bestRatio) { bestRatio = ratio; best = c; }
      });
      if (!best) return null;
      return {
        text: pre + t("Fokus berikutnya: " + best[1] + ", topik karir yang paling sedikit dikuasai.", "Next focus: " + best[2] + ", the career topic you have mastered the least."),
        label: t("Latihan topik ini", "Practice this topic"), hash: "practice/topic:" + best[0]
      };
    }
    if (focus === "istqb") return istqbStep() || careerStep();
    if (focus === "career") return careerStep() || istqbStep();
    var a = pathStats("istqb"), b = pathStats("career");
    var ra = a.total ? a.mastered / a.total : 1, rb = b.total ? b.mastered / b.total : 1;
    return (ra <= rb ? istqbStep() || careerStep() : careerStep() || istqbStep());
  }

  // ===================== BERANDA ("Hari ini") =====================
  // Jalur 2: bekal karir QA. Topik = nilai field `topic` pada soal non-ISTQB.
  var CAREER = [
    ["rest-api", "REST API", "REST API", "Method, status code, auth, desain endpoint, dan cara mengujinya.", "Methods, status codes, auth, endpoint design and how to test them."],
    ["selenium", "Selenium", "Selenium", "Locator, wait, Page Object Model, dan flaky test (Selenium 4).", "Locators, waits, Page Object Model and flaky tests (Selenium 4)."],
    ["qa-general", "QA umum", "General QA", "SQL dasar, Git, Agile, dan tools yang dipakai sehari-hari.", "Basic SQL, Git, Agile and everyday tools."],
    ["playwright", "Playwright", "Playwright", "Pertanyaan interview seputar Playwright.", "Interview questions about Playwright."],
    ["cypress", "Cypress", "Cypress", "Pertanyaan interview seputar Cypress.", "Interview questions about Cypress."],
    ["katalon", "Katalon", "Katalon", "Pertanyaan interview seputar Katalon.", "Interview questions about Katalon."],
    ["sql", "SQL lanjutan", "Advanced SQL", "Join, agregasi, dan query untuk validasi data.", "Joins, aggregation and queries for data validation."],
    ["interview", "Jawaban terbuka", "Open answers", "Latihan menjawab pertanyaan interview dengan kata-kata sendiri.", "Practise answering interview questions in your own words."]
  ];

  function topicStats(topic) {
    var qs = QA.questions.filter(function (q) { return q.topic === topic; });
    var seen = 0, mastered = 0;
    qs.forEach(function (q) { var r = S.state.q[q.id]; if (r) seen++; if (S.mastered(r)) mastered++; });
    return { total: qs.length, seen: seen, mastered: mastered };
  }

  function greeting() {
    var a = QA.account;
    var name = a && a.status === "in" && a.email ? a.email.split("@")[0] : null;
    return name ? t("Halo, " + name, "Hi, " + name) : t("Halo, selamat belajar", "Hi, happy learning");
  }

  QA.routes.dashboard = function () {
    var o = QA.overall();
    var acc = QA.pct(o.correct, o.correct + o.wrong);
    var due = QA.dueQuestions().length;
    var root = h("div", { class: "page" });

    root.appendChild(h("h1", null, greeting()));
    root.appendChild(h("p", { class: "muted" }, t("Mulai dari yang paling penting hari ini, lalu lanjut ke jalur belajar Anda.", "Start with what matters most today, then continue on your learning path.")));

    var vb = QA.verifyBanner && QA.verifyBanner(); if (vb) root.appendChild(vb);
    if (!S.state.focus) {
      function pick(v) { return function () { S.state.focus = v; S.save(); QA.render(); }; }
      root.appendChild(h("div", { class: "card" },
        h("h2", { class: "h3" }, t("Apa tujuan belajar Anda?", "What are you studying for?")),
        h("p", { class: "small muted" }, t("Beranda akan menyesuaikan saran harian. Bisa diubah kapan saja di Pengaturan.", "The home page adapts its daily suggestion. You can change this any time in Settings.")),
        h("div", { class: "row gap" },
          h("button", { class: "btn", type: "button", onclick: pick("istqb") }, t("Sertifikasi ISTQB", "ISTQB certification")),
          h("button", { class: "btn", type: "button", onclick: pick("career") }, t("Bekal karir QA", "QA career toolkit")),
          h("button", { class: "btn", type: "button", onclick: pick("both") }, t("Keduanya", "Both")))));
    }
    // Kartu "Hari ini" hanya bila bermakna: ada soal jatuh tempo, sudah cukup jawaban (>= 10) untuk menilai area terlemah, atau ujian tinggal <= 14 hari.
    var dx = S.state.focus === "career" ? null : examDays();
    var na = due > 0 || o.seen >= 10 || (dx !== null && dx <= 14) ? nextAction() : null;
    if (na) {
      root.appendChild(h("div", { class: "card accent today-card" },
        h("div", null, h("div", { class: "eyebrow" }, t("Hari ini", "Today")), h("div", null, na.text)),
        na.hash ? h("a", { class: "btn primary", href: "#/" + na.hash }, na.label) : null));
    }

    root.appendChild(h("div", { class: "stats" },
      stat(t("Soal dilihat", "Questions seen"), o.seen + "/" + o.total),
      stat(t("Dikuasai", "Mastered"), o.mastered, t("box 3 ke atas", "box 3 and above")),
      stat(t("Akurasi", "Accuracy"), o.correct + o.wrong ? acc + "%" : "-"),
      stat(t("Jatuh tempo", "Due"), due),
      stat(t("Hari beruntun", "Day streak"), QA.streak(), t("belajar tiap hari", "studying daily"))));

    if (QA.backupDue()) {
      root.appendChild(h("div", { class: "card", role: "note" },
        h("div", null, t("Progres Anda hanya tersimpan di browser ini dan belum dicadangkan dalam 7 hari terakhir. Masuk ke akun agar tersinkron otomatis, atau ekspor cadangan.",
          "Your progress lives only in this browser and has not been backed up in the last 7 days. Sign in to sync automatically, or export a backup.")),
        h("a", { class: "btn", href: "#/settings" }, t("Ekspor cadangan", "Export backup"))));
    }

    function istqbSection() {
    var ex = S.state.examDate;
    var days = ex ? Math.ceil((new Date(ex + "T00:00:00") - new Date().setHours(0, 0, 0, 0)) / QA.dayMs) : null;
    root.appendChild(h("div", { class: "track-head" },
      h("div", null, h("h2", null, t("Jalur 1 \u00b7 Sertifikasi ISTQB CTFL", "Path 1 \u00b7 ISTQB CTFL certification")),
        h("p", { class: "muted small" },
          days === null ? t("Belum ada tanggal ujian. Atur di menu Rencana bila ingin jadwal belajar otomatis.", "No exam date yet. Set one in Plan for an automatic study schedule.")
            : days >= 0 ? t(days + " hari menuju ujian.", days + " days until the exam.")
            : t("Tanggal ujian sudah lewat; perbarui di Rencana.", "Exam date has passed; update it in Plan."))),
      h("div", { class: "row gap" }, h("a", { class: "btn small", href: "#/mock" }, t("Mock exam", "Mock exam")), h("a", { class: "btn small", href: "#/plan" }, t("Rencana", "Plan")))));
    var grid = h("div", { class: "grid" });
    QA.chapters.forEach(function (ch) {
      var st = QA.chapterStats(ch.n);
      var chips = h("div", { class: "chips" });
      QA.los.filter(function (l) { return l.ch === ch.n; }).forEach(function (l) {
        chips.appendChild(h("a", {
          class: "chip " + QA.loState(l.code), href: "#/study/ch" + ch.n,
          title: l.code + " (K" + l.k + "): " + L(l.title)
        }, l.code.replace("FL-", "")));
      });
      grid.appendChild(h("div", { class: "card" },
        h("div", { class: "row" }, h("h3", null, t("Bab ", "Chapter ") + ch.n + ". " + L(ch.title)),
          h("span", { class: "badge" }, weightOf(ch) + t(" soal ujian", " exam Qs"))),
        h("div", { class: "lbl" }, t("Dilihat ", "Seen ") + st.seen + "/" + st.total), bar(st.seen, st.total),
        h("div", { class: "lbl" }, t("Dikuasai ", "Mastered ") + st.mastered + "/" + st.total), bar(st.mastered, st.total, "good"),
        chips,
        h("div", { class: "row gap" },
          h("a", { class: "btn small", href: "#/study/ch" + ch.n }, t("Baca materi", "Read material")),
          h("a", { class: "btn small", href: "#/practice/ch" + ch.n }, t("Latihan", "Practice")))));
    });
    root.appendChild(grid);
    root.appendChild(h("div", { class: "legend small muted" },
      h("span", { class: "chip new" }, t("belum", "new")), " ",
      h("span", { class: "chip weak" }, t("lemah", "weak")), " ",
      h("span", { class: "chip learning" }, t("belajar", "learning")), " ",
      h("span", { class: "chip strong" }, t("kuat", "strong")), " ",
      h("span", { class: "chip none" }, t("tanpa soal", "no questions"))));

    var mocks = S.state.mocks.slice(-3).reverse();
    if (mocks.length) {
      var list = h("div", { class: "card" }, h("h3", null, t("Mock exam terakhir", "Latest mock exams")));
      mocks.forEach(function (m) {
        list.appendChild(h("div", { class: "row" },
          h("span", { class: "muted small" }, new Date(m.t).toLocaleString()),
          h("span", { class: m.score >= QA.exam.pass ? "ok" : "bad" }, m.score + "/" + m.total + " " + (m.score >= QA.exam.pass ? t("LULUS", "PASS") : t("BELUM", "NOT YET")))));
      });
      root.appendChild(list);
    }

    }
    function careerSection() {
    root.appendChild(h("div", { class: "track-head" },
      h("div", null, h("h2", null, t("Jalur 2 \u00b7 Bekal karir QA", "Path 2 \u00b7 QA career toolkit")),
        h("p", { class: "muted small" }, t("Topik praktik yang sering ditanyakan saat interview QA/SDET. Pilih topik yang ingin diasah.", "Practical topics often asked in QA/SDET interviews. Pick a topic to sharpen.")))));
    var cgrid = h("div", { class: "grid" });
    CAREER.forEach(function (c) {
      var st = topicStats(c[0]);
      if (!st.total) return;
      cgrid.appendChild(h("div", { class: "card" },
        h("div", { class: "row" }, h("h3", null, t(c[1], c[2])), h("span", { class: "badge" }, st.total + t(" soal", " Qs"))),
        h("p", { class: "muted small" }, t(c[3], c[4])),
        h("div", { class: "lbl" }, t("Dikuasai ", "Mastered ") + st.mastered + "/" + st.total), bar(st.mastered, st.total, "good"),
        h("div", { class: "row gap" },
          h("a", { class: "btn small", href: "#/career/" + c[0] }, t("Baca materi", "Read material")),
          h("a", { class: "btn small", href: "#/practice/topic:" + c[0] }, st.seen ? t("Lanjut latihan", "Keep practising") : t("Latihan", "Practise")))));
    });
    root.appendChild(cgrid);

    }
    if (S.state.focus === "career") { careerSection(); istqbSection(); } else { istqbSection(); careerSection(); }

    root.appendChild(h("p", { class: "small muted" },
      t("Catatan: isi aplikasi adalah ringkasan dan soal orisinal yang dipetakan ke learning objective ISTQB, bukan salinan silabus. Baca silabus resmi: ",
        "Note: the content is original summaries and questions mapped to ISTQB learning objectives, not a copy of the syllabus. Read the official syllabus: "),
      h("a", { href: QA.syllabusUrl, target: "_blank", rel: "noopener" }, "ISTQB CTFL v4.0.1")));
    return root;
  };

  // Materi lengkap per bab (Bahasa Indonesia): bagian bisa dilipat, bagian pertama terbuka.
  function sectionsBlock(secs, englishNote) {
    if (!secs || !secs.length) return null;
    var box = h("div", { class: "card mat" },
      h("h2", { class: "h3" }, t("Materi lengkap", "Full study material")),
      S.state.lang === "en" ? h("p", { class: "small muted" }, englishNote) : null);
    secs.forEach(function (sec, i) {
      var d = h("details", i === 0 ? { open: "" } : null, h("summary", null, sec.h));
      (sec.p || []).forEach(function (x) { d.appendChild(h("p", null, x)); });
      if (sec.ul) d.appendChild(h("ul", null, sec.ul.map(function (x) { return h("li", null, x); })));
      if (sec.pre) d.appendChild(h("pre", { tabindex: "0", role: "group", "aria-label": t("Contoh", "Example") }, sec.pre));
      (sec.tip || []).forEach(function (x) { d.appendChild(h("p", { class: "small" }, h("b", null, t("Jebakan ujian: ", "Exam trap: ")), x)); });
      box.appendChild(d);
    });
    return box;
  }

  function materiBlock(n) {
    return sectionsBlock((QA.materi || {})[n], "Full material is written in Indonesian. Short English notes are in each learning objective below.");
  }

  // Materi topik Jalur 2: #/career/<topic>
  QA.routes.career = function (topic) {
    var root = h("div", { class: "page" });
    var c = CAREER.filter(function (x) { return x[0] === topic; })[0];
    if (!c) { root.appendChild(h("p", { class: "muted" }, t("Topik tidak ditemukan.", "Topic not found."))); return root; }
    var st = topicStats(topic);
    root.appendChild(h("a", { href: "#/dashboard", class: "muted small backlink" }, "< " + t("Beranda", "Home")));
    root.appendChild(h("h1", null, t(c[1], c[2])));
    root.appendChild(h("p", { class: "muted" }, t(c[3], c[4])));
    root.appendChild(sectionsBlock((QA.materiKarir || {})[topic], "Full material is written in Indonesian."));
    root.appendChild(h("div", { class: "card accent" },
      h("div", null, t(st.total + " soal tersedia untuk topik ini.", st.total + " questions available for this topic.")),
      h("a", { class: "btn primary", href: "#/practice/topic:" + topic }, t("Latihan topik ini", "Practise this topic"))));
    return root;
  };

  // Panel silabus resmi: kita tidak menghosting PDF (hak cipta ISTQB), hanya menautkan ke sumber resmi.
  function syllabusCard() {
    return h("div", { class: "card" },
      h("h2", { class: "h3" }, t("Silabus resmi ISTQB CTFL v4.0", "Official ISTQB CTFL v4.0 syllabus")),
      h("p", { class: "small muted" }, t("Baca materi di sini bersama silabus resmi. Silabus gratis dari ISTQB dan IDSTB; PDF-nya tidak kami simpan di situs ini karena hak ciptanya milik ISTQB.",
        "Read the material here alongside the official syllabus. It is free from ISTQB and IDSTB; we do not host the PDF here because ISTQB holds the copyright.")),
      h("ul", { class: "linklist" },
        h("li", null, h("a", { href: QA.syllabusUrl, target: "_blank", rel: "noopener" }, t("English: PDF CTFL v4.0.1 (istqb.org)", "English: CTFL v4.0.1 PDF (istqb.org)"))),
        QA.syllabusUrlId ? h("li", null, h("a", { href: QA.syllabusUrlId, target: "_blank", rel: "noopener" }, t("Bahasa Indonesia (IDSTB)", "Indonesian (IDSTB)"))) : null,
        h("li", null, h("a", { href: QA.syllabusPageUrl, target: "_blank", rel: "noopener" }, t("Halaman unduhan resmi ISTQB: silabus, sample exam, aturan ujian, dan terjemahan", "Official ISTQB download page: syllabus, sample exams, exam rules and translations")))),
      QA.syllabusUrlId ? null : h("p", { class: "small muted" }, t("Versi Bahasa Indonesia diterbitkan oleh IDSTB (Indonesia Software Testing Board); cari di halaman unduhan ISTQB di atas atau situs IDSTB.", "The Indonesian version is published by IDSTB (Indonesia Software Testing Board); look on the ISTQB download page above or on the IDSTB site.")));
  }

  // ===================== BELAJAR =====================
  QA.routes.study = function (arg) {
    var root = h("div", { class: "page" });
    var m = /^ch(\d)$/.exec(arg || "");
    if (!m) {
      root.appendChild(h("h1", null, t("Materi belajar", "Study material")));
      root.appendChild(h("p", { class: "muted" }, t("Materi lengkap Bahasa Indonesia untuk dua jalur: sertifikasi ISTQB dan bekal karir QA.", "Full Indonesian material for two paths: ISTQB certification and the QA career toolkit.")));
      root.appendChild(h("h2", null, t("Jalur 1 \u00b7 ISTQB CTFL", "Path 1 \u00b7 ISTQB CTFL")));
      root.appendChild(syllabusCard());
      QA.chapters.forEach(function (ch) {
        var los = QA.los.filter(function (l) { return l.ch === ch.n; });
        root.appendChild(h("a", { class: "card link", href: "#/study/ch" + ch.n },
          h("div", { class: "row" }, h("h2", { class: "h3" }, t("Bab ", "Chapter ") + ch.n + ". " + L(ch.title)), h("span", { class: "badge" }, los.length + " LO")),
          h("div", { class: "muted small" }, ch.min + t(" menit", " min"))));
      });
      root.appendChild(h("h2", null, t("Jalur 2 \u00b7 Bekal karir QA", "Path 2 \u00b7 QA career toolkit")));
      CAREER.forEach(function (c) {
        if (!topicStats(c[0]).total) return;
        root.appendChild(h("a", { class: "card link", href: "#/career/" + c[0] },
          h("div", { class: "row" }, h("h3", null, t(c[1], c[2])), h("span", { class: "badge" }, topicStats(c[0]).total + t(" soal", " Qs"))),
          h("div", { class: "muted small" }, t(c[3], c[4]))));
      });
      return root;
    }
    var n = parseInt(m[1], 10);
    var ch = QA.chapters.filter(function (c) { return c.n === n; })[0];
    if (!ch) return root;
    root.appendChild(h("a", { href: "#/study", class: "muted small backlink" }, "< " + t("Semua bab", "All chapters")));
    root.appendChild(h("h1", null, t("Bab ", "Chapter ") + n + ". " + L(ch.title)));
    if (ch.check) root.appendChild(h("div", { class: "card warn small" }, t("Kode LO bab ini disusun dari sumber sekunder dan ingatan. Cocokkan dengan silabus resmi sebelum mengandalkannya.", "LO codes for this chapter come from secondary sources and memory. Check them against the official syllabus before relying on them.")));
    root.appendChild(materiBlock(n));
    QA.los.filter(function (l) { return l.ch === n; }).forEach(function (l) {
      var qn = (QA.qByLo[l.code] || []).length;
      root.appendChild(h("div", { class: "card" },
        h("div", { class: "row" },
          h("h2", { class: "h3" }, l.code + " " + L(l.title)),
          h("span", { class: "badge k" + l.k }, "K" + l.k)),
        h("p", null, L(l.note)),
        h("div", { class: "row gap" },
          h("span", { class: "chip " + QA.loState(l.code) }, l.code.replace("FL-", "")),
          qn ? h("a", { class: "btn", href: "#/practice/lo:" + l.code }, t("Latih " + qn + " soal", "Practice " + qn + " questions")) : h("span", { class: "muted small" }, t("Belum ada soal", "No questions yet")))));
    });
    return root;
  };

  // ===================== RENCANA =====================
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }

  QA.buildPlan = function (examDateStr, today) {
    var exam = new Date(examDateStr + "T00:00:00");
    var start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var days = Math.round((exam - start) / QA.dayMs);
    if (days < 1) return null;
    var n = QA.chapters.length;
    var studyDays = Math.max(n, Math.floor(days * 0.65));
    if (studyDays > days - 1 && days > 1) studyDays = days - 1;
    if (studyDays < n) {
      // Waktu lebih pendek dari jumlah bab: beberapa bab digabung per hari, semua jatuh sebelum hari ujian.
      var d = Math.max(1, studyDays), packed = [];
      QA.chapters.forEach(function (c, i) {
        var day = Math.floor(i * d / n);
        packed.push({ from: addDays(start, day), to: addDays(start, day), kind: "study", ch: c });
      });
      if (days - d > 0) packed.push({ from: addDays(start, d), to: addDays(start, days - 1), kind: "review", mocks: Math.max(1, Math.floor((days - d) / 3)) });
      return { days: days, rows: packed, studyDays: d, reviewDays: days - d };
    }
    var totalMin = QA.chapters.reduce(function (a, c) { return a + c.min; }, 0);
    var alloc = QA.chapters.map(function (c) { return Math.max(1, Math.round(studyDays * c.min / totalMin)); });
    var sum = alloc.reduce(function (a, b) { return a + b; }, 0);
    while (sum > studyDays && sum > QA.chapters.length) { var mi = alloc.indexOf(Math.max.apply(null, alloc)); alloc[mi]--; sum--; }
    while (sum < studyDays) { var ma = alloc.indexOf(Math.max.apply(null, alloc)); alloc[ma]++; sum++; }
    var rows = [], cursor = 0;
    QA.chapters.forEach(function (c, i) {
      rows.push({ from: addDays(start, cursor), to: addDays(start, cursor + alloc[i] - 1), kind: "study", ch: c });
      cursor += alloc[i];
    });
    var reviewDays = days - cursor;
    if (reviewDays > 0) rows.push({ from: addDays(start, cursor), to: addDays(start, days - 1), kind: "review", mocks: Math.max(1, Math.floor(reviewDays / 3)) });
    return { days: days, rows: rows, studyDays: cursor, reviewDays: reviewDays };
  };

  QA.routes.plan = function () {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Rencana belajar", "Study plan")));
    var dateInput = h("input", { type: "date", value: S.state.examDate || "" });
    var minInput = h("input", { type: "number", min: "30", max: "480", step: "15", value: String(S.state.dailyMin) });
    root.appendChild(h("div", { class: "card" },
      h("label", null, t("Tanggal ujian", "Exam date"), dateInput),
      h("label", null, t("Menit belajar per hari", "Study minutes per day"), minInput),
      h("button", {
        class: "btn primary", onclick: function () {
          S.state.examDate = dateInput.value || null;
          S.state.dailyMin = Math.max(30, parseInt(minInput.value, 10) || 120);
          S.save(); QA.render();
        }
      }, t("Simpan dan buat jadwal", "Save and build schedule"))));

    if (!S.state.examDate) { root.appendChild(h("p", { class: "muted" }, t("Isi tanggal ujian untuk melihat jadwal.", "Enter your exam date to see the schedule."))); return root; }
    var plan = QA.buildPlan(S.state.examDate, new Date());
    if (!plan) { root.appendChild(h("p", { class: "muted" }, t("Tanggal ujian harus di masa depan.", "The exam date must be in the future."))); return root; }

    var perDay = Math.max(10, Math.round(S.state.dailyMin * 0.4 / 1.5));
    root.appendChild(h("div", { class: "card accent" },
      h("b", null, plan.days + t(" hari tersisa. Target harian:", " days left. Daily target:")),
      h("ul", null,
        h("li", null, t("Baca catatan bab: ~" + Math.round(S.state.dailyMin * 0.4) + " menit", "Read chapter notes: ~" + Math.round(S.state.dailyMin * 0.4) + " min")),
        h("li", null, t("Latihan soal: ~" + perDay + " soal", "Practice: ~" + perDay + " questions")),
        h("li", null, t("Ulang soal jatuh tempo dan kartu istilah: sisanya", "Review due questions and glossary cards: the rest")))));

    var todayStr = QA.dateStr(new Date());
    var fmt = function (d) { return d.toLocaleDateString(S.state.lang === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "short" }); };
    plan.rows.forEach(function (r) {
      var isToday = QA.dateStr(r.from) <= todayStr && todayStr <= QA.dateStr(r.to);
      var title = r.kind === "study" ? t("Bab ", "Chapter ") + r.ch.n + ". " + L(r.ch.title)
        : t("Fase ulang dan simulasi", "Review and simulation phase");
      var detail = r.kind === "study"
        ? t("Baca catatan LO, latihan bab, lalu ulang soal yang salah.", "Read LO notes, practise the chapter, then redo missed questions.")
        : t("Jalankan sekitar " + r.mocks + " mock exam, ulang soal lemah, dan kartu istilah. Hari ujian: istirahat cukup.", "Take about " + r.mocks + " mock exams, redo weak questions and glossary cards. Exam day: rest well.");
      root.appendChild(h("div", { class: "card" + (isToday ? " today" : "") },
        h("div", { class: "row" }, h("b", null, fmt(r.from) + (QA.dateStr(r.from) === QA.dateStr(r.to) ? "" : " - " + fmt(r.to))), isToday ? h("span", { class: "badge" }, t("Hari ini", "Today")) : null),
        h("div", null, title), h("div", { class: "muted small" }, detail)));
    });
    root.appendChild(h("p", { class: "small muted" }, t("Format ujian CTFL v4.0: 40 soal, lulus 26 poin (65%), 60 menit (75 menit untuk non-native speaker). Cek aturan terbaru di situs ISTQB.", "CTFL v4.0 exam: 40 questions, pass 26 points (65%), 60 minutes (75 for non-native speakers). Check the latest rules on the ISTQB site.")));
    return root;
  };

  // ===================== PENGATURAN =====================
  var importNote = "";
  QA.routes.settings = function () {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Pengaturan", "Settings")));
    var extra = h("input", { type: "checkbox", checked: S.state.extraTime });
    extra.addEventListener("change", function () { S.state.extraTime = extra.checked; S.save(); });
    var conf = h("input", { type: "checkbox", checked: S.state.confidence });
    conf.addEventListener("change", function () { S.state.confidence = conf.checked; S.save(); });
    var focus = h("select", { id: "focus-sel" }, [["", "Belum dipilih (keduanya)", "Not chosen (both)"], ["istqb", "Sertifikasi ISTQB", "ISTQB certification"], ["career", "Bekal karir QA", "QA career toolkit"], ["both", "Keduanya", "Both"]].map(function (o) {
      return h("option", { value: o[0], selected: (S.state.focus || "") === o[0] ? "" : null }, t(o[1], o[2]));
    }));
    focus.addEventListener("change", function () { S.state.focus = focus.value || null; S.save(); });
    root.appendChild(h("div", { class: "card" },
      h("label", { for: "focus-sel" }, t("Fokus belajar (memengaruhi saran di Beranda)", "Study focus (affects the Home suggestion)"), focus),
      h("label", { class: "inline" }, conf, t("Tanya tingkat keyakinan (menebak/ragu/yakin) sebelum jawaban dibuka di Latihan", "Ask for confidence (guess/unsure/sure) before revealing the answer in Practice")),
      h("label", { class: "inline" }, extra, t("Mock exam 75 menit (waktu tambahan untuk non-native speaker)", "75-minute mock exam (extra time for non-native speakers)")),
      h("div", { class: "row gap" },
        h("button", { class: "btn", onclick: function () { S.state.lang = "id"; S.save(); QA.render(); } }, "Bahasa Indonesia"),
        h("button", { class: "btn", onclick: function () { S.state.lang = "en"; S.save(); QA.render(); } }, "English"))));

    var msg = h("div", { class: "small muted", role: "status" }, importNote);
    importNote = "";
    var file = h("input", { type: "file", accept: "application/json", "aria-label": t("Impor berkas progres (.json)", "Import progress file (.json)") });
    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try { S.importJSON(String(rd.result)); importNote = t("Progres berhasil diimpor.", "Progress imported."); QA.announce(importNote); QA.render(); }
        catch (e) { msg.textContent = t("Gagal impor: ", "Import failed: ") + e.message; }
      };
      rd.readAsText(f);
    });
    function exportNoteText() {
      return S.state.lastExport
        ? t("Terakhir diekspor: ", "Last exported: ") + new Date(S.state.lastExport).toLocaleString()
        : t("Belum pernah diekspor.", "Never exported.");
    }
    var lastExportNote = h("p", { class: "small muted" }, exportNoteText());
    root.appendChild(h("div", { class: "card" },
      h("h2", { class: "h3" }, t("Cadangan progres", "Progress backup")),
      h("p", { class: "muted small" }, QA.account && QA.account.status === "in"
        ? t("Progres otomatis tersimpan di akun Anda. Ekspor tetap berguna sebagai cadangan pribadi; impor akan menggantikan progres akun ini.", "Progress is saved to your account automatically. Export is still handy as a personal backup; importing replaces this account's progress.")
        : t("Progres tersimpan di browser ini saja. Ekspor secara berkala.", "Progress is stored in this browser only. Export regularly.")),
      h("div", { class: "row gap" },
        h("button", {
          class: "btn", onclick: function () {
            var blob = new Blob([S.exportJSON()], { type: "application/json" });
            var a = h("a", { href: URL.createObjectURL(blob), download: "qa-drill-progress-" + QA.dateStr(new Date()) + ".json" });
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            S.state.lastExport = Date.now(); S.save();
            lastExportNote.textContent = exportNoteText();
          }
        }, t("Ekspor", "Export")), file),
      lastExportNote,
      msg));

    root.appendChild(h("div", { class: "card" },
      h("h2", { class: "h3" }, t("Hapus semua progres", "Reset all progress")),
      QA.account && QA.account.status === "in" ? h("p", { class: "small muted" }, t("Karena Anda masuk, ini juga mengosongkan progres di akun dan perangkat lain.", "Since you are signed in, this also clears progress on your account and other devices.")) : null,
      h("button", {
        class: "btn danger", onclick: function () {
          if (window.confirm(t("Hapus semua progres? Tindakan ini tidak dapat dibatalkan.", "Delete all progress? This cannot be undone."))) { S.reset(); QA.render(); }
        }
      }, t("Hapus progres", "Reset progress"))));
    return root;
  };
})();
