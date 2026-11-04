'use strict';
// Ringkasan belajar untuk papan komunitas. Hanya angka kasar; tidak pernah memuat akurasi, jawaban, atau email.
const DAY = 86400000;
const TZ_OFFSET_MIN = Number(process.env.TZ_OFFSET_MIN) || 420; // hari dihitung menurut WIB bila tidak diubah

function dayKey(ms, offsetMin = TZ_OFFSET_MIN) {
  return new Date(ms + offsetMin * 60000).toISOString().slice(0, 10);
}

// data = dokumen progres klien ({q, history, mocks}). Mengembalikan {seen, mastered, days} dengan days = tanggal aktif terbaru (maks 90).
function summarize(data, offsetMin = TZ_OFFSET_MIN) {
  const q = data && typeof data.q === 'object' && data.q ? data.q : {};
  let seen = 0, mastered = 0;
  for (const rec of Object.values(q)) {
    if (!rec || typeof rec !== 'object') continue;
    seen++;
    if (Number(rec.box) >= 3) mastered++;
  }
  const days = new Set();
  for (const list of [data && data.history, data && data.mocks]) {
    if (!Array.isArray(list)) continue;
    for (const e of list) if (e && Number.isFinite(e.t) && e.t > 0) days.add(dayKey(e.t, offsetMin));
  }
  // days dari klien (tanggal lokal per jawaban); divalidasi bentuknya.
  if (data && Array.isArray(data.days)) for (const d of data.days) if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) days.add(d);
  return { seen, mastered, days: [...days].sort().slice(-90) };
}

// Hari aktif dalam 7 hari terakhir dan streak (hari beruntun; hari ini yang belum belajar tidak memutus streak).
function activity(days, now = Date.now(), offsetMin = TZ_OFFSET_MIN) {
  const set = new Set(days);
  let active7 = 0;
  for (let i = 0; i < 7; i++) if (set.has(dayKey(now - i * DAY, offsetMin))) active7++;
  let streak = 0, i = set.has(dayKey(now, offsetMin)) ? 0 : 1;
  while (set.has(dayKey(now - i * DAY, offsetMin))) { streak++; i++; }
  return { active7, streak };
}

function validDisplayName(name) {
  return typeof name === 'string' && /^[\p{L}\p{N} ._'-]{2,24}$/u.test(name.trim()) && !/@/.test(name);
}

// Kunci pembanding nama: huruf kecil, tanpa aksen/spasi/tanda, leetspeak disamakan (4=a, 3=e, 1=i, 0=o, 5=s, 7=t).
// Dipakai untuk keunikan nama dan pemeriksaan kata terlarang agar "Adm1n" atau "ad min" tidak lolos.
function nameKey(name) {
  return String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[4@]/g, 'a').replace(/3/g, 'e').replace(/[1!|]/g, 'i').replace(/0/g, 'o').replace(/5/g, 's').replace(/7/g, 't')
    .replace(/[^a-z0-9]/g, '');
}

// Nama yang dicadangkan (menyamar pengelola) dan kata kasar yang tidak ambigu. Tambahan lewat env BLOCKED_NAME_WORDS=kata1,kata2.
const RESERVED = ['admin', 'administrator', 'moderator', 'naradipta', 'qadrill', 'official', 'support', 'staff'];
const PROFANE = ['anjing', 'bangsat', 'kontol', 'memek', 'ngentot', 'bajingan', 'goblok', 'jancok', 'jancuk', 'pantek', 'fuck', 'shit', 'bitch', 'nigger', 'nigga', 'cunt', 'asshole', 'bastard'];
function nameBlocked(name, extra = process.env.BLOCKED_NAME_WORDS) {
  const key = nameKey(name);
  const more = String(extra || '').split(',').map(nameKey).filter(Boolean);
  return RESERVED.concat(PROFANE, more).some((w) => key.includes(nameKey(w)));
}

module.exports = { summarize, activity, validDisplayName, nameKey, nameBlocked, dayKey };
