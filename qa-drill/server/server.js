'use strict';
// API login + sinkronisasi progres QA Drill. Tanpa dependency; jalan di belakang Nginx (127.0.0.1).
// Env: PORT (4400), HOST (127.0.0.1), DB_PATH, ALLOWED_ORIGIN (mis. https://learn.naradipta.com),
//      COOKIE_SECURE (default: aktif bila NODE_ENV=production), TRUST_PROXY=1 (baca X-Real-IP dari Nginx),
//      MAX_USERS (2000), STATIC_DIR (opsional, hanya untuk dev/CI: sajikan public/learn di "/").
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const auth = require('./auth');
const dbmod = require('./db');

const MAX_BODY = 1_200_000;
const MAX_PROGRESS = 1_000_000;
const COOKIE = 'qd_session';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.json': 'application/json' };

function createServer(opts = {}) {
  const env = { ...process.env, ...opts };
  const db = dbmod.open(env.DB_PATH || path.join(__dirname, 'data', 'qa-drill.sqlite'));
  const allowedOrigin = env.ALLOWED_ORIGIN || '';
  const secure = env.COOKIE_SECURE !== undefined ? String(env.COOKIE_SECURE) === '1' || env.COOKIE_SECURE === true : env.NODE_ENV === 'production';
  const trustProxy = String(env.TRUST_PROXY) === '1';
  const maxUsers = Number(env.MAX_USERS) || 2000;
  const ipLimit = Number(env.RATE_LIMIT_IP) || 30; // percobaan daftar/login per IP per 15 menit
  const staticDir = env.STATIC_DIR ? path.resolve(env.STATIC_DIR) : '';

  // Pembatas laju sederhana di memori: kunci -> waktu percobaan dalam jendela.
  const hits = new Map();
  function limited(key, max, windowMs) {
    const now = Date.now();
    const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
    list.push(now);
    hits.set(key, list);
    return list.length > max;
  }
  const janitor = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (!v.some((t) => now - t < 15 * 60000)) hits.delete(k);
    db.pruneSessions();
  }, 10 * 60000);
  janitor.unref();

  const clientIp = (req) => (trustProxy && req.headers['x-real-ip']) || req.socket.remoteAddress || 'unknown';

  function send(res, status, body, headers = {}) {
    const payload = body === undefined ? '' : JSON.stringify(body);
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    });
    res.end(payload);
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      req.on('data', (c) => {
        size += c.length;
        if (size > MAX_BODY) { reject(Object.assign(new Error('too large'), { status: 413 })); req.destroy(); return; }
        chunks.push(c);
      });
      req.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
        catch { reject(Object.assign(new Error('bad json'), { status: 400 })); }
      });
      req.on('error', reject);
    });
  }

  function cookieValue(req) {
    const m = new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)').exec(req.headers.cookie || '');
    return m ? m[1] : '';
  }
  function sessionCookie(token, maxAgeSec) {
    return `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSec}${secure ? '; Secure' : ''}`;
  }
  function currentUser(req) {
    const t = cookieValue(req);
    return t ? db.sessionUser(auth.tokenHash(t)) : undefined;
  }

  // Perlindungan CSRF: tulis hanya lewat JSON, dan Origin (bila ada) harus asal yang diizinkan.
  function csrfOk(req) {
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) return false;
    const origin = req.headers.origin;
    if (!origin) return true;
    if (allowedOrigin) return origin === allowedOrigin;
    return origin === `http://${req.headers.host}` || origin === `https://${req.headers.host}`;
  }

  async function startSession(res, userId, status, email) {
    const token = auth.newToken();
    db.createSession(userId, auth.tokenHash(token));
    send(res, status, { email }, { 'Set-Cookie': sessionCookie(token, dbmod.SESSION_DAYS * 86400) });
  }

  async function handleApi(req, res, url) {
    const route = req.method + ' ' + url.pathname;
    if (route === 'GET /api/health') return send(res, 200, { ok: true });
    if (route === 'GET /api/me') {
      const u = currentUser(req);
      return send(res, 200, { email: u ? u.email : null }); // 200 juga saat belum login, supaya konsol pengunjung bersih
    }
    if (route === 'GET /api/progress') {
      const u = currentUser(req);
      if (!u) return send(res, 401, { error: 'not_logged_in' });
      const cur = db.getProgress(u.id);
      return send(res, 200, cur ? { data: JSON.parse(cur.data), version: cur.version } : { data: null, version: 0 });
    }
    if (req.method !== 'POST' && req.method !== 'PUT') return send(res, 404, { error: 'not_found' });
    if (!csrfOk(req)) return send(res, 403, { error: 'forbidden' });

    if (route === 'POST /api/register' || route === 'POST /api/login') {
      const ip = clientIp(req);
      if (limited('ip:' + ip, ipLimit, 15 * 60000)) return send(res, 429, { error: 'too_many_requests' });
      const body = await readBody(req);
      const email = auth.normalizeEmail(body.email);
      if (!auth.validEmail(email)) return send(res, 400, { error: 'invalid_email' });
      if (!auth.validPassword(body.password)) return send(res, 400, { error: 'invalid_password' });
      if (limited('em:' + email, 10, 15 * 60000)) return send(res, 429, { error: 'too_many_requests' });

      if (route === 'POST /api/register') {
        if (db.userCount() >= maxUsers) return send(res, 503, { error: 'registration_closed' });
        if (db.userByEmail(email)) return send(res, 409, { error: 'email_taken' });
        const hash = await auth.hashPassword(body.password);
        let id;
        try { id = db.createUser(email, hash); }
        catch { return send(res, 409, { error: 'email_taken' }); }
        return startSession(res, id, 201, email);
      }
      const user = db.userByEmail(email);
      const ok = user ? await auth.verifyPassword(body.password, user.pw_hash) : await auth.verifyDummy(body.password);
      if (!ok) return send(res, 401, { error: 'invalid_credentials' });
      return startSession(res, user.id, 200, user.email);
    }

    if (route === 'POST /api/logout') {
      const t = cookieValue(req);
      if (t) db.deleteSession(auth.tokenHash(t));
      return send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0) });
    }

    const user = currentUser(req);
    if (!user) return send(res, 401, { error: 'not_logged_in' });

    if (route === 'PUT /api/progress') {
      const body = await readBody(req);
      const d = body.data;
      const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
      if (!isObj(d) || !isObj(d.q) || !isObj(d.cards) || !Number.isInteger(body.baseVersion) || body.baseVersion < 0) return send(res, 400, { error: 'invalid_payload' });
      const text = JSON.stringify(d);
      if (text.length > MAX_PROGRESS) return send(res, 413, { error: 'too_large' });
      const version = db.saveProgress(user.id, text, body.baseVersion);
      if (version === null) {
        const cur = db.getProgress(user.id);
        return send(res, 409, { error: 'version_conflict', version: cur ? cur.version : 0, data: cur ? JSON.parse(cur.data) : null });
      }
      return send(res, 200, { version });
    }
    return send(res, 404, { error: 'not_found' });
  }

  function serveStatic(req, res, url) {
    if (!staticDir || req.method !== 'GET') { res.writeHead(404); return res.end(); }
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.resolve(staticDir, '.' + rel);
    if (file !== staticDir && !file.startsWith(staticDir + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    });
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
      return serveStatic(req, res, url);
    } catch (e) {
      if (!res.headersSent) send(res, e.status || 500, { error: e.status ? e.message : 'server_error' });
      if (!e.status) console.error(e);
    }
  });
  server.on('close', () => { clearInterval(janitor); db.raw.close(); });
  server.db = db;
  return server;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 4400;
  createServer().listen(port, process.env.HOST || '127.0.0.1', () => console.log('QA Drill API on :' + port));
}

module.exports = { createServer };
