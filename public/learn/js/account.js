// Akun opsional: login email + password dan sinkronisasi progres lintas perangkat lewat /api/.
// Tanpa server (mis. dibuka dari file://) aplikasi tetap berjalan lokal seperti biasa.
(function () {
  var QA = window.QA, S = QA.store, h = QA.h, t = QA.t;
  var SYNC_KEY = "qa-drill-sync";
  var acct = QA.account = { status: "unknown", email: null, version: 0, syncing: false, dirty: false, lastSync: null, error: "" };
  var pushTimer = null;

  try {
    var saved = JSON.parse(window.localStorage.getItem(SYNC_KEY) || "null");
    if (saved && typeof saved.version === "number") acct.version = saved.version;
  } catch (e) { /* abaikan */ }
  function persistSync() {
    try { window.localStorage.setItem(SYNC_KEY, JSON.stringify({ version: acct.version })); } catch (e) { /* abaikan */ }
  }

  function api(method, path, body) {
    if (!window.fetch) return Promise.reject(new Error("no fetch"));
    return window.fetch(path, {
      method: method, credentials: "same-origin",
      headers: body === undefined ? {} : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; });
    });
  }

  function refresh() { if (QA.started) QA.render(true); }

  // ---------- sinkronisasi ----------
  function push(retry) {
    if (acct.status !== "in" || acct.syncing) { acct.dirty = true; return Promise.resolve(); }
    acct.syncing = true; acct.dirty = false;
    return api("PUT", "/api/progress", { data: S.state, baseVersion: acct.version }).then(function (r) {
      if (r.status === 200) { acct.version = r.body.version; acct.lastSync = Date.now(); acct.error = ""; persistSync(); }
      else if (r.status === 409 && !retry) {
        // Perangkat lain menyimpan lebih dulu: gabungkan lalu coba sekali lagi.
        acct.version = r.body.version;
        if (r.body.data) S.merge(r.body.data);
        S.state.updatedAt = Date.now(); saveQuiet();
        acct.syncing = false;
        return push(true);
      } else if (r.status === 401) { acct.status = "out"; acct.email = null; acct.error = "session"; }
      else acct.error = "push";
    }).catch(function () { acct.dirty = true; acct.error = "network"; })
      .then(function () { acct.syncing = false; refresh(); });
  }

  function schedulePush() {
    if (acct.status !== "in") return;
    acct.dirty = true;
    window.clearTimeout(pushTimer);
    pushTimer = window.setTimeout(function () { push(false); }, 1500);
  }

  // Simpan lokal tanpa memicu push (dipakai saat menggabungkan data dari server).
  function saveQuiet() {
    var hook = S.onSave; S.onSave = null;
    try { S.save(); } finally { S.onSave = hook; }
  }

  function pull() {
    return api("GET", "/api/progress").then(function (r) {
      if (r.status === 401) { acct.status = "out"; acct.email = null; return; }
      if (r.status !== 200) return;
      acct.version = r.body.version;
      if (r.body.data) S.merge(r.body.data);
      saveQuiet();
      return push(false);
    });
  }

  function sync() {
    if (acct.status !== "in") return Promise.resolve();
    return pull().catch(function () { acct.error = "network"; }).then(refresh);
  }

  // ---------- sesi ----------
  function init() {
    return api("GET", "/api/me").then(function (r) {
      if (r.status === 200 && r.body.email) { acct.status = "in"; acct.email = r.body.email; return sync(); }
      acct.status = r.status === 200 ? "out" : "offline";
    }).catch(function () { acct.status = "offline"; }).then(refresh);
  }

  function enter(r) {
    acct.status = "in"; acct.email = r.body.email; acct.error = "";
    return sync().then(function () { QA.announce(t("Berhasil masuk. Progres disinkronkan.", "Signed in. Progress synced.")); QA.go("dashboard"); });
  }

  function logout() {
    var done = acct.dirty ? push(false) : Promise.resolve();
    return done.then(function () {
      if (acct.dirty) {
        if (!window.confirm(t("Perubahan terakhir belum tersimpan ke server. Tetap keluar dan hapus data di perangkat ini?", "Your latest changes are not saved to the server. Sign out and clear this device anyway?"))) return;
      }
      return api("POST", "/api/logout", {}).catch(function () { /* tetap keluar secara lokal */ }).then(function () {
        // Perangkat bersama: progres sudah ada di server, jadi hapus salinan lokal agar tidak terbaca orang berikutnya.
        var hook = S.onSave; S.onSave = null; S.reset(); S.onSave = hook;
        acct.status = "out"; acct.email = null; acct.version = 0; acct.lastSync = null; persistSync();
        QA.announce(t("Anda sudah keluar.", "You have signed out."));
        QA.render();
      });
    });
  }

  S.onSave = schedulePush;
  document.addEventListener("visibilitychange", function () { if (!document.hidden) sync(); });
  window.addEventListener("online", function () { if (acct.dirty) push(false); });

  // ---------- tampilan ----------
  var ERR = {
    invalid_email: ["Email tidak valid.", "Invalid email."],
    invalid_password: ["Password harus 8-200 karakter.", "Password must be 8-200 characters."],
    email_taken: ["Email sudah terdaftar. Silakan masuk.", "Email already registered. Please sign in."],
    invalid_credentials: ["Email atau password salah.", "Wrong email or password."],
    too_many_requests: ["Terlalu banyak percobaan. Coba lagi dalam 15 menit.", "Too many attempts. Try again in 15 minutes."],
    registration_closed: ["Pendaftaran sedang ditutup.", "Registration is closed."]
  };
  var mode = "login";

  QA.routes.account = function () {
    var root = h("div", { class: "page" });
    root.appendChild(h("h1", null, t("Akun", "Account")));

    if (acct.status === "offline" || acct.status === "unknown") {
      root.appendChild(h("div", { class: "card" }, h("p", { class: "muted" }, acct.status === "unknown"
        ? t("Memeriksa server...", "Checking server...")
        : t("Server akun tidak tersedia (mungkin halaman dibuka dari berkas lokal). Aplikasi tetap bekerja, progres tersimpan di browser ini.",
            "The account server is unavailable (the page may be opened from a local file). The app still works; progress stays in this browser."))));
      return root;
    }

    if (acct.status === "in") {
      var note = acct.syncing ? t("Menyinkronkan...", "Syncing...")
        : acct.error === "network" ? t("Tidak ada koneksi; akan dicoba lagi otomatis.", "No connection; will retry automatically.")
        : acct.error ? t("Gagal menyinkronkan. Coba lagi.", "Sync failed. Try again.")
        : acct.lastSync ? t("Terakhir sinkron: ", "Last synced: ") + new Date(acct.lastSync).toLocaleTimeString()
        : t("Belum sinkron.", "Not synced yet.");
      root.appendChild(h("div", { class: "card" },
        h("p", null, t("Masuk sebagai ", "Signed in as "), h("b", null, acct.email)),
        h("p", { class: "small muted", role: "status" }, note),
        h("p", { class: "small muted" }, t("Progres otomatis tersimpan ke akun dan tersedia di perangkat lain setelah Anda masuk.", "Progress is saved to your account automatically and available on other devices after you sign in.")),
        h("div", { class: "row gap" },
          h("button", { class: "btn", onclick: function () { sync(); } }, t("Sinkronkan sekarang", "Sync now")),
          h("button", { class: "btn danger", onclick: function () { logout(); } }, t("Keluar", "Sign out")))));
      return root;
    }

    var isReg = mode === "register";
    var email = h("input", { type: "email", id: "acct-email", autocomplete: "email", required: "", maxlength: "254" });
    var pw = h("input", { type: "password", id: "acct-pw", autocomplete: isReg ? "new-password" : "current-password", required: "", minlength: "8", maxlength: "200" });
    var err = h("p", { class: "small bad", role: "alert" }, acct.error === "session" ? t("Sesi berakhir. Silakan masuk lagi.", "Session expired. Please sign in again.") : "");
    var btn = h("button", { class: "btn primary", type: "submit" }, isReg ? t("Daftar", "Create account") : t("Masuk", "Sign in"));
    var form = h("form", { class: "card", novalidate: "" },
      h("p", { class: "muted small" }, isReg
        ? t("Cukup email dan password; tanpa verifikasi email. Gunakan password unik. Tidak ada fitur lupa password otomatis.", "Just email and password, no email verification. Use a unique password. There is no automatic password reset.")
        : t("Masuk untuk menyinkronkan progres Anda di semua perangkat.", "Sign in to sync your progress across devices.")),
      h("label", { for: "acct-email" }, "Email"), email,
      h("label", { for: "acct-pw" }, "Password"), pw,
      err,
      h("div", { class: "row gap" }, btn,
        h("button", { class: "btn", type: "button", onclick: function () { mode = isReg ? "login" : "register"; acct.error = ""; QA.render(); } },
          isReg ? t("Sudah punya akun", "I have an account") : t("Buat akun baru", "Create new account"))));
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      err.textContent = "";
      btn.disabled = true;
      api("POST", isReg ? "/api/register" : "/api/login", { email: email.value, password: pw.value }).then(function (r) {
        if (r.status === 200 || r.status === 201) return enter(r);
        var m = ERR[r.body && r.body.error];
        err.textContent = m ? t(m[0], m[1]) : t("Terjadi kesalahan. Coba lagi.", "Something went wrong. Try again.");
        btn.disabled = false;
      }).catch(function () { err.textContent = t("Tidak dapat terhubung ke server.", "Cannot reach the server."); btn.disabled = false; });
    });
    root.appendChild(form);
    return root;
  };

  QA.nav.splice(QA.nav.length - 1, 0, ["account", "Akun", "Account"]);
  init();
})();
