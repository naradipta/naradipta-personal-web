// Akun opsional: login email + password dan sinkronisasi progres lintas perangkat lewat /api/.
// Tanpa server (mis. dibuka dari file://) aplikasi tetap berjalan lokal seperti biasa.
(function () {
  var QA = window.QA, S = QA.store, h = QA.h, t = QA.t;
  var acct = QA.account = { status: "unknown", email: null, id: null, verified: false, emailEnabled: false, version: 0, syncing: false, dirty: false, lastSync: null, error: "" };
  var pushTimer = null;

  // Pilihan "lanjut sebagai tamu" hanya berlaku selama tab ini terbuka (perangkat bersama: orang berikutnya ditanya lagi).
  var guestMemo = false;
  function guestChosen() {
    try { return window.sessionStorage.getItem("qa-drill-guest") === "1"; } catch (e) { return guestMemo; }
  }
  function setGuest(on) {
    guestMemo = on;
    try { if (on) window.sessionStorage.setItem("qa-drill-guest", "1"); else window.sessionStorage.removeItem("qa-drill-guest"); } catch (e) { /* abaikan */ }
  }

  // Gerbang: saat server akun tersedia dan belum masuk, tampilkan layar selamat datang (masuk / daftar / tamu).
  QA.gate = function () {
    // Tautan dari email (#/verify/<token>, #/reset/<token>) harus bisa dibuka tanpa login, dengan kerangka menu disembunyikan.
    var m = /^#\/(verify|reset)\/./.exec(window.location.hash || "");
    if (m) return m[1];
    if (acct.status === "unknown") return "loading";
    if (acct.status === "out" && !guestChosen()) return "welcome";
    return null;
  };

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

  QA.api = api;
  function refresh() { if (QA.started) QA.render(true); }

  // Sesi habis di server: kembali ke ruang tamu. Salinan lokal akun dibiarkan agar perubahan yang belum terkirim tidak hilang.
  function expire() {
    acct.status = "out"; acct.email = null; acct.id = null; acct.displayName = ""; acct.share = false; acct.error = "session";
    S.useKey(S.guestKey);
  }

  // ---------- sinkronisasi ----------
  function push(retry) {
    if (acct.status !== "in" || acct.syncing) { acct.dirty = true; return Promise.resolve(); }
    acct.syncing = true; acct.dirty = false;
    return api("PUT", "/api/progress", { data: S.state, baseVersion: acct.version }).then(function (r) {
      if (r.status === 200) { acct.version = r.body.version; acct.lastSync = Date.now(); acct.error = ""; }
      else if (r.status === 409 && !retry) {
        // Perangkat lain menyimpan lebih dulu: gabungkan lalu coba sekali lagi.
        acct.version = r.body.version;
        if (r.body.data) S.merge(r.body.data);
        S.state.updatedAt = Date.now(); saveQuiet();
        acct.syncing = false;
        return push(true);
      } else if (r.status === 401) { expire(); }
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
      if (r.status === 401) { expire(); return; }
      if (r.status !== 200) return;
      acct.version = r.body.version;
      acct.serverEmpty = !r.body.data;
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
  // Progres tiap akun punya ruang penyimpanan sendiri di perangkat, jadi dua akun di satu browser tidak bercampur.
  // Progres tamu hanya ditawarkan untuk diimpor ke akun yang masih kosong (akun baru).
  function activate(me) {
    var guest = S.peek(S.guestKey);
    acct.status = "in"; acct.email = me.email; acct.id = me.id; acct.displayName = me.displayName || ""; acct.share = !!me.share; acct.nameLocked = !!me.nameLocked; acct.verified = !!me.verified; acct.emailEnabled = !!me.emailEnabled; acct.error = "";
    setGuest(false);
    S.useKey(S.keyFor(me.id));
    return sync().then(function () {
      if (acct.serverEmpty && !S.hasProgress(S.state) && S.hasProgress(guest)) {
        var ok = window.confirm(t("Ada progres belajar tersimpan di perangkat ini (tanpa akun). Pindahkan ke akun " + me.email + "?",
          "There is study progress on this device (no account). Move it into the account " + me.email + "?"));
        if (ok) {
          S.merge(guest); saveQuiet(); S.drop(S.guestKey);
          return push(false);
        }
      }
    });
  }

  function init() {
    return api("GET", "/api/me").then(function (r) {
      acct.emailEnabled = !!(r.body && r.body.emailEnabled);
      if (r.status === 200 && r.body.email) return activate(r.body);
      acct.status = r.status === 200 ? "out" : "offline";
    }).catch(function () { acct.status = "offline"; }).then(refresh);
  }

  function enter(r) {
    return activate(r.body).then(function () { QA.announce(t("Berhasil masuk. Progres disinkronkan.", "Signed in. Progress synced.")); QA.go("dashboard"); });
  }

  function logout() {
    var done = acct.dirty ? push(false) : Promise.resolve();
    return done.then(function () {
      if (acct.dirty) {
        if (!window.confirm(t("Perubahan terakhir belum tersimpan ke server. Tetap keluar dan hapus data di perangkat ini?", "Your latest changes are not saved to the server. Sign out and clear this device anyway?"))) return;
      }
      return api("POST", "/api/logout", {}).catch(function () { /* tetap keluar secara lokal */ }).then(function () {
        // Perangkat bersama: progres sudah ada di server, jadi hapus salinan lokal akun ini agar tidak terbaca orang berikutnya.
        S.drop(S.keyFor(acct.id));
        S.useKey(S.guestKey);
        acct.status = "out"; acct.email = null; acct.id = null; acct.verified = false; acct.displayName = ""; acct.share = false; acct.version = 0; acct.lastSync = null;
        setGuest(false); mode = "login";
        QA.announce(t("Anda sudah keluar.", "You have signed out."));
        QA.go("dashboard");
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
    invalid_token: ["Tautan tidak valid atau sudah kedaluwarsa. Minta tautan baru.", "The link is invalid or has expired. Request a new one."],
    registration_closed: ["Pendaftaran sedang ditutup.", "Registration is closed."]
  };
  var mode = "login";

  function initial() { return acct.email ? acct.email.charAt(0).toUpperCase() : "?"; }
  function syncNote() {
    return acct.syncing ? t("Menyinkronkan...", "Syncing...")
      : acct.error === "network" ? t("Tidak ada koneksi; akan dicoba lagi otomatis.", "No connection; will retry automatically.")
      : acct.error ? t("Gagal menyinkronkan. Coba lagi.", "Sync failed. Try again.")
      : acct.lastSync ? t("Terakhir sinkron: ", "Last synced: ") + new Date(acct.lastSync).toLocaleTimeString()
      : t("Belum sinkron.", "Not synced yet.");
  }

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
      var vb = QA.verifyBanner(); if (vb) root.appendChild(vb);
      root.appendChild(h("div", { class: "card" },
        h("div", { class: "who-card" }, h("span", { class: "avatar big-av", "aria-hidden": "true" }, initial()),
          h("div", null, h("div", { class: "muted small" }, t("Masuk sebagai", "Signed in as")), h("b", { class: "wrap" }, acct.email))),
        h("p", { class: "small muted", role: "status" }, syncNote()),
        h("p", { class: "small muted" }, t("Progres otomatis tersimpan ke akun dan tersedia di perangkat lain setelah Anda masuk.", "Progress is saved to your account automatically and available on other devices after you sign in.")),
        h("div", { class: "row gap" },
          h("button", { class: "btn", type: "button", onclick: function () { sync(); } }, t("Sinkronkan sekarang", "Sync now")),
          h("button", { class: "btn danger", type: "button", onclick: function () { logout(); } }, QA.icon("logout", 16), t("Keluar", "Sign out")))));
      return root;
    }

    root.appendChild(authForm(false));
    root.appendChild(h("p", { class: "small muted" }, t("Tanpa akun, progres hanya tersimpan di browser ini.", "Without an account, progress stays in this browser only.")));
    return root;
  };

  // Formulir masuk/daftar (layar selamat datang dan halaman Akun): tab Masuk/Daftar, tampilkan password, status memuat.
  function authForm(autofocus) {
    if (mode === "forgot") return forgotForm(autofocus);
    var isReg = mode === "register";
    var email = h("input", { type: "email", id: "acct-email", autocomplete: "email", required: "", maxlength: "254", inputmode: "email", "data-autofocus": autofocus ? "" : null });
    var pw = h("input", { type: "password", id: "acct-pw", autocomplete: isReg ? "new-password" : "current-password", required: "", minlength: "8", maxlength: "200" });
    var eye = h("button", { class: "eye", type: "button", "aria-label": t("Tampilkan password", "Show password"), "aria-pressed": "false" }, QA.icon("eye", 18));
    eye.addEventListener("click", function () {
      var show = pw.type === "password"; pw.type = show ? "text" : "password";
      eye.setAttribute("aria-pressed", show ? "true" : "false");
      eye.setAttribute("aria-label", show ? t("Sembunyikan password", "Hide password") : t("Tampilkan password", "Show password"));
      while (eye.firstChild) eye.removeChild(eye.firstChild); eye.appendChild(QA.icon(show ? "eyeoff" : "eye", 18));
    });
    var err = h("p", { class: "form-err", role: "alert" }, acct.error === "session" ? t("Sesi berakhir. Silakan masuk lagi.", "Session expired. Please sign in again.") : "");
    var label = isReg ? t("Buat akun", "Create account") : t("Masuk", "Sign in");
    var btn = h("button", { class: "btn primary block", type: "submit" }, label);
    function tab(m, text) {
      return h("button", { type: "button", class: "seg" + (mode === m ? " on" : ""), "aria-pressed": mode === m ? "true" : "false",
        onclick: function () { if (mode !== m) { mode = m; acct.error = ""; QA.render(); } } }, text);
    }
    var form = h("form", { class: "card auth-card", novalidate: "" },
      h("div", { class: "segs", role: "group", "aria-label": t("Masuk atau daftar", "Sign in or create account") }, tab("login", t("Masuk", "Sign in")), tab("register", t("Daftar", "Register"))),
      h("p", { class: "muted small" }, isReg
        ? t("Cukup email dan password. Verifikasi email dan lupa password otomatis belum tersedia, jadi simpan password Anda baik-baik.", "Just email and password. Email verification and automatic password reset are not available yet, so keep your password safe.")
        : t("Lanjutkan belajar di perangkat mana pun. Progres tersimpan per akun.", "Pick up where you left off on any device. Progress is saved per account.")),
      h("div", { class: "field" }, h("label", { for: "acct-email" }, "Email"), email),
      h("div", { class: "field" }, h("label", { for: "acct-pw" }, "Password"),
        h("div", { class: "pw-wrap" }, pw, eye),
        isReg ? h("p", { class: "hint" }, t("Minimal 8 karakter.", "At least 8 characters.")) : null),
      err, btn,
      !isReg && acct.emailEnabled ? h("button", { class: "linkbtn", type: "button", onclick: function () { mode = "forgot"; acct.error = ""; QA.render(); } }, t("Lupa password?", "Forgot password?")) : null);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      err.textContent = "";
      btn.disabled = true; btn.textContent = t("Memproses...", "Working...");
      function reset() { btn.disabled = false; btn.textContent = label; }
      api("POST", isReg ? "/api/register" : "/api/login", { email: email.value, password: pw.value }).then(function (r) {
        if (r.status === 200 || r.status === 201) return enter(r);
        var m = ERR[r.body && r.body.error];
        err.textContent = m ? t(m[0], m[1]) : t("Terjadi kesalahan. Coba lagi.", "Something went wrong. Try again.");
        reset();
      }).catch(function () { err.textContent = t("Tidak dapat terhubung ke server.", "Cannot reach the server."); reset(); });
    });
    return form;
  }

  // Lupa password: selalu jawaban sama agar tidak membocorkan email mana yang terdaftar.
  function forgotForm(autofocus) {
    var email = h("input", { type: "email", id: "acct-email", autocomplete: "email", required: "", maxlength: "254", inputmode: "email", "data-autofocus": autofocus ? "" : null });
    var msg = h("p", { class: "small", role: "status" }, "");
    var err = h("p", { class: "form-err", role: "alert" }, "");
    var btn = h("button", { class: "btn primary block", type: "submit" }, t("Kirim tautan reset", "Send reset link"));
    var form = h("form", { class: "card auth-card", novalidate: "" },
      h("h2", { class: "h3" }, t("Lupa password", "Forgot password")),
      h("p", { class: "muted small" }, t("Masukkan email akun Anda. Kami kirim tautan untuk membuat password baru (berlaku 1 jam).", "Enter your account email. We will send a link to create a new password (valid for 1 hour).")),
      h("div", { class: "field" }, h("label", { for: "acct-email" }, "Email"), email), msg, err, btn,
      h("button", { class: "linkbtn", type: "button", onclick: function () { mode = "login"; QA.render(); } }, t("Kembali ke Masuk", "Back to sign in")));
    form.addEventListener("submit", function (ev) {
      ev.preventDefault(); err.textContent = ""; msg.textContent = ""; btn.disabled = true;
      api("POST", "/api/password/forgot", { email: email.value }).then(function (r) {
        if (r.status === 200) msg.textContent = t("Jika email itu terdaftar, tautan reset sudah dikirim. Periksa juga folder spam.", "If that email is registered, a reset link has been sent. Check your spam folder too.");
        else { var m = ERR[r.body && r.body.error]; err.textContent = m ? t(m[0], m[1]) : r.status === 429 ? t("Terlalu banyak permintaan. Coba lagi nanti.", "Too many requests. Try again later.") : t("Terjadi kesalahan. Coba lagi.", "Something went wrong. Try again."); }
        btn.disabled = false;
      }).catch(function () { err.textContent = t("Tidak dapat terhubung ke server.", "Cannot reach the server."); btn.disabled = false; });
    });
    return form;
  }

  function tokenFromHash() { var m = /^#\/(?:verify|reset)\/([\w-]+)/.exec(window.location.hash || ""); return m ? m[1] : ""; }
  function plainPage(children) { return h("div", { class: "auth" }, h("a", { class: "brand", href: "#/dashboard" }, QA.brandMark(), h("span", null, "QA Drill")), children); }

  // #/verify/<token>: konfirmasi email sekali jalan.
  var verifyState = { token: "", status: "idle" };
  QA.routes.verify = function () {
    var token = tokenFromHash();
    if (verifyState.token !== token) {
      verifyState = { token: token, status: "working" };
      api("POST", "/api/verify/confirm", { token: token }).then(function (r) {
        verifyState.status = r.status === 200 ? "ok" : "bad";
        if (r.status === 200 && acct.status === "in") acct.verified = true;
        QA.render();
      }).catch(function () { verifyState.status = "net"; QA.render(); });
    }
    var s = verifyState.status;
    var body = s === "working" ? h("p", { class: "muted", role: "status" }, t("Memverifikasi email...", "Verifying your email..."))
      : s === "ok" ? h("div", { class: "card okbox", role: "status" }, h("h1", null, t("Email terverifikasi", "Email verified")), h("p", null, t("Terima kasih! Email Anda sudah terverifikasi.", "Thank you! Your email is now verified.")))
      : h("div", { class: "card badbox", role: "alert" }, h("h1", null, t("Tautan tidak berlaku", "Link not valid")), h("p", null, s === "net" ? t("Tidak dapat terhubung ke server.", "Cannot reach the server.") : t("Tautan salah atau sudah kedaluwarsa. Masuk lalu minta email verifikasi baru dari Beranda.", "The link is wrong or expired. Sign in and request a new verification email from Home.")));
    return plainPage([body, h("a", { class: "btn primary", href: "#/dashboard", onclick: function () { verifyState = { token: "", status: "idle" }; } }, t("Lanjut ke QA Drill", "Continue to QA Drill"))]);
  };

  // #/reset/<token>: password baru.
  QA.routes.reset = function () {
    var token = tokenFromHash();
    var pw = h("input", { type: "password", id: "np", autocomplete: "new-password", required: "", minlength: "8", maxlength: "200", "data-autofocus": "" });
    var pw2 = h("input", { type: "password", id: "np2", autocomplete: "new-password", required: "", minlength: "8", maxlength: "200" });
    var err = h("p", { class: "form-err", role: "alert" }, "");
    var btn = h("button", { class: "btn primary block", type: "submit" }, t("Simpan password baru", "Save new password"));
    var form = h("form", { class: "card auth-card", novalidate: "" },
      h("h1", { class: "h3" }, t("Buat password baru", "Create a new password")),
      h("p", { class: "muted small" }, t("Minimal 8 karakter. Setelah disimpan, semua perangkat akan keluar dan Anda perlu masuk lagi.", "At least 8 characters. After saving, all devices are signed out and you need to sign in again.")),
      h("div", { class: "field" }, h("label", { for: "np" }, t("Password baru", "New password")), pw),
      h("div", { class: "field" }, h("label", { for: "np2" }, t("Ulangi password baru", "Repeat new password")), pw2), err, btn);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault(); err.textContent = "";
      if (pw.value !== pw2.value) { err.textContent = t("Kedua password tidak sama.", "The two passwords do not match."); return; }
      btn.disabled = true;
      api("POST", "/api/password/reset", { token: token, password: pw.value }).then(function (r) {
        if (r.status === 200) {
          if (acct.status === "in") expire();
          acct.error = ""; mode = "login";
          QA.announce(t("Password diganti. Silakan masuk.", "Password changed. Please sign in."));
          window.location.hash = "#/dashboard"; QA.render(); return;
        }
        var m = ERR[r.body && r.body.error];
        err.textContent = m ? t(m[0], m[1]) : t("Terjadi kesalahan. Coba lagi.", "Something went wrong. Try again."); btn.disabled = false;
      }).catch(function () { err.textContent = t("Tidak dapat terhubung ke server.", "Cannot reach the server."); btn.disabled = false; });
    });
    return plainPage(form);
  };

  // Banner "verifikasi email" untuk akun yang belum terverifikasi (hanya bila server bisa mengirim email).
  var verifyMsg = "";
  QA.verifyBanner = function () {
    if (acct.status !== "in" || !acct.emailEnabled || acct.verified) return null;
    var status = h("p", { class: "small", role: "status" }, verifyMsg);
    var btn = h("button", { class: "btn small", type: "button" }, t("Kirim email verifikasi", "Send verification email"));
    btn.addEventListener("click", function () {
      btn.disabled = true;
      api("POST", "/api/verify/send", {}).then(function (r) {
        verifyMsg = r.status === 200 ? (r.body.alreadyVerified ? t("Email sudah terverifikasi.", "Email already verified.") : t("Email verifikasi dikirim ke " + acct.email + ". Periksa juga folder spam.", "Verification email sent to " + acct.email + ". Check your spam folder too."))
          : r.status === 429 ? t("Terlalu sering. Coba lagi nanti.", "Too many requests. Try again later.") : t("Gagal mengirim. Coba lagi.", "Could not send. Try again.");
        if (r.status === 200 && r.body.alreadyVerified) acct.verified = true;
        QA.render(true);
      }).catch(function () { verifyMsg = t("Tidak dapat terhubung ke server.", "Cannot reach the server."); QA.render(true); });
    });
    return h("div", { class: "card warn", role: "note" },
      h("b", null, t("Email Anda belum diverifikasi", "Your email is not verified yet")),
      h("p", { class: "small" }, t("Verifikasi diperlukan untuk bergabung di papan komunitas dan membantu Anda memulihkan akun.", "Verification is needed to join the community board and helps you recover your account.")),
      btn, status);
  };

  QA.routes.loading = function () {
    return h("div", { class: "page" }, h("p", { class: "muted", role: "status" }, t("Memeriksa sesi...", "Checking session...")));
  };

  // Layar masuk: sederhana dan ramah, satu kolom. Bukan halaman promosi; hanya menjelaskan untuk siapa dan apa isinya.
  QA.routes.welcome = function () {
    var intro = h("div", { class: "auth-intro" },
      h("a", { class: "brand", href: "https://naradipta.com/" }, QA.brandMark(), h("span", null, "QA Drill")),
      h("h1", null, t("Belajar QA bareng", "Learning QA together")),
      h("p", null, t("Tempat latihan untuk teman-teman QA: persiapan sertifikasi ISTQB CTFL dan bekal karir (API, Selenium, SQL, interview). Gratis dan tanpa iklan.",
        "A practice space for fellow QAs: ISTQB CTFL prep and career toolkit (API, Selenium, SQL, interviews). Free, no ads.")),
      h("p", { class: "small muted" }, t("Masuk supaya progres belajar Anda tersimpan dan bisa dilanjutkan dari perangkat mana pun.", "Sign in so your progress is saved and can continue on any device.")));
    return h("div", { class: "auth" },
      intro,
      authForm(true),
      h("div", { class: "or" }, h("span", null, t("atau", "or"))),
      h("button", { class: "btn block", type: "button", onclick: function () { setGuest(true); QA.go("dashboard"); QA.render(); } }, t("Coba dulu tanpa akun", "Try it without an account")),
      h("p", { class: "small muted center" }, t("Tanpa akun, progres hanya tersimpan di browser ini.", "Without an account, progress stays in this browser only.")),
      h("div", { class: "row center" }, QA.langToggle()),
      h("p", { class: "small muted center" }, t("Dibuat oleh Muhammad Arrafi untuk belajar bersama. ", "Built by Muhammad Arrafi for learning together. "), h("a", { href: "https://naradipta.com/" }, "naradipta.com")));
  };

  // Akun di sidebar: avatar + email + Keluar, atau ajakan Masuk untuk tamu.
  QA.accountBlock = function () {
    if (acct.status === "in") {
      return h("div", { class: "acct" },
        h("a", { href: "#/account", class: "acct-who", title: acct.email }, h("span", { class: "avatar", "aria-hidden": "true" }, initial()),
          h("span", { class: "acct-text" }, h("span", { class: "acct-email" }, acct.email), h("span", { class: "acct-sub" }, acct.syncing ? t("Menyinkronkan...", "Syncing...") : t("Tersinkron", "Synced")))),
        h("button", { class: "btn small block", type: "button", onclick: function () { logout(); } }, QA.icon("logout", 16), t("Keluar", "Sign out")));
    }
    if (acct.status === "out") {
      return h("div", { class: "acct" },
        h("p", { class: "small muted" }, t("Mode tamu: progres hanya di browser ini.", "Guest mode: progress only in this browser.")),
        h("a", { href: "#/account", class: "btn primary small block" }, QA.icon("login", 16), t("Masuk / Daftar", "Sign in / Register")));
    }
    return null;
  };

  // Avatar kecil di top bar mobile.
  QA.accountChip = function () {
    if (acct.status === "in") return h("a", { href: "#/account", class: "avatar", "aria-label": t("Akun: ", "Account: ") + acct.email }, initial());
    if (acct.status === "out") return h("a", { href: "#/account", class: "btn primary small" }, t("Masuk", "Sign in"));
    return null;
  };

  init();
})();
