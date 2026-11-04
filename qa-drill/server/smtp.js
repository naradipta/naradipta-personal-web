'use strict';
// Klien SMTP minimal untuk mengirim satu email. Hanya modul bawaan Node (node:tls/net), tanpa dependency.
// TLS langsung (implicit TLS, port 465) + AUTH PLAIN. Tidak ada STARTTLS dan tidak ada antrean/percobaan ulang:
// kegagalan dilempar ke pemanggil (mailer), yang mencatatnya tanpa menggagalkan pendaftaran.
// Kredensial tidak pernah dimasukkan ke pesan error.
const net = require('node:net');
const tls = require('node:tls');
const crypto = require('node:crypto');

const CRLF = '\r\n';
const LOOPBACK = new Set(['127.0.0.1', 'localhost', '::1']);
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const wrap76 = (b) => b.replace(/.{1,76}/g, '$&' + CRLF).trimEnd();

// Mencegah penyuntikan header: tidak ada CR/LF/NUL di nilai yang masuk ke header atau perintah SMTP.
function clean(name, value) {
  const s = String(value == null ? '' : value);
  if (/[\r\n\0]/.test(s)) throw new Error(`${name} tidak valid`);
  return s;
}
// "QA Drill <a@b.c>" atau "a@b.c" -> "a@b.c"
function addressOf(value) {
  const s = clean('alamat', value);
  const m = /<([^<>\s]+)>/.exec(s);
  const a = (m ? m[1] : s).trim();
  if (!/^[^\s@<>]+@[^\s@<>]+$/.test(a)) throw new Error('alamat email tidak valid');
  return a;
}
// Header non-ASCII memakai encoded-word RFC 2047 (dipecah per ~40 byte agar tiap kata <= 75 karakter).
function encodeHeader(value) {
  const s = clean('header', value);
  if (/^[\x20-\x7e]*$/.test(s)) return s;
  const words = [];
  let cur = '';
  for (const ch of s) {
    if (Buffer.byteLength(cur + ch) > 40) { words.push(cur); cur = ''; }
    cur += ch;
  }
  if (cur) words.push(cur);
  return words.map((w) => '=?UTF-8?B?' + b64(w) + '?=').join(CRLF + ' ');
}

function buildMessage({ from, to, subject, text, html, domain }) {
  const body = (type, content) => `Content-Type: ${type}; charset=utf-8${CRLF}Content-Transfer-Encoding: base64${CRLF}${CRLF}${wrap76(b64(content))}`;
  const head = [
    'From: ' + encodeHeader(from),
    'To: ' + clean('to', to),
    'Subject: ' + encodeHeader(subject),
    'Date: ' + new Date().toUTCString(),
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    'MIME-Version: 1.0',
  ];
  if (!html) return head.concat(body('text/plain', text || '')).join(CRLF);
  const boundary = 'qd-' + crypto.randomBytes(12).toString('hex');
  head.push(`Content-Type: multipart/alternative; boundary="${boundary}"`, '');
  return head.join(CRLF) + CRLF +
    `--${boundary}${CRLF}${body('text/plain', text || '')}${CRLF}` +
    `--${boundary}${CRLF}${body('text/html', html)}${CRLF}` +
    `--${boundary}--`;
}

// Opsi: host, port (465), user, pass, from, to, subject, text, html, secure (true), timeoutMs (15000).
// secure:false (tanpa TLS) hanya diizinkan ke loopback, untuk tes; ke host lain ditolak agar kredensial tidak terkirim polos.
async function sendMail(opts) {
  const host = clean('host', opts.host);
  const port = Number(opts.port) || 465;
  const secure = opts.secure !== false;
  if (!secure && !LOOPBACK.has(host)) throw new Error('SMTP tanpa TLS hanya boleh ke loopback');
  const envFrom = addressOf(opts.from);
  const envTo = addressOf(opts.to);
  const user = clean('user', opts.user);
  const pass = clean('pass', opts.pass);
  const message = buildMessage({ from: opts.from, to: opts.to, subject: opts.subject, text: opts.text, html: opts.html, domain: envFrom.split('@')[1] });
  const timeoutMs = opts.timeoutMs || 15000;

  const sock = await new Promise((resolve, reject) => {
    const s = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    s.once(secure ? 'secureConnect' : 'connect', () => resolve(s));
    s.once('error', reject);
  });

  let buf = '';
  let waiter = null;
  let failure = null;
  const fail = (err) => { failure = failure || err; if (waiter) { const w = waiter; waiter = null; w.reject(failure); } };
  const takeReply = () => {
    const lines = buf.split(CRLF);
    const done = lines.slice(0, -1);
    const i = done.findIndex((l) => /^\d{3}( |$)/.test(l));
    if (i < 0) return null;
    buf = lines.slice(i + 1).join(CRLF);
    return { code: Number(done[i].slice(0, 3)), text: done.slice(0, i + 1).map((l) => l.slice(4)).join(' ') };
  };
  const pump = () => { if (!waiter) return; const r = takeReply(); if (r) { const w = waiter; waiter = null; w.resolve(r); } };
  sock.on('data', (d) => { buf += d.toString('utf8'); pump(); });
  sock.on('error', fail);
  sock.on('close', () => fail(new Error('koneksi SMTP ditutup')));
  sock.setTimeout(timeoutMs, () => sock.destroy(new Error('SMTP timeout')));

  const read = () => new Promise((resolve, reject) => {
    if (failure) return reject(failure);
    waiter = { resolve, reject };
    pump();
  });
  // `label` dipakai di pesan error (bukan isi perintah, karena AUTH membawa kredensial).
  const step = async (label, line, ok) => {
    if (line !== null) sock.write(line + CRLF);
    const r = await read();
    if (!ok.includes(r.code)) throw new Error(`SMTP ${label} ditolak (${r.code})`);
    return r;
  };

  try {
    await step('banner', null, [220]);
    await step('EHLO', 'EHLO ' + (envFrom.split('@')[1] || 'localhost'), [250]);
    await step('AUTH', 'AUTH PLAIN ' + b64('\0' + user + '\0' + pass), [235]);
    await step('MAIL FROM', `MAIL FROM:<${envFrom}>`, [250]);
    await step('RCPT TO', `RCPT TO:<${envTo}>`, [250, 251]);
    await step('DATA', 'DATA', [354]);
    // Dot-stuffing: baris yang diawali "." digandakan agar tidak dianggap penutup DATA.
    sock.write(message.replace(/^\./gm, '..') + CRLF + '.' + CRLF);
    await step('isi pesan', null, [250]);
    // Tunggu 221 sebentar agar QUIT sampai sebelum soket ditutup (pesan sudah diterima; kegagalan di sini diabaikan).
    sock.write('QUIT' + CRLF);
    await Promise.race([read().catch(() => {}), new Promise((r) => setTimeout(r, 1500).unref())]);
  } finally {
    sock.removeAllListeners('close');
    sock.on('error', () => {});
    sock.end();
    setTimeout(() => sock.destroy(), 500).unref();
  }
}

module.exports = { sendMail, buildMessage, addressOf, encodeHeader };
