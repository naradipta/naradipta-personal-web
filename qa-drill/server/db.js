'use strict';
// SQLite (node:sqlite bawaan Node >= 22.13). Satu berkas, tanpa dependency.
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const SESSION_DAYS = 30;

function open(file) {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      pw_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS email_tokens (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY,
      reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reported_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reason TEXT NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      resolved_at INTEGER
    );
    CREATE TABLE IF NOT EXISTS progress (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data TEXT NOT NULL,
      version INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  // Migrasi untuk DB lama: kolom verified_at disiapkan untuk verifikasi email (NULL = belum terverifikasi).
  if (!db.prepare("PRAGMA table_info(users)").all().some((c) => c.name === 'verified_at')) {
    db.exec('ALTER TABLE users ADD COLUMN verified_at INTEGER');
  }
  // Profil komunitas (opt-in): nama tampilan + persetujuan berbagi; stats = ringkasan progres untuk papan komunitas.
  const cols = (t) => db.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
  if (!cols('users').includes('display_name')) db.exec('ALTER TABLE users ADD COLUMN display_name TEXT');
  if (!cols('users').includes('share_stats')) db.exec('ALTER TABLE users ADD COLUMN share_stats INTEGER NOT NULL DEFAULT 0');
  if (!cols('users').includes('name_locked')) db.exec('ALTER TABLE users ADD COLUMN name_locked INTEGER NOT NULL DEFAULT 0');
  if (!cols('progress').includes('stats')) db.exec('ALTER TABLE progress ADD COLUMN stats TEXT');
  const q = {
    userCount: db.prepare('SELECT COUNT(*) AS n FROM users'),
    userByEmail: db.prepare('SELECT id, email, pw_hash FROM users WHERE email = ?'),
    insertUser: db.prepare('INSERT INTO users (email, pw_hash, created_at) VALUES (?, ?, ?)'),
    setPassword: db.prepare('UPDATE users SET pw_hash = ? WHERE email = ?'),
    deleteSessionsOfUser: db.prepare('DELETE FROM sessions WHERE user_id = ?'),
    insertSession: db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)'),
    sessionUser: db.prepare('SELECT u.id, u.email, u.verified_at, u.display_name, u.share_stats, u.name_locked FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?'),
    deleteSession: db.prepare('DELETE FROM sessions WHERE token_hash = ?'),
    pruneSessions: db.prepare('DELETE FROM sessions WHERE expires_at <= ?'),
    insertToken: db.prepare('INSERT INTO email_tokens (token_hash, user_id, kind, expires_at) VALUES (?, ?, ?, ?)'),
    deleteTokensOf: db.prepare('DELETE FROM email_tokens WHERE user_id = ? AND kind = ?'),
    getToken: db.prepare('SELECT user_id FROM email_tokens WHERE token_hash = ? AND kind = ? AND expires_at > ?'),
    deleteToken: db.prepare('DELETE FROM email_tokens WHERE token_hash = ?'),
    pruneTokens: db.prepare('DELETE FROM email_tokens WHERE expires_at <= ?'),
    setVerified: db.prepare('UPDATE users SET verified_at = COALESCE(verified_at, ?) WHERE id = ?'),
    setPasswordById: db.prepare('UPDATE users SET pw_hash = ? WHERE id = ?'),
    userById: db.prepare('SELECT id, email, verified_at, display_name, share_stats, name_locked FROM users WHERE id = ?'),
    getProgress: db.prepare('SELECT data, version, updated_at, stats FROM progress WHERE user_id = ?'),
    setProfile: db.prepare('UPDATE users SET display_name = ?, share_stats = ? WHERE id = ?'),
    setStats: db.prepare('UPDATE progress SET stats = ? WHERE user_id = ?'),
    community: db.prepare(`SELECT u.id, u.display_name, CASE WHEN p.stats IS NULL THEN p.data END AS data, p.stats FROM users u LEFT JOIN progress p ON p.user_id = u.id
      WHERE u.share_stats = 1 AND u.display_name IS NOT NULL AND u.name_locked = 0
        AND (SELECT COUNT(DISTINCT r.reporter_id) FROM reports r WHERE r.reported_id = u.id AND r.resolved_at IS NULL) < ?`),
    sharedNames: db.prepare('SELECT id, display_name FROM users WHERE share_stats = 1 AND display_name IS NOT NULL AND name_locked = 0'),
    openReport: db.prepare('SELECT id FROM reports WHERE reporter_id = ? AND reported_id = ? AND resolved_at IS NULL'),
    insertReport: db.prepare('INSERT INTO reports (reporter_id, reported_id, reason, note, created_at) VALUES (?, ?, ?, ?, ?)'),
    openReports: db.prepare(`SELECT u.id AS user_id, u.email, u.display_name, COUNT(DISTINCT r.reporter_id) AS reporters, GROUP_CONCAT(DISTINCT r.reason) AS reasons, MIN(r.created_at) AS first_at
      FROM reports r JOIN users u ON u.id = r.reported_id WHERE r.resolved_at IS NULL GROUP BY u.id ORDER BY reporters DESC, first_at ASC`),
    resolveReports: db.prepare('UPDATE reports SET resolved_at = ? WHERE reported_id = ? AND resolved_at IS NULL'),
    lockName: db.prepare('UPDATE users SET display_name = NULL, share_stats = 0, name_locked = 1 WHERE id = ?'),
    unlockName: db.prepare('UPDATE users SET name_locked = 0 WHERE id = ?'),
    insertProgress: db.prepare('INSERT INTO progress (user_id, data, version, updated_at, stats) VALUES (?, ?, 1, ?, ?)'),
    updateProgress: db.prepare('UPDATE progress SET data = ?, version = version + 1, updated_at = ?, stats = ? WHERE user_id = ? AND version = ?'),
  };
  return {
    raw: db,
    userCount: () => q.userCount.get().n,
    userByEmail: (email) => q.userByEmail.get(email),
    createUser: (email, hash) => Number(q.insertUser.run(email, hash, Date.now()).lastInsertRowid),
    setPassword: (email, hash) => q.setPassword.run(hash, email).changes,
    logoutEverywhere: (userId) => q.deleteSessionsOfUser.run(userId),
    createSession: (userId, tokenHash) => q.insertSession.run(tokenHash, userId, Date.now() + SESSION_DAYS * 86400000),
    sessionUser: (tokenHash) => q.sessionUser.get(tokenHash, Date.now()),
    deleteSession: (tokenHash) => q.deleteSession.run(tokenHash),
    pruneSessions: () => q.pruneSessions.run(Date.now()),
    getProgress: (userId) => q.getProgress.get(userId),
    // Simpan hanya bila versi dasar klien masih sama dengan versi di server (optimistic concurrency).
    // Token sekali pakai: simpan hash-nya saja; token lama jenis yang sama untuk user itu dihapus.
    createToken(userId, kind, tokenHash, ttlMs) { q.deleteTokensOf.run(userId, kind); q.insertToken.run(tokenHash, userId, kind, Date.now() + ttlMs); },
    takeToken(tokenHash, kind) { const r = q.getToken.get(tokenHash, kind, Date.now()); if (r) q.deleteToken.run(tokenHash); return r ? r.user_id : null; },
    pruneTokens: () => q.pruneTokens.run(Date.now()),
    setVerified: (userId) => q.setVerified.run(Date.now(), userId),
    setPasswordById: (userId, hash) => q.setPasswordById.run(hash, userId),
    userById: (id) => q.userById.get(id),
    setProfile: (userId, name, share) => q.setProfile.run(name, share ? 1 : 0, userId),
    setStats: (userId, stats) => q.setStats.run(stats, userId),
    community: (autohideAt) => q.community.all(autohideAt),
    sharedNames: () => q.sharedNames.all(),
    // Laporan nama: satu laporan terbuka per pelapor per anggota; true bila baru dibuat.
    addReport(reporterId, reportedId, reason, note) {
      if (q.openReport.get(reporterId, reportedId)) return false;
      q.insertReport.run(reporterId, reportedId, reason, note || null, Date.now());
      return true;
    },
    openReports: () => q.openReports.all(),
    resolveReports: (userId) => q.resolveReports.run(Date.now(), userId),
    lockName(userId) { q.lockName.run(userId); q.resolveReports.run(Date.now(), userId); },
    unlockName: (userId) => q.unlockName.run(userId),
    saveProgress(userId, data, baseVersion, stats) {
      const cur = q.getProgress.get(userId);
      if (!cur) {
        if (baseVersion !== 0) return null;
        q.insertProgress.run(userId, data, Date.now(), stats);
        return 1;
      }
      if (cur.version !== baseVersion) return null;
      q.updateProgress.run(data, Date.now(), stats, userId, baseVersion);
      return baseVersion + 1;
    },
  };
}

module.exports = { open, SESSION_DAYS };
