'use strict';
// Server admin naradipta.com: login, edit draft, preview, publish. Tanpa dependency npm; jalan di 127.0.0.1 di belakang Nginx.
// Env: ADMIN_DATA_DIR (wajib di produksi), WEB_ROOT (tujuan publish), REPO_DIR (default: induk folder ini),
//      PORT (4500), HOST (127.0.0.1), ALLOWED_ORIGIN (mis. https://naradipta.com),
//      PUBLIC_PATH (awalan URL admin di Nginx, default /admin; dipakai menulis ulang link di preview), COOKIE_SECURE, TRUST_PROXY=1.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const auth = require('./auth');
const content = require('./content');
const { createStore } = require('./store');
const { createBuilder } = require('./builder');

const COOKIE = 'adm_session';
const SESSION_MS = 7 * 86400000;
const MAX_JSON = 400_000;
const MAX_UPLOAD = 11_000_000;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.woff2': 'font/woff2',
};
const UI_CSP = "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'";

function createServer(opts = {}) {
  const env = { ...process.env, ...opts };
  const repoDir = path.resolve(env.REPO_DIR || path.join(__dirname, '..'));
  const dataDir = path.resolve(env.ADMIN_DATA_DIR || path.join(__dirname, 'data'));
  const store = createStore(dataDir, repoDir);
  store.init();
  const builder = opts.builder || createBuilder({ store, repoDir, webRoot: env.WEB_ROOT || '' });
  const allowedOrigin = env.ALLOWED_ORIGIN || '';
  const publicPath = (env.PUBLIC_PATH === undefined ? '/admin' : env.PUBLIC_PATH).replace(/\/+$/, '');
  const secure = env.COOKIE_SECURE !== undefined ? String(env.COOKIE_SECURE) === '1' || env.COOKIE_SECURE === true : env.NODE_ENV === 'production';
  const trustProxy = String(env.TRUST_PROXY) === '1';
  const uiDir = path.join(__dirname, 'public');

  const sessions = new Map(); // tokenHash -> kedaluwarsa (hilang saat restart; hanya perlu login ulang)
  const hits = new Map();
  function limited(key, max, windowMs) {
    const now = Date.now();
    const l = (hits.get(key) || []).filter((t) => now - t < windowMs);
    l.push(now);
    hits.set(key, l);
    return l.length > max;
  }
  const janitor = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of sessions) if (v <= now) sessions.delete(k);
    for (const [k, v] of hits) if (!v.some((t) => now - t < 15 * 60000)) hits.delete(k);
  }, 10 * 60000);
  janitor.unref();

  const clientIp = (req) => (trustProxy && req.headers['x-real-ip']) || req.socket.remoteAddress || 'unknown';

  function send(res, status, body, headers = {}) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
    res.end(body === undefined ? '' : JSON.stringify(body));
  }

  function readRaw(req, max) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      req.on('data', (c) => {
        size += c.length;
        if (size > max) { reject(Object.assign(new Error('too_large'), { status: 413 })); req.destroy(); return; }
        chunks.push(c);
      });
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
  }
  async function readJson(req) {
    const buf = await readRaw(req, MAX_JSON);
    try { return JSON.parse(buf.toString('utf8') || '{}'); } catch { throw Object.assign(new Error('bad_json'), { status: 400 }); }
  }

  const cookieValue = (req) => { const m = new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)').exec(req.headers.cookie || ''); return m ? m[1] : ''; };
  function sessionCookie(token, maxAgeSec) {
    return `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAgeSec}${secure ? '; Secure' : ''}`;
  }
  const loggedIn = (req) => { const t = cookieValue(req); const exp = t && sessions.get(auth.tokenHash(t)); return !!exp && exp > Date.now(); };

  // CSRF: tulis hanya lewat JSON atau unggahan dengan header khusus (memicu preflight CORS), plus cek Origin.
  function csrfOk(req, upload) {
    const ct = String(req.headers['content-type'] || '');
    if (upload ? req.headers['x-requested-with'] !== 'admin' : !ct.startsWith('application/json')) return false;
    const origin = req.headers.origin;
    if (!origin) return true;
    if (allowedOrigin) return origin === allowedOrigin;
    return origin === `http://${req.headers.host}` || origin === `https://${req.headers.host}`;
  }

  const busy = () => builder.state.state === 'building';

  async function handleApi(req, res, url) {
    const p = url.pathname.slice('/api/'.length);
    const route = req.method + ' ' + p;
    if (route === 'GET health') return send(res, 200, { ok: true });
    if (route === 'GET me') return send(res, 200, { loggedIn: loggedIn(req) });

    if (req.method !== 'GET') {
      if (!csrfOk(req, route === 'POST upload')) return send(res, 403, { error: 'forbidden' });
    }

    if (route === 'POST login') {
      if (limited('ip:' + clientIp(req), 10, 15 * 60000) || limited('global', 60, 15 * 60000)) return send(res, 429, { error: 'too_many_requests' });
      const body = await readJson(req);
      const admin = store.readAdmin();
      const pw = typeof body.password === 'string' ? body.password.slice(0, 200) : '';
      const ok = admin && body.username === admin.username ? await auth.verifyPassword(pw, admin.pwHash) : await auth.verifyDummy(pw);
      if (!ok) return send(res, 401, { error: 'invalid_credentials' });
      const token = auth.newToken();
      sessions.set(auth.tokenHash(token), Date.now() + SESSION_MS);
      return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie(token, SESSION_MS / 1000) });
    }
    if (route === 'POST logout') {
      const t = cookieValue(req);
      if (t) sessions.delete(auth.tokenHash(t));
      return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0) });
    }

    if (!loggedIn(req)) return send(res, 401, { error: 'not_logged_in' });

    if (route === 'GET draft') return send(res, 200, { ...store.readDraft(), dirty: store.isDirty() });
    if (route === 'GET status') return send(res, 200, { ...builder.state, dirty: store.isDirty(), previewUrl: builder.state.previewAt ? 'preview/' : '' });
    if (route === 'GET history') return send(res, 200, { versions: store.listHistory() });
    if (req.method === 'GET' && p.startsWith('uploads/')) {
      const file = store.uploadFile(p.slice('uploads/'.length));
      if (!file || !fs.existsSync(file)) return send(res, 404, { error: 'not_found' });
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)], 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Cache-Control': 'private, max-age=3600' });
      return fs.createReadStream(file).pipe(res);
    }
    if (req.method === 'GET') return send(res, 404, { error: 'not_found' });

    // Semua yang mengubah draft/live ditolak saat build berjalan.
    if (busy()) return send(res, 409, { error: 'busy' });

    if (route === 'PUT site') { store.saveSite(await readJson(req)); return send(res, 200, { ok: true }); }
    if (route === 'POST upload') {
      const buf = await readRaw(req, MAX_UPLOAD);
      let name = '';
      try { name = decodeURIComponent(String(req.headers['x-filename'] || '')); } catch { /* nama tidak valid: pakai default */ }
      return send(res, 201, { path: store.saveUpload(buf, name) });
    }
    if (route === 'POST preview') return send(res, 202, { started: await builder.preview() });
    if (route === 'POST publish') return send(res, 202, { started: await builder.publish() });
    if (route === 'POST discard') { store.discardDraft(); return send(res, 200, { ok: true }); }
    if (route === 'POST history/restore') { store.restoreHistory(String((await readJson(req)).id)); return send(res, 200, { ok: true }); }

    const m = /^(PUT|DELETE) (projects|gallery)\/([^/]+)$/.exec(route);
    if (m) {
      const slug = decodeURIComponent(m[3]);
      if (m[1] === 'DELETE') return store.removeEntry(m[2], slug) ? send(res, 200, { ok: true }) : send(res, 404, { error: 'not_found' });
      const body = await readJson(req);
      store.saveEntry(m[2], slug, body.data, body.body);
      return send(res, 200, { ok: true });
    }
    return send(res, 404, { error: 'not_found' });
  }

  // Sajikan berkas statis dari root; coba $uri, $uri.html, $uri/index.html (sama seperti Nginx situs publik).
  function serveFiles(root, req, res, url, headers = {}, transform) {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    let rel;
    try { rel = decodeURIComponent(url.pathname); } catch { res.writeHead(400); return res.end(); }
    if (rel.includes('\0')) { res.writeHead(400); return res.end(); }
    const base = path.resolve(root);
    const target = path.resolve(base, '.' + rel);
    if (target !== base && !target.startsWith(base + path.sep)) { res.writeHead(403); return res.end(); }
    const file = [target, target + '.html', path.join(target, 'index.html')].find((f) => { try { return fs.statSync(f).isFile(); } catch { return false; } });
    if (!file) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const head = { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', ...headers };
    if (transform && type.startsWith('text/html')) {
      const out = Buffer.from(transform(fs.readFileSync(file, 'utf8')));
      res.writeHead(200, { ...head, 'Content-Length': out.length });
      return res.end(req.method === 'HEAD' ? undefined : out);
    }
    res.writeHead(200, head);
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname === '/preview' || url.pathname.startsWith('/preview/')) {
        if (!loggedIn(req)) { res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Login dulu di halaman admin, lalu buka preview lagi.'); }
        const previewDir = store.dir('preview');
        if (!fs.existsSync(previewDir)) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Belum ada preview. Klik "Preview" di admin.'); }
        url.pathname = url.pathname.slice('/preview'.length) || '/';
        // Situs memakai link absolut (/projects, /_astro/...); di preview semuanya diberi awalan /admin/preview.
        const prefix = publicPath + '/preview/';
        return serveFiles(previewDir, req, res, url, { 'X-Robots-Tag': 'noindex', 'Referrer-Policy': 'same-origin' },
          (html) => html.replace(/\b(href|src|action|poster)="\/(?!\/)/g, `$1="${prefix}`));
      }
      if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
      if (url.pathname === '/') url.pathname = '/index.html';
      return serveFiles(uiDir, req, res, url, { 'Content-Security-Policy': UI_CSP, 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'DENY', 'X-Robots-Tag': 'noindex' });
    } catch (e) {
      const status = e.status || (e instanceof content.ValidationError ? 400 : 500);
      if (!res.headersSent) send(res, status, { error: status === 500 ? 'server_error' : e.message });
      if (status === 500) console.error(e);
    }
  });
  server.on('close', () => clearInterval(janitor));
  server.store = store;
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 4500;
  createServer().listen(port, process.env.HOST || '127.0.0.1', () => console.log('Admin naradipta.com on :' + port));
}

module.exports = { createServer };
