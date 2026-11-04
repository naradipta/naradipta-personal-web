'use strict';
// Setup akun admin di server (tidak ada pendaftaran lewat web):
//   ADMIN_DATA_DIR=/var/lib/naradipta-admin node cli.js set-admin <username>
// Password dibaca dari prompt tersembunyi, atau dari env ADMIN_PASSWORD untuk skrip.
// Memanggil ulang perintah yang sama = ganti password (semua sesi berakhir setelah service di-restart).
const path = require('node:path');
const readline = require('node:readline');
const auth = require('./auth');
const { createStore } = require('./store');

function askHidden(q) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(q)) process.stdout.write(s); };
    rl.question(q, (a) => { rl.close(); process.stdout.write('\n'); resolve(a); });
  });
}

(async () => {
  const [cmd, username] = process.argv.slice(2);
  if (cmd !== 'set-admin' || !username) {
    console.error('Pemakaian: ADMIN_DATA_DIR=... node cli.js set-admin <username>');
    process.exit(1);
  }
  const store = createStore(path.resolve(process.env.ADMIN_DATA_DIR || path.join(__dirname, 'data')), path.join(__dirname, '..'));
  const pw = process.env.ADMIN_PASSWORD || (await askHidden('Password baru (min. 10 karakter): '));
  if (!auth.validPassword(pw)) { console.error('Password harus 10-200 karakter'); process.exit(1); }
  store.writeAdmin(username, await auth.hashPassword(pw));
  console.log('Akun admin disimpan:', username);
})();
