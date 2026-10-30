'use strict';
// Hash password (scrypt), token sesi, dan validasi input. Hanya modul bawaan Node.
const crypto = require('node:crypto');

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

function scrypt(password, salt, keylen, opts) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function validEmail(email) {
  return email.length <= 254 && EMAIL_RE.test(email);
}

// Batas atas mencegah request password sangat panjang membebani CPU.
function validPassword(pw) {
  return typeof pw === 'string' && pw.length >= 8 && pw.length <= 200;
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join('$');
}

async function verifyPassword(password, stored) {
  const parts = String(stored).split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  const salt = Buffer.from(parts[4], 'base64');
  const want = Buffer.from(parts[5], 'base64');
  const got = await scrypt(password, salt, want.length, { N, r, p });
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}

// Hash palsu agar login untuk email yang tidak ada memakan waktu sama dengan email yang ada.
let dummy;
async function verifyDummy(password) {
  dummy = dummy || (await hashPassword('dummy-password'));
  await verifyPassword(password, dummy);
  return false;
}

function newToken() {
  return crypto.randomBytes(32).toString('base64url');
}

// Basis data hanya menyimpan hash token, jadi kebocoran DB tidak membocorkan sesi aktif.
function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { normalizeEmail, validEmail, validPassword, hashPassword, verifyPassword, verifyDummy, newToken, tokenHash };
