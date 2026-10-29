/* HopfenMatch 1.11 – Startseite: ruhige Kategorie-Übersicht (Bier, Wein, Whisky) statt 3D-Flaschenkarussell.
   Kein WebGL, keine Bilddateien: Karten aus CSS + eigenen SVG-Icons. Erscheinen gestaffelt, sobald das Logo-Intro weg ist;
   Antippen hebt die Karte an, die übrigen treten zurück, dann blendet die Übersicht weich in die Kategorie über.
   Schnittstelle (window.HMHome) wie bisher: mount, show, hide, visible, enter, state, go, KS. */
'use strict';
(function(){
const KS=['bier','wein','whisky'],NAME={bier:'Bier',wein:'Wein',whisky:'Whisky'};
const SUB={bier:'Helles, Pils, Weizen & Craft',wein:'Rot, Weiß, Rosé & Schaumwein',whisky:'Scotch, Bourbon & Weltwhisky'};
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Eigene Icons, 64er-Raster, Linien + dezente Füllung in der Akzentfarbe */
const ICON={
 bier:`<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="hmgB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ac2)" stop-opacity=".95"/><stop offset="1" stop-color="var(--ac)" stop-opacity=".8"/></linearGradient></defs>
  <path class="liq" d="M19.4 24h25.2l-2.3 29.2a3.2 3.2 0 0 1-3.2 2.9H24.9a3.2 3.2 0 0 1-3.2-2.9z" fill="url(#hmgB)"/>
  <path class="foam" d="M18.2 25.2c-2.6-.6-3.9-3-3.1-5.3.7-2.1 2.9-3.2 5-2.7.9-3.2 3.9-5.3 7.3-5 1.6-2.2 4.3-3.4 7.1-2.8 2.4.5 4.2 2.2 5 4.4 2.9-.3 5.6 1.7 6 4.6.4 3-1.8 5.6-4.7 6.8z"/>
  <path class="ln" d="M17.8 21.8 21.6 53.3a3.2 3.2 0 0 0 3.2 2.8h14.4a3.2 3.2 0 0 0 3.2-2.8l3.8-31.5"/>
  <path class="ln" d="M45.4 28.5h3.4a4 4 0 0 1 4 4v9.8a4 4 0 0 1-4 4h-4.7"/>
  <g class="bub"><circle cx="27" cy="44" r="1.1"/><circle cx="31.5" cy="36" r=".9"/><circle cx="36.5" cy="47" r="1.2"/><circle cx="34" cy="31" r=".8"/><circle cx="28.5" cy="32.5" r=".7"/></g></svg>`,
 wein:`<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="hmgW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ac2)" stop-opacity=".95"/><stop offset="1" stop-color="var(--ac)" stop-opacity=".85"/></linearGradient></defs>
  <path class="liq" d="M19.3 25.5h25.4c-.4 7.9-5.4 13.6-12.7 13.6s-12.3-5.7-12.7-13.6z" fill="url(#hmgW)"/>
  <path class="ln" d="M20.5 8.5h23c1.8 5.4 2.6 10.6 2.3 15.6-.6 9.5-6.2 16.1-13.8 16.1s-13.2-6.6-13.8-16.1c-.3-5 .5-10.2 2.3-15.6z"/>
  <path class="ln" d="M32 40.2v14.3M22.5 56h19"/>
  <path class="hi" d="M24.2 14c-.9 3.4-1.1 6.7-.6 9.8"/></svg>`,
 whisky:`<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="hmgK" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ac2)" stop-opacity=".95"/><stop offset="1" stop-color="var(--ac)" stop-opacity=".85"/></linearGradient></defs>
  <path class="liq" d="M16.3 35h31.4l-1.5 15.6H17.8z" fill="url(#hmgK)"/>
  <rect class="ice" x="25" y="27.5" width="12" height="12" rx="2.2" transform="rotate(-14 31 33.5)"/>
  <path class="ln" d="M14.5 19.5h35l-2.9 33.2a3.4 3.4 0 0 1-3.4 3.1H20.8a3.4 3.4 0 0 1-3.4-3.1z"/>
  <path class="ln" d="M17.9 50.6h28.2"/>
  <path class="hi" d="M19.3 24.5l1.5 18"/></svg>`};
const ARROW=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
let host,opts={},vis=false,cur='bier',leaving=0,waitT=0,tc0=null;
/* Dunkle Übersicht: Browser-Leiste (theme-color) und simulierte Statusleiste passend dunkel, danach zurück */
function dark(on){const r=document.documentElement,m=document.querySelector('meta[name="theme-color"]');r.classList.toggle('hm-dark',on);
 if(m){if(tc0===null)tc0=m.getAttribute('content');m.setAttribute('content',on?'#2c1c10':tc0)}}
const fmt=n=>Number(n||0).toLocaleString('de-DE');
function build(){
 host.innerHTML=`<div class="hm-bg" aria-hidden="true"><i></i></div>
 <header class="hm-top"><div class="hm-brand"><img src="img/hop_logo_t.webp" alt=""><span class="hm-wm">Hopfen<b>Match</b></span></div>
  <button class="hm-me" data-hm="profile" aria-label="Profil"><img alt="" crossorigin="anonymous"></button></header>
 <div class="hm-head"><p class="hm-eye" id="hmhi">Willkommen</p><h1>Worauf hast du<br>heute Lust?</h1></div>
 <div class="hm-cards" role="list">${KS.map((k,i)=>`<button class="hm-card hm-${k}" data-hm="enter" data-k="${k}" role="listitem" style="--i:${i}" aria-label="${NAME[k]}">
  <span class="hm-glow" aria-hidden="true"></span><span class="hm-ic">${ICON[k]}</span>
  <span class="hm-tx"><span class="hm-n">${NAME[k]}</span><span class="hm-s">${SUB[k]}</span></span>
  <span class="hm-meta"><span class="hm-tot" data-tot></span><span class="hm-mine" data-mine></span></span>
  <span class="hm-go" aria-hidden="true">${ARROW}</span></button>`).join('')}</div>
 <p class="hm-foot" aria-hidden="true">Gute Biere. Gute Leute.</p>`;
}
function bind(){
 host.addEventListener('click',e=>{const b=e.target.closest('[data-hm]');if(!b||!vis)return;
  if(b.dataset.hm==='enter')enter(b.dataset.k);if(b.dataset.hm==='profile'&&opts.onProfile)opts.onProfile()});
 host.addEventListener('keydown',e=>{if(!vis)return;const i=KS.indexOf(cur);
  if(e.key==='ArrowDown'||e.key==='ArrowRight')go(1);if(e.key==='ArrowUp'||e.key==='ArrowLeft')go(-1);
  if(e.key==='Enter'&&!e.target.closest('button'))enter(cur)});
}
function go(d){const i=(KS.indexOf(cur)+d+3)%3;cur=KS[i];const c=host.querySelector('.hm-card[data-k="'+cur+'"]');if(c)c.focus()}
/* Erst einblenden, wenn das Logo-Intro geht (sonst liefe die Animation unsichtbar darunter ab) */
function reveal(){clearTimeout(waitT);const i=document.getElementById('intro');
 if(i&&i.isConnected&&!i.classList.contains('done')){waitT=setTimeout(reveal,60);return}
 requestAnimationFrame(()=>host.classList.add('in'))}
function info(o){if(!o)return;
 if(o.name){const h=host.querySelector('#hmhi');if(h)h.textContent='Hallo '+o.name}
 const im=host.querySelector('.hm-me img');if(im&&o.img&&im.getAttribute('src')!==o.img)im.src=o.img;
 (o.stats||[]).forEach((s,i)=>{const c=host.querySelector('.hm-card[data-k="'+KS[i]+'"]');if(!c)return;
  c.querySelector('[data-tot]').textContent=fmt(s.total)+' '+s.many;
  const m=c.querySelector('[data-mine]');m.textContent=s.mine?fmt(s.mine)+' bewertet':'Noch offen';m.classList.toggle('none',!s.mine)})}
function enter(k){if(!vis)return;k=KS.includes(k)?k:cur;cur=k;vis=false;
 const c=host.querySelector('.hm-card[data-k="'+k+'"]');if(c)c.classList.add('pick');
 host.classList.add('leaving');
 const rm=RM(),t1=rm?60:300,t2=rm?260:820;
 clearTimeout(leaving);leaving=setTimeout(()=>{if(opts.onEnter)opts.onEnter(k);host.classList.add('fade');setTimeout(()=>dark(false),rm?0:180)},t1);
 setTimeout(()=>{host.classList.remove('on','in','leaving','fade');if(c)c.classList.remove('pick');host.setAttribute('aria-hidden','true')},t2)}
window.HMHome={
 mount(el,o){host=el;opts=o||{};cur=KS.includes(opts.kat)?opts.kat:'bier';build();bind()},
 show(k,inf){if(!host)return;if(k&&KS.includes(k))cur=k;clearTimeout(leaving);info(inf);
  host.classList.remove('leaving','fade','in');host.querySelectorAll('.pick').forEach(x=>x.classList.remove('pick'));
  host.querySelectorAll('.hm-card').forEach(x=>x.classList.toggle('last',x.dataset.k===cur));
  host.classList.add('on');host.removeAttribute('aria-hidden');vis=true;dark(true);void host.offsetWidth;reveal()},
 hide(){if(!host)return;clearTimeout(leaving);clearTimeout(waitT);vis=false;dark(false);host.classList.remove('on','in','leaving','fade');host.setAttribute('aria-hidden','true')},
 update:info,
 visible:()=>vis,
 state:()=>({kat:cur,vis}),
 go,enter,KS};
})();
