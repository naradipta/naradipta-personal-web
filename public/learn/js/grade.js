// Penilaian tanpa AI: pilihan ganda, benar/salah, dan isian singkat berbasis kata kunci.
(function () {
  function norm(s) {
    return String(s === null || s === undefined ? "" : s)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\p{L}\p{N}\s\-\/]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // Kata kunci pendek (<=4 huruf) dicocokkan sebagai kata utuh agar "put" tidak cocok dengan "input".
  function hasKeyword(answerNorm, kw) {
    var k = norm(kw);
    if (!k) return false;
    if (k.length <= 4) return new RegExp("(^|\\s)" + esc(k) + "(\\s|$)").test(answerNorm);
    return answerNorm.indexOf(k) !== -1;
  }

  // q.keywords = array grup; satu grup terpenuhi bila minimal satu sinonim muncul.
  function gradeShort(answer, q) {
    var groups = q.keywords || [];
    var a = norm(answer);
    var matched = [], missed = [];
    if (a.length < 3 || !groups.length) {
      groups.forEach(function (_, i) { missed.push(i); });
      return { score: 0, matched: matched, missed: missed, pass: false };
    }
    groups.forEach(function (grp, i) {
      var hit = grp.some(function (kw) { return hasKeyword(a, kw); });
      (hit ? matched : missed).push(i);
    });
    var score = matched.length / groups.length;
    var need = typeof q.pass === "number" ? q.pass : 0.6;
    return { score: score, matched: matched, missed: missed, pass: score + 1e-9 >= need };
  }

  function gradeChoice(q, pickedOriginalIndex) { return pickedOriginalIndex === q.answer; }
  function gradeTF(q, value) { return value === q.answer; }

  var api = { norm: norm, gradeShort: gradeShort, gradeChoice: gradeChoice, gradeTF: gradeTF };
  if (typeof window !== "undefined") { window.QA = window.QA || {}; window.QA.grade = api; }
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
