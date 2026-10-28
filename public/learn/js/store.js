// Penyimpanan progres di localStorage + jadwal pengulangan berjarak (Leitner).
(function () {
  window.QA = window.QA || {};
  var KEY = "qa-drill-v1";
  var DAY = 86400000;
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32]; // hari per box 0..6

  function defaults() {
    return { lang: "id", examDate: null, dailyMin: 120, extraTime: true, confidence: true, q: {}, cards: {}, history: [], mocks: [] };
  }

  var memory = null;
  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { /* storage tidak tersedia */ }
    return memory || defaults();
  }

  var S = { state: load() };

  S.save = function () {
    memory = S.state;
    try { window.localStorage.setItem(KEY, JSON.stringify(S.state)); } catch (e) { /* abaikan */ }
  };

  // conf (opsional): "guess" | "unsure" | "sure". Benar karena menebak tidak menaikkan box (belum benar-benar dikuasai),
  // benar tapi ragu hanya menaikkan dari box 0, salah dengan yakin dicatat sebagai miskonsepsi (hyper).
  // Box hanya naik bila soal memang sudah jatuh tempo: mengulang soal yang sama berkali-kali dalam satu sesi
  // tidak membuktikan ingatan jangka panjang (spacing effect).
  function bump(rec, correct, now, conf) {
    var wasDue = !rec || rec.due <= now;
    rec = rec || { box: 0, due: now, seen: 0, correct: 0, wrong: 0, last: null };
    rec.seen += 1;
    var minDays = 0;
    if (correct && !wasDue) {
      rec.correct += 1; rec.last = 1;
      return rec;
    }
    if (correct) {
      rec.correct += 1;
      if (conf === "guess") minDays = 1;
      else if (conf === "unsure") { if (rec.box === 0) rec.box = 1; }
      else rec.box = Math.min(rec.box + 1, INTERVALS.length - 1);
    } else {
      rec.wrong += 1; rec.box = 0;
      if (conf === "sure") rec.hyper = (rec.hyper || 0) + 1;
    }
    rec.last = correct ? 1 : 0;
    rec.due = now + Math.max(INTERVALS[rec.box], minDays) * DAY;
    return rec;
  }

  S.record = function (qid, correct, conf) {
    S.state.q[qid] = bump(S.state.q[qid], correct, Date.now(), conf);
    S.save();
  };
  // Beberapa jawaban sekaligus (mis. mock exam) dengan satu kali tulis ke localStorage.
  S.recordMany = function (list) {
    var now = Date.now();
    list.forEach(function (e) { S.state.q[e.id] = bump(S.state.q[e.id], e.correct, now, e.conf); });
    S.save();
  };
  S.recordCard = function (key, know) {
    S.state.cards[key] = bump(S.state.cards[key], know, Date.now());
    S.save();
  };
  S.isDue = function (rec) { return !!rec && rec.due <= Date.now(); };
  S.mastered = function (rec) { return !!rec && rec.box >= 3; };

  S.addHistory = function (entry) {
    S.state.history.push(entry);
    if (S.state.history.length > 200) S.state.history = S.state.history.slice(-200);
    S.save();
  };
  S.addMock = function (entry) {
    S.state.mocks.push(entry);
    if (S.state.mocks.length > 50) S.state.mocks = S.state.mocks.slice(-50);
    S.save();
  };

  S.exportJSON = function () { return JSON.stringify(S.state, null, 2); };
  function isObj(x) { return !!x && typeof x === "object" && !Array.isArray(x); }
  function num(x) { return typeof x === "number" && isFinite(x); }
  // Ambil hanya rekaman yang bentuknya benar; sisanya dibuang agar state tersimpan tidak merusak aplikasi.
  function cleanRecs(map) {
    var out = {};
    Object.keys(map).forEach(function (k) {
      var r = map[k];
      if (isObj(r) && num(r.box) && r.box >= 0 && r.box < INTERVALS.length && num(r.due) && num(r.seen) && num(r.correct) && num(r.wrong)) {
        out[k] = { box: Math.floor(r.box), due: r.due, seen: r.seen, correct: r.correct, wrong: r.wrong, last: r.last === 1 ? 1 : r.last === 0 ? 0 : null, hyper: num(r.hyper) ? r.hyper : 0 };
      }
    });
    return out;
  }
  S.importJSON = function (text) {
    var obj = JSON.parse(text);
    if (!isObj(obj) || !isObj(obj.q) || !isObj(obj.cards)) throw new Error("Format berkas tidak dikenali");
    if (obj.history !== undefined && !Array.isArray(obj.history)) throw new Error("Format riwayat tidak valid");
    if (obj.mocks !== undefined && !Array.isArray(obj.mocks)) throw new Error("Format mock tidak valid");
    var next = defaults();
    next.q = cleanRecs(obj.q);
    next.cards = cleanRecs(obj.cards);
    next.history = (obj.history || []).filter(function (e) { return isObj(e) && num(e.total) && num(e.correct); }).slice(-200);
    next.mocks = (obj.mocks || []).filter(function (e) { return isObj(e) && num(e.score) && num(e.total) && isObj(e.byCh); }).slice(-50);
    if (obj.lang === "id" || obj.lang === "en") next.lang = obj.lang;
    if (typeof obj.examDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(obj.examDate)) next.examDate = obj.examDate;
    if (num(obj.dailyMin) && obj.dailyMin > 0 && obj.dailyMin <= 1440) next.dailyMin = obj.dailyMin;
    if (typeof obj.extraTime === "boolean") next.extraTime = obj.extraTime;
    if (typeof obj.confidence === "boolean") next.confidence = obj.confidence;
    S.state = next;
    S.save();
  };
  S.reset = function () { S.state = defaults(); S.save(); };

  S.INTERVALS = INTERVALS;
  window.QA.store = S;
})();
