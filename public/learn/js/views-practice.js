// Tampilan: Latihan (dengan pengulangan berjarak).
(function () {
  var QA = window.QA, S = QA.store, G = QA.grade, h = QA.h, t = QA.t, L = QA.L;
  var session = null;

  var SCOPES = [
    ["all", "Semua topik", "All topics"],
    ["istqb", "Semua materi ISTQB (bab 1-6)", "All ISTQB material (chapters 1-6)"],
    ["ch1", "ISTQB Bab 1 - Dasar-dasar Testing", "ISTQB Ch 1 - Fundamentals"],
    ["ch2", "ISTQB Bab 2 - SDLC", "ISTQB Ch 2 - SDLC"],
    ["ch3", "ISTQB Bab 3 - Static Testing", "ISTQB Ch 3 - Static Testing"],
    ["ch4", "ISTQB Bab 4 - Analisis dan Desain Test", "ISTQB Ch 4 - Test Analysis and Design"],
    ["ch5", "ISTQB Bab 5 - Mengelola Aktivitas Test", "ISTQB Ch 5 - Managing the Test Activities"],
    ["ch6", "ISTQB Bab 6 - Test Tools", "ISTQB Ch 6 - Test Tools"],
    ["topic:rest-api", "REST API", "REST API"],
    ["topic:selenium", "Selenium", "Selenium"],
    ["topic:qa-general", "QA umum (SQL, Git, Agile, tools)", "General QA (SQL, Git, Agile, tools)"],
    ["topic:playwright", "Interview: Playwright", "Interview: Playwright"],
    ["topic:cypress", "Interview: Cypress", "Interview: Cypress"],
    ["topic:katalon", "Interview: Katalon", "Interview: Katalon"],
    ["topic:sql", "Interview: SQL lanjutan", "Interview: Advanced SQL"],
    ["topic:interview", "Interview: jawaban terbuka", "Interview: open-ended answers"],
    ["due", "Hanya yang jatuh tempo", "Due for review only"]
  ];

  function poolFor(f) {
    return QA.questions.filter(function (q) {
      if (f.level && String(q.level) !== String(f.level)) return false;
      if (f.type && q.type !== f.type) return false;
      var sc = f.scope;
      if (sc === "all") return true;
      if (sc === "istqb") return !!q.lo;
      if (sc === "due") return S.isDue(S.state.q[q.id]);
      if (sc.indexOf("ch") === 0) return QA.chapterOf(q) === parseInt(sc.slice(2), 10);
      if (sc.indexOf("topic:") === 0) return q.topic === sc.slice(6);
      if (sc.indexOf("lo:") === 0) return q.lo === sc.slice(3);
      return true;
    });
  }

  // Interleaving: soal berurutan jangan dari LO/topik yang sama (bila masih ada pilihan di depan).
  function spread(list) {
    function key(q) { return q.lo || q.topic; }
    var rest = list.slice(), out = [], prev = null;
    while (rest.length) {
      var idx = 0;
      for (var i = 0; i < Math.min(rest.length, 8); i++) { if (key(rest[i]) !== prev) { idx = i; break; } }
      var q = rest.splice(idx, 1)[0];
      out.push(q); prev = key(q);
    }
    return out;
  }

  function smartOrder(pool) {
    function rank(q) {
      var r = S.state.q[q.id];
      if (!r) return 1;
      return S.isDue(r) ? 0 : 2;
    }
    return spread(QA.shuffle(pool).sort(function (a, b) { return rank(a) - rank(b); }));
  }

  QA.makeItem = function (q) {
    var item = { q: q, answered: false, correct: null, pick: null, draft: "", res: null };
    if (q.type === "mcq") item.order = QA.shuffle(q.options.id.map(function (_, i) { return i; }));
    return item;
  };

  QA.optionText = function (q, idx) { return q.options[S.state.lang][idx] || q.options.en[idx]; };

  function startSession(f, count, ordered) {
    var pool = poolFor(f);
    if (!pool.length) return false;
    var picked = (ordered === "random" ? QA.shuffle(pool) : smartOrder(pool)).slice(0, count || pool.length);
    session = { items: picked.map(QA.makeItem), i: 0, filter: f };
    return true;
  }

  function scopeLabel(sc) {
    for (var i = 0; i < SCOPES.length; i++) if (SCOPES[i][0] === sc) return t(SCOPES[i][1], SCOPES[i][2]);
    if (sc.indexOf("lo:") === 0) return sc.slice(3) + " " + L((QA.byLo[sc.slice(3)] || {}).title);
    return sc;
  }

  // ---------- setup ----------
  function setupView(msg) {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Latihan soal", "Practice")));
    function opt(s) { return h("option", { value: s[0] }, t(s[1], s[2]) + " (" + poolFor({ scope: s[0] }).length + ")"); }
    function grp(label, list) { return h("optgroup", { label: label }, list.map(opt)); }
    var isIstqb = function (s) { return s[0] === "istqb" || /^ch\d$/.test(s[0]); };
    var scope = h("select", null,
      opt(SCOPES[0]), opt(SCOPES[SCOPES.length - 1]),
      grp(t("Jalur 1 \u00b7 ISTQB CTFL", "Path 1 \u00b7 ISTQB CTFL"), SCOPES.filter(isIstqb)),
      grp(t("Jalur 2 \u00b7 Bekal karir QA", "Path 2 \u00b7 QA career toolkit"), SCOPES.filter(function (s) { return s[0].indexOf("topic:") === 0; })));
    var level = h("select", null, [["", "Semua level", "All levels"], ["1", "Level 1 (dasar)", "Level 1 (basic)"], ["2", "Level 2 (menengah)", "Level 2 (intermediate)"], ["3", "Level 3 (lanjut)", "Level 3 (advanced)"]].map(function (o) { return h("option", { value: o[0] }, t(o[1], o[2])); }));
    var type = h("select", null, [["", "Semua tipe", "All types"], ["mcq", "Pilihan ganda", "Multiple choice"], ["tf", "Benar/Salah", "True/False"], ["short", "Isian singkat", "Short answer"]].map(function (o) { return h("option", { value: o[0] }, t(o[1], o[2])); }));
    var order = h("select", null, [["smart", "Cerdas (jatuh tempo, belum dilihat, lalu sisanya; topik diselang-seling)", "Smart (due, unseen, then the rest; topics interleaved)"], ["random", "Acak", "Random"]].map(function (o) { return h("option", { value: o[0] }, t(o[1], o[2])); }));
    var count = h("select", null, [10, 20, 40, 0].map(function (n) { return h("option", { value: String(n) }, n ? n + t(" soal", " questions") : t("Semua", "All")); }));
    root.appendChild(h("div", { class: "card" },
      msg ? h("div", { class: "warn small" }, msg) : null,
      h("label", null, t("Cakupan", "Scope"), scope),
      h("label", null, t("Level", "Level"), level),
      h("label", null, t("Tipe soal", "Question type"), type),
      h("label", null, t("Urutan", "Order"), order),
      h("label", null, t("Jumlah", "Count"), count),
      h("button", {
        class: "btn primary", onclick: function () {
          var ok = startSession({ scope: scope.value, level: level.value, type: type.value }, parseInt(count.value, 10), order.value);
          if (!ok) { QA.render(); return; }
          QA.render();
        }
      }, t("Mulai", "Start"))));
    root.appendChild(h("p", { class: "small muted" }, t("Setiap jawaban memengaruhi jadwal ulang: benar dan yakin = interval lebih panjang, menebak/ragu = naik lebih pelan, salah = kembali ke awal.", "Each answer affects the review schedule: correct and sure = longer interval, guessing/unsure = slower climb, wrong = back to the start.")));
    root.appendChild(h("details", { class: "card" },
      h("summary", null, t("Mengapa latihan ini bekerja (dasar riset belajar)", "Why this practice works (learning-science basis)")),
      h("ul", { class: "small" },
        h("li", null, h("b", null, t("Retrieval practice: ", "Retrieval practice: ")), t("menjawab dari ingatan jauh lebih kuat daripada membaca ulang (testing effect).", "recalling from memory beats rereading (testing effect).")),
        h("li", null, h("b", null, t("Spaced repetition: ", "Spaced repetition: ")), t("jarak ulang melebar (1, 2, 4, 8... hari) memperlambat lupa.", "widening gaps (1, 2, 4, 8... days) slow forgetting.")),
        h("li", null, h("b", null, t("Interleaving: ", "Interleaving: ")), t("topik diselang-seling agar Anda belajar memilih strategi, bukan hanya menghafal pola satu bab.", "topics are mixed so you learn to choose a strategy, not just repeat one chapter's pattern.")),
        h("li", null, h("b", null, t("Keyakinan (kalibrasi): ", "Confidence (calibration): ")), t("menandai menebak/ragu/yakin membuat Anda jujur soal apa yang benar-benar dikuasai; salah tapi yakin adalah miskonsepsi yang paling mudah diperbaiki lewat umpan balik (hypercorrection).", "marking guess/unsure/sure keeps you honest about what you really know; being wrong but sure is a misconception best fixed by feedback (hypercorrection).")),
        h("li", null, h("b", null, t("Relearning: ", "Relearning: ")), t("soal yang salah muncul lagi beberapa soal kemudian dalam sesi yang sama, setelah Anda membaca penjelasan.", "missed questions return a few questions later in the same session, after you read the explanation.")),
        h("li", null, h("b", null, t("Umpan balik korektif: ", "Corrective feedback: ")), t("jawaban benar dan alasannya langsung ditampilkan, plus pembahasan lengkap di akhir sesi.", "the right answer and the reason are shown right away, plus a full review at the end.")))));
    return root;
  }

  // ---------- satu soal ----------
  // Soal ulangan (retry) tidak mengubah jadwal Leitner agar kesalahan awal tidak dihitung ganda.
  var RETRY_GAP = 3;
  function finishItem(item, correct) {
    item.answered = true; item.correct = correct;
    QA.announce(correct ? t("Benar", "Correct") : t("Salah. Jawaban benar: ", "Wrong. Correct answer: ") + answerText(item.q));
    if (item.retry) return;
    S.record(item.q.id, correct, item.conf);
    if (!correct && session && !item.retryQueued) {
      item.retryQueued = true;
      var again = QA.makeItem(item.q);
      again.retry = true;
      session.items.splice(Math.min(session.i + 1 + RETRY_GAP, session.items.length), 0, again);
    }
  }

  // Pilihan jawaban: bila mode keyakinan aktif, minta tingkat keyakinan dulu sebelum jawaban dibuka.
  function choose(item, pick, correct, onChange) {
    item.pick = pick;
    if (S.state.confidence) { item.pending = true; item.pendingCorrect = correct; QA.announce(t("Pilih tingkat keyakinan Anda", "Choose how sure you are")); }
    else finishItem(item, correct);
    onChange();
  }

  var CONF = [["guess", "Menebak", "Guessing"], ["unsure", "Ragu", "Unsure"], ["sure", "Yakin", "Sure"]];
  function confidenceRow(item, onChange) {
    return h("div", { class: "card conf" },
      h("div", { class: "small muted" }, t("Seberapa yakin jawaban Anda?", "How sure are you?")),
      h("div", { class: "row gap" }, CONF.map(function (c) {
        return h("button", {
          class: "btn conf-" + c[0], "data-autofocus": c[0] === "guess" ? "1" : null, onclick: function () {
            item.conf = c[0]; item.pending = false; finishItem(item, item.pendingCorrect); onChange();
          }
        }, t(c[1], c[2]));
      })));
  }

  function answerText(q) {
    return q.type === "mcq" ? QA.optionText(q, q.answer) : q.type === "tf" ? (q.answer ? t("Benar", "True") : t("Salah", "False")) : L(q.model);
  }

  function feedbackBanner(item) {
    var q = item.q;
    if (item.correct) {
      return h("div", { class: "card okbox" }, h("b", null, "✓ " + t("Benar", "Correct")),
        item.conf === "guess" ? h("div", { class: "small" }, t("Benar tapi menebak: soal ini akan muncul lebih cepat.", "Correct but a guess: this question will come back sooner.")) : null);
    }
    return h("div", { class: "card badbox" }, h("b", null, "✗ " + t("Belum tepat", "Not quite")),
      h("div", null, t("Jawaban benar: ", "Correct answer: ") + answerText(q)),
      item.conf === "sure" ? h("div", { class: "small" }, t("Anda yakin tetapi keliru: ini miskonsepsi, baca penjelasan di bawah dengan teliti.", "You were sure but wrong: a misconception, so read the explanation below carefully.")) : null);
  }

  function questionBody(item, onChange) {
    var q = item.q, box = h("div", { class: "qbody" });
    if (q.type === "mcq") {
      item.order.forEach(function (orig, pos) {
        var cls = "opt";
        if (item.answered) { if (orig === q.answer) cls += " right"; else if (orig === item.pick) cls += " wrong"; }
        else if (item.pending && orig === item.pick) cls += " picked";
        box.appendChild(h("button", {
          class: cls, disabled: item.answered || item.pending,
          onclick: function () { choose(item, orig, G.gradeChoice(q, orig), onChange); }
        }, String.fromCharCode(65 + pos) + ". " + QA.optionText(q, orig)));
      });
    } else if (q.type === "tf") {
      [[true, "Benar", "True"], [false, "Salah", "False"]].forEach(function (o) {
        var cls = "opt";
        if (item.answered) { if (o[0] === q.answer) cls += " right"; else if (o[0] === item.pick) cls += " wrong"; }
        else if (item.pending && o[0] === item.pick) cls += " picked";
        box.appendChild(h("button", {
          class: cls, disabled: item.answered || item.pending,
          onclick: function () { choose(item, o[0], G.gradeTF(q, o[0]), onChange); }
        }, t(o[1], o[2])));
      });
    } else {
      var ta = h("textarea", { rows: "4", placeholder: t("Tulis jawaban Anda...", "Write your answer..."), disabled: item.checked }, item.draft);
      ta.addEventListener("input", function () { item.draft = ta.value; });
      box.appendChild(ta);
      if (!item.checked) {
        box.appendChild(h("button", { class: "btn primary", onclick: function () { item.checked = true; item.res = G.gradeShort(item.draft, q); onChange(); } }, t("Cek jawaban", "Check answer")));
      } else if (!item.answered) {
        var r = item.res;
        box.appendChild(h("div", { class: "card " + (r.pass ? "okbox" : "badbox") },
          h("b", null, t("Kecocokan kata kunci: ", "Keyword match: ") + Math.round(r.score * 100) + "% (" + r.matched.length + "/" + q.keywords.length + ")"),
          h("div", null, t("Jawaban acuan: ", "Model answer: "), L(q.model))));
        box.appendChild(h("div", { class: "muted small" }, t("Nilai sendiri (menentukan jadwal ulang):", "Grade yourself (sets the review schedule):")));
        box.appendChild(h("div", { class: "row gap" },
          h("button", { class: "btn good", onclick: function () { item.pick = "self-right"; finishItem(item, true); onChange(); } }, t("Benar", "Correct")),
          h("button", { class: "btn", onclick: function () { item.pick = "self-almost"; finishItem(item, false); onChange(); } }, t("Hampir", "Almost")),
          h("button", { class: "btn danger", onclick: function () { item.pick = "self-wrong"; finishItem(item, false); onChange(); } }, t("Salah", "Wrong"))));
      } else {
        box.appendChild(h("div", { class: "card " + (item.correct ? "okbox" : "badbox") }, h("div", null, t("Jawaban acuan: ", "Model answer: "), L(q.model))));
      }
    }
    if (q.type !== "short") {
      if (item.pending) box.appendChild(confidenceRow(item, onChange));
      if (item.answered) box.appendChild(feedbackBanner(item));
    }
    if (item.answered && q.exp) box.appendChild(h("div", { class: "card expl" }, h("b", null, t("Penjelasan: ", "Explanation: ")), L(q.exp)));
    return box;
  }

  QA.questionHeader = function (q) {
    var tags = [h("span", { class: "badge" }, q.topic)];
    if (q.lo) tags.push(h("span", { class: "badge k" + (q.k || 2) }, q.lo + " K" + (q.k || 2)));
    return h("div", { class: "row gap tags" }, tags);
  };

  function sessionView() {
    var s = session;
    if (s.i >= s.items.length) return summaryView();
    var item = s.items[s.i];
    var root = h("div", { class: "page" });
    root.appendChild(h("div", { class: "row" },
      h("h1", { class: "sess-h" }, t("Soal ", "Question ") + (s.i + 1) + "/" + s.items.length),
      h("button", { class: "btn small", onclick: function () { session = null; QA.render(); } }, t("Akhiri", "End"))));
    root.appendChild(h("div", { class: "bar" }, h("span", { style: "width:" + QA.pct(s.i, s.items.length) + "%" })));
    var card = h("div", { class: "card" });
    card.appendChild(QA.questionHeader(item.q));
    if (item.retry) card.appendChild(h("div", { class: "small warn card" }, t("Ulangan: soal ini salah tadi. Coba jawab lagi dari ingatan (tidak mengubah jadwal ulang).", "Retry: you missed this earlier. Try to recall it again (does not change the review schedule).")));
    card.appendChild(h("h2", { class: "qtext", tabindex: "-1", "data-autofocus": item.answered || item.pending ? null : "1" }, L(item.q.q)));
    card.appendChild(questionBody(item, function () { QA.render(true); }));
    if (item.answered) {
      card.appendChild(h("button", {
        class: "btn primary", "data-autofocus": "1", onclick: function () { s.i++; QA.render(); }
      }, s.i + 1 >= s.items.length ? t("Lihat ringkasan", "See summary") : t("Berikutnya", "Next")));
    }
    root.appendChild(card);
    return root;
  }

  function summaryView() {
    var s = session, ok = 0, wrong = [], total = 0, retried = 0, retryOk = 0, sureN = 0, sureOk = 0, hyper = 0;
    s.items.forEach(function (it) {
      if (it.retry) { retried++; if (it.correct) retryOk++; return; }
      total++;
      if (it.correct) ok++; else wrong.push(it);
      if (it.conf === "sure") { sureN++; if (it.correct) sureOk++; else hyper++; }
    });
    if (!s.logged) {
      s.logged = true;
      S.addHistory({ t: Date.now(), mode: "practice", scope: s.filter.scope, total: total, correct: ok });
    }
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Ringkasan sesi", "Session summary")));
    var stats = [stat(t("Benar", "Correct"), ok + "/" + total), stat(t("Akurasi", "Accuracy"), QA.pct(ok, total) + "%")];
    if (retried) stats.push(stat(t("Berhasil saat diulang", "Recovered on retry"), retryOk + "/" + retried));
    if (sureN) stats.push(stat(t("Yakin dan benar", "Sure and right"), sureOk + "/" + sureN));
    root.appendChild(h("div", { class: "stats" }, stats));
    if (hyper) root.appendChild(h("div", { class: "card warn small" }, t(hyper + " jawaban salah padahal yakin. Ini miskonsepsi: prioritaskan membaca pembahasannya di bawah.", hyper + " answers were wrong although you were sure. These are misconceptions: read their explanations below first.")));

    if (wrong.length) {
      root.appendChild(h("h2", null, t("Pembahasan soal yang salah", "Review of missed questions")));
      wrong.forEach(function (it) {
        var q = it.q;
        var yours = it.pick === null ? "-" : q.type === "mcq" ? QA.optionText(q, it.pick) : q.type === "tf" ? (it.pick === true ? t("Benar", "True") : it.pick === false ? t("Salah", "False") : String(it.pick)) : (it.draft || "-");
        var chap = QA.chapterOf(q);
        root.appendChild(h("div", { class: "card" },
          QA.questionHeader(q),
          it.conf === "sure" ? h("div", { class: "small bad" }, "⚠ " + t("Salah tapi yakin", "Wrong but sure")) : null,
          h("div", { class: "qtext" }, L(q.q)),
          q.type === "short" ? null : h("div", { class: "badbox card small" }, t("Jawaban Anda: ", "Your answer: ") + yours),
          h("div", { class: "okbox card small" }, t("Jawaban benar: ", "Correct answer: ") + answerText(q)),
          q.exp ? h("div", { class: "expl card small" }, h("b", null, t("Mengapa: ", "Why: ")), L(q.exp)) : null,
          chap ? h("a", { class: "small", href: "#/study/ch" + chap }, t("Baca catatan Bab ", "Read the notes for Chapter ") + chap) : null));
      });
    } else {
      root.appendChild(h("div", { class: "card okbox" }, t("Tidak ada jawaban salah di sesi ini.", "No wrong answers in this session.")));
    }
    root.appendChild(h("div", { class: "row gap" },
      wrong.length ? h("button", {
        class: "btn primary", onclick: function () {
          session = { items: QA.shuffle(wrong).map(function (w) { return QA.makeItem(w.q); }), i: 0, filter: s.filter };
          QA.render();
        }
      }, t("Ulangi yang salah", "Redo missed")) : null,
      h("button", { class: "btn", onclick: function () { session = null; QA.render(); } }, t("Sesi baru", "New session"))));
    return root;
  }

  function stat(label, value) {
    return h("div", { class: "stat" }, h("div", { class: "v" }, value), h("div", { class: "l" }, label));
  }

  // arg dari URL (mis. practice/ch4) memulai sesi sekali; render ulang (ganti bahasa, jawab soal) tidak memulai ulang.
  var startedArg = null;
  QA.onRoute = function (name) { if (name !== "practice") startedArg = null; };

  QA.routes.practice = function (arg) {
    if (arg && arg !== startedArg) {
      startedArg = arg;
      session = null;
      var count = arg === "due" ? 20 : 10;
      var ok = startSession({ scope: arg }, count, "smart");
      if (!ok) return setupView(t("Tidak ada soal untuk cakupan itu.", "No questions for that scope."));
    }
    return session ? sessionView() : setupView();
  };
})();
