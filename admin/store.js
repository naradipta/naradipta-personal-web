'use strict';
// Penyimpanan konten admin di ADMIN_DATA_DIR (di luar repo, jadi `git pull` aman):
//   live/     konten yang sedang terbit      (site.json, projects/*.md, gallery/*.md)
//   draft/    konten yang sedang diedit      (struktur sama)
//   history/  salinan live sebelum tiap publish (untuk kembali ke versi lama)
//   uploads/  foto dan PDF yang diunggah
//   admin.json  akun admin (username + hash password)
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const content = require('./content');

const COLLECTIONS = ['projects', 'gallery'];
const KEEP_HISTORY = 20;

function createStore(dataDir, repoDir) {
  const dir = (...p) => path.join(dataDir, ...p);
  const ensure = (d) => fs.mkdirSync(d, { recursive: true });

  function atomicWrite(file, data) {
    ensure(path.dirname(file));
    const tmp = file + '.' + crypto.randomBytes(4).toString('hex') + '.tmp';
    fs.writeFileSync(tmp, data);
    fs.renameSync(tmp, file);
  }

  // Pertama kali dipakai: isi live/ dari konten bawaan repo supaya situs tidak berubah apa pun.
  function init() {
    ensure(dir('uploads'));
    if (!fs.existsSync(dir('live'))) {
      const tmp = dir('live.seed');
      fs.rmSync(tmp, { recursive: true, force: true });
      ensure(tmp);
      fs.copyFileSync(path.join(repoDir, 'src/config/site.json'), path.join(tmp, 'site.json'));
      for (const c of COLLECTIONS) fs.cpSync(path.join(repoDir, 'src/content', c), path.join(tmp, c), { recursive: true });
      fs.renameSync(tmp, dir('live'));
    }
    if (!fs.existsSync(dir('draft'))) fs.cpSync(dir('live'), dir('draft'), { recursive: true });
  }

  const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

  function slugFile(collection, slug) {
    if (!COLLECTIONS.includes(collection) || !content.SLUG_RE.test(slug)) throw new content.ValidationError('slug tidak valid');
    return dir('draft', collection, slug + '.md');
  }

  function readDraft() {
    const out = { site: readJson(dir('draft', 'site.json')) };
    for (const c of COLLECTIONS) {
      const d = dir('draft', c);
      out[c] = fs.existsSync(d)
        ? fs.readdirSync(d).filter((f) => f.endsWith('.md')).sort().map((f) => ({ slug: f.slice(0, -3), ...content.parseMarkdown(fs.readFileSync(path.join(d, f), 'utf8')) }))
        : [];
    }
    return out;
  }

  const saveSite = (data) => atomicWrite(dir('draft', 'site.json'), JSON.stringify(content.cleanSite(data), null, 2) + '\n');

  function saveEntry(collection, slug, data, body) {
    const file = slugFile(collection, slug);
    const clean = content.cleaners[collection](data);
    atomicWrite(file, content.serializeMarkdown(clean, collection === 'projects' ? content.cleanBody(body) : ''));
  }

  function removeEntry(collection, slug) {
    const file = slugFile(collection, slug);
    if (!fs.existsSync(file)) return false;
    fs.rmSync(file);
    return true;
  }

  // Ringkasan isi folder untuk membandingkan draft dengan live.
  function fingerprint(root) {
    const h = crypto.createHash('sha256');
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else { h.update(path.relative(root, p)); h.update(fs.readFileSync(p)); }
      }
    };
    walk(root);
    return h.digest('hex');
  }
  const isDirty = () => fingerprint(dir('draft')) !== fingerprint(dir('live'));

  const replaceDir = (src, dst) => {
    fs.rmSync(dst + '.new', { recursive: true, force: true });
    fs.cpSync(src, dst + '.new', { recursive: true });
    fs.rmSync(dst, { recursive: true, force: true });
    fs.renameSync(dst + '.new', dst);
  };

  const discardDraft = () => replaceDir(dir('live'), dir('draft'));

  // Dipanggil setelah build draft berhasil: simpan live lama ke history, lalu draft menjadi live.
  function promoteDraft() {
    const id = new Date().toISOString().replace(/[:.]/g, '-');
    fs.cpSync(dir('live'), dir('history', id), { recursive: true });
    replaceDir(dir('draft'), dir('live'));
    const all = listHistory();
    for (const old of all.slice(KEEP_HISTORY)) fs.rmSync(dir('history', old), { recursive: true, force: true });
    return id;
  }

  const listHistory = () => (fs.existsSync(dir('history')) ? fs.readdirSync(dir('history')).sort().reverse() : []);

  function restoreHistory(id) {
    if (!listHistory().includes(id)) throw new content.ValidationError('versi tidak ditemukan');
    replaceDir(dir('history', id), dir('draft'));
  }

  // --- Unggahan ---
  const MAGIC = [
    { ext: '.jpg', max: 8e6, test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
    { ext: '.png', max: 8e6, test: (b) => b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])) },
    { ext: '.gif', max: 8e6, test: (b) => b.subarray(0, 4).toString('latin1') === 'GIF8' },
    { ext: '.webp', max: 8e6, test: (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP' },
    { ext: '.pdf', max: 10e6, test: (b) => b.subarray(0, 5).toString('latin1') === '%PDF-' },
  ];
  // Tipe ditentukan dari isi file, bukan dari nama/ekstensi yang dikirim klien.
  function saveUpload(buf, originalName) {
    const kind = MAGIC.find((m) => m.test(buf));
    if (!kind) throw new content.ValidationError('Hanya JPG, PNG, GIF, WebP, atau PDF');
    if (buf.length > kind.max) throw new content.ValidationError('File terlalu besar');
    const base = String(originalName || 'file').replace(/\.[^.]*$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file';
    const name = `${base}-${crypto.randomBytes(4).toString('hex')}${kind.ext}`;
    atomicWrite(dir('uploads', name), buf);
    return '/uploads/' + name;
  }
  const uploadFile = (name) => (/^[a-z0-9-]+\.(jpg|png|gif|webp|pdf)$/.test(name) ? dir('uploads', name) : null);

  // --- Akun admin ---
  const readAdmin = () => (fs.existsSync(dir('admin.json')) ? readJson(dir('admin.json')) : null);
  function writeAdmin(username, pwHash) {
    atomicWrite(dir('admin.json'), JSON.stringify({ username, pwHash }) + '\n');
    fs.chmodSync(dir('admin.json'), 0o600);
  }

  return { dir, init, readDraft, saveSite, saveEntry, removeEntry, isDirty, discardDraft, promoteDraft, listHistory, restoreHistory, saveUpload, uploadFile, readAdmin, writeAdmin };
}

module.exports = { createStore };
