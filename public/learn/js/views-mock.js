// Tampilan: Mock Exam gaya CTFL (40 soal, 60/75 menit, lulus 26) dan Kartu Istilah.
(function () {
  var QA = window.QA, S = QA.store, h = QA.h, t = QA.t, L = QA.L;
  var mock = null, timer = null;

  // ---------- pemilihan soal sesuai sebaran resmi per bab dan K-level ----------
  QA.pickMock = function () {
    var pool = QA.questions.filter(function (q) { return q.type === "mcq" && q.lo; });
    var used = {}, out = [], shortage = 0;
    function take(list, n) {
      var got = [];
      QA.shuffle(list).forEach(function (q) { if (got.length < n && !used[q.id]) { used[q.id] = 1; got.push(q); } });
      return got;
    }
    QA.chapters.forEach(function (ch) {
      var inCh = pool.filter(function (q) { return QA.chapterOf(q) === ch.n; });
      var need = 0, got = [];
      [1, 2, 3].forEach(function (k) {
        var n = ch.mix[k]; need += n;
        got = got.concat(take(inCh.filter(function (q) { return (q.k || 2) === k; }), n));
      });
      if (got.length < need) got = got.concat(take(inCh, need - got.length));
      shortage += need - got.length;
      out = out.concat(got);
    });
    if (out.length < QA.exam.total) {
      var extra = take(pool, QA.exam.total - out.length);
      out = out.concat(extra);
    }
    return { questions: QA.shuffle(out), shortage: shortage };
  };

  function startMock() {
    var pick = QA.pickMock();
    var minutes = S.state.extraTime ? QA.exam.extraMinutes : QA.exam.minutes;
    mock = {
      items: pick.questions.map(function (q) { var it = QA.makeItem(q); it.flag = false; return it; }),
      idx: 0, startedAt: Date.now(), endAt: Date.now() + minutes * 60000, minutes: minutes, finished: false, result: null
    };
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  function tick() {
    if (!mock || mock.finished) { clearInterval(timer); timer = null; return; }
    var left = Math.round((mock.endAt - Date.now()) / 1000);
    var el = document.getElementById("mock-timer");
    if (el) { el.textContent = QA.fmtTime(left); el.className = "timer" + (left < 300 ? " low" : ""); }
    if (left <= 0) { finishMock(); QA.render(); }
  }

  function finishMock() {
    if (!mock || mock.finished) return;
    var score = 0, byCh = {}, recs = [];
    mock.items.forEach(function (it) {
      var q = it.q, ch = QA.chapterOf(q);
      var ok = it.pick !== null && it.pick === q.answer;
      it.correct = ok;
      if (ok) score++;
      byCh[ch] = byCh[ch] || { c: 0, n: 0 };
      byCh[ch].n++; if (ok) byCh[ch].c++;
      recs.push({ id: q.id, correct: ok });
    });
    S.recordMany(recs);
    mock.finished = true;
    mock.result = { score: score, total: mock.items.length, byCh: byCh, secs: Math.round((Date.now() - mock.startedAt) / 1000) };
    S.addMock({ t: Date.now(), score: score, total: mock.items.length, byCh: byCh });
    if (timer) { clearInterval(timer); timer = null; }
  }

  function setupView() {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, "Mock Exam CTFL"));
    var pool = QA.questions.filter(function (q) { return q.type === "mcq" && q.lo; }).length;
    var minutes = S.state.extraTime ? QA.exam.extraMinutes : QA.exam.minutes;
    root.appendChild(h("div", { class: "card" },
      h("ul", null,
        h("li", null, QA.exam.total + t(" soal pilihan ganda, ", " multiple-choice questions, ") + minutes + t(" menit", " minutes")),
        h("li", null, t("Lulus: ", "Pass: ") + QA.exam.pass + "/" + QA.exam.total + " (65%)"),
        h("li", null, t("Sebaran per bab mengikuti tabel struktur ujian ISTQB: ", "Per-chapter spread follows the ISTQB exam structure table: ") + QA.chapters.map(function (c) { return c.mix[1] + c.mix[2] + c.mix[3]; }).join(" / ")),
        h("li", null, t("Tidak ada umpan balik sampai Anda menyerahkan. Hasil dicatat dan soal yang salah masuk jadwal ulang.", "No feedback until you submit. Results are saved and missed questions enter the review schedule."))),
      h("div", { class: "muted small" }, t("Bank soal: ", "Question bank: ") + pool + t(" soal pilihan ganda bertag ISTQB. Ini simulasi latihan, bukan soal ujian resmi.", " ISTQB-tagged multiple-choice questions. This is practice, not official exam questions.")),
      h("button", { class: "btn primary", onclick: function () { startMock(); QA.render(); } }, t("Mulai ujian", "Start exam"))));
    return root;
  }

  function examView() {
    var it = mock.items[mock.idx], q = it.q;
    var root = h("div", { class: "page" });
    var left = Math.round((mock.endAt - Date.now()) / 1000);
    root.appendChild(h("div", { class: "row sticky" },
      h("span", null, t("Soal ", "Question ") + (mock.idx + 1) + "/" + mock.items.length),
      h("span", { id: "mock-timer", class: "timer" + (left < 300 ? " low" : "") }, QA.fmtTime(left)),
      h("button", {
        class: "btn danger small", onclick: function () {
          var un = mock.items.filter(function (x) { return x.pick === null; }).length;
          var msg = un ? t("Masih ada " + un + " soal belum dijawab. Serahkan sekarang?", un + " questions unanswered. Submit now?") : t("Serahkan jawaban?", "Submit your answers?");
          if (window.confirm(msg)) { finishMock(); QA.render(); }
        }
      }, t("Serahkan", "Submit"))));

    var card = h("div", { class: "card" });
    card.appendChild(h("h2", { class: "qtext" }, L(q.q)));
    it.order.forEach(function (orig, pos) {
      card.appendChild(h("button", {
        class: "opt" + (it.pick === orig ? " picked" : ""),
        "aria-pressed": it.pick === orig ? "true" : "false",
        "data-autofocus": it.pick === orig ? "1" : null,
        onclick: function () { it.pick = orig; QA.render(true); }
      }, String.fromCharCode(65 + pos) + ". " + QA.optionText(q, orig)));
    });
    card.appendChild(h("div", { class: "row gap" },
      h("button", { class: "btn small", onclick: function () { it.flag = !it.flag; QA.render(true); } }, it.flag ? t("Hapus tanda", "Unflag") : t("Tandai", "Flag")),
      h("button", { class: "btn", disabled: mock.idx === 0, onclick: function () { mock.idx--; QA.render(); } }, t("Sebelumnya", "Previous")),
      h("button", { class: "btn primary", disabled: mock.idx >= mock.items.length - 1, onclick: function () { mock.idx++; QA.render(); } }, t("Berikutnya", "Next"))));
    root.appendChild(card);

    var pal = h("div", { class: "palette" });
    mock.items.forEach(function (x, i) {
      pal.appendChild(h("button", {
        class: "pal" + (x.pick !== null ? " done" : "") + (x.flag ? " flag" : "") + (i === mock.idx ? " cur" : ""),
        onclick: function () { mock.idx = i; QA.render(); }
      }, String(i + 1)));
    });
    root.appendChild(pal);
    return root;
  }

  function resultView() {
    var r = mock.result, pass = r.score >= QA.exam.pass;
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Hasil mock exam", "Mock exam result")));
    root.appendChild(h("div", { class: "card " + (pass ? "okbox" : "badbox") },
      h("div", { class: "big" }, r.score + "/" + r.total),
      h("b", null, pass ? t("LULUS (batas " + QA.exam.pass + ")", "PASS (threshold " + QA.exam.pass + ")") : t("BELUM LULUS (batas " + QA.exam.pass + ")", "NOT YET (threshold " + QA.exam.pass + ")")),
      h("div", { class: "muted small" }, t("Waktu: ", "Time: ") + QA.fmtTime(r.secs))));

    root.appendChild(h("h2", null, t("Per bab", "By chapter")));
    var card = h("div", { class: "card" });
    QA.chapters.forEach(function (ch) {
      var x = r.byCh[ch.n] || { c: 0, n: 0 };
      card.appendChild(h("div", { class: "lbl" }, t("Bab ", "Ch ") + ch.n + " " + L(ch.title) + ": " + x.c + "/" + x.n));
      card.appendChild(h("div", { class: "bar " + (x.n && x.c / x.n >= 0.65 ? "good" : "bad") }, h("span", { style: "width:" + QA.pct(x.c, x.n) + "%" })));
    });
    root.appendChild(card);

    root.appendChild(h("h2", null, t("Pembahasan", "Review")));
    var nWrong = mock.items.filter(function (it) { return !it.correct; }).length;
    if (nWrong) root.appendChild(h("p", { class: "small muted" }, t(nWrong + " soal salah/tidak terjawab ditampilkan di atas dan terbuka, lengkap dengan jawaban benar dan penjelasannya.", nWrong + " wrong/unanswered questions are listed first and expanded, with the correct answer and explanation.")));
    mock.items.map(function (it, i) { return { it: it, i: i }; }).sort(function (a, b) {
      return (a.it.correct ? 1 : 0) - (b.it.correct ? 1 : 0) || a.i - b.i;
    }).forEach(function (e) {
      var it = e.it, i = e.i, q = it.q;
      var yours = it.pick === null ? t("(tidak dijawab)", "(unanswered)") : QA.optionText(q, it.pick);
      root.appendChild(h("details", { class: "card rev " + (it.correct ? "okbox" : "badbox"), open: !it.correct },
        h("summary", null, (i + 1) + ". " + (it.correct ? "✓ " : "✗ ") + L(q.q)),
        h("div", null, QA.questionHeader(q)),
        h("div", null, t("Jawaban Anda: ", "Your answer: ") + yours),
        h("div", null, t("Jawaban benar: ", "Correct answer: ") + QA.optionText(q, q.answer)),
        q.exp ? h("div", { class: "muted" }, L(q.exp)) : null));
    });
    root.appendChild(h("button", { class: "btn primary", onclick: function () { mock = null; QA.render(); } }, t("Mock exam baru", "New mock exam")));
    return root;
  }

  QA.routes.mock = function () {
    if (!mock) return setupView();
    if (mock.finished) return resultView();
    return examView();
  };

  // ===================== KARTU ISTILAH =====================
  var deck = null;

  function cardKey(g) { return g.t; }

  function startDeck(mode) {
    var list = QA.glossary.filter(function (g) {
      var r = S.state.cards[cardKey(g)];
      return mode === "all" ? true : (!r || S.isDue(r));
    });
    deck = { items: QA.shuffle(list), i: 0, flipped: false, known: 0, mode: mode };
  }

  QA.routes.cards = function () {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Kartu istilah ISTQB", "ISTQB glossary cards")));
    if (!deck) {
      var dueN = QA.glossary.filter(function (g) { var r = S.state.cards[cardKey(g)]; return !r || S.isDue(r); }).length;
      root.appendChild(h("div", { class: "card" },
        h("p", null, QA.glossary.length + t(" kartu. Jatuh tempo atau baru: ", " cards. Due or new: ") + dueN),
        h("div", { class: "row gap" },
          h("button", { class: "btn primary", onclick: function () { startDeck("due"); QA.render(); } }, t("Mulai (jatuh tempo + baru)", "Start (due + new)")),
          h("button", { class: "btn", onclick: function () { startDeck("all"); QA.render(); } }, t("Semua kartu", "All cards")))));
      return root;
    }
    if (deck.i >= deck.items.length) {
      root.appendChild(h("div", { class: "card okbox" }, h("div", { class: "big" }, deck.known + "/" + deck.items.length), h("div", null, t("kartu sudah Anda ketahui.", "cards you knew."))));
      root.appendChild(h("button", { class: "btn primary", onclick: function () { deck = null; QA.render(); } }, t("Selesai", "Done")));
      return root;
    }
    var g = deck.items[deck.i];
    root.appendChild(h("div", { class: "muted" }, (deck.i + 1) + "/" + deck.items.length));
    root.appendChild(h("div", { class: "bar" }, h("span", { style: "width:" + QA.pct(deck.i, deck.items.length) + "%" })));
    var card = h("div", { class: "card flash" }, h("div", { class: "big" }, g.t));
    if (!deck.flipped) {
      card.appendChild(h("button", { class: "btn primary", onclick: function () { deck.flipped = true; QA.render(true); } }, t("Tampilkan definisi", "Show definition")));
    } else {
      card.appendChild(h("p", null, S.state.lang === "id" ? g.id : g.en));
      if (g.lo) card.appendChild(h("span", { class: "badge" }, g.lo));
      card.appendChild(h("div", { class: "row gap" },
        h("button", { class: "btn good", onclick: function () { S.recordCard(cardKey(g), true); deck.known++; deck.i++; deck.flipped = false; QA.render(); } }, t("Tahu", "Knew it")),
        h("button", { class: "btn danger", onclick: function () { S.recordCard(cardKey(g), false); deck.i++; deck.flipped = false; QA.render(); } }, t("Belum", "Not yet"))));
    }
    root.appendChild(card);
    root.appendChild(h("button", { class: "btn small", onclick: function () { deck = null; QA.render(); } }, t("Akhiri", "End")));
    return root;
  };
})();
