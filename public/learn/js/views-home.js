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

  function nextAction() {
    var due = QA.dueQuestions().length;
    if (due > 0) {
      return {
        text: t("Ada " + due + " soal jatuh tempo untuk diulang.", due + " questions are due for review."),
        label: t("Ulangi sekarang", "Review now"), hash: "practice/due"
      };
    }
    var best = null, bestScore = -1;
    QA.chapters.forEach(function (ch) {
      var st = QA.chapterStats(ch.n);
      if (!st.total) return;
      var score = (1 - st.mastered / st.total) * (weightOf(ch) / 40);
      if (score > bestScore) { bestScore = score; best = ch; }
    });
    if (!best) return null;
    return {
      text: t("Fokus berikutnya: Bab " + best.n + " (" + L(best.title) + "), bobot ujian terbesar yang belum dikuasai.",
              "Next focus: Chapter " + best.n + " (" + L(best.title) + "), the biggest exam weight not yet mastered."),
      label: t("Latihan bab ini", "Practice this chapter"), hash: "practice/ch" + best.n
    };
  }

  // ===================== BERANDA =====================
  QA.routes.dashboard = function () {
    var o = QA.overall();
    var acc = QA.pct(o.correct, o.correct + o.wrong);
    var due = QA.dueQuestions().length;
    var root = h("div", { class: "page" });

    root.appendChild(h("h1", null, t("Jalur menuju sertifikasi ISTQB CTFL", "Your path to ISTQB CTFL")));

    var ex = S.state.examDate;
    var days = ex ? Math.ceil((new Date(ex + "T00:00:00") - new Date().setHours(0, 0, 0, 0)) / QA.dayMs) : null;
    root.appendChild(h("p", { class: "muted" },
      days === null ? t("Atur tanggal ujian di menu Rencana agar jadwal belajar dibuat otomatis.", "Set your exam date in Plan to get an automatic study schedule.")
        : days >= 0 ? t(days + " hari menuju ujian.", days + " days until the exam.")
        : t("Tanggal ujian sudah lewat; perbarui di Pengaturan.", "Exam date has passed; update it in Settings.")));

    root.appendChild(h("div", { class: "stats" },
      stat(t("Soal dilihat", "Questions seen"), o.seen + "/" + o.total),
      stat(t("Dikuasai", "Mastered"), o.mastered, t("box 3 ke atas", "box 3 and above")),
      stat(t("Akurasi", "Accuracy"), o.correct + o.wrong ? acc + "%" : "-"),
      stat(t("Jatuh tempo", "Due"), due)));

    var na = nextAction();
    if (na) {
      root.appendChild(h("div", { class: "card accent" },
        h("div", null, na.text),
        h("a", { class: "btn primary", href: "#/" + na.hash }, na.label)));
    }

    if (QA.backupDue()) {
      root.appendChild(h("div", { class: "card", role: "note" },
        h("div", null, t("Progres Anda hanya tersimpan di browser ini dan belum dicadangkan dalam 7 hari terakhir.",
          "Your progress lives only in this browser and has not been backed up in the last 7 days.")),
        h("a", { class: "btn", href: "#/settings" }, t("Ekspor cadangan", "Export backup"))));
    }

    root.appendChild(h("h2", null, t("Peta bab ISTQB", "ISTQB chapter map")));
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
        h("div", { class: "row" }, h("h2", { class: "h3" }, t("Bab ", "Chapter ") + ch.n + ". " + L(ch.title)),
          h("span", { class: "badge" }, weightOf(ch) + t(" soal ujian", " exam Qs"))),
        h("div", { class: "muted small" }, ch.min + t(" menit belajar (silabus)", " min study (syllabus)") + (ch.check ? t(" - kode LO perlu dicek", " - verify LO codes") : "")),
        h("div", { class: "lbl" }, t("Dilihat ", "Seen ") + st.seen + "/" + st.total), bar(st.seen, st.total),
        h("div", { class: "lbl" }, t("Dikuasai ", "Mastered ") + st.mastered + "/" + st.total), bar(st.mastered, st.total, "good"),
        chips,
        h("div", { class: "row gap" },
          h("a", { class: "btn", href: "#/study/ch" + ch.n }, t("Belajar", "Study")),
          h("a", { class: "btn", href: "#/practice/ch" + ch.n }, t("Latihan", "Practice")))));
    });
    root.appendChild(grid);

    root.appendChild(h("div", { class: "legend small muted" },
      h("span", { class: "chip new" }, t("belum", "new")), " ",
      h("span", { class: "chip weak" }, t("lemah", "weak")), " ",
      h("span", { class: "chip learning" }, t("belajar", "learning")), " ",
      h("span", { class: "chip strong" }, t("kuat", "strong")), " ",
      h("span", { class: "chip none" }, t("tanpa soal", "no questions"))));

    root.appendChild(h("h2", null, t("Riwayat mock exam", "Mock exam history")));
    var mocks = S.state.mocks.slice(-5).reverse();
    if (!mocks.length) root.appendChild(h("p", { class: "muted" }, t("Belum ada mock exam. Coba satu setelah menyelesaikan beberapa bab.", "No mock exams yet. Try one after finishing a few chapters.")));
    else {
      var list = h("div", { class: "card" });
      mocks.forEach(function (m) {
        list.appendChild(h("div", { class: "row" },
          h("span", null, new Date(m.t).toLocaleString()),
          h("span", { class: m.score >= QA.exam.pass ? "ok" : "bad" }, m.score + "/" + m.total + " " + (m.score >= QA.exam.pass ? t("LULUS", "PASS") : t("BELUM", "NOT YET")))));
      });
      root.appendChild(list);
    }

    root.appendChild(h("p", { class: "small muted" },
      t("Catatan: isi aplikasi adalah ringkasan dan soal orisinal yang dipetakan ke learning objective ISTQB, bukan salinan silabus. Baca silabus resmi: ",
        "Note: the content is original summaries and questions mapped to ISTQB learning objectives, not a copy of the syllabus. Read the official syllabus: "),
      h("a", { href: QA.syllabusUrl, target: "_blank", rel: "noopener" }, "ISTQB CTFL v4.0.1")));
    return root;
  };

  // ===================== BELAJAR =====================
  QA.routes.study = function (arg) {
    var root = h("div", { class: "page" });
    var m = /^ch(\d)$/.exec(arg || "");
    if (!m) {
      root.appendChild(h("h1", null, t("Belajar per bab", "Study by chapter")));
      root.appendChild(h("p", { class: "muted" }, t("Catatan ringkas per learning objective. Gunakan bersama silabus resmi.", "Short notes per learning objective. Use alongside the official syllabus.")));
      QA.chapters.forEach(function (ch) {
        var los = QA.los.filter(function (l) { return l.ch === ch.n; });
        root.appendChild(h("a", { class: "card link", href: "#/study/ch" + ch.n },
          h("div", { class: "row" }, h("h2", { class: "h3" }, t("Bab ", "Chapter ") + ch.n + ". " + L(ch.title)), h("span", { class: "badge" }, los.length + " LO")),
          h("div", { class: "muted small" }, ch.min + t(" menit", " min"))));
      });
      return root;
    }
    var n = parseInt(m[1], 10);
    var ch = QA.chapters.filter(function (c) { return c.n === n; })[0];
    if (!ch) return root;
    root.appendChild(h("a", { href: "#/study", class: "muted small" }, "< " + t("Semua bab", "All chapters")));
    root.appendChild(h("h1", null, t("Bab ", "Chapter ") + n + ". " + L(ch.title)));
    if (ch.check) root.appendChild(h("div", { class: "card warn small" }, t("Kode LO bab ini disusun dari sumber sekunder dan ingatan. Cocokkan dengan silabus resmi sebelum mengandalkannya.", "LO codes for this chapter come from secondary sources and memory. Check them against the official syllabus before relying on them.")));
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
    root.appendChild(h("div", { class: "card" },
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
      h("p", { class: "muted small" }, t("Progres tersimpan di browser ini saja. Ekspor secara berkala.", "Progress is stored in this browser only. Export regularly.")),
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
      h("button", {
        class: "btn danger", onclick: function () {
          if (window.confirm(t("Hapus semua progres? Tindakan ini tidak dapat dibatalkan.", "Delete all progress? This cannot be undone."))) { S.reset(); QA.render(); }
        }
      }, t("Hapus progres", "Reset progress"))));
    return root;
  };
})();
