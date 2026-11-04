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

  // Ikon SVG garis (gaya Lucide, 24x24) tanpa emoji; dekoratif (aria-hidden) karena selalu didampingi teks.
  var ICONS = {
    home: ["M3 11l9-8 9 8", "M5 10v10h5v-6h4v6h5V10"],
    book: ["M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z", "M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"],
    target: ["M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20z", "M12 6a6 6 0 1 0 0 12a6 6 0 0 0 0-12z", "M12 10a2 2 0 1 0 0 4a2 2 0 0 0 0-4z"],
    clock: ["M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20z", "M12 7v5l3 2"],
    layers: ["M12 2l10 5-10 5L2 7z", "M2 12l10 5 10-5", "M2 17l10 5 10-5"],
    calendar: ["M8 2v4", "M16 2v4", "M3 6h18v15H3z", "M3 10h18"],
    user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8z"],
    sliders: ["M4 6h8", "M16 6h4", "M12 4v4", "M4 12h2", "M10 12h10", "M6 10v4", "M4 18h10", "M18 18h2", "M14 16v4"],
    more: ["M5 12h.01", "M12 12h.01", "M19 12h.01"],
    logout: ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
    login: ["M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", "M10 17l5-5-5-5", "M15 12H3"],
    back: ["M19 12H5", "M12 19l-7-7 7-7"],
    eye: ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z", "M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z"],
    eyeoff: ["M17.9 17.9A10.6 10.6 0 0 1 12 19c-6.5 0-10-7-10-7a17.7 17.7 0 0 1 4.1-4.9", "M9.9 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-2.2 3.2", "M2 2l20 20", "M9.9 9.9a3 3 0 0 0 4.2 4.2"],
    trend: ["M3 17l6-6 4 4 8-8", "M14 7h7v7"],
    devices: ["M4 5h16v11H4z", "M2 20h20"],
    users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8z", "M22 21v-2a4 4 0 0 0-3-3.9", "M16 3.1a4 4 0 0 1 0 7.8"],
    shield: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", "M9 12l2 2 4-4"]
  };
  QA.icon = function (name, size) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", size || 20); svg.setAttribute("height", size || 20);
    svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round"); svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false"); svg.setAttribute("class", "ico");
    (ICONS[name] || []).forEach(function (d) { var p = document.createElementNS(NS, "path"); p.setAttribute("d", d); svg.appendChild(p); });
    return svg;
  };

  QA.dayMs = 86400000;
  QA.pct = function (a, b) { return b ? Math.round((a / b) * 100) : 0; };
  QA.dateStr = function (d) {
    var y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
    return y + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  };
})();
