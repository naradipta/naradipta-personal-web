'use strict';
// Jalankan: node admin/tests/server.test.js  (memakai builder palsu; build asli dites terpisah)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer } = require('../server');
const auth = require('../auth');
const { createStore } = require('../store');

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.alloc(32)]);
const REPO = path.join(__dirname, '../..');

async function setup() {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adm-'));
  createStore(dataDir, REPO).writeAdmin('boss', await auth.hashPassword('correct-horse-9'));
  const calls = [];
  const builder = { state: { state: 'idle' }, preview: async () => { calls.push('preview'); return true; }, publish: async () => { calls.push('publish'); return true; } };
  const server = createServer({ ADMIN_DATA_DIR: dataDir, REPO_DIR: REPO, builder });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  let cookie = '';
  const call = async (method, p, body, headers = {}) => {
    const isBuf = Buffer.isBuffer(body);
    const res = await fetch(base + p, { method, headers: { Connection: 'close', ...(body !== undefined && !isBuf ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { cookie } : {}), ...headers }, body: body === undefined ? undefined : isBuf ? body : JSON.stringify(body) });
    const sc = res.headers.get('set-cookie');
    if (sc) cookie = sc.split(';')[0];
    return { status: res.status, json: await res.json().catch(() => ({})), res };
  };
  const login = () => call('POST', '/api/login', { username: 'boss', password: 'correct-horse-9' });
  return { server, dataDir, call, login, calls, base, close: () => { server.closeAllConnections(); server.close(); fs.rmSync(dataDir, { recursive: true, force: true }); } };
}

test('butuh login untuk semua endpoint data', async () => {
  const t = await setup();
  assert.equal((await t.call('GET', '/api/draft')).status, 401);
  assert.equal((await t.call('PUT', '/api/site', {})).status, 401);
  assert.equal((await t.call('POST', '/api/login', { username: 'boss', password: 'salah' })).status, 401);
  assert.equal((await t.call('POST', '/api/login', { username: 'x', password: 'correct-horse-9' })).status, 401);
  assert.equal((await t.login()).status, 200);
  assert.equal((await t.call('GET', '/api/draft')).status, 200);
  t.close();
});

test('draft awal sama dengan konten repo dan tidak dianggap berubah', async () => {
  const t = await setup(); await t.login();
  const { json } = await t.call('GET', '/api/draft');
  assert.equal(json.dirty, false);
  assert.ok(json.projects.length >= 5 && json.gallery.length >= 5);
  assert.equal(json.site.name, 'Muhammad Arrafi');
  t.close();
});

test('edit site, project, galeri; dirty; discard', async () => {
  const t = await setup(); await t.login();
  let { json } = await t.call('GET', '/api/draft');
  json.site.tagline = 'Tagline baru';
  assert.equal((await t.call('PUT', '/api/site', json.site)).status, 200);
  const p = json.projects[0];
  p.data.title = 'Judul baru';
  assert.equal((await t.call('PUT', `/api/projects/${p.slug}`, { data: p.data, body: '## Problem\nx' })).status, 200);
  assert.equal((await t.call('PUT', '/api/projects/proyek-baru', { data: { title: 'T', summary: 'S', status: 'completed', featured: false, order: 99, tags: ['a'] }, body: 'hai' })).status, 200);
  json = (await t.call('GET', '/api/draft')).json;
  assert.equal(json.dirty, true);
  assert.equal(json.site.tagline, 'Tagline baru');
  assert.equal(json.projects.find((x) => x.slug === 'proyek-baru').body.trim(), 'hai');
  assert.equal(json.projects.find((x) => x.slug === p.slug).data.title, 'Judul baru');
  assert.equal((await t.call('DELETE', '/api/projects/proyek-baru', {})).status, 200);
  assert.equal((await t.call('POST', '/api/discard', {})).status, 200);
  json = (await t.call('GET', '/api/draft')).json;
  assert.equal(json.dirty, false);
  assert.equal(json.site.tagline.startsWith('QA Engineer'), true);
  t.close();
});

test('validasi menolak data buruk dan path berbahaya', async () => {
  const t = await setup(); await t.login();
  const { json } = await t.call('GET', '/api/draft');
  assert.equal((await t.call('PUT', '/api/site', { ...json.site, name: '' })).status, 400);
  assert.equal((await t.call('PUT', '/api/site', { ...json.site, avatar: '../../etc/passwd' })).status, 400);
  assert.equal((await t.call('PUT', '/api/site', { ...json.site, contact: { ...json.site.contact, github: 'javascript:alert(1)' } })).status, 400);
  const good = { title: 'T', summary: 'S', status: 'completed', featured: false, order: 1, tags: [] };
  assert.equal((await t.call('PUT', '/api/projects/..%2Fevil', { data: good })).status, 400);
  assert.equal((await t.call('PUT', '/api/projects/Bad Slug', { data: good })).status, 400);
  assert.equal((await t.call('PUT', '/api/projects/ok', { data: { ...good, status: 'x' } })).status, 400);
  assert.equal((await t.call('PUT', '/api/projects/ok', { data: { ...good, repo: 'javascript:alert(1)' } })).status, 400);
  assert.equal(fs.existsSync(path.join(t.dataDir, 'evil.md')), false);
  t.close();
});

test('unggahan dicek dari isi file, bukan nama', async () => {
  const t = await setup(); await t.login();
  const h = { 'X-Requested-With': 'admin', 'Content-Type': 'application/octet-stream', 'X-Filename': 'Foto Saya.PNG' };
  const ok = await t.call('POST', '/api/upload', PNG, h);
  assert.equal(ok.status, 201);
  assert.match(ok.json.path, /^\/uploads\/foto-saya-[0-9a-f]{8}\.png$/);
  assert.equal((await t.call('GET', '/api/' + ok.json.path.slice(1))).status, 200);
  assert.equal((await t.call('POST', '/api/upload', Buffer.from('<svg onload=alert(1)>'), { ...h, 'X-Filename': 'x.png' })).status, 400);
  assert.equal((await t.call('POST', '/api/upload', PNG, { 'Content-Type': 'application/octet-stream' })).status, 403); // tanpa header khusus
  assert.equal((await t.call('GET', '/api/uploads/..%2Fadmin.json')).status, 404);
  t.close();
});

test('CSRF: Origin asing ditolak', async () => {
  const t = await setup(); await t.login();
  assert.equal((await t.call('POST', '/api/discard', {}, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await t.call('POST', '/api/discard', {}, { Origin: t.base })).status, 200);
  t.close();
});

test('rate limit login', async () => {
  const t = await setup();
  let last;
  for (let i = 0; i < 12; i++) last = await t.call('POST', '/api/login', { username: 'boss', password: 'salah-' + i });
  assert.equal(last.status, 429);
  t.close();
});

test('publish/preview diteruskan ke builder; riwayat bisa dimuat ke draft', async () => {
  const t = await setup(); await t.login();
  await t.call('POST', '/api/preview', {}); await t.call('POST', '/api/publish', {});
  assert.deepEqual(t.calls, ['preview', 'publish']);
  const { json } = await t.call('GET', '/api/draft');
  json.site.name = 'Nama Baru';
  await t.call('PUT', '/api/site', json.site);
  const id = t.server.store.promoteDraft(); // seperti publish sukses
  assert.deepEqual((await t.call('GET', '/api/history')).json.versions, [id]);
  await t.call('PUT', '/api/site', { ...json.site, name: 'Nama Lain' });
  assert.equal((await t.call('POST', '/api/history/restore', { id })).status, 200);
  assert.equal((await t.call('GET', '/api/draft')).json.site.name, 'Muhammad Arrafi');
  assert.equal((await t.call('POST', '/api/history/restore', { id: '../x' })).status, 400);
  t.close();
});

test('UI statis disajikan dengan CSP; traversal ditolak', async () => {
  const t = await setup();
  const r = await fetch(t.base + '/');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-security-policy'), /default-src 'self'/);
  const bad = await fetch(t.base + '/..%2Fserver.js');
  assert.notEqual(bad.status, 200);
  t.close();
});

test('preview: wajib login dan link absolut diberi awalan /admin/preview/', async () => {
  const t = await setup();
  const pv = path.join(t.dataDir, 'preview');
  fs.mkdirSync(path.join(pv, 'projects'), { recursive: true });
  fs.writeFileSync(path.join(pv, 'index.html'), '<a href="/projects">p</a><a href="/#work">w</a><img src="/uploads/a.png"><a href="//cdn.example/x">c</a><a href="https://x.example">e</a><a href=\'/single\'>s</a><img srcset="/a.png 1x, /b.png 2x, //cdn.example/c.png 3x"><div style="background:url(/bg.png)"></div>');
  fs.writeFileSync(path.join(pv, 'projects', 'index.html'), 'x');
  fs.writeFileSync(path.join(pv, 'projects.html'), '<a href="/">home</a>');
  assert.equal((await fetch(t.base + '/preview/')).status, 401);
  await t.login();
  const r = await fetch(t.base + '/preview/', { headers: { cookie: (await (async () => { const l = await fetch(t.base + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Connection: 'close' }, body: JSON.stringify({ username: 'boss', password: 'correct-horse-9' }) }); return l.headers.get('set-cookie').split(';')[0]; })()) } });
  const html = await r.text();
  assert.equal(r.status, 200);
  assert.match(html, /href="\/admin\/preview\/projects"/);
  assert.match(html, /href="\/admin\/preview\/#work"/);
  assert.match(html, /src="\/admin\/preview\/uploads\/a\.png"/);
  assert.match(html, /href="\/\/cdn\.example\/x"/); // protocol-relative tidak diubah
  assert.match(html, /href="https:\/\/x\.example"/);
  assert.match(html, /href='\/admin\/preview\/single'/); // kutip tunggal
  assert.match(html, /srcset="\/admin\/preview\/a\.png 1x, \/admin\/preview\/b\.png 2x, \/\/cdn\.example\/c\.png 3x"/); // srcset
  assert.match(html, /url\(\/admin\/preview\/bg\.png\)/); // CSS url()
  t.close();
});

test('body JSON bukan objek (null, array, angka) ditolak 400, bukan 500', async () => {
  const t = await setup();
  for (const bad of [null, [], 7]) assert.equal((await t.call('POST', '/api/login', bad)).status, 400);
  t.close();
});
