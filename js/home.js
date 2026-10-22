/* HopfenMatch 1.8 – Startseite: 3D-Karussell aus gerenderten Flaschen (Blender Cycles, 36 Drehwinkel à 10° je Flasche, Retina-Auflösung). Drei fotorealistische Flaschen stehen auf einer unsichtbaren Drehplatte;
   Wischen dreht den ganzen Kreis (folgt dem Finger, Trägheit, Feder, endlos). Studiolicht bleibt stehen. */
'use strict';
(function(){
const KS=['bier','wein','whisky'],NAME={bier:'Bier',wein:'Wein',whisky:'Whisky'};
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
/* Flaschen-Freisteller (Pixel im jeweiligen Bild) + reale Höhe in cm */
const META={"bier":{"hcm":25.6,"wcm":7.0,"crop":[0.20904,0.17556,0.79096,1.0],"fw":206,"fh":742},"wein":{"hcm":30.0,"wcm":7.6,"crop":[0.18927,0.04333,0.81073,1.0],"fw":220,"fh":861},"whisky":{"hcm":25.8,"wcm":9.6,"crop":[0.07062,0.17,0.92938,0.99111],"fw":304,"fh":739}},FCM=33,FWCM=13,BASE=0.318/0.33,SEQ={n:36,step:10,cols:6,gut:2};
/* Kamera: Abstand zur Drehachse D, Plattenradius RT, Kamerahöhe HC (cm) */
const D=36,RT=8,HC=12;
const C={bier:{ui:'#fbf0dc',sub:'#e8cfa6',btn:'#e3a332',btnInk:'#24140a'},
 wein:{ui:'#fbefe6',sub:'#e6c6c8',btn:'#f3e6cf',btnInk:'#5a1424'},
 whisky:{ui:'#f6ead2',sub:'#d8c39a',btn:'#d8b864',btnInk:'#1a1208'}};
const hex=h=>{const n=parseInt(h.slice(1),16);return [n>>16,(n>>8)&255,n&255]};
const CH={};KS.forEach(k=>{const o={};for(const x in C[k])o[x]=hex(C[k][x]);CH[k]=o});
const mixc=(a,b,t)=>'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')';
let host,stage,P=0,V=0,anim=0,drag=null,opts={},vis=false,lastIdx=-1,hinted=false,DPR=2,CW=390,CHh=844,L=null;
const mod=(x,n)=>((x%n)+n)%n;
function weights(p){const q=mod(p,3),i=Math.floor(q),t=q-i;return {i,j:(i+1)%3,t}}
const B={};// je Flasche: el, cv, ctx, img, lab, neck, lastPsi
function build(){
 host.innerHTML=`<div class="hm-bg" aria-hidden="true">${KS.map(k=>`<i class="hm-bg-${k}"></i>`).join('')}</div>
 <div class="hm-svg hm-stage" aria-hidden="true">${KS.map(k=>`<canvas class="hm-b" data-k="${k}"></canvas>`).join('')}</div>
 <div class="hm-top"><div class="hm-wm">Hopfen<b>Match</b></div><button class="hm-me" data-hm="profile" aria-label="Profil"><img alt="" crossorigin="anonymous"></button></div>
 <div class="hm-bot"><div class="hm-titles">${KS.map((k,i)=>`<div class="hm-t" id="hmt${i}"><h1>${NAME[k]}</h1><p></p></div>`).join('')}</div>
 <button class="hm-go" data-hm="enter"><span id="hmgo">Bier entdecken</span><svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
 <div class="hm-dots">${KS.map((k,i)=>`<button data-hm-dot="${i}" aria-label="${NAME[k]}"></button>`).join('')}<i id="hmpill"></i></div>
 <div class="hm-hint" id="hmhint"><span>‹</span> Wischen zum Drehen <span>›</span></div></div>`;
 stage=host.querySelector('.hm-stage');
 E.hmgo=host.querySelector('#hmgo');E.hmpill=host.querySelector('#hmpill');E.bg=KS.map(k=>host.querySelector('.hm-bg-'+k));for(let i=0;i<3;i++)E['t'+i]=host.querySelector('#hmt'+i);
 const ld=(src,cb)=>{const im=new Image();im.decoding='async';im.onload=()=>{cb(im);for(const k of KS)B[k].lp=null;render(P,true)};im.src=src;return im};
 KS.forEach(k=>{const cv=host.querySelector('.hm-b[data-k="'+k+'"]');B[k]={el:cv,ctx:cv.getContext('2d'),lp:null}});
 const first=KS.indexOf(opts.kat||'bier'),ord=[0,1,2].map(d=>KS[(first+d)%3]);
 // gestaffelt: Frontansicht der aktiven Flasche → je Flasche die geraden Winkel (20°-Raster, enthält alle Ruhelagen) → ungerade Winkel (10°) → übrige Frontansichten
 ld('img/car_'+ord[0]+'.webp',im=>B[ord[0]].hi=im);
 setTimeout(()=>{ord.forEach(k=>ld('img/car_'+k+'_s1.webp',im=>B[k].s1=im));setTimeout(()=>{ord.forEach(k=>ld('img/car_'+k+'_s2.webp',im=>B[k].s2=im));ord.slice(1).forEach(k=>ld('img/car_'+k+'.webp',im=>B[k].hi=im))},250)},60);
}
const E={};
/* Layout aus der Bildschirmgröße: Brennweite so, dass die größte Flasche vorne zwischen Kopfzeile und Titel passt */
function resize(){if(!host)return;const r=host.getBoundingClientRect();if(!r.width)return;
 DPR=Math.min(window.devicePixelRatio||1,3);CW=r.width;CHh=r.height;
 const top=host.querySelector('.hm-top').getBoundingClientRect().bottom-r.top+6,bot=host.querySelector('.hm-titles').getBoundingClientRect().top-r.top-16;
 const maxH=Math.max(...KS.map(k=>META[k].hcm));let f=(bot-top)*(D-RT)/maxH;
 const wmax=Math.max(...KS.map(k=>META[k].wcm/2));f=Math.min(f,(CW/2-6)*(D+RT/2)/(RT*Math.sin(2.0944)+wmax));
 const y0=bot-f*HC/(D-RT);L={f,y0,base:bot};
 KS.forEach(k=>{const b=B[k],ch=f/(D-RT)*FCM,cw=ch*FWCM/FCM;// CSS-Größe des Bildausschnitts vorne
  const w=Math.ceil(cw),h=Math.ceil(ch),base=h*BASE;b.w=w;b.h=h;b.base=base;b.pxcm=ch/FCM;
  b.el.style.width=w+'px';b.el.style.height=h+'px';b.el.style.marginLeft=(-w/2)+'px';b.el.style.marginTop=(-base)+'px';b.el.style.transformOrigin='50% '+base+'px';
  b.el.width=Math.round(w*DPR);b.el.height=Math.round(h*DPR);b.lp=null});
 render(P,true)}
let OF=null;const PY=[],PU=[],PS=[];
/* Flasche k in Drehlage psi (Bogenmaß) zeichnen: Sprite-Frame (15°-Schritte, weich überblendet) bzw. scharfe Frontansicht in Ruhe */
function frame(b,n){const par=n%2,sh=par?b.s2:b.s1;if(!sh)return null;const m=n>>1,fw=b.m.fw,fh=b.m.fh;return [sh,(m%SEQ.cols)*(fw+SEQ.gut),Math.floor(m/SEQ.cols)*(fh+SEQ.gut),fw,fh]}
function paint(k,psi,blur,rest){const b=B[k],m=META[k];b.m=m;if(!b.hi&&!b.s1)return;
 const W=b.el.width,HH=b.el.height,soft=blur*DPR>0.6;
 if(soft){if(!OF)OF=document.createElement('canvas');if(OF.width<W||OF.height<HH){OF.width=Math.max(W,OF.width);OF.height=Math.max(HH,OF.height)}}
 const x=soft?OF.getContext('2d'):b.ctx;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,HH);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
 const cr=m.crop,dx=cr[0]*W,dy=cr[1]*HH,dw=(cr[2]-cr[0])*W,dh=(cr[3]-cr[1])*HH;
 const deg=((psi*180/Math.PI)%360+360)%360,fi=deg/SEQ.step;let i0=Math.floor(fi)%SEQ.n,t=fi-Math.floor(fi),i1=(i0+1)%SEQ.n;
 const front=(deg<0.6||deg>359.4)&&b.hi&&(rest||!b.s1);
 if(front)x.drawImage(b.hi,dx,dy,dw,dh);
 else if(b.s1){let f0=frame(b,i0),f1=frame(b,i1);
  if(!f0||!f1){/* nur 20°-Raster geladen */const e0=i0-(i0%2),e1=(e0+2)%SEQ.n;t=((fi-e0+SEQ.n)%SEQ.n)/2;f0=frame(b,e0);f1=frame(b,e1)}
  const s=ss(.42,.58,t);/* meist ein scharfer Einzelwinkel, nur im Übergang additiv überblendet (keine Doppelkanten) */
  if(s<.01||s>.99){const f=s>.99?f1:f0;x.drawImage(f[0],f[1],f[2],f[3],f[4],dx,dy,dw,dh)}
  else{x.globalCompositeOperation='lighter';x.globalAlpha=1-s;x.drawImage(f0[0],f0[1],f0[2],f0[3],f0[4],dx,dy,dw,dh);x.globalAlpha=s;x.drawImage(f1[0],f1[1],f1[2],f1[3],f1[4],dx,dy,dw,dh);x.globalAlpha=1;x.globalCompositeOperation='source-over'}}
 else x.drawImage(b.hi,dx,dy,dw,dh);
 /* weicher Kontaktschatten unter der Flasche, hinter das Bild gelegt (keine Fläche, kein Rand) */
 const cx=W/2,sy=b.base*DPR,pc=b.pxcm*DPR;x.save();x.globalCompositeOperation='destination-over';
 const ell=(r,sy_,dy,stops)=>{x.save();x.translate(cx,sy+dy);x.scale(1,sy_);const g=x.createRadialGradient(0,0,0,0,0,r);stops.forEach(([o,a])=>g.addColorStop(o,'rgba(0,0,0,'+a+')'));x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,7);x.fill();x.restore()};
 ell(m.wcm/2*.98*pc,.075,-.05*pc,[[0,.72],[.7,.5],[1,0]]);/* Kontaktlinie direkt am Boden */
 ell(m.wcm/2*1.5*pc,.16,.05*pc,[[0,.38],[.5,.17],[1,0]]);/* weicher Schlagschatten */
 x.restore();
 if(soft){/* Tiefenunschärfe: Bildpyramide mit Zeltfilter (je Stufe 4 versetzte Abtastungen, additiv gemittelt) – weich, ohne Treppen, ohne teure CSS-Unschärfe */
  const lv=Math.max(1,Math.min(4,Math.round(Math.log2(blur*DPR/0.9)+.5)));let src=OF,w=W,h=HH;
  for(let n=0;n<lv;n++){const c=PY[n]||(PY[n]=document.createElement('canvas')),nw=Math.max(2,Math.ceil(w/2)),nh=Math.max(2,Math.ceil(h/2));
   if(c.width<nw+2||c.height<nh+2){c.width=Math.max(nw+2,c.width);c.height=Math.max(nh+2,c.height)}const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
   g.globalCompositeOperation='lighter';g.globalAlpha=.25;for(const [ox,oy] of [[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]])g.drawImage(src,0,0,w,h,ox,oy,nw,nh);g.globalAlpha=1;g.globalCompositeOperation='source-over';
   src=c;w=nw;h=nh;PS[n]=[w,h]}
  for(let n=lv-1;n>0;n--){const c=PU[n]||(PU[n]=document.createElement('canvas')),[nw,nh]=PS[n-1];if(c.width<nw+2||c.height<nh+2){c.width=Math.max(nw+2,c.width);c.height=Math.max(nh+2,c.height)}
   const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(src,0,0,w,h,0,0,nw,nh);src=c;w=nw;h=nh}
  const y=b.ctx;y.setTransform(1,0,0,1,0,0);y.clearRect(0,0,W,HH);y.imageSmoothingEnabled=true;y.imageSmoothingQuality='high';y.drawImage(src,0,0,w,h,0,0,W,HH)}
}
/* Stellung im Kreis für Karussell-Position p */
function pose(k,p){const i=KS.indexOf(k),a=(i-p)*2.0944;const xw=RT*Math.sin(a),zw=RT*Math.cos(a),dz=D-zw,sc=(D-RT)/dz;
 return {a,xw,zw,sc,X:CW/2+L.f*xw/dz,Y:L.y0+L.f*HC/dz,psi:a-Math.atan2(xw,dz),dd:Math.max(0,(1-Math.cos(a))/1.5)}}
let lastP=null;
function render(p,force){if(!host||!L)return;if(p===lastP&&!force)return;lastP=p;
 const {i,j,t}=weights(p),e=t*t*(3-2*t);
 KS.forEach(k=>{const b=B[k],q=pose(k,p);
  const dd=Math.min(1,q.dd),br=1-.66*dd,bl=1.25*Math.pow(dd,1.6);
  b.el.style.transform=`translate3d(${q.X.toFixed(2)}px,${q.Y.toFixed(2)}px,0) scale(${q.sc.toFixed(4)})`;
  b.el.style.zIndex=String(100+Math.round(q.zw*10));
  b.el.style.filter=dd>.002?`brightness(${br.toFixed(3)}) saturate(${(1-.3*dd).toFixed(3)})`:'none';
  b.el.dataset.blur=bl.toFixed(2);
  const ps=Math.round(q.a*600)/600,rs=!anim&&!drag,key=ps+'|'+Math.round(bl*20)+'|'+rs+'|'+!!b.hi+!!b.s1+!!b.s2;if(b.lp!==key||force){b.lp=key;paint(k,ps,bl/q.sc,rs)}
  b.el.classList.toggle('front',Math.cos(q.a)>.5)});
 const w=[0,0,0];w[i]=1-e;w[j]=e;E.bg.forEach((el,n)=>el.style.opacity=w[n].toFixed(3));
 uiUpd(p,i,j,t,e,CH[KS[i]],CH[KS[j]])}
function uiUpd(p,i,j,t,e,ca,cb){
 const m=(u,v)=>mixc(u,v,e);
 host.style.setProperty('--ui',m(ca.ui,cb.ui));host.style.setProperty('--sub',m(ca.sub,cb.sub));host.style.setProperty('--btn',m(ca.btn,cb.btn));host.style.setProperty('--btnink',m(ca.btnInk,cb.btnInk));
 for(let k=0;k<3;k++){const el=E['t'+k];let off=0;if(k===i)off=-e;else if(k===j)off=1-e;else off=2;
  const op=k===i?1-ss(0,.5,t):k===j?ss(.5,1,t):0;
  el.style.opacity=op.toFixed(3);el.style.transform=`translate3d(${(off*60).toFixed(1)}px,0,0)`}
 const near=Math.round(mod(p,3))%3;
 if(near!==lastIdx){lastIdx=near;E.hmgo.textContent=NAME[KS[near]]+' entdecken';host.dataset.kat=KS[near];host.querySelectorAll('[data-hm-dot]').forEach((x,q)=>x.classList.toggle('on',q===near))}
 const q=mod(p,3);let pill=q,po=1;
 if(q>2){pill=q<2.5?q:q-3;po=Math.abs(q-2.5)*2}
 E.hmpill.style.transform=`translate3d(${(pill*22).toFixed(1)}px,0,0)`;E.hmpill.style.opacity=po.toFixed(3);
}
/* Feder zum nächsten Ziel */
let target=0;
function springTo(tg){target=tg;cancelAnimationFrame(anim);
 if(RM()){fadeSwap(()=>{P=tg;render(P);settle()});return}
 let last=performance.now();
 const step=now=>{let dt=Math.min(0.25,(now-last)/1000);last=now;const k=150,c=2*Math.sqrt(k)*0.78;
  while(dt>0){const h=Math.min(dt,1/120);V+=(-k*(P-target)-c*V)*h;P+=V*h;dt-=h}
  if(Math.abs(P-target)<0.0006&&Math.abs(V)<0.003){P=target;V=0;anim=0;render(P);settle();return}
  render(P);anim=requestAnimationFrame(step)};
 anim=requestAnimationFrame(step)}
function settle(){P=mod(Math.round(P),3);target=P;render(P,true);if(opts.onChange)opts.onChange(KS[P])}
function fadeSwap(fn){stage.style.transition='opacity .18s';stage.style.opacity='0';host.classList.add('rmfade');setTimeout(()=>{fn();stage.style.opacity='1';host.classList.remove('rmfade')},180)}
function go(dirn){springTo(Math.round(P)+dirn)}
/* Welche Flasche liegt unter dem Finger? (vorderste mit Treffer im Umriss-Rechteck) */
function hitBottle(cx,cy){let best=null,bz=-1e9;KS.forEach(k=>{const r=B[k].el.getBoundingClientRect(),q=pose(k,P),m=META[k];
 const sc=r.height/FCM,bw=m.wcm*sc,l0=r.left+(r.width-bw)/2,t0=r.top+(0.318-m.hcm/100)/0.33*r.height,b0=r.top+BASE*r.height;if(cx<l0||cx>l0+bw||cy<t0||cy>b0)return;if(q.zw>bz){bz=q.zw;best=k}});return best}
function bind(){
 const sw=host.clientWidth||390;
 host.addEventListener('pointerdown',e=>{if(!vis||e.button>0)return;if(e.target.closest('[data-hm],[data-hm-dot]'))return;
  cancelAnimationFrame(anim);anim=0;drag={hit:hitBottle(e.clientX,e.clientY),x:e.clientX,y:e.clientY,p0:P,t:performance.now(),lx:e.clientX,lt:performance.now(),vx:0,moved:false,id:e.pointerId,w:host.clientWidth||sw};
  try{host.setPointerCapture(e.pointerId)}catch(x){}});
 host.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moved&&Math.hypot(dx,dy)>8)drag.moved=true;
  const now=performance.now(),dt=Math.max(1,now-drag.lt);drag.vx=0.8*((e.clientX-drag.lx)/dt)+0.2*drag.vx;drag.lx=e.clientX;drag.lt=now;
  if(drag.moved&&!RM()){P=drag.p0-dx/(drag.w*0.62);V=0;render(P);if(!hinted){hinted=true;host.classList.add('swiped')}}});
 const up=e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;const dx=e.clientX-d.x;
  if(!d.moved){const cur=KS[mod(Math.round(P),3)];
   if(d.hit===cur)enter();else if(d.hit){const n=KS.indexOf(d.hit),c=KS.indexOf(cur);let s=n-c;if(s===2)s=-1;if(s===-2)s=1;springTo(Math.round(P)+s)}else springTo(Math.round(P));return}
  if(RM()){if(Math.abs(dx)>40){hinted=true;host.classList.add('swiped');springTo(Math.round(d.p0)+(dx<0?1:-1))}return}
  const vel=-d.vx*1000/(d.w*0.62); // Positionen pro Sekunde
  let tg=Math.round(P+vel*0.2);const base=Math.round(d.p0);tg=Math.max(base-2,Math.min(base+2,tg));
  V=Math.max(-9,Math.min(9,vel));springTo(tg)};
 host.addEventListener('pointerup',up);host.addEventListener('pointercancel',e=>{if(drag){drag=null;springTo(Math.round(P))}});
 host.addEventListener('click',e=>{const b=e.target.closest('[data-hm]'),dt=e.target.closest('[data-hm-dot]');
  if(dt){const n=+dt.dataset.hmDot,cur=mod(Math.round(P),3);let d=n-cur;if(d===2)d=-1;if(d===-2)d=1;springTo(Math.round(P)+d);return}
  if(!b)return;if(b.dataset.hm==='enter')enter();if(b.dataset.hm==='profile'&&opts.onProfile)opts.onProfile()});
 host.addEventListener('keydown',e=>{if(!vis)return;if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);if(e.key==='Enter'&&!e.target.closest('button'))enter()});
}
function enter(){if(!vis)return;cancelAnimationFrame(anim);anim=0;const k=KS[mod(Math.round(P),3)];P=mod(Math.round(P),3);render(P,true);
 host.classList.add('leaving');vis=false;if(opts.onEnter)opts.onEnter(k);
 setTimeout(()=>{host.classList.remove('on','leaving');host.setAttribute('aria-hidden','true')},RM()?200:560)}
window.HMHome={
 mount(el,o){host=el;opts=o||{};build();bind();P=Math.max(0,KS.indexOf(o.kat||'bier'));addEventListener('resize',()=>{if(vis)resize()});},
 show(k,info){if(!host)return;if(k&&KS.includes(k)){P=KS.indexOf(k)}
  if(info){(info.counts||[]).forEach((c,i)=>{const p=host.querySelector('#hmt'+i+' p');if(p)p.textContent=c});const im=host.querySelector('.hm-me img');if(im&&info.img)im.src=info.img}
  host.classList.remove('leaving');host.classList.add('on');host.removeAttribute('aria-hidden');vis=true;resize()},
 hide(){if(!host)return;cancelAnimationFrame(anim);anim=0;drag=null;vis=false;host.classList.remove('on','leaving');host.setAttribute('aria-hidden','true')},
 visible:()=>vis,
 state:()=>({p:P,v:V,kat:KS[mod(Math.round(P),3)],drag:!!drag,anim:!!anim}),
 render:p=>{render(p==null?P:p,true)},
 setP(p){cancelAnimationFrame(anim);anim=0;P=p;render(P,true)},
 pose:k=>L?pose(k,P):null,
 go,enter,KS};
})();
