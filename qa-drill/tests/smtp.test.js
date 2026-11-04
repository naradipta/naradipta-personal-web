// Tes klien SMTP dengan server SMTP palsu di loopback (tanpa TLS, hanya diizinkan ke 127.0.0.1). Jalankan: node tests/smtp.test.js
const assert = require("assert");
const net = require("net");
const { sendMail, buildMessage, encodeHeader, addressOf } = require("../server/smtp");
const { createMailer } = require("../server/mailer");

// Server palsu: mode "ok" (menerima semuanya), "authfail" (535 saat AUTH), "hang" (diam setelah banner).
function fakeServer(mode) {
  const got = { commands: [], data: "" };
  const srv = net.createServer((sock) => {
    let inData = false, buf = "";
    sock.write("220 fake ESMTP\r\n");
    if (mode === "hang") return;
    sock.on("data", (d) => {
      buf += d.toString("utf8");
      if (inData) {
        if (buf.includes("\r\n.\r\n")) { got.data = buf.slice(0, buf.indexOf("\r\n.\r\n")); buf = ""; inData = false; sock.write("250 queued\r\n"); }
        return;
      }
      let i;
      while ((i = buf.indexOf("\r\n")) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 2);
        got.commands.push(line);
        if (/^EHLO/.test(line)) sock.write("250-fake\r\n250 AUTH PLAIN\r\n");
        else if (/^AUTH PLAIN/.test(line)) sock.write(mode === "authfail" ? "535 5.7.8 Authentication failed\r\n" : "235 ok\r\n");
        else if (/^MAIL FROM/.test(line) || /^RCPT TO/.test(line)) sock.write("250 ok\r\n");
        else if (line === "DATA") { inData = true; sock.write("354 go\r\n"); if (buf.length) sock.emit("data", Buffer.alloc(0)); }
        else if (line === "QUIT") { sock.write("221 bye\r\n"); sock.end(); }
      }
    });
  });
  return new Promise((resolve) => srv.listen(0, "127.0.0.1", () => resolve({ srv, got, port: srv.address().port })));
}
const decodeBodies = (data) => [...data.matchAll(/Content-Transfer-Encoding: base64\r\n\r\n([A-Za-z0-9+/=\r\n]+?)(?:\r\n--|$)/g)].map((m) => Buffer.from(m[1].replace(/\r\n/g, ""), "base64").toString("utf8"));

(async () => {
  const base = { host: "127.0.0.1", secure: false, user: "login@smtp-brevo.com", pass: "xsmtpsib-RAHASIA", from: "QA Drill <no-reply@naradipta.com>", to: "budi@contoh.id" };

  // 1. Alur normal: amplop, kredensial, header, dan isi (teks + html) sampai utuh.
  {
    const { srv, got, port } = await fakeServer("ok");
    await sendMail({ ...base, port, subject: "Verifikasi email QA Drill / Verify", text: "Halo\n.baris titik\nTautan: https://learn.example.org/#/verify/abc", html: "<p>Halo <b>Budi</b></p>" });
    srv.close();
    const auth = got.commands.find((c) => c.startsWith("AUTH PLAIN "));
    assert.strictEqual(Buffer.from(auth.slice(11), "base64").toString(), "\0login@smtp-brevo.com\0xsmtpsib-RAHASIA", "AUTH PLAIN membawa user dan kunci");
    assert.ok(got.commands.includes("MAIL FROM:<no-reply@naradipta.com>"), "amplop pengirim hanya alamatnya");
    assert.ok(got.commands.includes("RCPT TO:<budi@contoh.id>"));
    assert.ok(got.commands.includes("QUIT"));
    assert.ok(/^From: QA Drill <no-reply@naradipta\.com>$/m.test(got.data), "header From memuat nama tampilan");
    assert.ok(/^To: budi@contoh\.id$/m.test(got.data));
    assert.ok(/^Subject: Verifikasi email QA Drill \/ Verify$/m.test(got.data));
    assert.ok(/^Message-ID: <[0-9a-f-]+@naradipta\.com>$/m.test(got.data), "Message-ID memakai domain pengirim");
    assert.ok(/multipart\/alternative; boundary=/.test(got.data));
    const bodies = decodeBodies(got.data);
    assert.strictEqual(bodies.length, 2, "dua bagian: teks dan html");
    assert.ok(bodies[0].includes("\n.baris titik\n") && bodies[0].includes("#/verify/abc"), "baris berawalan titik dan tautan fragment utuh");
    assert.strictEqual(bodies[1], "<p>Halo <b>Budi</b></p>");
  }

  // 2. Teks saja (tanpa html) = satu bagian text/plain.
  {
    const { srv, got, port } = await fakeServer("ok");
    await sendMail({ ...base, port, subject: "Tes", text: "isi saja" });
    srv.close();
    assert.ok(!/multipart/.test(got.data) && /Content-Type: text\/plain; charset=utf-8/.test(got.data));
    assert.deepStrictEqual(decodeBodies(got.data), ["isi saja"]);
  }

  // 3. Login ditolak: error jelas, tanpa membocorkan kunci/login ke pesan.
  {
    const { srv, port } = await fakeServer("authfail");
    await assert.rejects(sendMail({ ...base, port, subject: "x", text: "y" }), (e) => {
      assert.ok(/AUTH ditolak \(535\)/.test(e.message), e.message);
      assert.ok(!e.message.includes("RAHASIA") && !e.message.includes("login@"), "kredensial tidak ikut di pesan error");
      return true;
    });
    srv.close();
  }

  // 4. Server diam: berhenti oleh timeout, tidak menggantung.
  {
    const { srv, port } = await fakeServer("hang");
    const t0 = Date.now();
    await assert.rejects(sendMail({ ...base, port, subject: "x", text: "y", timeoutMs: 300 }), /timeout|ditutup/i);
    assert.ok(Date.now() - t0 < 3000, "timeout cepat");
    srv.close();
  }

  // 5. Penyuntikan header ditolak sebelum ada koneksi (port 1 tidak mendengarkan; bila lolos, error-nya akan ECONNREFUSED).
  for (const bad of [{ subject: "Halo\r\nBcc: korban@contoh.id" }, { to: "a@b.c\r\nRCPT TO:<x@y.z>" }, { from: "a@b.c>\r\nX: y" }]) {
    await assert.rejects(sendMail({ ...base, port: 1, subject: "s", text: "t", ...bad }), /tidak valid/, "harus ditolak: " + JSON.stringify(bad));
  }
  await assert.rejects(sendMail({ ...base, port: 1, subject: "s", text: "t", to: "bukan-email" }), /tidak valid/);

  // 6. Tanpa TLS hanya ke loopback: kredensial tidak boleh terkirim polos ke host lain.
  await assert.rejects(sendMail({ ...base, host: "smtp-relay.brevo.com", secure: false, subject: "s", text: "t" }), /loopback/);

  // 7. Header non-ASCII memakai encoded-word RFC 2047 dan bisa dibaca balik; ASCII tidak diubah.
  {
    const enc = encodeHeader("Verifikasi café ☕ untuk Muhammad Arrafi — konfirmasi email");
    assert.ok(enc.split("\r\n ").every((w) => /^=\?UTF-8\?B\?[A-Za-z0-9+/=]+\?=$/.test(w) && w.length <= 75), "tiap encoded-word <= 75 karakter");
    assert.strictEqual(enc.split("\r\n ").map((w) => Buffer.from(w.slice(10, -2), "base64").toString("utf8")).join(""), "Verifikasi café ☕ untuk Muhammad Arrafi — konfirmasi email");
    assert.strictEqual(encodeHeader("Subjek biasa"), "Subjek biasa");
  }
  assert.strictEqual(addressOf("QA Drill <no-reply@naradipta.com>"), "no-reply@naradipta.com");
  assert.ok(buildMessage({ from: "a@b.c", to: "d@e.f", subject: "s", text: "t", domain: "b.c" }).includes("MIME-Version: 1.0"));

  // 8. Mailer: konfigurasi smtp divalidasi; tanpa provider tetap mati.
  assert.throws(() => createMailer({ MAIL_PROVIDER: "smtp", MAIL_FROM: "a@b.c" }), /MAIL_SMTP_USER/);
  assert.strictEqual(createMailer({}).enabled, false);
  assert.strictEqual(createMailer({ MAIL_PROVIDER: "smtp", MAIL_FROM: "QA <a@b.c>", MAIL_SMTP_USER: "u", MAIL_SMTP_KEY: "k" }).enabled, true);

  console.log("smtp.test.js: semua tes lulus");
  process.exit(0);
})().catch((e) => { console.error("GAGAL:", e); process.exit(1); });
