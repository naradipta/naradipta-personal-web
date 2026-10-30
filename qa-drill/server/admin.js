'use strict';
// Alat admin lokal (tanpa email, jadi tidak ada fitur "lupa password" otomatis).
//   node server/admin.js set-password <email> <password-baru>
//   node server/admin.js stats
const path = require('node:path');
const auth = require('./auth');
const dbmod = require('./db');

(async () => {
  const [cmd, emailArg, pw] = process.argv.slice(2);
  const db = dbmod.open(process.env.DB_PATH || path.join(__dirname, 'data', 'qa-drill.sqlite'));
  if (cmd === 'stats') {
    console.log('pengguna:', db.userCount());
  } else if (cmd === 'set-password' && emailArg && pw) {
    if (!auth.validPassword(pw)) { console.error('Password harus 8-200 karakter'); process.exit(1); }
    const email = auth.normalizeEmail(emailArg);
    const user = db.userByEmail(email);
    if (!user) { console.error('Email tidak ditemukan'); process.exit(1); }
    db.setPassword(email, await auth.hashPassword(pw));
    db.logoutEverywhere(user.id);
    console.log('Password diganti dan semua sesi dicabut untuk', email);
  } else {
    console.error('Pemakaian: admin.js set-password <email> <password> | stats');
    process.exit(1);
  }
})();
