// Komunitas: papan belajar opt-in. Hanya nama tampilan dan angka kasar (hari aktif, streak, soal dikuasai). Tanpa email, akurasi, atau jawaban.
(function () {
  var QA = window.QA, h = QA.h, t = QA.t;
  var acct = QA.account;
  var cache = { rows: null, total: 0, at: 0, loading: false, error: "" };
  var formError = "", saving = false, draft = "";

  var ERR = {
    invalid_display_name: ["Nama tampilan 2-24 karakter (huruf, angka, spasi), tanpa @.", "Display name: 2-24 characters (letters, digits, spaces), no @."],
    name_not_allowed: ["Nama itu tidak diizinkan (kata kasar atau nama yang dicadangkan). Pilih nama lain.", "That name is not allowed (offensive or reserved). Choose another."],
    name_taken: ["Nama itu sudah dipakai anggota lain. Pilih nama lain.", "That name is already used by another member. Choose another."],
    name_locked: ["Nama tampilan Anda dikunci oleh pengelola. Hubungi pengelola bila ini keliru.", "Your display name was locked by the maintainer. Contact them if this is a mistake."]
  };
  var reporting = null; // { name, msg, busy }

  function load(force) {
    if (cache.loading || (!force && cache.rows && Date.now() - cache.at < 30000)) return;
    cache.loading = true;
    QA.api("GET", "/api/community").then(function (r) {
      if (r.status === 200) { cache.rows = r.body.rows; cache.total = r.body.total; cache.error = ""; cache.at = Date.now(); }
      else cache.error = "load";
    }).catch(function () { cache.error = "load"; }).then(function () {
      cache.loading = false;
      if (/^#\/community/.test(window.location.hash)) QA.render(true);
    });
  }

  function saveProfile(name, share) {
    saving = true; formError = "";
    return QA.api("PUT", "/api/profile", { displayName: name, share: share }).then(function (r) {
      if (r.status === 200) { acct.displayName = r.body.displayName || ""; acct.share = r.body.share; cache.rows = null; draft = ""; }
      else if (r.body && r.body.error === "name_locked") acct.nameLocked = true;
      else { var m = ERR[r.body && r.body.error]; formError = m ? t(m[0], m[1]) : t("Gagal menyimpan. Coba lagi.", "Could not save. Try again."); }
    }).catch(function () { formError = t("Tidak dapat terhubung ke server.", "Cannot reach the server."); })
      .then(function () { saving = false; QA.render(); });
  }

  function joinCard() {
    if (acct.nameLocked) return h("div", { class: "card warn", role: "note" }, h("p", null, t(ERR.name_locked[0], ERR.name_locked[1])));
    var name = h("input", { type: "text", id: "dn", maxlength: "24", minlength: "2", autocomplete: "nickname", value: draft || acct.displayName || "" });
    var agree = h("input", { type: "checkbox", id: "dn-ok" });
    var btn = h("button", { class: "btn primary", type: "submit", disabled: saving }, t("Ikut papan belajar", "Join the board"));
    var form = h("form", { class: "card", novalidate: "" },
      h("h2", { class: "h3" }, t("Belajar bareng teman-teman", "Learn together")),
      h("p", { class: "small muted" }, t("Papan ini untuk saling menyemangati, bukan lomba. Bergabung bersifat pilihan dan bisa dibatalkan kapan saja.", "This board is for mutual encouragement, not a contest. Joining is optional and you can leave any time.")),
      h("div", { class: "field" }, h("label", { for: "dn" }, t("Nama tampilan (bukan email)", "Display name (not your email)")), name),
      h("label", { class: "inline", for: "dn-ok" }, agree,
        h("span", null, t("Saya setuju nama tampilan, jumlah hari aktif, streak, dan jumlah soal yang dikuasai terlihat oleh sesama anggota yang sudah masuk. Email, akurasi, dan jawaban saya tidak pernah ditampilkan.",
          "I agree that my display name, active days, streak and mastered-question count are visible to other signed-in members. My email, accuracy and answers are never shown."))),
      h("p", { class: "form-err", role: "alert" }, formError), btn);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      draft = name.value;
      if (!agree.checked) { formError = t("Centang persetujuan dulu untuk bergabung.", "Tick the consent box to join."); QA.render(); return; }
      saveProfile(name.value, true);
    });
    return form;
  }

  function board() {
    var box = h("div", { class: "card" });
    box.appendChild(h("div", { class: "row" }, h("h2", { class: "h3" }, t("Papan belajar", "Study board")),
      h("button", { class: "btn small", type: "button", onclick: function () { load(true); QA.render(true); } }, t("Muat ulang", "Refresh"))));
    box.appendChild(h("p", { class: "small muted" }, t("Urut berdasarkan hari aktif 7 hari terakhir. Streak = hari beruntun belajar. Dikuasai = soal yang sudah naik ke box 3 atau lebih.",
      "Sorted by active days in the last 7. Streak = consecutive study days. Mastered = questions at box 3 or above.")));
    if (cache.error) box.appendChild(h("p", { class: "form-err", role: "alert" }, t("Gagal memuat papan.", "Could not load the board.")));
    else if (!cache.rows) box.appendChild(h("p", { class: "muted", role: "status" }, t("Memuat...", "Loading...")));
    else if (!cache.rows.length) box.appendChild(h("p", { class: "muted" }, t("Belum ada anggota.", "No members yet.")));
    else {
      var tbl = h("table", { class: "board" },
        h("caption", { class: "sr-only" }, t("Papan belajar komunitas", "Community study board")),
        h("thead", null, h("tr", null, h("th", { scope: "col" }, t("Nama", "Name")), h("th", { scope: "col" }, t("Aktif 7 hari", "Active 7d")), h("th", { scope: "col" }, "Streak"), h("th", { scope: "col" }, t("Dikuasai", "Mastered")))),
        h("tbody", null, cache.rows.map(function (r) {
          return h("tr", { class: r.you ? "you" : "" },
            h("th", { scope: "row" }, r.name, r.you ? h("span", { class: "badge" }, t("Anda", "You")) : null,
              r.you ? null : h("div", null, h("button", { class: "linkbtn small-link", type: "button", "aria-label": t("Laporkan nama ", "Report the name ") + r.name,
                onclick: function () { reporting = { name: r.name, msg: "", busy: false }; QA.render(true); } }, t("Laporkan", "Report")))),
            h("td", null, r.active7 + "/7"), h("td", null, String(r.streak)), h("td", null, String(r.mastered)));
        })));
      box.appendChild(h("div", { class: "table-wrap" }, tbl));
    }
    return box;
  }

  function reportCard() {
    var rp = reporting;
    var reason = h("select", { id: "rp-reason" }, [["inappropriate", "Nama kasar atau tidak pantas", "Offensive or inappropriate name"], ["impersonation", "Menyamar sebagai orang lain atau pengelola", "Impersonating someone or the maintainer"], ["other", "Lainnya", "Other"]].map(function (o) { return h("option", { value: o[0] }, t(o[1], o[2])); }));
    var note = h("input", { type: "text", id: "rp-note", maxlength: "140" });
    var msg = h("p", { class: "small", role: "status" }, rp.msg);
    var send = h("button", { class: "btn primary small", type: "submit", disabled: !!(rp.busy || rp.msg) }, t("Kirim laporan", "Send report"));
    var form = h("form", { class: "card", novalidate: "" },
      h("h2", { class: "h3" }, t("Laporkan ", "Report ") + rp.name),
      h("p", { class: "small muted" }, t("Laporan ini hanya dilihat pengelola. Bila beberapa anggota melaporkan nama yang sama, nama itu disembunyikan sementara sampai ditinjau.", "Only the maintainer sees this report. If several members report the same name, it is hidden until reviewed.")),
      h("div", { class: "field" }, h("label", { for: "rp-reason" }, t("Alasan", "Reason")), reason),
      h("div", { class: "field" }, h("label", { for: "rp-note" }, t("Catatan (opsional)", "Note (optional)")), note), msg,
      h("div", { class: "row gap" }, send, h("button", { class: "btn small", type: "button", onclick: function () { reporting = null; QA.render(true); } }, rp.msg ? t("Tutup", "Close") : t("Batal", "Cancel"))));
    form.addEventListener("submit", function (ev) {
      ev.preventDefault(); rp.busy = true;
      QA.api("POST", "/api/community/report", { name: rp.name, reason: reason.value, note: note.value }).then(function (r) {
        rp.msg = r.status === 200 ? (r.body.duplicate ? t("Anda sudah melaporkan nama ini; laporan sedang menunggu tinjauan.", "You already reported this name; the report is awaiting review.") : t("Terima kasih, laporan terkirim.", "Thanks, report sent."))
          : r.status === 429 ? t("Terlalu banyak laporan. Coba lagi nanti.", "Too many reports. Try again later.") : t("Gagal mengirim laporan.", "Could not send the report.");
        rp.busy = false; QA.render(true);
      }).catch(function () { rp.msg = t("Tidak dapat terhubung ke server.", "Cannot reach the server."); rp.busy = false; QA.render(true); });
    });
    return form;
  }

  QA.routes.community = function () {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Komunitas", "Community")));
    if (acct.status === "offline" || acct.status === "unknown") {
      root.appendChild(h("div", { class: "card" }, h("p", { class: "muted" }, t("Fitur komunitas butuh server akun, yang sedang tidak tersedia.", "Community needs the account server, which is unavailable."))));
      return root;
    }
    if (acct.status !== "in") {
      root.appendChild(h("div", { class: "card" },
        h("p", null, t("Masuk dulu untuk melihat papan belajar bersama teman-teman QA.", "Sign in to see the study board with fellow QAs.")),
        h("a", { class: "btn primary", href: "#/account" }, t("Masuk / Daftar", "Sign in / Register"))));
      return root;
    }
    if (acct.emailEnabled && !acct.verified) {
      root.appendChild(h("div", { class: "card" }, h("p", null, t("Verifikasi email dulu untuk bergabung di papan komunitas.", "Verify your email first to join the community board."))));
      root.appendChild(QA.verifyBanner());
      return root;
    }
    if (!acct.share) { root.appendChild(joinCard()); return root; }
    load(false);
    root.appendChild(board());
    if (reporting) root.appendChild(reportCard());
    root.appendChild(h("div", { class: "card" },
      h("p", { class: "small muted" }, t("Anda tampil sebagai ", "You appear as "), h("b", null, acct.displayName)),
      h("button", { class: "btn small", type: "button", disabled: saving, onclick: function () { saveProfile(acct.displayName, false); } }, t("Berhenti berbagi dan hilang dari papan", "Stop sharing and leave the board"))));
    return root;
  };
})();
