/* HopfenMatch 1.7 – Startseite: Nahansicht des Flaschenbauchs, Wisch-Morphing Bier ↔ Wein ↔ Whisky.
   Canvas 2D (in Safari GPU-beschleunigt): pro Frame nur Kontur, Verläufe und 2–3 vorgerenderte Etikett-Bitmaps. */
'use strict';
(function(){
const KS=['bier','wein','whisky'],NAME={bier:'Bier',wein:'Wein',whisky:'Whisky'};
const VW=390,VH=844,CX=195,Y0=-80,Y1=1000,N=150;
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
/* Halbe Breite der Flasche in Höhe y (Bildschirmkoordinaten) */
const PROF={
 bier:y=>{const s=ss(-10,250,y);return 50+(168-50)*s+(y>250?9*Math.sin(Math.PI*Math.min(1,(y-250)/760)):0)},     // bauchig
 wein:y=>{const s=ss(60,380,y);return 34+(124-34)*s},                                                              // schlank, lange Schulter
 whisky:y=>{const s=ss(104,150,y);return 46+(152-46)*s}};                                                            // kantig, kurze harte Schulter
const YS=[...Array(N)].map((_,i)=>Y0+(Y1-Y0)*i/(N-1));
const PW={};KS.forEach(k=>PW[k]=YS.map(PROF[k]));
const HL=(k,y)=>PROF[k](y);
/* Farben je Kategorie */
const C={
 bier:{bg0:'#fbe6b4',bg1:'#e2a548',bg2:'#a8601c',g:['#2a1206','#5e2e0c','#a45a18','#e09a44','#7a3f10','#3a1a06','#1e0c04'],neck:'#c9a227',neck2:'#8a6a12',lab:'#f4ead0',ink:'#3b1a0b',ui:'#3b1a0b',sub:'#6b4a2a',btn:'#d8921a',btnInk:'#ffffff',empty:0,shine:.34},
 wein:{bg0:'#8e2a3e',bg1:'#4e1222',bg2:'#1e050c',g:['#040c06','#0f2414','#24442a','#5c7e58','#1a3420','#08140a','#030804'],neck:'#6b1d24',neck2:'#3a0c12',lab:'#f7f2e5',ink:'#2a1a10',ui:'#fbefe6',sub:'#e6c6c8',btn:'#f3e6cf',btnInk:'#5a1424',empty:0,shine:.3},
 whisky:{bg0:'#6a4426',bg1:'#2e1c10',bg2:'#0e0804',g:['#4a2206','#8a4612','#cf8a30','#f6cf7c','#b2661e','#5a2a08','#2e1404'],neck:'#1c1c1c',neck2:'#c8a24a',lab:'#121212',ink:'#d8b864',ui:'#f6ead2',sub:'#d8c39a',btn:'#d8b864',btnInk:'#1a1208',empty:1,shine:.5}};
const LBL={bier:{y:372,h:292,m:22,r:44},wein:{y:386,h:306,m:12,r:6},whisky:{y:380,h:276,m:34,r:3}};
const hex=h=>{if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];const n=parseInt(h.slice(1),16);return [n>>16,(n>>8)&255,n&255]};
const CH={};KS.forEach(k=>{const o={};for(const x in C[k]){const v=C[k][x];o[x]=Array.isArray(v)?v.map(hex):typeof v==='string'?hex(v):v}CH[k]=o});
const mixc=(a,b,t)=>'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')';
const lerp=(a,b,t)=>a+(b-a)*t;
const W=(rest)=>{const k=rest,l=LBL[k];return 2*PROF[k](l.y)-2*l.m};
/* Etiketten (Entwurf in Ruhebreite, zentriert um 0,0) */
/* Etiketten: einmal je Kategorie in eine Bitmap gezeichnet (echte Webfonts), pro Frame nur noch skaliert/überblendet */
const SERIF="Lora,Georgia,serif",SANS="'Source Sans 3',-apple-system,Helvetica,Arial,sans-serif";
function rr(x,X,y,w,h,r){r=Math.min(r,w/2,h/2);x.beginPath();x.moveTo(X+r,y);x.arcTo(X+w,y,X+w,y+h,r);x.arcTo(X+w,y+h,X,y+h,r);x.arcTo(X,y+h,X,y,r);x.arcTo(X,y,X+w,y,r);x.closePath()}
function txt(x,t,y,font,col,sp){x.font=font;x.fillStyle=col;x.textBaseline='alphabetic';
 if(!sp){x.textAlign='center';x.fillText(t,0,y);return}
 x.textAlign='left';const ch=[...t],ws=ch.map(c=>x.measureText(c).width),tot=ws.reduce((a,b)=>a+b,0)+sp*(ch.length-1);let cx=-tot/2;ch.forEach((c,i)=>{x.fillText(c,cx,y);cx+=ws[i]+sp})}
let HOP=null,HOPC=null;
/* Hopfen-Logo: hellen Hintergrund ausstanzen, damit es auf dem Etikett sauber sitzt */
function hopCut(){try{const c=document.createElement('canvas');c.width=HOP.naturalWidth;c.height=HOP.naturalHeight;const x=c.getContext('2d');x.drawImage(HOP,0,0);
 const d=x.getImageData(0,0,c.width,c.height),a=d.data;for(let i=0;i<a.length;i+=4){const l=Math.min(a[i],a[i+1],a[i+2]);if(l>222)a[i+3]=Math.max(0,Math.round((255-l)*255/33))}x.putImageData(d,0,0);HOPC=c}catch(e){HOPC=HOP}}
function labelArt(k,x){const w=W(k),h=LBL[k].h,hw=w/2,hh=h/2;x.lineWidth=1;
 const box=(m,r,col,lw)=>{rr(x,-hw+m,-hh+m,w-2*m,h-2*m,r);x.strokeStyle=col;x.lineWidth=lw;x.stroke()};
 if(k==='bier'){box(10,34,'#7a3f10',2.4);box(16,29,'#c9a227',1.2);
  if(HOPC)x.drawImage(HOPC,-27,-hh+22,54,54);
  txt(x,'HOPFENMATCH',-hh+96,`700 12.5px ${SANS}`,'#7a3f10',4.2);
  txt(x,'Bier',22,`700 82px ${SERIF}`,'#3b1a0b');
  txt(x,'Gute Biere. Gute Leute.',50,`italic 400 16px ${SERIF}`,'#7a3f10');
  x.fillStyle='#b2392b';x.fillRect(-hw+10,hh-76,w-20,30);txt(x,'HELL · PILS · WEIZEN · IPA',hh-56,`700 13px ${SANS}`,'#fbefd6',3);
  x.beginPath();x.moveTo(-18,hh-26);for(let i=0;i<6;i++)x.lineTo(-12+i*6,hh-26-(i%2?0:7));x.strokeStyle='#c9a227';x.lineWidth=1.6;x.stroke();return}
 if(k==='wein'){box(9,0,'#6b1d24',1.4);box(14,0,'#b8922e',.8);
  const gy=-hh+52;x.fillStyle='#6b1d24';[[-12,0],[0,0],[12,0],[-6,10],[6,10],[0,20]].forEach(([cx,cy])=>{x.beginPath();x.arc(cx,cy+gy,5.4,0,7);x.fill()});
  x.fillStyle='#3f6a3a';x.beginPath();x.moveTo(0,gy-6);x.quadraticCurveTo(10,gy-19,25,gy-17);x.quadraticCurveTo(19,gy-6,0,gy-6);x.fill();
  txt(x,'WEINGUT HOPFENMATCH',-hh+104,`700 11.5px ${SANS}`,'#6b1d24',3.4);
  txt(x,'Wein',30,`italic 700 80px ${SERIF}`,'#2a1a10');
  x.fillStyle='#b8922e';x.fillRect(-56,51.5,112,1);
  txt(x,'RIESLING · SPÄTBURGUNDER',76,`700 12px ${SANS}`,'#6b1d24',2);
  txt(x,'Pfalz · Mosel · Rheinhessen · Franken',97,`italic 400 12.5px ${SERIF}`,'#5a4a3a');
  txt(x,'QUALITÄTSWEIN',hh-28,`700 10.5px ${SANS}`,'#b8922e',3);return}
 box(8,0,'#c8a24a',2);box(14,0,'#c8a24a',.8);
 txt(x,'SINGLE MALT · BOURBON · BLEND',-hh+46,`700 11px ${SANS}`,'#c8a24a',2.6);
 x.fillStyle='#c8a24a';x.fillRect(-70,-hh+59.6,140,.8);
 txt(x,'Whisky',8,`700 62px ${SERIF}`,'#e2c477');
 x.fillStyle='#c8a24a';x.fillRect(-74,28,148,28);txt(x,'AGED 12 YEARS',47.5,`700 13px ${SANS}`,'#121212',3);
 txt(x,'Islay · Speyside · Kentucky',hh-32,`italic 400 14px ${SERIF}`,'#d8c39a')}
const LC={};
function buildLabels(){const sc=Math.min(3,DPR*SC*1.1);KS.forEach(k=>{const w=W(k),h=LBL[k].h,c=LC[k]||document.createElement('canvas');c.width=Math.ceil(w*sc);c.height=Math.ceil(h*sc);
 const x=c.getContext('2d');x.setTransform(sc,0,0,sc,c.width/2,c.height/2);x.clearRect(-w,-h,2*w,2*h);labelArt(k,x);LC[k]=c});lastP=null;if(host)render(P)}
let host,cv,cx,E={},P=0,V=0,anim=0,drag=null,opts={},vis=false,lastIdx=-1,hinted=false,DPR=2,SC=1,OX=0,OY=0;
const mod=(x,n)=>((x%n)+n)%n;
function weights(p){const q=mod(p,3),i=Math.floor(q),t=q-i;return {i,j:(i+1)%3,t}}
function build(){
 host.innerHTML=`<canvas class="hm-svg" aria-hidden="true"></canvas>
 <div class="hm-top"><div class="hm-wm">Hopfen<b>Match</b></div><button class="hm-me" data-hm="profile" aria-label="Profil"><img alt="" crossorigin="anonymous"></button></div>
 <div class="hm-hint" id="hmhint"><span>‹</span> Wischen <span>›</span></div>
 <div class="hm-bot"><div class="hm-titles">${KS.map((k,i)=>`<div class="hm-t" id="hmt${i}"><h1 class="sr">${NAME[k]}</h1><p></p></div>`).join('')}</div>
 <button class="hm-go" data-hm="enter"><span id="hmgo">Bier entdecken</span><svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
 <div class="hm-dots">${KS.map((k,i)=>`<button data-hm-dot="${i}" aria-label="${NAME[k]}"></button>`).join('')}<i id="hmpill"></i></div></div>`;
 cv=host.querySelector('canvas');cx=cv.getContext('2d',{alpha:false});
 E.hmgo=host.querySelector('#hmgo');E.hmpill=host.querySelector('#hmpill');for(let i=0;i<3;i++)E['t'+i]=host.querySelector('#hmt'+i);
 HOP=new Image();HOP.onload=()=>{hopCut();buildLabels()};HOP.src='img/hop_logo.webp';
}
function resize(){if(!host)return;const r=host.getBoundingClientRect();if(!r.width)return;
 DPR=Math.min(window.devicePixelRatio||1,2.5);cv.width=Math.round(r.width*DPR);cv.height=Math.round(r.height*DPR);
 SC=Math.max(r.width/VW,r.height/VH);OX=(r.width-VW*SC)/2;OY=(r.height-VH*SC)/2;buildLabels()}
let lastP=null;const HW=new Float32Array(N);
const lg=(x0,x1,stops)=>{const g=cx.createLinearGradient(x0,0,x1,0);stops.forEach(([o,c])=>g.addColorStop(o,c));return g};
function render(p){
 if(p===lastP||!cx)return;lastP=p;
 const {i,j,t}=weights(p),a=KS[i],b=KS[j],e=t*t*(3-2*t);
 const wk=[0,0,0];wk[i]+=1-t;wk[j]+=t;
 const A=PW[a],Bq=PW[b];let mx=0;for(let n=0;n<N;n++){const v=A[n]+(Bq[n]-A[n])*e;HW[n]=v;if(v>mx)mx=v}
 const at=y=>{const f=(y-Y0)/(Y1-Y0)*(N-1),k=Math.max(0,Math.min(N-2,Math.floor(f)));return HW[k]+(HW[k+1]-HW[k])*(f-k)};
 const ca=CH[a],cb=CH[b],m=(x,y)=>mixc(x,y,t);
 const x=cx;x.setTransform(DPR*SC,0,0,DPR*SC,DPR*OX,DPR*OY);
 // Hintergrund
 const bg=x.createRadialGradient(CX,VH*.44,0,CX,VH*.44,VH*.75);bg.addColorStop(0,m(ca.bg0,cb.bg0));bg.addColorStop(.55,m(ca.bg1,cb.bg1));bg.addColorStop(1,m(ca.bg2,cb.bg2));
 x.fillStyle=bg;x.fillRect(-VW,-VH,3*VW,3*VH);
 const gl=x.createRadialGradient(CX,380,0,CX,380,460);const ga=.22*wk[0]+.1*wk[1]+.14*wk[2];gl.addColorStop(0,`rgba(255,255,255,${(ga*.9).toFixed(3)})`);gl.addColorStop(.6,`rgba(255,255,255,${(ga*.25).toFixed(3)})`);gl.addColorStop(1,'rgba(255,255,255,0)');
 x.fillStyle=gl;x.fillRect(-VW,-VH,3*VW,3*VH);
 // Kontur
 const path=new Path2D();path.moveTo(CX-HW[0],Y0);path.lineTo(CX+HW[0],Y0);for(let n=1;n<N;n++)path.lineTo(CX+HW[n],YS[n]);for(let n=N-1;n>=0;n--)path.lineTo(CX-HW[n],YS[n]);path.closePath();
 const OFF=[0,.12,.27,.36,.6,.86,1];x.fillStyle=lg(CX-mx,CX+mx,OFF.map((o,s)=>[o,m(ca.g[s],cb.g[s])]));x.fill(path);
 x.save();x.clip(path);
 // Whisky: Klarglas, Flüssigkeit erst ab der Schulter
 const emp=ca.empty*(1-t)+cb.empty*t,lv=lerp(a==='whisky'?186:Y0,b==='whisky'?186:Y0,e);
 if(emp>0.003&&lv>Y0){x.globalAlpha=emp;x.fillStyle=lg(CX-mx,CX+mx,[[0,'#8f9a94'],[.3,'#eef2ee'],[.55,'#c9d0cb'],[1,'#7d8782']]);x.fillRect(0,Y0,VW,lv-Y0);
  x.globalAlpha=emp*.7;x.fillStyle='#fff';x.fillRect(0,lv-2,VW,4);x.globalAlpha=1}
 const neckH=lerp({bier:100,wein:100,whisky:72}[a],{bier:100,wein:100,whisky:72}[b],e);
 x.fillStyle=m(ca.neck,cb.neck);x.fillRect(0,Y0,VW,neckH-Y0);x.fillStyle=m(ca.neck2,cb.neck2);x.fillRect(0,neckH-8,VW,6);
 // Etikett: gemeinsame Grundform morpht, Inhalte blenden gestaffelt über
 const LA=LBL[a],LB=LBL[b],ly=lerp(LA.y,LB.y,e),lh=lerp(LA.h,LB.h,e),lm=lerp(LA.m,LB.m,e),lr=lerp(LA.r,LB.r,e),lw=2*at(ly)-2*lm;
 rr(x,CX-lw/2,ly-lh/2,lw,lh,lr);x.fillStyle=m(ca.lab,cb.lab);x.fill();
 for(let k=0;k<3;k++){const op=k===i?1-ss(0,.56,t):k===j?ss(.44,1,t):0;if(op<0.004)continue;const c=LC[KS[k]];if(!c)continue;
  let off=0;if(k===i)off=-e*46;else if(k===j)off=(1-e)*46;
  const sx=lw/W(KS[k]),sy=lh/LBL[KS[k]].h,dw=W(KS[k])*sx,dh=LBL[KS[k]].h*sy;
  x.globalAlpha=op;x.drawImage(c,CX+off*sx-dw/2,ly-dh/2,dw,dh)}
 x.globalAlpha=1;
 // Zylinder-Schattierung über Glas und Etikett
 x.fillStyle=lg(CX-mx,CX+mx,[[0,'rgba(0,0,0,.42)'],[.22,'rgba(255,255,255,.16)'],[.42,'rgba(255,255,255,0)'],[.8,'rgba(0,0,0,.12)'],[1,'rgba(0,0,0,.5)']]);x.fillRect(0,Y0,VW,Y1-Y0);
 // Whisky: kantige Facetten
 const fac=wk[2];
 if(fac>0.01){const f1=new Path2D(),f2=new Path2D();for(let y=Y0+20,q=0;y<=Y1;y+=14,q++){const w2=at(y);q?f1.lineTo(CX-w2+22,y):f1.moveTo(CX-w2+22,y);q?f2.lineTo(CX+w2-22,y):f2.moveTo(CX+w2-22,y)}
  x.lineWidth=2;x.strokeStyle=`rgba(0,0,0,${(fac*.35).toFixed(3)})`;x.stroke(f1);x.lineWidth=1.2;x.strokeStyle=`rgba(255,255,255,${(fac*.5).toFixed(3)})`;x.stroke(f2)}
 x.restore();
 // Glanzlichter folgen der Kontur
 const shine=ca.shine*(1-t)+cb.shine*t,h1=new Path2D(),h2=new Path2D(),rim=new Path2D();
 for(let y=Y0+20,q=0;y<=Y1;y+=14,q++){const w2=at(y),f=q?'lineTo':'moveTo';h1[f](CX-w2*0.7,y);h2[f](CX+w2*0.42,y);rim[f](CX+w2-3,y)}
 x.lineCap='round';x.lineJoin='round';
 x.lineWidth=lerp(a==='whisky'?5:a==='wein'?8:14,b==='whisky'?5:b==='wein'?8:14,e);x.strokeStyle=`rgba(255,255,255,${shine.toFixed(3)})`;x.stroke(h1);
 x.lineWidth=3;x.strokeStyle='rgba(255,255,255,.22)';x.stroke(h2);x.lineWidth=3;x.strokeStyle='rgba(0,0,0,.25)';x.stroke(rim);
 const sg=x.createLinearGradient(0,560,0,VH);sg.addColorStop(0,'rgba(0,0,0,0)');sg.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=sg;x.fillRect(-VW,560,3*VW,VH);
 // UI
 host.style.setProperty('--ui',m(ca.ui,cb.ui));host.style.setProperty('--sub',m(ca.sub,cb.sub));host.style.setProperty('--btn',m(ca.btn,cb.btn));host.style.setProperty('--btnink',m(ca.btnInk,cb.btnInk));
 for(let k=0;k<3;k++){const el=E['t'+k];let off=0;if(k===i)off=-e;else if(k===j)off=1-e;else off=2;
  const op=k===i?1-ss(0,.5,t):k===j?ss(.5,1,t):0;
  el.style.opacity=op.toFixed(3);el.style.transform=`translate3d(${(off*60).toFixed(1)}px,0,0)`}
 const near=Math.round(mod(p,3))%3;
 if(near!==lastIdx){lastIdx=near;E.hmgo.textContent=NAME[KS[near]]+' entdecken';host.dataset.kat=KS[near];host.querySelectorAll('[data-hm-dot]').forEach((x,q)=>x.classList.toggle('on',q===near))}
 const q=mod(p,3);let pill=q,po=1; // Endlos: von Whisky zu Bier gleitet der Ring rechts hinaus und links wieder herein
 if(q>2){pill=q<2.5?q:q-3;po=Math.abs(q-2.5)*2}
 E.hmpill.style.transform=`translate3d(${(pill*22).toFixed(1)}px,0,0)`;E.hmpill.style.opacity=po.toFixed(3);
}
/* Feder zum nächsten Ziel */
let target=0;
function springTo(tg){target=tg;cancelAnimationFrame(anim);
 if(RM()){fadeSwap(()=>{P=tg;render(P);settle()});return}
 let last=performance.now();
 const step=now=>{let dt=Math.min(0.25,(now-last)/1000);last=now;const k=170,c=2*Math.sqrt(k)*0.92;
  while(dt>0){const h=Math.min(dt,1/120);V+=(-k*(P-target)-c*V)*h;P+=V*h;dt-=h}
  if(Math.abs(P-target)<0.0005&&Math.abs(V)<0.002){P=target;V=0;anim=0;render(P);settle();return}
  render(P);anim=requestAnimationFrame(step)};
 anim=requestAnimationFrame(step)}
function settle(){P=mod(Math.round(P),3);target=P;lastP=null;render(P);if(opts.onChange)opts.onChange(KS[P])}
function fadeSwap(fn){cv.style.transition='opacity .18s';cv.style.opacity='0';host.classList.add('rmfade');setTimeout(()=>{fn();cv.style.opacity='1';host.classList.remove('rmfade')},180)}
function go(dirn){springTo(Math.round(P)+dirn)}
function bind(){
 const sw=host.clientWidth||VW;
 host.addEventListener('pointerdown',e=>{if(!vis||e.button>0)return;if(e.target.closest('[data-hm],[data-hm-dot]'))return;
  cancelAnimationFrame(anim);anim=0;drag={onB:!!e.target.closest('.hm-svg'),x:e.clientX,y:e.clientY,p0:P,t:performance.now(),lx:e.clientX,lt:performance.now(),vx:0,moved:false,id:e.pointerId,w:host.clientWidth||sw};
  try{host.setPointerCapture(e.pointerId)}catch(x){}});
 host.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moved&&Math.hypot(dx,dy)>8)drag.moved=true;
  const now=performance.now(),dt=Math.max(1,now-drag.lt);drag.vx=0.8*((e.clientX-drag.lx)/dt)+0.2*drag.vx;drag.lx=e.clientX;drag.lt=now;
  if(drag.moved&&!RM()){P=drag.p0-dx/(drag.w*0.82);V=0;render(P);if(!hinted){hinted=true;host.classList.add('swiped')}}});
 const up=e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;const dx=e.clientX-d.x;
  if(!d.moved){if(d.onB)enter();else springTo(Math.round(P));return}
  if(RM()){if(Math.abs(dx)>40){hinted=true;host.classList.add('swiped');springTo(Math.round(d.p0)+(dx<0?1:-1))}return}
  const vel=-d.vx*1000/(d.w*0.82); // Indizes pro Sekunde
  let tg=Math.round(P+vel*0.18);const base=Math.round(d.p0);tg=Math.max(base-1,Math.min(base+1,tg));
  V=vel;springTo(tg)};
 host.addEventListener('pointerup',up);host.addEventListener('pointercancel',e=>{if(drag){drag=null;springTo(Math.round(P))}});
 host.addEventListener('click',e=>{const b=e.target.closest('[data-hm]'),dt=e.target.closest('[data-hm-dot]');
  if(dt){const n=+dt.dataset.hmDot,cur=mod(Math.round(P),3);let d=n-cur;if(d===2)d=-1;if(d===-2)d=1;springTo(Math.round(P)+d);return}
  if(!b)return;if(b.dataset.hm==='enter')enter();if(b.dataset.hm==='profile'&&opts.onProfile)opts.onProfile()});
 host.addEventListener('keydown',e=>{if(!vis)return;if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);if(e.key==='Enter'&&!e.target.closest('button'))enter()});
}
function enter(){if(!vis)return;cancelAnimationFrame(anim);const k=KS[mod(Math.round(P),3)];P=mod(Math.round(P),3);render(P);
 host.classList.add('leaving');vis=false;if(opts.onEnter)opts.onEnter(k);
 setTimeout(()=>{host.classList.remove('on','leaving');host.setAttribute('aria-hidden','true')},RM()?200:560)}
window.HMHome={
 mount(el,o){host=el;opts=o||{};build();bind();P=Math.max(0,KS.indexOf(o.kat||'bier'));addEventListener('resize',()=>{if(vis)resize()});if(document.fonts&&document.fonts.load)Promise.all(['700 80px Lora','italic 700 80px Lora','italic 400 16px Lora',"700 13px 'Source Sans 3'"].map(f=>document.fonts.load(f))).then(()=>{if(host.clientWidth)buildLabels()}).catch(()=>{})},
 show(k,info){if(!host)return;if(k&&KS.includes(k)){P=KS.indexOf(k);lastP=null;render(P)}
  if(info){(info.counts||[]).forEach((c,i)=>{const p=host.querySelector('#hmt'+i+' p');if(p)p.textContent=c});const im=host.querySelector('.hm-me img');if(im&&info.img)im.src=info.img}
  host.classList.remove('leaving');host.classList.add('on');host.removeAttribute('aria-hidden');vis=true;resize();lastP=null;render(P)},
 hide(){if(!host)return;cancelAnimationFrame(anim);anim=0;drag=null;vis=false;host.classList.remove('on','leaving');host.setAttribute('aria-hidden','true')},
 visible:()=>vis,
 state:()=>({p:P,v:V,kat:KS[mod(Math.round(P),3)],drag:!!drag,anim:!!anim}),
 render:p=>{lastP=null;render(p==null?P:p)},
 setP(p){cancelAnimationFrame(anim);anim=0;P=p;lastP=null;render(P)},
 go,enter,KS};
})();
