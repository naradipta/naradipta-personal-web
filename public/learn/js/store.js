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
  function bump(rec, correct, now, conf) {
    rec = rec || { box: 0, due: now, seen: 0, correct: 0, wrong: 0, last: null };
    rec.seen += 1;
    var minDays = 0;
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
  S.importJSON = function (text) {
    var obj = JSON.parse(text);
    if (!obj || typeof obj !== "object" || typeof obj.q !== "object" || typeof obj.cards !== "object") {
      throw new Error("Format berkas tidak dikenali");
    }
    S.state = Object.assign(defaults(), obj);
    S.save();
  };
  S.reset = function () { S.state = defaults(); S.save(); };

  S.INTERVALS = INTERVALS;
  window.QA.store = S;
})();
