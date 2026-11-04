// Helper kecil: pembuat elemen DOM yang aman (tanpa innerHTML), acak, format waktu.
(function () {
  window.QA = window.QA || {};

  // h("div", {class:"x", onclick:fn}, "teks", childEl, [..])
  QA.h = function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k.indexOf("on") === 0 && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (k === "value") el.value = v;
        else if (k === "checked") el.checked = !!v;
        else if (k === "disabled") el.disabled = !!v;
        else el.setAttribute(k, v === true ? "" : String(v));
      });
    }
    var kids = Array.prototype.slice.call(arguments, 2);
    (function add(list) {
      list.forEach(function (kid) {
        if (kid === null || kid === undefined || kid === false) return;
        if (Array.isArray(kid)) return add(kid);
        el.appendChild(kid && kid.nodeType ? kid : document.createTextNode(String(kid)));
      });
    })(kids);
    return el;
  };

  QA.shuffle = function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  QA.sample = function sample(arr, n) { return QA.shuffle(arr).slice(0, n); };

  QA.fmtTime = function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  };

  QA.dayMs = 86400000;
  QA.pct = function (a, b) { return b ? Math.round((a / b) * 100) : 0; };
  QA.dateStr = function (d) {
    var y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
    return y + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  };
})();
