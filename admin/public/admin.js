'use strict';
// UI admin: semua data dari/ke API; DOM dibuat dengan textContent (tanpa innerHTML) supaya aman dari XSS.
const app = document.getElementById('app');
let draft = null, status = {}, tab = 'profile', editing = null, pollTimer = null;

function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else if (v !== false && v != null) el.setAttribute(k, v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
}

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

async function api(method, path, body, raw) {
  const headers = {};
  if (raw) { headers['X-Requested-With'] = 'admin'; headers['X-Filename'] = encodeURIComponent(raw.name); headers['Content-Type'] = 'application/octet-stream'; }
  else if (body !== undefined || method !== 'GET') headers['Content-Type'] = 'application/json';
  const res = await fetch('api/' + path, { method, headers, body: raw ? raw : body === undefined ? (method === 'GET' ? undefined : '{}') : JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== 'login') { showLogin(); throw new Error('Sesi berakhir, silakan login lagi'); }
  if (!res.ok) throw new Error(data.error === 'busy' ? 'Build sedang berjalan, tunggu sebentar' : data.error || 'Gagal (' + res.status + ')');
  return data;
}
const act = (fn) => async (...a) => { try { await fn(...a); } catch (e) { toast(e.message); } };

const imgSrc = (p) => (p && p.startsWith('/uploads/') ? 'api' + p : p);

// ---------- Field helpers ----------
const uid = () => 'f-' + Math.random().toString(36).slice(2);
function text(label, obj, key, o = {}) {
  const common = { id: uid(), onInput: (e) => { obj[key] = e.target.value; } };
  const input = o.area ? h('textarea', { ...common, class: o.tall ? 'tall' : '' }) : h('input', { ...common, type: o.type || 'text' });
  input.value = obj[key] ?? '';
  if (o.type === 'number') input.addEventListener('input', (e) => { obj[key] = Number(e.target.value); });
  if (o.optional) input.addEventListener('input', (e) => { if (!e.target.value) delete obj[key]; });
  return h('div', {}, h('label', { for: common.id }, label, o.hint && h('span', { class: 'hint' }, o.hint)), input);
}
function check(label, obj, key) {
  const input = h('input', { type: 'checkbox', onChange: (e) => { obj[key] = e.target.checked; } });
  input.checked = !!obj[key];
  return h('label', { class: 'row' }, input, label);
}
function select(label, obj, key, options) {
  const id = uid();
  const sel = h('select', { id, onChange: (e) => { obj[key] = e.target.value; } }, options.map((o) => h('option', { value: o }, o)));
  sel.value = obj[key];
  return h('div', {}, h('label', { for: id }, label), sel);
}
// Daftar teks ↔ satu textarea (satu baris per item) atau satu input (dipisah koma).
function lines(label, obj, key, o = {}) {
  const sep = o.comma ? /\s*,\s*/ : /\r?\n/;
  const id = uid();
  const area = h(o.comma ? 'input' : 'textarea', { id, type: o.comma ? 'text' : undefined, onInput: (e) => { obj[key] = e.target.value.split(sep).map((s) => s.trim()).filter(Boolean); } });
  area.value = (obj[key] || []).join(o.comma ? ', ' : '\n');
  return h('div', {}, h('label', { for: id }, label, h('span', { class: 'hint' }, o.comma ? 'Pisahkan dengan koma' : 'Satu item per baris')), area);
}
function image(label, obj, key, o = {}) {
  const box = h('div', {});
  const fileId = uid();
  const render = () => {
    box.replaceChildren();
    const v = obj[key];
    if (v && !o.pdf) box.append(h('img', { class: 'thumb', src: imgSrc(v), alt: '' }));
    if (v) box.append(h('div', { class: 'hint' }, v));
    const file = h('input', { id: fileId, 'aria-label': label, type: 'file', accept: o.pdf ? 'application/pdf' : 'image/jpeg,image/png,image/webp,image/gif', onChange: act(async (e) => {
      const f = e.target.files[0]; if (!f) return;
      toast('Mengunggah…');
      obj[key] = (await api('POST', 'upload', undefined, f)).path;
      toast('Terunggah. Jangan lupa klik Simpan.'); render();
    }) });
    box.append(file);
    if (v && o.optional) box.append(h('button', { type: 'button', onClick: () => { delete obj[key]; render(); } }, 'Hapus'));
  };
  render();
  return h('div', {}, h('label', { for: fileId }, label, o.hint && h('span', { class: 'hint' }, o.hint)), box);
}
function listEditor(arr, makeItem, renderItem, addLabel, rerender) {
  const wrap = h('div', {});
  arr.forEach((item, i) => {
    wrap.append(h('div', { class: 'card' },
      renderItem(item, i),
      h('div', { class: 'row' },
        h('button', { type: 'button', disabled: i === 0, onClick: () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; rerender(); } }, '↑'),
        h('button', { type: 'button', disabled: i === arr.length - 1, onClick: () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; rerender(); } }, '↓'),
        h('button', { type: 'button', class: 'danger', onClick: () => { arr.splice(i, 1); rerender(); } }, 'Hapus'))));
  });
  wrap.append(h('button', { type: 'button', onClick: () => { arr.push(makeItem()); rerender(); } }, '+ ' + addLabel));
  return wrap;
}
const saveSite = () => h('button', { class: 'primary', onClick: act(async () => { await api('PUT', 'site', draft.site); toast('Draft tersimpan'); await refresh(); }) }, 'Simpan draft');

// ---------- Tab situs ----------
function profileTab() {
  const s = draft.site;
  return [
    h('div', { class: 'card' },
      text('Nama', s, 'name'), text('Peran', s, 'role'),
      image('Foto profil', s, 'avatar', { optional: true, hint: 'Kompres dulu (maks 8 MB)' }),
      image('File CV (PDF)', s, 'resumeUrl', { optional: true, pdf: true }),
      text('Tagline', s, 'tagline', { area: true }),
      text('Value proposition', s, 'valueProposition', { area: true })),
    h('div', { class: 'card' }, h('h2', {}, 'Ketersediaan'), text('Lokasi', s.availability, 'location'), text('Zona waktu', s.availability, 'timezone'), text('Status', s.availability, 'statusLine')),
    h('div', { class: 'card' }, h('h2', {}, 'Kontak'), text('Email', s.contact, 'email'), text('WhatsApp (URL wa.me)', s.contact, 'whatsapp'), text('LinkedIn', s.contact, 'linkedin'), text('GitHub', s.contact, 'github')),
    saveSite(),
  ];
}
function whatTab() {
  return [listEditor(draft.site.whatIDo, () => ({ icon: 'gear', title: '', description: '' }),
    (it) => [select('Ikon', it, 'icon', ['bug', 'gear', 'cloud', 'mobile', 'shield', 'sparkle', 'doc', 'checklist']), text('Judul', it, 'title'), text('Deskripsi', it, 'description', { area: true })],
    'Tambah item', render), saveSite()];
}
function expTab() {
  return [listEditor(draft.site.experience, () => ({ role: '', company: '', period: '', location: '', highlights: [] }),
    (it) => [text('Posisi', it, 'role'), text('Perusahaan', it, 'company'), text('Periode', it, 'period'), text('Lokasi', it, 'location'), lines('Highlight', it, 'highlights', {})],
    'Tambah pengalaman', render), saveSite()];
}
function skillsTab() {
  return [listEditor(draft.site.skills, () => ({ category: 'Languages', skills: [] }),
    (it) => [select('Kategori', it, 'category', ['Languages', 'Testing Tools', 'Frameworks', 'AI-Assisted QA', 'Testing Types', 'Project & Monitoring Tools', 'Methodologies', 'Soft Skills']), lines('Skills', it, 'skills', { comma: true })],
    'Tambah grup', render), saveSite()];
}

// ---------- Project ----------
function projectsTab() {
  if (editing && editing.kind === 'projects') return projectEditor();
  const items = [...draft.projects].sort((a, b) => a.data.order - b.data.order);
  return [
    h('div', { class: 'card' }, items.map((p) => h('div', { class: 'list-item' },
      h('div', {}, h('strong', {}, p.data.title), h('div', { class: 'hint' }, `${p.slug} · ${p.data.status} · ${p.data.featured ? 'tampil di landing' : 'tidak di landing'} · urutan ${p.data.order}`)),
      h('button', { onClick: () => { editing = { kind: 'projects', isNew: false, slug: p.slug, data: structuredClone(p.data), body: p.body }; render(); } }, 'Edit')))),
    h('button', { class: 'primary', onClick: () => { editing = { kind: 'projects', isNew: true, slug: '', data: { title: '', summary: '', status: 'in-progress', featured: false, order: items.length + 1, tags: [], showRepo: false, showDemo: false }, body: '## Problem\n\n## Role & Contribution\n\n## Solution\n\n## Impact\n' }; render(); } }, '+ Project baru'),
  ];
}
function projectEditor() {
  const e = editing, d = e.data;
  return [
    h('button', { onClick: () => { editing = null; render(); } }, '← Kembali'),
    h('div', { class: 'card' },
      e.isNew ? text('Slug (URL)', e, 'slug', { hint: 'huruf kecil, angka, tanda -, mis. my-new-project. Tidak bisa diubah setelah dibuat.' }) : h('p', {}, 'Slug: ', h('code', {}, e.slug)),
      text('Judul', d, 'title'), text('Ringkasan (1 kalimat, tampil di card)', d, 'summary', { area: true }),
      select('Status', d, 'status', ['completed', 'in-progress']), check('Tampil di landing page', d, 'featured'),
      text('Urutan (kecil = duluan)', d, 'order', { type: 'number' }),
      lines('Tags', d, 'tags', { comma: true }),
      text('Repo (URL)', d, 'repo', { optional: true }), check('Tampilkan tombol repo', d, 'showRepo'),
      text('Demo (URL)', d, 'demo', { optional: true }), check('Tampilkan tombol demo', d, 'showDemo'),
      image('Cover', d, 'cover', { optional: true }),
      text('Isi (Markdown: Problem → Role & Contribution → Solution → Impact)', e, 'body', { area: true, tall: true, hint: 'Jangan memuat data internal perusahaan.' })),
    h('div', { class: 'row' },
      h('button', { class: 'primary', onClick: act(async () => { await api('PUT', `projects/${encodeURIComponent(e.slug)}`, { data: e.data, body: e.body }); toast('Draft tersimpan'); editing = null; await refresh(); }) }, 'Simpan draft'),
      !e.isNew && h('button', { class: 'danger', onClick: act(async () => { if (!confirm('Hapus project ini dari draft?')) return; await api('DELETE', `projects/${encodeURIComponent(e.slug)}`); editing = null; await refresh(); }) }, 'Hapus')),
  ];
}

// ---------- Galeri ----------
function galleryTab() {
  const items = [...draft.gallery].sort((a, b) => a.data.order - b.data.order);
  const add = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp,image/gif', onChange: act(async (ev) => {
    const f = ev.target.files[0]; if (!f) return;
    const path = (await api('POST', 'upload', undefined, f)).path;
    const n = draft.gallery.reduce((m, g) => Math.max(m, Number((/photo-(\d+)$/.exec(g.slug) || [])[1]) || 0), 0) + 1;
    await api('PUT', `gallery/photo-${String(n).padStart(2, '0')}`, { data: { image: path, alt: 'Foto', order: items.length + 1 } });
    toast('Foto ditambahkan ke draft. Isi alt text dan caption.'); await refresh();
  }) });
  return [
    h('div', { class: 'card' }, h('label', {}, 'Tambah foto', h('span', { class: 'hint' }, 'Tanpa data/ruang kerja internal pada foto dan caption')), add),
    h('div', { class: 'grid' }, items.map((g) => {
      const d = structuredClone(g.data);
      return h('div', { class: 'card' },
        h('img', { class: 'thumb', src: imgSrc(d.image), alt: d.alt }),
        text('Alt text', d, 'alt'), text('Caption', d, 'caption', { optional: true }), text('Urutan', d, 'order', { type: 'number' }),
        h('div', { class: 'row' },
          h('button', { class: 'primary', onClick: act(async () => { await api('PUT', `gallery/${encodeURIComponent(g.slug)}`, { data: d }); toast('Draft tersimpan'); await refresh(); }) }, 'Simpan'),
          h('button', { class: 'danger', onClick: act(async () => { if (!confirm('Hapus foto ini dari draft?')) return; await api('DELETE', `gallery/${encodeURIComponent(g.slug)}`); await refresh(); }) }, 'Hapus')));
    })),
  ];
}

// ---------- Kerangka ----------
const TABS = [['profile', 'Profil', profileTab], ['what', 'What I Do', whatTab], ['exp', 'Pengalaman', expTab], ['skills', 'Skills', skillsTab], ['projects', 'Project', projectsTab], ['gallery', 'Galeri', galleryTab]];

function statusBar() {
  const building = status.state === 'building';
  return h('div', { class: 'bar' },
    h('div', { class: 'row' }, h('h1', {}, 'Admin naradipta.com'),
      building ? h('span', { class: 'pill' }, status.kind === 'publish' ? 'Menerbitkan…' : 'Membuat preview…')
        : status.dirty ? h('span', { class: 'pill pill--dirty' }, 'Ada draft belum terbit') : h('span', { class: 'pill pill--ok' }, 'Draft = situs terbit')),
    h('div', { class: 'bar__actions' },
      h('button', { disabled: building, onClick: act(async () => { await api('POST', 'preview'); await refresh(); }) }, 'Preview'),
      status.previewUrl && status.previewAt && h('a', { class: 'btn', href: status.previewUrl, target: '_blank', rel: 'noopener' }, 'Buka preview ↗'),
      h('button', { class: 'primary', disabled: building || !status.dirty, onClick: act(async () => { if (!confirm('Terbitkan draft ke naradipta.com sekarang?')) return; await api('POST', 'publish'); await refresh(); }) }, 'Publish'),
      h('button', { disabled: building || !status.dirty, onClick: act(async () => { if (!confirm('Buang semua perubahan draft dan kembali ke versi terbit?')) return; await api('POST', 'discard'); editing = null; await refresh(); }) }, 'Buang draft'),
      h('button', { onClick: () => { tab = 'history'; editing = null; render(); } }, 'Riwayat'),
      h('button', { onClick: act(async () => { await api('POST', 'logout'); showLogin(); }) }, 'Keluar')));
}

async function historyTab() {
  const { versions } = await api('GET', 'history');
  return [h('div', { class: 'card' }, h('p', {}, 'Pilih versi lama untuk dimuat ke draft. Lalu cek lewat Preview dan Publish bila sudah sesuai.'),
    versions.length === 0 ? h('p', {}, 'Belum ada riwayat.') : versions.map((v) => h('div', { class: 'list-item' }, h('span', {}, v.replace(/T(\d+)-(\d+)-(\d+).*/, ' $1:$2:$3 UTC')),
      h('button', { onClick: act(async () => { if (!confirm('Timpa draft dengan versi ini?')) return; await api('POST', 'history/restore', { id: v }); tab = 'profile'; await refresh(); toast('Versi dimuat ke draft'); }) }, 'Muat ke draft'))))];
}

async function render() {
  const body = tab === 'history' ? await historyTab() : TABS.find((t) => t[0] === tab)[2]();
  const msg = status.ok === false && status.message ? h('div', { class: 'card' }, h('strong', { class: 'error' }, 'Build terakhir gagal'), h('div', { class: 'log' }, status.message)) : status.ok && status.finishedAt && status.kind === 'publish' && status.message ? h('div', { class: 'card' }, status.message) : null;
  app.replaceChildren(...[statusBar(), h('nav', {}, TABS.map(([id, label]) => h('button', { 'aria-current': String(tab === id), onClick: () => { tab = id; editing = null; render(); } }, label))), msg, ...[].concat(body)].filter(Boolean));
}

async function refresh() {
  [draft, status] = await Promise.all([api('GET', 'draft'), api('GET', 'status')]);
  await render();
  clearTimeout(pollTimer);
  if (status.state === 'building') pollTimer = setTimeout(act(poll), 1200);
}
async function poll() {
  status = await api('GET', 'status');
  if (status.state === 'building') { pollTimer = setTimeout(act(poll), 1200); return; }
  if (status.ok === false) toast('Build gagal, lihat detail di halaman');
  else if (status.kind === 'publish') toast('Situs berhasil terbit');
  else toast('Preview siap');
  await refresh();
}

function showLogin() {
  clearTimeout(pollTimer);
  const f = { username: '', password: '' };
  const err = h('p', { class: 'error', role: 'alert' });
  const u = text('Username', f, 'username'), p = text('Password', f, 'password', { type: 'password' });
  app.replaceChildren(h('form', { class: 'login card', onSubmit: act(async (e) => {
    e.preventDefault(); err.textContent = '';
    try { await api('POST', 'login', f); await refresh(); } catch (x) { err.textContent = x.message === 'invalid_credentials' ? 'Username atau password salah' : x.message; }
  }) }, h('h1', {}, 'Masuk admin'), u, p, err, h('button', { class: 'primary', type: 'submit' }, 'Masuk')));
}

(async () => {
  try { (await api('GET', 'me')).loggedIn ? await refresh() : showLogin(); } catch { showLogin(); }
})();
