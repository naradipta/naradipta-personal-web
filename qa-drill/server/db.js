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
    CREATE TABLE IF NOT EXISTS progress (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      data TEXT NOT NULL,
      version INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  const q = {
    userCount: db.prepare('SELECT COUNT(*) AS n FROM users'),
    userByEmail: db.prepare('SELECT id, email, pw_hash FROM users WHERE email = ?'),
    insertUser: db.prepare('INSERT INTO users (email, pw_hash, created_at) VALUES (?, ?, ?)'),
    setPassword: db.prepare('UPDATE users SET pw_hash = ? WHERE email = ?'),
    deleteSessionsOfUser: db.prepare('DELETE FROM sessions WHERE user_id = ?'),
    insertSession: db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)'),
    sessionUser: db.prepare('SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?'),
    deleteSession: db.prepare('DELETE FROM sessions WHERE token_hash = ?'),
    pruneSessions: db.prepare('DELETE FROM sessions WHERE expires_at <= ?'),
    getProgress: db.prepare('SELECT data, version, updated_at FROM progress WHERE user_id = ?'),
    insertProgress: db.prepare('INSERT INTO progress (user_id, data, version, updated_at) VALUES (?, ?, 1, ?)'),
    updateProgress: db.prepare('UPDATE progress SET data = ?, version = version + 1, updated_at = ? WHERE user_id = ? AND version = ?'),
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
    saveProgress(userId, data, baseVersion) {
      const cur = q.getProgress.get(userId);
      if (!cur) {
        if (baseVersion !== 0) return null;
        q.insertProgress.run(userId, data, Date.now());
        return 1;
      }
      if (cur.version !== baseVersion) return null;
      q.updateProgress.run(data, Date.now(), userId, baseVersion);
      return baseVersion + 1;
    },
  };
}

module.exports = { open, SESSION_DAYS };
