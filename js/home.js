/* HopfenMatch 1.7.1 – Startseite: fotorealistische Nahansicht des Flaschenbauchs, Wisch-Morphing Bier ↔ Wein ↔ Whisky (WebGL). */
'use strict';
(function(){
const KS=['bier','wein','whisky'],NAME={bier:'Bier',wein:'Wein',whisky:'Whisky'};
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
/* Fotorealistische Flaschen (Studiofotos mit HopfenMatch-Etiketten) – Morphing in WebGL:
   Merkmals-Ausrichtung (Flaschenbreite + Etikettkanten wandern ineinander), weiche Wisch-Kante mit Rauschen,
   leichte Glas-Verzerrung und ein Softbox-Lichtstreif entlang der Übergangskante. Fallback: Canvas-2D-Überblendung. */
const IMW=720,IMH=1280; // Bildmaße in Merkmal-Einheiten (Originalfoto)
const F={bier:{cx:358,hw:242,lt:469,lb:1032,hs:165},wein:{cx:362,hw:244,lt:321,lb:1032,hs:158},whisky:{cx:363,hw:315,lt:371,lb:938,hs:178}};
const C={bier:{ui:'#fbf0dc',sub:'#e8cfa6',btn:'#e3a332',btnInk:'#24140a',bg:[.07,.05,.04]},
 wein:{ui:'#fbefe6',sub:'#e6c6c8',btn:'#f3e6cf',btnInk:'#5a1424',bg:[.12,.02,.04]},
 whisky:{ui:'#f6ead2',sub:'#d8c39a',btn:'#d8b864',btnInk:'#1a1208',bg:[.07,.045,.03]}};
const hex=h=>{const n=parseInt(h.slice(1),16);return [n>>16,(n>>8)&255,n&255]};
const CH={};KS.forEach(k=>{const o={};for(const x in C[k]){const v=C[k][x];o[x]=typeof v==='string'?hex(v):v}CH[k]=o});
const mixc=(a,b,t)=>'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')';
const lerp=(a,b,t)=>a+(b-a)*t;
let host,cv,gl=null,c2=null,prog,U={},TX={},IMG={},E={},P=0,V=0,anim=0,drag=null,opts={},vis=false,lastIdx=-1,hinted=false,DPR=2,CW=390,CHh=844;
const mod=(x,n)=>((x%n)+n)%n;
function weights(p){const q=mod(p,3),i=Math.floor(q),t=q-i;return {i,j:(i+1)%3,t}}
const VS='attribute vec2 p;varying vec2 vp;void main(){vp=p*.5+.5;vp.y=1.-vp.y;gl_Position=vec4(p,0.,1.);}';
const FS=`precision highp float;varying vec2 vp;uniform sampler2D ta,tb;uniform vec4 ma,mb;uniform vec2 res;uniform float e,dir,sh;uniform vec3 bga,bgb;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
vec3 smp(sampler2D t,vec4 m,vec2 q,vec3 bg){vec2 uv=vec2(q.x*m.x+m.y,q.y*m.z+m.w);vec3 c=texture2D(t,clamp(uv,0.,1.)).rgb;
 float o=max(max(-uv.y,uv.y-1.),max(-uv.x,uv.x-1.));return mix(c,bg,clamp(o*5.,0.,.85));}
void main(){vec2 q=vp*res;float s=sin(3.14159*e);
 float rip=s*(sin(q.y*.018+e*6.)*.5+n(q*.01+e*3.)-.5)*5.;
 vec3 A=smp(ta,ma,q+vec2(rip*dir,0.),bga),B=smp(tb,mb,q-vec2(rip*dir,0.),bgb);
 float f=(dir>0.?q.x/res.x:1.-q.x/res.x)+.12*(q.y/res.y-.5)+(n(q*.009+vec2(0.,e*2.))-.5)*.14;
 float edge=mix(1.2,-.2,e);float m=smoothstep(edge-.075,edge+.075,f);
 vec3 c=mix(A,B,m);
 float hl=exp(-pow((f-edge)/.055,2.))*s*.7;c=1.-(1.-c)*(1.-hl*vec3(1.,.9,.74));
 float y=q.y/res.y;c*=1.-.62*smoothstep(.62,1.,y);c*=1.-.35*smoothstep(.12,0.,y);
 float vx=abs(q.x/res.x-.5);c*=1.-.22*smoothstep(.3,.62,vx);
 gl_FragColor=vec4(c*sh,1.);}`;
function mk(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
function initGL(){try{gl=cv.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});if(!gl)return false;
 prog=gl.createProgram();gl.attachShader(prog,mk(gl.VERTEX_SHADER,VS));gl.attachShader(prog,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error('link');
 gl.useProgram(prog);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const l=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
 ['ta','tb','ma','mb','res','e','dir','sh','bga','bgb'].forEach(k=>U[k]=gl.getUniformLocation(prog,k));gl.uniform1i(U.ta,0);gl.uniform1i(U.tb,1);
 cv.addEventListener('webglcontextlost',ev=>{ev.preventDefault();gl=null;c2=cv.getContext('2d')});return true}catch(err){gl=null;return false}}
function upload(k){if(!gl||!IMG[k])return;const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,IMG[k]);TX[k]=t}
function build(){
 host.innerHTML=`<canvas class="hm-svg" aria-hidden="true"></canvas>
 <div class="hm-top"><div class="hm-wm">Hopfen<b>Match</b></div><button class="hm-me" data-hm="profile" aria-label="Profil"><img alt="" crossorigin="anonymous"></button></div>
 <div class="hm-hint" id="hmhint"><span>‹</span> Wischen <span>›</span></div>
 <div class="hm-bot"><div class="hm-titles">${KS.map((k,i)=>`<div class="hm-t" id="hmt${i}"><h1 class="sr">${NAME[k]}</h1><p></p></div>`).join('')}</div>
 <button class="hm-go" data-hm="enter"><span id="hmgo">Bier entdecken</span><svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
 <div class="hm-dots">${KS.map((k,i)=>`<button data-hm-dot="${i}" aria-label="${NAME[k]}"></button>`).join('')}<i id="hmpill"></i></div></div>`;
 cv=host.querySelector('canvas');if(!initGL())c2=cv.getContext('2d',{alpha:false});
 E.hmgo=host.querySelector('#hmgo');E.hmpill=host.querySelector('#hmpill');for(let i=0;i<3;i++)E['t'+i]=host.querySelector('#hmt'+i);
 const first=KS.indexOf(opts.kat||'bier');[0,1,2].map(d=>KS[(first+d)%3]).forEach(k=>{const im=new Image();im.decoding='async';im.onload=()=>{IMG[k]=im;upload(k);lastP=null;render(P)};im.src='img/home_'+k+'.webp'});
}
function resize(){if(!host)return;const r=host.getBoundingClientRect();if(!r.width)return;
 DPR=Math.min(window.devicePixelRatio||1,3);CW=r.width;CHh=r.height;cv.width=Math.round(CW*DPR);cv.height=Math.round(CHh*DPR);if(gl)gl.viewport(0,0,cv.width,cv.height);lastP=null}
/* Ruhelage je Kategorie in Bildschirmkoordinaten (CSS-Pixel) */
function rest(k){const f=F[k],s=Math.min(f.hs*(CW/390)/f.hw,0.47*CHh/(f.lb-f.lt)),Yc=CHh*0.44,lc=(f.lt+f.lb)/2;return {s,X:CW/2,hw:f.hw*s,lt:Yc+(f.lt-lc)*s,lb:Yc+(f.lb-lc)*s,Yc,lc}}
/* Abbildung Bildschirm → Textur bei Zwischenstand (hw,lt,lb) */
function mapFor(k,hw,lt,lb){const R=rest(k),f=F[k];const kx=R.hw/hw,ky=(R.lb-R.lt)/(lb-lt);
 // xr = X+(x-X)*kx ; u=(cx+(xr-X)/s)/IMW
 const au=kx/(R.s*IMW),bu=(f.cx-(CW/2)*kx/R.s)/IMW;
 // yr = R.lt+(y-lt)*ky ; v=(lc+(yr-Yc)/s)/IMH
 const av=ky/(R.s*IMH),bv=(R.lc+(R.lt-lt*ky-R.Yc)/R.s)/IMH;return [au,bu,av,bv]}
let lastP=null,shade=1;
function render(p){
 if(p===lastP||!cv)return;lastP=p;
 const {i,j,t}=weights(p),a=KS[i],b=KS[j],e=t*t*(3-2*t);
 const RA=rest(a),RB=rest(b),hw=lerp(RA.hw,RB.hw,e),lt=lerp(RA.lt,RB.lt,e),lb=lerp(RA.lb,RB.lb,e);
 const ca=CH[a],cb=CH[b];
 GP={a,b,e,hw,lt,lb,ca,cb};again=2;if(!graf)graf=requestAnimationFrame(draw);
 uiUpd(p,i,j,t,e,ca,cb)}
let GP=null,graf=0,again=0;
/* WebKit zeigt einen WebGL-Frame teils erst mit dem nächsten Zeichnen an – daher einmal nachzeichnen */
function draw(){graf=0;if(!GP)return;if(--again>0)graf=requestAnimationFrame(draw);const {a,b,e,hw,lt,lb,ca,cb}=GP;
 if(gl&&!(TX[a]&&TX[b])){const g=TX[a]?cb.bg:ca.bg;gl.clearColor(g[0],g[1],g[2],1);gl.clear(gl.COLOR_BUFFER_BIT);if(TX[a]||TX[b])lastP=null}
 if(gl&&TX[a]&&TX[b]){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,TX[a]);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,TX[b]);
  gl.uniform4fv(U.ma,mapFor(a,hw,lt,lb));gl.uniform4fv(U.mb,mapFor(b,hw,lt,lb));gl.uniform2f(U.res,CW,CHh);gl.uniform1f(U.e,e);gl.uniform1f(U.dir,1);gl.uniform1f(U.sh,shade);
  gl.uniform3fv(U.bga,ca.bg);gl.uniform3fv(U.bgb,cb.bg);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
 else if(c2){const x=c2;x.setTransform(DPR,0,0,DPR,0,0);x.fillStyle=mixc(ca.bg.map(v=>v*255),cb.bg.map(v=>v*255),e);x.fillRect(0,0,CW,CHh);
  [[a,1-e],[b,e]].forEach(([k,al])=>{const R=rest(k);if(!IMG[k]||al<=0)return;x.globalAlpha=al;x.drawImage(IMG[k],R.X-F[k].cx*R.s,R.Yc-R.lc*R.s,IMW*R.s,IMH*R.s)});x.globalAlpha=1;
  const g=x.createLinearGradient(0,CHh*.62,0,CHh);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.62)');x.fillStyle=g;x.fillRect(0,CHh*.62,CW,CHh*.38)}
 }
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
 const step=now=>{let dt=Math.min(0.25,(now-last)/1000);last=now;const k=170,c=2*Math.sqrt(k)*0.92;
  while(dt>0){const h=Math.min(dt,1/120);V+=(-k*(P-target)-c*V)*h;P+=V*h;dt-=h}
  if(Math.abs(P-target)<0.0005&&Math.abs(V)<0.002){P=target;V=0;anim=0;render(P);settle();return}
  render(P);anim=requestAnimationFrame(step)};
 anim=requestAnimationFrame(step)}
function settle(){P=mod(Math.round(P),3);target=P;lastP=null;render(P);if(opts.onChange)opts.onChange(KS[P])}
function fadeSwap(fn){cv.style.transition='opacity .18s';cv.style.opacity='0';host.classList.add('rmfade');setTimeout(()=>{fn();cv.style.opacity='1';host.classList.remove('rmfade')},180)}
function go(dirn){springTo(Math.round(P)+dirn)}
function bind(){
 const sw=host.clientWidth||390;
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
 mount(el,o){host=el;opts=o||{};build();bind();P=Math.max(0,KS.indexOf(o.kat||'bier'));addEventListener('resize',()=>{if(vis)resize()});},
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
