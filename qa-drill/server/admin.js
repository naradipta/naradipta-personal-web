'use strict';
// Alat admin lokal. Reset password mandiri lewat email ada di server (butuh MAIL_PROVIDER); ini jalan cadangan.
//   node server/admin.js set-password <email> <password-baru>
//   node server/admin.js verify <email>      (tandai terverifikasi manual)
//   node server/admin.js reports              (daftar laporan nama yang belum ditinjau)
//   node server/admin.js hide-name <email>    (hapus nama dari papan dan kunci: tidak bisa bergabung lagi sampai unhide-name)
//   node server/admin.js unhide-name <email>  (buka kunci nama)
//   node server/admin.js dismiss <email>      (tutup laporan tanpa tindakan; nama tampil lagi bila tersembunyi otomatis)
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
  } else if (cmd === 'verify' && emailArg) {
    const user = db.userByEmail(auth.normalizeEmail(emailArg));
    if (!user) { console.error('Email tidak ditemukan'); process.exit(1); }
    db.setVerified(user.id);
    console.log('Ditandai terverifikasi:', user.email);
  } else if (cmd === 'reports') {
    const list = db.openReports();
    if (!list.length) console.log('Tidak ada laporan terbuka.');
    for (const r of list) console.log(`${r.email}  nama="${r.display_name}"  pelapor=${r.reporters}  alasan=${r.reasons}  sejak=${new Date(r.first_at).toISOString().slice(0, 10)}`);
  } else if (['hide-name', 'unhide-name', 'dismiss'].includes(cmd) && emailArg) {
    const user = db.userByEmail(auth.normalizeEmail(emailArg));
    if (!user) { console.error('Email tidak ditemukan'); process.exit(1); }
    if (cmd === 'hide-name') { db.lockName(user.id); console.log('Nama dihapus dan dikunci untuk', user.email); }
    else if (cmd === 'unhide-name') { db.unlockName(user.id); console.log('Kunci nama dibuka untuk', user.email); }
    else { db.resolveReports(user.id); console.log('Laporan ditutup untuk', user.email); }
  } else {
    console.error('Pemakaian: admin.js set-password <email> <password> | verify <email> | reports | hide-name <email> | unhide-name <email> | dismiss <email> | stats');
    process.exit(1);
  }
})();
