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
// guest=true: lewati layar masuk (pilihan "lanjut tanpa akun") agar tes non-akun tetap langsung ke aplikasi.
async function newPage(w=390,scheme='light',guest=true){const c=await br.newContext({viewport:{width:w,height:900},colorScheme:scheme,acceptDownloads:true});if(guest)await c.addInitScript(()=>{try{sessionStorage.setItem('qa-drill-guest','1')}catch(e){}});const p=await c.newPage();
 p.on('pageerror',e=>errs.push(w+scheme+' '+e.message)); p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource.*status of (400|401|409)/.test(m.text()))errs.push(w+scheme+' '+m.text())}); p.on('dialog',d=>d.accept()); return p;}

// Server dengan MAIL_PROVIDER=log mencetak email ke stdout (E2E_MAIL_LOG); tes mengambil tautan dari sana.
const lastLink=(kind)=>{const m=[...fs.readFileSync(process.env.E2E_MAIL_LOG,'utf8').matchAll(new RegExp('(https?://[^\\s]+/#/'+kind+'/[\\w-]+)','g'))].pop(); return m&&m[1];};
async function verifyViaMail(){await new Promise(r=>setTimeout(r,400)); const q=await newPage(390,'light',false); await q.goto(lastLink('verify')); await q.waitForSelector('.okbox'); await q.context().close();}

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
 for (const r of ['dashboard','study','study/ch4','practice','mock','cards','plan','settings','account','more','community','career/selenium','career/sql','career/fundamentals','career/nonfunctional','career/tooling','career/coding']) {
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

// ===== 2b. Mobile: topik karir, sumber belajar, soal berkode (tanpa overflow, font isian 16px, target sentuh) =====
for (const w of [360,390]) {
 const p=await newPage(w,'light');
 for (const tp of ['rest-api','qa-general','fundamentals','nonfunctional','tooling','coding']) {
  await p.goto(B+'#/career/'+tp); await p.waitForSelector('#app details');
  const m=await p.evaluate(()=>({ov:document.documentElement.scrollWidth>window.innerWidth+1, n:document.querySelectorAll('#app ul.linklist a').length,
   safe:[...document.querySelectorAll('#app ul.linklist a')].every(a=>/^https:/.test(a.href)&&a.target==='_blank'&&/noopener/.test(a.rel)),
   short:[...document.querySelectorAll('#app ul.linklist a')].filter(a=>a.getBoundingClientRect().height<24).length}));
  ok(`mobile ${w} career/${tp}: tanpa overflow, sumber tampil dan aman, target >= 24px`, !m.ov&&m.n>0&&m.safe&&m.short===0, JSON.stringify(m));
 }
 await p.goto(B+'#/practice'); await p.waitForSelector('#app select');
 const fs16=await p.evaluate(()=>[...document.querySelectorAll('#app select,#app input[type=text],#app textarea')].every(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
 ok(`mobile ${w}: kolom isian >= 16px (tanpa zoom otomatis iOS)`, fs16);
 const sel=p.locator('#app select'); await sel.nth(0).selectOption('topic:coding'); await sel.nth(2).selectOption('mcq');
 await p.getByRole('button',{name:/^Mulai/}).click(); await p.waitForSelector('#app pre.qcode');
 const c=await p.evaluate(()=>{const e=document.querySelector('#app pre.qcode');return {ov:document.documentElement.scrollWidth>window.innerWidth+1, wrap:getComputedStyle(e).whiteSpace, tab:e.tabIndex}});
 ok(`mobile ${w}: soal berkode membungkus, tanpa overflow, dapat difokus`, !c.ov&&c.wrap==='pre-wrap'&&c.tab===0, JSON.stringify(c));
 await p.context().close();
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
 const [dl]=await Promise.all([p.waitForEvent('download'),p.getByRole('button',{name:'Export'}).click()]);
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
 await p.locator('.lang:visible').first().click(); ok('language toggle persists', (await p.evaluate(()=>JSON.parse(localStorage.getItem('qa-drill-v1')).lang))==='en');
 // kartu istilah
 await p.goto(B+'#/cards'); await p.waitForTimeout(200); ok('cards route', (await p.locator('#app').innerText()).length>30);
 // link kembali
 ok('back link to site', (await p.locator('a[href="https://naradipta.com/"]').count())>=1);
 // storage bentrok: key milik situs
 ok('only qa-drill key in localStorage', JSON.stringify(await p.evaluate(()=>Object.keys(localStorage)))==='["qa-drill-v1"]');
}

// ===== 3b. Pengingat cadangan =====
{
 const p=await newPage(390,'light'); await p.goto(B+'#/dashboard');
 await p.evaluate(()=>{const st=QA.store.state; for(let i=0;i<20;i++) st.q['x'+i]={box:1,due:0,seen:1,correct:1,wrong:0,last:1,hyper:0}; QA.store.save();});
 await p.reload(); await p.waitForSelector('h1');
 ok('backup reminder shown when never exported', /belum di-backup/.test(await p.locator('#app').innerText()));
 await p.evaluate(axeSrc); const v=await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.map(a=>a.id));
 ok('axe with backup reminder', v.length===0, JSON.stringify(v));
 await p.goto(B+'#/settings'); const [dl]=await Promise.all([p.waitForEvent('download'),p.getByRole('button',{name:'Export'}).click()]); await dl.path();
 ok('export records last-exported note', /Terakhir diekspor/.test(await p.locator('#app').innerText()));
 await p.goto(B+'#/dashboard'); ok('reminder hidden after export', !/belum dicadangkan/.test(await p.locator('#app').innerText()));
}

// ===== 3c. Akun + sinkronisasi lintas perangkat =====
{
 const email='e2e'+Date.now()+'@example.com', pass='kata-sandi-e2e-1';
 const A=await newPage(390,'light',false); await A.goto(B+'#/account'); await A.waitForSelector('#acct-email');
 // salah password / email tidak valid
 await A.fill('#acct-email',email); await A.fill('#acct-pw','x'); await A.locator('button[type=submit]').click();
 await A.waitForSelector('[role=alert]:not(:empty)'); ok('invalid password shows an alert', /8-200/.test(await A.locator('[role=alert]').innerText()));
 await A.fill('#acct-pw','salah-salah-1'); await A.locator('button[type=submit]').click();
 await A.waitForFunction(()=>/salah/i.test(document.querySelector('[role=alert]').textContent)); ok('wrong credentials message', true);
 await A.evaluate(axeSrc); ok('axe on account form', (await A.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 // daftar (tanpa verifikasi) -> langsung masuk dan jawab beberapa soal di perangkat A
 await A.getByRole('button',{name:'Daftar',exact:true}).click(); await A.fill('#acct-email',email); await A.fill('#acct-pw',pass);
 await A.locator('button[type=submit]').click(); await A.waitForURL(/#\/dashboard/);
 ok('register logs in without verification', await A.evaluate(()=>QA.account.status==='in'));
 await A.evaluate(()=>{QA.store.recordMany([{id:QA.questions[0].id,correct:true,conf:'sure'},{id:QA.questions[1].id,correct:false,conf:'unsure'}]);});
 await A.waitForFunction(()=>QA.account.lastSync&&!QA.account.dirty,null,{timeout:8000}); ok('progress pushed to server', true);
 // perangkat B (konteks bersih): login -> progres muncul
 const Bp=await newPage(390,'light',false); await Bp.goto(B+'#/account'); await Bp.waitForSelector('#acct-email');
 await Bp.fill('#acct-email',email.toUpperCase()); await Bp.fill('#acct-pw',pass); await Bp.locator('button[type=submit]').click();
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
 await Bp.goto(B+'#/account'); await Bp.getByRole('button',{name:'Keluar'}).first().click();
 await Bp.waitForFunction(()=>QA.account.status==='out'); ok('logout clears local progress', await Bp.evaluate(()=>Object.keys(QA.store.state.q).length===0));
 ok('server session revoked after logout', (await Bp.evaluate(()=>fetch('/api/me').then(r=>r.json())).then(j=>j.email))===null);
 ok('cookie is HttpOnly (not readable from JS)', !(await A.evaluate(()=>document.cookie)).includes('qd_session'));
}

// ===== 3d. Gerbang masuk, tamu, dan akun terpisah di satu browser =====
{
 const p=await newPage(390,'light',false); await p.goto(B+'#/practice'); await p.waitForSelector('#acct-email');
 ok('gate: welcome screen replaces app for signed-out visitors', /Coba dulu tanpa akun/.test(await p.locator('#app').innerText()));
 ok('gate: no app nav before sign-in', (await p.locator('.side-nav a, .tabbar a').count())===0);
 await p.evaluate(axeSrc); ok('axe on welcome', (await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 // tamu: kerjakan soal, simpan di ruang tamu
 await p.getByRole('button',{name:'Coba dulu tanpa akun'}).click(); await p.waitForSelector('.stats');
 ok('guest continues into the app', (await p.locator('.side-nav a').count())>3 && (await p.locator('.tabbar a').count())===5);
 await p.evaluate(()=>QA.store.recordMany([{id:QA.questions[0].id,correct:true,conf:'sure'}]));
 // akun baru di browser yang sama: tawaran impor progres tamu; terima
 const e1='iso1'+Date.now()+'@example.com', e2='iso2'+Date.now()+'@example.com', pw='kata-sandi-e2e-2';
 async function signUp(email){await p.goto(B+'#/account'); await p.waitForSelector('#acct-email'); await p.getByRole('button',{name:'Daftar',exact:true}).click(); await p.fill('#acct-email',email); await p.fill('#acct-pw',pw); await p.locator('button[type=submit]').click(); await p.waitForFunction(()=>QA.account.status==='in'&&!QA.account.syncing,null,{timeout:8000});}
 await signUp(e1);
 ok('account storage key uses the numeric user id', await p.evaluate(()=>Object.keys(localStorage).some(k=>/^qa-drill-u[0-9]+$/.test(k))&&!Object.keys(localStorage).some(k=>/undefined/.test(k))));
 ok('new account imports guest progress (confirm accepted)', await p.evaluate(()=>Object.keys(QA.store.state.q).length===1));
 await p.evaluate(()=>QA.store.recordMany([{id:QA.questions[5].id,correct:true,conf:'sure'}]));
 await p.waitForFunction(()=>QA.account.lastSync&&!QA.account.dirty,null,{timeout:8000});
 await p.goto(B+'#/account'); await p.getByRole('button',{name:'Keluar'}).first().click(); await p.waitForSelector('#acct-email');
 ok('after sign-out the welcome screen returns', await p.evaluate(()=>QA.gate()==='welcome'));
 ok('account progress is not left on the device', await p.evaluate(()=>Object.keys(localStorage).filter(k=>/^qa-drill-u/.test(k)).length===0));
 // akun kedua: tidak melihat progres akun pertama
 await signUp(e2);
 ok('second account starts empty (no leak from first account)', await p.evaluate(()=>Object.keys(QA.store.state.q).length===0));
 await p.waitForSelector('.acct-email',{state:'attached'});
 ok('shell shows the signed-in email', /iso2/.test(await p.evaluate(()=>document.querySelector('.acct-email').textContent)));
 await p.goto(B+'#/account'); await p.getByRole('button',{name:'Keluar'}).first().click(); await p.waitForSelector('#acct-email');
 // masuk lagi ke akun pertama: progres kembali dari server
 await p.fill('#acct-email',e1); await p.fill('#acct-pw',pw); await p.locator('button[type=submit]').click();
 await p.waitForFunction(()=>QA.account.status==='in'&&Object.keys(QA.store.state.q).length===2,null,{timeout:8000}); ok('first account progress restored from server', true);
}

// ===== 3e. Komunitas (opt-in) + materi karir =====
{
 const p=await newPage(390,'light',false); await p.goto(B+'#/community'); await p.waitForSelector('#acct-email');
 const e='kom'+Date.now()+'@example.com';
 await p.getByRole('button',{name:'Daftar',exact:true}).click(); await p.fill('#acct-email',e); await p.fill('#acct-pw','kata-sandi-e2e-3'); await p.locator('button[type=submit]').click();
 await p.waitForFunction(()=>QA.account.status==='in',null,{timeout:8000});
 if(process.env.E2E_MAIL_LOG){await verifyViaMail(); await p.reload(); await p.waitForFunction(()=>QA.account.status==='in');}
 await p.goto(B+'#/community'); await p.waitForSelector('#dn');
 ok('community: not joined by default (join form shown)', /Ikut papan belajar/.test(await p.locator('#app').innerText()));
 await p.evaluate(axeSrc); ok('axe on community join', (await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 await p.fill('#dn','x@y'); await p.check('#dn-ok'); await p.getByRole('button',{name:'Ikut papan belajar'}).click();
 await p.waitForFunction(()=>/tanpa @/.test(document.querySelector('.form-err').textContent)); ok('community: email-like name rejected', true);
 await p.fill('#dn','Rafi QA'); await p.check('#dn-ok'); await p.getByRole('button',{name:'Ikut papan belajar'}).click();
 await p.waitForSelector('table.board'); ok('community: board lists me as You', /Rafi QA/.test(await p.locator('table.board tr.you').innerText()));
 ok('community: email never shown on the board', !(await p.locator('#app').innerText()).includes(e));
 await p.evaluate(axeSrc); ok('axe on community board', (await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 await p.getByRole('button',{name:'Berhenti berbagi'}).click(); await p.waitForSelector('#dn'); ok('community: leaving returns to join form', true);
 await p.goto(B+'#/career/selenium'); await p.waitForSelector('.mat'); ok('career material renders with practice link', (await p.locator('a[href="#/practice/topic:selenium"]').count())===1);
}

// ===== 3j. Aturan nama dan laporan di komunitas =====
{
 const mk=async(label)=>{const p=await newPage(390,'light',false); await p.goto(B+'#/account'); await p.waitForSelector('#acct-email');
  await p.getByRole('button',{name:'Daftar',exact:true}).click(); await p.fill('#acct-email',label+Date.now()+'@example.com'); await p.fill('#acct-pw','kata-sandi-e2e-4'); await p.locator('button[type=submit]').click();
  await p.waitForFunction(()=>QA.account.status==='in'); if(process.env.E2E_MAIL_LOG){await verifyViaMail(); await p.reload(); await p.waitForFunction(()=>QA.account.status==='in');}
  await p.goto(B+'#/community'); await p.waitForSelector('#dn'); return p;};
 const join=async(p,name)=>{await p.fill('#dn',name); await p.check('#dn-ok'); await p.getByRole('button',{name:'Ikut papan belajar'}).click();};
 const A=await mk('na'), Bp=await mk('nb');
 await join(A,'Sari Uji'); await A.waitForSelector('table.board');
 await join(Bp,'Admin'); await Bp.waitForFunction(()=>/tidak diizinkan/.test(document.querySelector('.form-err').textContent)); ok('community: reserved name rejected', true);
 await join(Bp,'sari  uji'); await Bp.waitForFunction(()=>/sudah dipakai/.test(document.querySelector('.form-err').textContent)); ok('community: duplicate name rejected', true);
 await join(Bp,'Budi Uji'); await Bp.waitForSelector('table.board');
 await Bp.getByRole('button',{name:'Laporkan nama Sari Uji'}).click(); await Bp.waitForSelector('#rp-reason');
 ok('community: cannot report yourself (no button on own row)', (await Bp.getByRole('button',{name:'Laporkan nama Budi Uji'}).count())===0);
 await Bp.evaluate(axeSrc); ok('axe on report form', (await Bp.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 await Bp.getByRole('button',{name:'Kirim laporan'}).click(); await Bp.waitForFunction(()=>/laporan terkirim/.test(document.querySelector('[role=status]').textContent)); ok('community: report sent', true);
 await Bp.getByRole('button',{name:'Tutup'}).click(); await Bp.getByRole('button',{name:'Laporkan nama Sari Uji'}).click(); await Bp.getByRole('button',{name:'Kirim laporan'}).click();
 await Bp.waitForFunction(()=>/sudah melaporkan/.test(document.querySelector('[role=status]').textContent)); ok('community: duplicate report acknowledged', true);
}

// ===== 3f. Hari aktif, judul halaman, struktur heading =====
{
 const p=await newPage(390,'light'); await p.goto(B+'#/dashboard'); await p.waitForSelector('.stats');
 ok('page title follows the route', /^Beranda \| QA Drill/.test(await p.title()));
 ok('streak starts at 0', await p.evaluate(()=>QA.streak()===0));
 await p.evaluate(()=>QA.store.record(QA.questions[0].id,true,'sure'));
 ok('one answer (no finished session) counts as an active day', await p.evaluate(()=>QA.streak()===1 && QA.store.state.days.length===1));
 await p.goto(B+'#/practice/ch1'); await p.waitForSelector('.qtext');
 ok('practice session has exactly one h1', (await p.locator('h1').count())===1);
 await p.evaluate(()=>{QA.store.state.lang='en';QA.store.save();QA.render();});
 ok('html lang follows language', await p.evaluate(()=>document.documentElement.lang==='en'));
}

// ===== 3g. Email: verifikasi + reset password (hanya bila server dijalankan dengan MAIL_PROVIDER=log; stdout-nya di E2E_MAIL_LOG) =====
if (process.env.E2E_MAIL_LOG) {
 const e='mail'+Date.now()+'@example.com', pw1='kata-sandi-mail-1', pw2='kata-sandi-mail-2';
 const p=await newPage(390,'light',false); await p.goto(B+'#/account'); await p.waitForSelector('#acct-email');
 await p.getByRole('button',{name:'Daftar',exact:true}).click(); await p.fill('#acct-email',e); await p.fill('#acct-pw',pw1); await p.locator('button[type=submit]').click();
 await p.waitForFunction(()=>QA.account.status==='in'); await p.goto(B+'#/dashboard'); await p.waitForSelector('.stats');
 ok('mail: unverified banner shown', /belum diverifikasi/.test(await p.locator('#app').innerText()));
 await p.evaluate(axeSrc); ok('axe with verify banner', (await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 await p.waitForTimeout(400); const vlink=lastLink('verify'); ok('mail: verification link was "sent"', !!vlink);
 const q=await newPage(390,'light',false); await q.goto(vlink); await q.waitForSelector('.okbox');
 ok('mail: verify page confirms and hides app chrome', /Email terverifikasi/.test(await q.locator('#app').innerText()) && (await q.locator('.tabbar a').count())===0);
 await q.evaluate(axeSrc); ok('axe on verify page', (await q.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 const r=await newPage(390,'light',false); await r.goto(B+'#/account'); await r.waitForSelector('#acct-email'); await r.getByRole('button',{name:'Lupa password?'}).click();
 await r.fill('#acct-email',e); await r.locator('button[type=submit]').click(); await r.waitForFunction(()=>/link reset sudah dikirim/.test(document.querySelector('[role=status]').textContent));
 await r.waitForTimeout(400); const rlink=lastLink('reset'); ok('mail: reset link was "sent"', !!rlink);
 await r.goto(rlink); await r.waitForSelector('#np'); await r.evaluate(axeSrc); ok('axe on reset page', (await r.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 await r.fill('#np',pw2); await r.fill('#np2','beda-sekali-1'); await r.locator('button[type=submit]').click(); await r.waitForFunction(()=>/tidak sama/.test(document.querySelector('.form-err').textContent)); ok('mail: mismatched passwords rejected', true);
 await r.fill('#np2',pw2); await r.locator('button[type=submit]').click(); await r.waitForSelector('#acct-email');
 ok('mail: after reset the sign-in screen appears and token is gone from URL', !/reset\//.test(r.url()));
 await r.fill('#acct-email',e); await r.fill('#acct-pw',pw1); await r.locator('button[type=submit]').click(); await r.waitForFunction(()=>/salah/i.test(document.querySelector('[role=alert]').textContent)); ok('mail: old password rejected', true);
 await r.fill('#acct-pw',pw2); await r.locator('button[type=submit]').click(); await r.waitForFunction(()=>QA.account.status==='in'&&QA.account.verified===true,null,{timeout:8000}); ok('mail: new password works and email is verified', true);
}

// ===== 3h. Fokus belajar + kartu per topik =====
{
 const p=await newPage(390,'light'); await p.goto(B+'#/dashboard'); await p.waitForSelector('.stats');
 ok('focus chooser shown until a choice is made', /Apa tujuan belajar Anda/.test(await p.locator('#app').innerText()));
 ok('empty account: no generic Today card', (await p.locator('.today-card').count())===0);
 await p.evaluate(()=>QA.store.recordMany(QA.questions.slice(0,12).map(q=>({id:q.id,correct:true,conf:'sure'}))));
 await p.reload(); await p.waitForSelector('.stats');
 await p.getByRole('button',{name:'Bekal karir QA'}).click(); await p.waitForSelector('.today-card');
 ok('career focus: suggestion points to a career topic and career path is listed first', /practice\/topic:/.test(await p.locator('.today-card a').getAttribute('href')) && /Jalur 2/.test(await p.locator('.track-head h2').first().innerText()));
 ok('chooser hidden after choosing', !/Apa tujuan belajar Anda/.test(await p.locator('#app').innerText()));
 await p.evaluate(axeSrc); ok('axe on dashboard with focus set', (await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
 await p.goto(B+'#/cards'); await p.waitForSelector('#deck-topic'); await p.selectOption('#deck-topic','sql');
 ok('glossary deck filters by topic', await p.evaluate(()=>{const n=QA.glossary.filter(g=>g.topic==='sql').length;return n>=5&&new RegExp('^'+n+' flashcard','m').test(document.getElementById('app').innerText)}));
 await p.getByRole('button',{name:/Review semua/}).click(); await p.waitForSelector('.flash');
 const shown=(await p.locator('.flash .big').innerText()).trim();
 ok('deck contains only the chosen topic', await p.evaluate(t=>QA.glossary.filter(g=>g.topic==='sql').map(g=>g.t).includes(t),shown), shown);
 await p.goto(B+'#/settings'); ok('settings shows the study focus', (await p.locator('#focus-sel').inputValue())==='career');
}

// ===== 3i. Kartu "Hari ini" dan tanggal ujian =====
{
 const p=await newPage(390,'light'); await p.goto(B+'#/dashboard'); await p.waitForSelector('.stats');
 const setExam=async(n,focus)=>{await p.evaluate(([n,f])=>{const S=QA.store;S.state.focus=f;S.state.examDate=n===null?null:QA.dateStr(new Date(Date.now()+n*86400000));S.save();QA.render();},[n,focus]); await p.waitForSelector('.stats');};
 await p.evaluate(()=>QA.store.recordMany(QA.questions.slice(0,12).map(q=>({id:q.id,correct:true,conf:'sure'}))));
 await setExam(5,'both');
 ok('exam in 5 days, no recent mock: card suggests a mock exam with countdown', (await p.locator('.today-card a').getAttribute('href'))==='#/mock' && /H-5/.test(await p.locator('.today-card').innerText()));
 await p.evaluate(()=>{QA.store.addMock({t:Date.now(),score:30,total:40,byCh:{}});QA.render();});
 ok('after a mock exam the card moves on (no mock suggestion)', (await p.locator('.today-card a').getAttribute('href'))!=='#/mock' && /H-5/.test(await p.locator('.today-card').innerText()));
 await setExam(10,'both'); await p.evaluate(()=>{QA.store.state.mocks=[];QA.store.save();QA.render();});
 ok('exam in 10 days: countdown but no mock yet', (await p.locator('.today-card a').getAttribute('href'))!=='#/mock' && /H-10/.test(await p.locator('.today-card').innerText()));
 await setExam(0,'both');
 ok('exam day: rest message and no button', /hari ujian/i.test(await p.locator('.today-card').innerText()) && (await p.locator('.today-card a').count())===0);
 await setExam(5,'career');
 ok('career focus ignores the exam date', !/H-5/.test(await p.locator('#app').innerText().then(t=>t.split('Jalur 1')[0])) );
 await p.evaluate(axeSrc); ok('axe on Today card variants', (await p.evaluate(async()=>(await axe.run('body',{runOnly:['wcag2a','wcag2aa']})).violations.length))===0);
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
