// E2E + aksesibilitas QA Drill (Playwright + axe-core). Opsional, tidak ikut build situs.
// Pemakaian: lihat qa-drill/tests/e2e/README.md
import { chromium } from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
// SITE_URL = situs utama (astro preview); LEARN_URL = QA Drill di akar subdomain (qa-drill/server dengan STATIC_DIR).
const ORIGIN=(process.env.SITE_URL||'http://localhost:4399').replace(/\/$/,'');
const LEARN=(process.env.LEARN_URL||'http://localhost:4400').replace(/\/$/,'');
const B=LEARN+'/';
const axeSrc=fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'),'utf8');
const TMP=fs.mkdtempSync(path.join(os.tmpdir(),'qa-drill-e2e-'));
const br=await chromium.launch(); const results=[]; const errs=[];
const ok=(name,cond,extra='')=>{results.push([cond?'PASS':'FAIL',name,extra]);};
async function newPage(w=390,scheme='light'){const c=await br.newContext({viewport:{width:w,height:900},colorScheme:scheme,acceptDownloads:true});const p=await c.newPage();
 p.on('pageerror',e=>errs.push(w+scheme+' '+e.message)); p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource.*status of (400|401|409)/.test(m.text()))errs.push(w+scheme+' '+m.text())}); p.on('dialog',d=>d.accept()); return p;}

// ===== 1. aria-live =====
{
 const p=await newPage(); await p.goto(B+'#/practice/ch4'); await p.waitForSelector('.qtext');
 ok('live region attrs', await p.evaluate(()=>{const e=document.getElementById('live');return e.getAttribute('aria-live')==='polite'&&e.getAttribute('aria-atomic')==='true'&&e.classList.contains('sr-only');}));
 ok('live region not display:none/hidden', await p.evaluate(()=>{const s=getComputedStyle(document.getElementById('live'));return s.display!=='none'&&s.visibility!=='hidden';}));
 await p.evaluate(()=>{window.__live=[];new MutationObserver(()=>{const t=document.getElementById('live').textContent; if(t) window.__live.push(t);}).observe(document.getElementById('live'),{childList:true,characterData:true,subtree:true});});
 const q1=await p.locator('.qtext').innerText();
 // pick wrong-or-right via keyboard only
 await p.locator('#app .opt').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
 await p.keyboard.press('ArrowRight').catch(()=>{}); // no effect; ensure still on guess
 await p.locator('.conf .conf-sure').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
 const live=await p.evaluate(()=>window.__live);
 ok('announces confidence prompt', live.some(t=>/keyakinan/i.test(t)), JSON.stringify(live));
 ok('announces result (Benar / Salah + jawaban)', live.some(t=>/^Benar$|^Salah\. Jawaban benar: .+/.test(t)), JSON.stringify(live));
 ok('prompt announced before result', live.findIndex(t=>/keyakinan/i.test(t)) < live.findIndex(t=>/Benar|Salah/.test(t)));
 // language switch -> English announcements
 await p.evaluate(()=>{QA.store.state.lang='en';}); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
 await p.evaluate(()=>{window.__live.length=0;});
 await p.locator('#app .opt').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
 await p.locator('.conf .conf-unsure').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
 const live2=await p.evaluate(()=>window.__live);
 ok('announcements follow language (EN)', live2.some(t=>/^Correct$|^Wrong\. Correct answer: /.test(t)) && live2.some(t=>/how sure/i.test(t)), JSON.stringify(live2));
 // accessibility tree of the feedback
 const snap=await p.locator('#app').ariaSnapshot();
 ok('feedback visible in a11y tree', /Correct|Not quite/.test(snap));
 // confidence off: direct announce
 await p.evaluate(()=>{QA.store.state.confidence=false; QA.store.save();}); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
 await p.evaluate(()=>{window.__live.length=0;});
 await p.locator('#app .opt').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
 ok('no confidence: result announced directly, no prompt', await p.evaluate(()=>window.__live.length>0 && !window.__live.some(t=>/how sure|keyakinan/i.test(t))), JSON.stringify(await p.evaluate(()=>window.__live)));
 ok('repeat same text is re-announced (clear then set)', await (async()=>{await p.evaluate(()=>{window.__live.length=0; QA.announce('X'); });await p.waitForTimeout(120);await p.evaluate(()=>QA.announce('X'));await p.waitForTimeout(120);return (await p.evaluate(()=>window.__live)).filter(t=>t==='X').length===2;})());
}

// ===== 2. axe-core pada semua rute, terang/gelap, 390 & 1100 =====
for (const [w,scheme] of [[390,'light'],[390,'dark'],[1100,'light'],[1100,'dark']]) {
 const p=await newPage(w,scheme);
 for (const r of ['dashboard','study','study/ch4','practice','mock','cards','plan','settings','account']) {
  await p.goto(B+'#/'+r); await p.waitForTimeout(200);
  await p.evaluate(axeSrc);
  const v=await p.evaluate(async()=>{const x=await axe.run('body',{runOnly:['wcag2a','wcag2aa','best-practice']});return x.violations.map(a=>({id:a.id,impact:a.impact,n:a.nodes.length,t:a.nodes[0].target.join(' ')}));});
  ok(`axe ${w}/${scheme}/${r}`, v.length===0, JSON.stringify(v));
 }
 // sesi latihan: pending, answered, summary
 await p.goto(B+'#/practice/ch5'); await p.waitForSelector('.qtext');
 await p.locator('#app .opt').first().click();
 for (const st of ['pending']) { await p.evaluate(axeSrc); const v=await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.map(a=>({id:a.id,t:a.nodes[0].target.join(' ')}))); ok(`axe ${w}/${scheme}/practice-pending`, v.length===0, JSON.stringify(v)); }
 await p.locator('.conf .conf-sure').click();
 { await p.evaluate(axeSrc); const v=await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.map(a=>({id:a.id,t:a.nodes[0].target.join(' ')}))); ok(`axe ${w}/${scheme}/practice-answered`, v.length===0, JSON.stringify(v)); }
}

// ===== 3. Alur lengkap =====
{
 const p=await newPage(390,'light');
 // latihan sampai ringkasan, jawab salah semua
 await p.goto(B+'#/practice/ch4'); await p.waitForSelector('.qtext'); let n=0;
 while(!(await p.locator('h1',{hasText:/Ringkasan/}).count())&&n<40){
  const info=await p.evaluate(()=>{const t=document.querySelector('.qtext').textContent;const q=QA.questions.find(x=>x.q.id===t||x.q.en===t);return {type:q.type,short:q.type==='short'};});
  if(info.short){ await p.locator('#app textarea').fill('tidak tahu'); await p.getByRole('button',{name:/Cek jawaban/}).click(); await p.getByRole('button',{name:'Salah',exact:true}).click(); }
  else { await p.locator('#app .opt').first().click(); await p.locator('.conf .conf-guess').click(); }
  await p.locator('#app .btn.primary').last().click(); n++; }
 ok('practice session reaches summary', n>0&&n<40, 'answered '+n);
 const txt=await p.locator('#app').innerText();
 ok('summary: explanation, your answer, correct answer', /Mengapa:/.test(txt)&&/Jawaban Anda:/.test(txt)&&/Jawaban benar:/.test(txt));
 ok('summary: retry stats', /Berhasil saat diulang/.test(txt));
 // persistence + deep link
 const before=await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('qa-drill-v1')).q).length);
 await p.reload(); await p.goto(B+'#/mock');
 ok('progress persists after reload', (await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('qa-drill-v1')).q).length))===before, String(before));
 ok('deep link /#/mock renders', /Mock Exam/.test(await p.locator('#app').innerText()));
 // mock lengkap: jawab separuh, serahkan
 await p.getByRole('button',{name:/Mulai/i}).click(); await p.waitForTimeout(200);
 for(let i=0;i<20;i++){ await p.locator('#app .opt').nth(i%4).click(); await p.getByRole('button',{name:/Berikutnya/}).click(); }
 await p.getByRole('button',{name:'Serahkan'}).click(); await p.waitForTimeout(300);
 const rt=await p.locator('#app').innerText();
 ok('mock result shown with pass/fail + per-chapter', /LULUS|TIDAK LULUS|Lulus|Tidak lulus|\/40/.test(rt)&&/Per bab/.test(rt), rt.slice(0,120).replace(/\n/g,' | '));
 ok('mock review: wrong items open, listed first', await p.evaluate(()=>{const d=[...document.querySelectorAll('details.rev')];const firstOpen=d[0].open;const idxClosed=d.findIndex(x=>!x.open);const lastOpen=d.map(x=>x.open).lastIndexOf(true);return d.length===40&&firstOpen&&(idxClosed===-1||lastOpen<idxClosed);}));
 ok('mock review shows answer + explanation', /Jawaban benar:/.test(rt)&&/Jawaban Anda:/.test(rt));
 const mocks=await p.evaluate(()=>JSON.parse(localStorage.getItem('qa-drill-v1')).mocks.length); ok('mock stored', mocks===1);
 // ekspor / impor
 await p.goto(B+'#/settings');
 const [dl]=await Promise.all([p.waitForEvent('download'),p.getByRole('button',{name:'Ekspor'}).click()]);
 const exp=path.join(TMP,'export.json'); await dl.saveAs(exp);
 const exported=JSON.parse(fs.readFileSync(exp,'utf8')); ok('export contains q/mocks', Object.keys(exported.q).length>0&&exported.mocks.length===1);
 await p.getByRole('button',{name:'Hapus progres'}).click(); await p.waitForTimeout(200);
 ok('reset clears', (await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('qa-drill-v1')).q).length))===0);
 await p.setInputFiles('input[type=file]',exp); await p.waitForTimeout(400);
 ok('import success message visible after re-render', /Progres berhasil diimpor/.test(await p.locator('#app').innerText()));
 ok('import restores progress', (await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('qa-drill-v1')).q).length))===Object.keys(exported.q).length);
 fs.writeFileSync(path.join(TMP,'bad.json'),'{"q":{},"cards":{},"history":null}');
 await p.setInputFiles('input[type=file]',path.join(TMP,'bad.json')); await p.waitForTimeout(300);
 ok('corrupt import shows error message', /Gagal impor/.test(await p.locator('#app').innerText()));
 ok('state intact after corrupt import', (await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('qa-drill-v1')).q).length))===Object.keys(exported.q).length);
 // bahasa
 await p.locator('.lang').click(); ok('language toggle persists', (await p.evaluate(()=>JSON.parse(localStorage.getItem('qa-drill-v1')).lang))==='en');
 // kartu istilah
 await p.goto(B+'#/cards'); await p.waitForTimeout(200); ok('cards route', (await p.locator('#app').innerText()).length>30);
 // link kembali
 ok('back link to site', (await p.locator('a.back').getAttribute('href'))==='https://naradipta.com/');
 // storage bentrok: key milik situs
 ok('only qa-drill key in localStorage', JSON.stringify(await p.evaluate(()=>Object.keys(localStorage)))==='["qa-drill-v1"]');
}

// ===== 3b. Pengingat cadangan =====
{
 const p=await newPage(390,'light'); await p.goto(B+'#/dashboard');
 await p.evaluate(()=>{const st=QA.store.state; for(let i=0;i<20;i++) st.q['x'+i]={box:1,due:0,seen:1,correct:1,wrong:0,last:1,hyper:0}; QA.store.save();});
 await p.reload(); await p.waitForSelector('h1');
 ok('backup reminder shown when never exported', /belum dicadangkan/.test(await p.locator('#app').innerText()));
 await p.evaluate(axeSrc); const v=await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.map(a=>a.id));
 ok('axe with backup reminder', v.length===0, JSON.stringify(v));
 await p.goto(B+'#/settings'); const [dl]=await Promise.all([p.waitForEvent('download'),p.getByRole('button',{name:'Ekspor'}).click()]); await dl.path();
 ok('export records last-exported note', /Terakhir diekspor/.test(await p.locator('#app').innerText()));
 await p.goto(B+'#/dashboard'); ok('reminder hidden after export', !/belum dicadangkan/.test(await p.locator('#app').innerText()));
}

// ===== 3c. Akun + sinkronisasi lintas perangkat =====
{
 const email='e2e'+Date.now()+'@example.com', pass='kata-sandi-e2e-1';
 const A=await newPage(390,'light'); await A.goto(B+'#/account'); await A.waitForSelector('#acct-email');
 // salah password / email tidak valid
 await A.fill('#acct-email',email); await A.fill('#acct-pw','x'); await A.getByRole('button',{name:'Masuk',exact:true}).click();
 await A.waitForSelector('[role=alert]:not(:empty)'); ok('invalid password shows an alert', /8-200/.test(await A.locator('[role=alert]').innerText()));
 await A.fill('#acct-pw','salah-salah-1'); await A.getByRole('button',{name:'Masuk',exact:true}).click();
 await A.waitForFunction(()=>/salah/i.test(document.querySelector('[role=alert]').textContent)); ok('wrong credentials message', true);
 await A.evaluate(axeSrc); ok('axe on account form', (await A.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 // daftar (tanpa verifikasi) -> langsung masuk dan jawab beberapa soal di perangkat A
 await A.getByRole('button',{name:'Buat akun baru'}).click(); await A.fill('#acct-email',email); await A.fill('#acct-pw',pass);
 await A.getByRole('button',{name:'Daftar'}).click(); await A.waitForURL(/#\/dashboard/);
 ok('register logs in without verification', await A.evaluate(()=>QA.account.status==='in'));
 await A.evaluate(()=>{QA.store.recordMany([{id:QA.questions[0].id,correct:true,conf:'sure'},{id:QA.questions[1].id,correct:false,conf:'unsure'}]);});
 await A.waitForFunction(()=>QA.account.lastSync&&!QA.account.dirty,null,{timeout:8000}); ok('progress pushed to server', true);
 // perangkat B (konteks bersih): login -> progres muncul
 const Bp=await newPage(390,'light'); await Bp.goto(B+'#/account'); await Bp.waitForSelector('#acct-email');
 await Bp.fill('#acct-email',email.toUpperCase()); await Bp.fill('#acct-pw',pass); await Bp.getByRole('button',{name:'Masuk',exact:true}).click();
 await Bp.waitForFunction(()=>QA.account.status==='in'&&Object.keys(QA.store.state.q).length>=2,null,{timeout:8000}); ok('second device receives progress after login', true);
 // kedua perangkat bekerja bersamaan pada soal berbeda -> tergabung, tidak saling menimpa
 await A.evaluate(()=>QA.store.recordMany([{id:QA.questions[2].id,correct:true,conf:'sure'}]));
 await Bp.evaluate(()=>QA.store.recordMany([{id:QA.questions[3].id,correct:true,conf:'sure'}]));
 await A.waitForFunction(()=>!QA.account.dirty&&!QA.account.syncing,null,{timeout:8000}); await Bp.waitForFunction(()=>!QA.account.dirty&&!QA.account.syncing,null,{timeout:8000});
 await A.evaluate(()=>document.dispatchEvent(new Event('visibilitychange'))); await Bp.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 const need=[2,3];
 for (const pg of [A,Bp]) await pg.waitForFunction(ids=>ids.every(i=>QA.store.state.q[QA.questions[i].id]),need,{timeout:8000});
 ok('concurrent progress from two devices is merged', true);
 // keluar: salinan lokal dihapus (perangkat bersama), sesi dicabut di server
 await Bp.goto(B+'#/account'); await Bp.getByRole('button',{name:'Keluar'}).click();
 await Bp.waitForFunction(()=>QA.account.status==='out'); ok('logout clears local progress', await Bp.evaluate(()=>Object.keys(QA.store.state.q).length===0));
 ok('server session revoked after logout', (await Bp.evaluate(()=>fetch('/api/me').then(r=>r.json())).then(j=>j.email))===null);
 ok('cookie is HttpOnly (not readable from JS)', !(await A.evaluate(()=>document.cookie)).includes('qd_session'));
}

// ===== 4. Situs utama =====
{
 const p=await newPage(1100,'light'); await p.goto(ORIGIN+'/'); 
 ok('site nav has QA Drill link', (await p.locator('.site-header__nav a',{hasText:'QA Drill'}).getAttribute('href'))==='https://learn.naradipta.com/');
 await p.goto(ORIGIN+'/projects/qa-drill'); ok('project page renders', /QA Drill/.test(await p.title())||/QA Drill/.test(await p.locator('h1').innerText()));
 const dev=['CLAUDE.md','README.md','tests/smoke.test.js','tools/build-data.py','questions/istqb.json','package.json'];
 for(const f of dev) ok('not published: /'+f,(await p.request.get(LEARN+'/'+f)).status()===404);
 const h=await p.request.get(LEARN+'/'); const body=await h.text();
 ok('learn is indexable (no noindex)', !/noindex/i.test(body)); ok('learn has canonical to subdomain + description', /rel="canonical" href="https:\/\/learn\.naradipta\.com\/"/.test(body)&&/name="description"/.test(body));
}
console.log(results.map(r=>r.join(' | ')).join('\n')); console.log('\nPASS',results.filter(r=>r[0]==='PASS').length,'FAIL',results.filter(r=>r[0]==='FAIL').length); console.log('console/page errors:',errs);
await br.close();
fs.rmSync(TMP,{recursive:true,force:true});
process.exit(results.some(r=>r[0]==='FAIL')||errs.length?1:0);
