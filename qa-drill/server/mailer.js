'use strict';
// Pengirim email. Tanpa dependency: layanan HTTP (Resend) lewat fetch, atau mode 'log' untuk dev (tautan dicetak ke konsol).
// Env: MAIL_PROVIDER = resend | log (kosong = email dimatikan), MAIL_FROM (mis. "QA Drill <no-reply@naradipta.com>"), RESEND_API_KEY.
// Kredensial hanya lewat environment di server, tidak pernah di repo.
function createMailer(env = process.env) {
  const provider = (env.MAIL_PROVIDER || '').toLowerCase();
  const from = env.MAIL_FROM || '';
  if (provider === 'resend') {
    if (!env.RESEND_API_KEY || !from) throw new Error('MAIL_PROVIDER=resend butuh RESEND_API_KEY dan MAIL_FROM');
    return {
      enabled: true,
      async send({ to, subject, text, html }) {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to: [to], subject, text, html }),
          signal: AbortSignal.timeout(10000),
        });
        if (!r.ok) throw new Error('resend ' + r.status);
      },
    };
  }
  if (provider === 'log') {
    return { enabled: true, async send({ to, subject, text }) { console.log(`[mail:log] to=${to} subject=${subject}\n${text}\n`); } };
  }
  return { enabled: false, async send() { throw new Error('email disabled'); } };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Isi email dwibahasa singkat. Tautan memakai fragment (#/...) supaya token tidak ikut terkirim ke log server web.
function verifyEmail(url) {
  const text = `Verifikasi email QA Drill\n\nBuka tautan ini untuk memverifikasi email Anda (berlaku 24 jam):\n${url}\n\nVerify your QA Drill email: open the link above (valid for 24 hours).\n\nAbaikan email ini bila Anda tidak mendaftar. / Ignore this email if you did not sign up.`;
  return { subject: 'Verifikasi email QA Drill / Verify your QA Drill email', text,
    html: `<p><b>Verifikasi email QA Drill</b></p><p>Buka tautan ini untuk memverifikasi email Anda (berlaku 24 jam):<br><a href="${esc(url)}">${esc(url)}</a></p><p>Verify your email: open the link above (valid for 24 hours).</p><p style="color:#666">Abaikan bila Anda tidak mendaftar. / Ignore if you did not sign up.</p>` };
}
function resetEmail(url) {
  const text = `Atur ulang password QA Drill\n\nBuka tautan ini untuk membuat password baru (berlaku 1 jam, sekali pakai):\n${url}\n\nReset your QA Drill password: open the link above (valid for 1 hour, single use).\n\nBila bukan Anda yang meminta, abaikan email ini; password Anda tidak berubah. / If you did not request this, ignore it; your password is unchanged.`;
  return { subject: 'Atur ulang password QA Drill / Reset your QA Drill password', text,
    html: `<p><b>Atur ulang password QA Drill</b></p><p>Buka tautan ini untuk membuat password baru (berlaku 1 jam, sekali pakai):<br><a href="${esc(url)}">${esc(url)}</a></p><p>Reset your password: open the link above (valid for 1 hour, single use).</p><p style="color:#666">Bila bukan Anda yang meminta, abaikan; password tidak berubah. / If this was not you, ignore it.</p>` };
}

module.exports = { createMailer, verifyEmail, resetEmail };
