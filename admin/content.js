'use strict';
// Format dan validasi konten: frontmatter Markdown + site.json.
// Aturan mengikuti schema di src/content.config.ts dan tipe di src/config/site.ts.

const SLUG_RE = /^[a-z0-9][a-z0-9&_-]{0,80}$/;
const ICONS = ['bug', 'gear', 'cloud', 'mobile', 'shield', 'sparkle', 'doc', 'checklist'];
const CATEGORIES = ['Languages', 'Testing Tools', 'Frameworks', 'AI-Assisted QA', 'Testing Types', 'Project & Monitoring Tools', 'Methodologies', 'Soft Skills'];

class ValidationError extends Error {}
const bad = (msg) => { throw new ValidationError(msg); };

function str(v, name, { max = 600, optional = false } = {}) {
  if (v === undefined || v === null || v === '') { if (optional) return undefined; bad(`${name} wajib diisi`); }
  if (typeof v !== 'string') bad(`${name} harus teks`);
  if (v.length > max) bad(`${name} terlalu panjang (maks ${max})`);
  return v;
}
function bool(v, name) { if (typeof v !== 'boolean') bad(`${name} harus true/false`); return v; }
function num(v, name) { if (typeof v !== 'number' || !Number.isFinite(v)) bad(`${name} harus angka`); return v; }
function list(v, name, max) { if (!Array.isArray(v)) bad(`${name} harus daftar`); if (v.length > max) bad(`${name} terlalu banyak item`); return v; }
function httpUrl(v, name) {
  const s = str(v, name, { max: 500, optional: true });
  if (s === undefined) return undefined;
  let u; try { u = new URL(s); } catch { bad(`${name} bukan URL yang valid`); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') bad(`${name} harus http(s)`);
  return s;
}
// Path file di situs (mis. /uploads/foto.jpg). Mencegah "..", skema URL, dan karakter aneh.
function assetPath(v, name, optional) {
  const s = str(v, name, { max: 200, optional });
  if (s === undefined) return undefined;
  if (!/^\/[A-Za-z0-9._\/-]+$/.test(s) || s.includes('..') || s.includes('//')) bad(`${name} bukan path file yang valid`);
  return s;
}
// Tautan kontak boleh https/http atau mailto.
function link(v, name) {
  const s = str(v, name, { max: 300 });
  if (!/^(https?:\/\/|mailto:)/.test(s) && !/^[^\s@]+@[^\s@]+$/.test(s)) bad(`${name} harus URL atau email`);
  return s;
}

function cleanSite(d) {
  if (!d || typeof d !== 'object') bad('data situs tidak valid');
  const out = {
    name: str(d.name, 'name', { max: 100 }),
    role: str(d.role, 'role', { max: 150 }),
    avatar: assetPath(d.avatar, 'avatar', true),
    resumeUrl: assetPath(d.resumeUrl, 'resumeUrl', true),
    qaDrillUrl: httpUrl(d.qaDrillUrl, 'qaDrillUrl'),
    tagline: str(d.tagline, 'tagline', { max: 2000 }),
    valueProposition: str(d.valueProposition, 'valueProposition', { max: 4000 }),
  };
  out.whatIDo = list(d.whatIDo, 'whatIDo', 30).map((x, i) => {
    if (!ICONS.includes(x && x.icon)) bad(`whatIDo[${i}].icon harus salah satu dari ${ICONS.join(', ')}`);
    return { icon: x.icon, title: str(x.title, `whatIDo[${i}].title`, { max: 150 }), description: str(x.description, `whatIDo[${i}].description`, { max: 1500 }) };
  });
  const a = d.availability || {};
  out.availability = { location: str(a.location, 'availability.location', { max: 150 }), timezone: str(a.timezone, 'availability.timezone', { max: 50 }), statusLine: str(a.statusLine, 'availability.statusLine', { max: 300 }) };
  const c = d.contact || {};
  out.contact = { email: str(c.email, 'contact.email', { max: 200 }), whatsapp: link(c.whatsapp, 'contact.whatsapp'), linkedin: link(c.linkedin, 'contact.linkedin'), github: link(c.github, 'contact.github') };
  out.experience = list(d.experience, 'experience', 30).map((x, i) => ({
    role: str(x.role, `experience[${i}].role`, { max: 150 }),
    company: str(x.company, `experience[${i}].company`, { max: 150 }),
    period: str(x.period, `experience[${i}].period`, { max: 80 }),
    location: str(x.location, `experience[${i}].location`, { max: 150 }),
    highlights: list(x.highlights, `experience[${i}].highlights`, 30).map((h, j) => str(h, `experience[${i}].highlights[${j}]`, { max: 1000 })),
  }));
  out.skills = list(d.skills, 'skills', 20).map((x, i) => {
    if (!CATEGORIES.includes(x && x.category)) bad(`skills[${i}].category harus salah satu dari ${CATEGORIES.join(', ')}`);
    return { category: x.category, skills: list(x.skills, `skills[${i}].skills`, 60).map((s, j) => str(s, `skills[${i}].skills[${j}]`, { max: 100 })) };
  });
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
  return out;
}

function cleanProject(d) {
  if (!d || typeof d !== 'object') bad('data project tidak valid');
  if (d.status !== 'completed' && d.status !== 'in-progress') bad('status harus completed atau in-progress');
  const out = {
    title: str(d.title, 'title', { max: 200 }),
    summary: str(d.summary, 'summary', { max: 500 }),
    status: d.status,
    featured: bool(d.featured, 'featured'),
    order: num(d.order, 'order'),
    tags: list(d.tags, 'tags', 30).map((t, i) => str(t, `tags[${i}]`, { max: 60 })),
    repo: httpUrl(d.repo, 'repo'),
    demo: httpUrl(d.demo, 'demo'),
    showRepo: bool(d.showRepo === undefined ? false : d.showRepo, 'showRepo'),
    showDemo: bool(d.showDemo === undefined ? false : d.showDemo, 'showDemo'),
    cover: assetPath(d.cover, 'cover', true),
  };
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
  return out;
}

function cleanGallery(d) {
  if (!d || typeof d !== 'object') bad('data foto tidak valid');
  const out = { image: assetPath(d.image, 'image', false), alt: str(d.alt, 'alt', { max: 300 }), caption: str(d.caption, 'caption', { max: 300, optional: true }), order: num(d.order, 'order') };
  if (out.caption === undefined) delete out.caption;
  return out;
}

function cleanBody(b) {
  if (b === undefined || b === null) return '';
  if (typeof b !== 'string') bad('isi harus teks');
  if (b.length > 100000) bad('isi terlalu panjang');
  return b;
}

// Frontmatter yang ditulis admin selalu JSON-per-baris (valid YAML), jadi pembacaan cukup JSON.parse per nilai.
function parseMarkdown(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const k = /^([A-Za-z]\w*):\s*(.*)$/.exec(line);
    if (!k) continue;
    const raw = k[2].trim();
    try { data[k[1]] = JSON.parse(raw); } catch { data[k[1]] = raw; }
  }
  return { data, body: m[2] };
}

function serializeMarkdown(data, body) {
  const front = Object.entries(data).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');
  return `---\n${front}\n---\n\n${body.replace(/^\s+|\s+$/g, '')}\n`;
}

const cleaners = { projects: cleanProject, gallery: cleanGallery };

module.exports = { SLUG_RE, ValidationError, cleanSite, cleanBody, cleaners, parseMarkdown, serializeMarkdown };
