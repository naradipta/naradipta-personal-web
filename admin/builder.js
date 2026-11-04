'use strict';
// Menjalankan `astro build` dari konten draft (preview) atau draft->live (publish).
// Satu build pada satu waktu. Build selalu ke folder sementara dulu; web root publik
// hanya disentuh setelah build sukses.
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

function run(cmd, args, opts) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, opts);
    let log = '';
    const add = (c) => { log = (log + c).slice(-4000); };
    p.stdout.on('data', add);
    p.stderr.on('data', add);
    const timer = setTimeout(() => p.kill('SIGKILL'), 5 * 60000);
    p.on('error', (e) => { clearTimeout(timer); resolve({ code: -1, log: String(e.message) }); });
    p.on('close', (code) => { clearTimeout(timer); resolve({ code, log }); });
  });
}

function createBuilder({ store, repoDir, webRoot }) {
  const astroBin = path.join(repoDir, 'node_modules/astro/bin/astro.mjs');
  const state = { state: 'idle', kind: null, startedAt: null, finishedAt: null, ok: null, message: '', previewAt: null, publishedAt: null };

  async function buildTo(contentDir, outDir) {
    fs.rmSync(outDir, { recursive: true, force: true });
    const r = await run(process.execPath, [astroBin, 'build', '--outDir', outDir], { cwd: repoDir, env: { ...process.env, CONTENT_DIR: contentDir } });
    if (r.code !== 0 || !fs.existsSync(path.join(outDir, 'index.html'))) throw new Error('Build gagal:\n' + r.log);
    // Unggahan bukan bagian dari repo, jadi disalin ke hasil build.
    fs.cpSync(store.dir('uploads'), path.join(outDir, 'uploads'), { recursive: true });
  }

  async function task(kind, fn) {
    if (state.state === 'building') return false;
    Object.assign(state, { state: 'building', kind, startedAt: Date.now(), finishedAt: null, ok: null, message: '' });
    fn().then(
      (msg) => Object.assign(state, { ok: true, message: msg || '' }, kind === 'preview' ? { previewAt: Date.now() } : { publishedAt: Date.now() }),
      (e) => Object.assign(state, { ok: false, message: e.message }),
    ).finally(() => Object.assign(state, { state: 'idle', finishedAt: Date.now() }));
    return true;
  }

  const preview = () => task('preview', async () => {
    const out = store.dir('preview');
    await buildTo(store.dir('draft'), out + '.tmp');
    fs.rmSync(out, { recursive: true, force: true });
    fs.renameSync(out + '.tmp', out);
  });

  const publish = () => task('publish', async () => {
    if (!webRoot) throw new Error('WEB_ROOT belum diatur di server');
    const staging = store.dir('staging');
    await buildTo(store.dir('draft'), staging);
    const r = await run('rsync', ['-a', '--delete', staging + '/', webRoot + '/'], {});
    if (r.code !== 0) throw new Error('Gagal menyalin ke web root:\n' + r.log);
    store.promoteDraft();
    fs.rmSync(staging, { recursive: true, force: true });
    return 'Situs sudah terbit';
  });

  return { state, preview, publish };
}

module.exports = { createBuilder };
