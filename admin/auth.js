'use strict';
// Password admin (scrypt) dan token sesi. Hanya modul bawaan Node.
const crypto = require('node:crypto');

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };

function scrypt(password, salt, keylen, opts) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, opts, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

function validPassword(pw) {
  return typeof pw === 'string' && pw.length >= 10 && pw.length <= 200;
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

// Login dengan username salah tetap memakan waktu yang sama dengan username benar.
let dummy;
async function verifyDummy(password) {
  dummy = dummy || (await hashPassword('dummy-password'));
  await verifyPassword(password, dummy);
  return false;
}

const newToken = () => crypto.randomBytes(32).toString('base64url');
const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { validPassword, hashPassword, verifyPassword, verifyDummy, newToken, tokenHash };
