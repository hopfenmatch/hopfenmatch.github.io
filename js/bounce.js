/* HopfenMatch – Gummiband-Effekt („Bounce“) am Listenende in allen Browsern.
   WebKit (iPhone/iPad – Safari, Chrome, Firefox – und Safari auf dem Mac) federt nativ: dort tun wir nichts.
   Alle anderen (Android-Chrome, Samsung Internet, Firefox, Desktop-Chrome/Edge/Firefox) bekommen eine eigene
   JS-Federung für Touch und Mausrad/Trackpad; Overscroll-Glow und Pull-to-Refresh werden per CSS unterdrückt.
   Nie doppelt: entweder nativ oder JS. Test-Override: ?bounce=js | native | off */
'use strict';
(function(){
 const SEL='.tabview,.pbody,.sheet-body';
 const q=(location.search.match(/[?&]bounce=(js|native|off)/)||[])[1];
 const isWebKit=/^Apple/.test(navigator.vendor||'')&&!/Chrome|Chromium|Edg\//.test(navigator.userAgent.replace(/CriOS/,''))||/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
 const mode=q||(isWebKit?'native':'js');
 const root=document.documentElement;
 root.classList.add('bounce-'+mode);
 window.HMBounce={mode};
 if(mode!=='js')return;

 const MAXF=0.22;                       // max. Auslenkung relativ zur Höhe
 const band=(x,h)=>{const d=h*MAXF;return Math.sign(x)*d*(1-1/(Math.abs(x)/d*0.55+1))}; // Gummiband-Kurve wie iOS
 const atTop=el=>el.scrollTop<=0;
 const atBottom=el=>el.scrollTop+el.clientHeight>=el.scrollHeight-1;
 function set(el,off,anim){
  el._ob=off;
  el.classList.toggle('ob-anim',!!anim);
  el.style.setProperty('--ob',off.toFixed(1)+'px');
  el.classList.toggle('ob-on',off!==0||!!anim);
  if(anim){clearTimeout(el._obT);el._obT=setTimeout(()=>{if(!el._ob)el.classList.remove('ob-on','ob-anim')},420)}
 }
 const release=el=>{if(el&&el._ob)set(el,0,true)};
 const skip=t=>t.closest('input[type=range],.hscroll,.filters,textarea,select,.grab,.sheet-hd');

 /* ---- Touch ---- */
 let T=null;
 document.addEventListener('touchstart',e=>{
  if(e.touches.length!==1)return;const t=e.target;if(!(t instanceof Element)||skip(t)){T=null;return}
  const el=t.closest(SEL);if(!el){T=null;return}
  if(el._ob)set(el,el._ob,false);
  T={el,y:e.touches[0].clientY,x:e.touches[0].clientX,base:null,dir:0,raw:0,lock:null};
 },{passive:true,capture:true});
 document.addEventListener('touchmove',e=>{
  if(!T||e.touches.length!==1)return;const el=T.el,p=e.touches[0];
  const dy=p.clientY-T.y,dx=p.clientX-T.x;
  if(T.lock==null){if(Math.abs(dx)<6&&Math.abs(dy)<6)return;T.lock=Math.abs(dy)>=Math.abs(dx)?'v':'h'}
  if(T.lock!=='v')return;
  if(T.base==null){
   // Einstieg in die Federung erst, wenn der Rand erreicht ist
   if(dy>0&&atTop(el))T.dir=1;else if(dy<0&&atBottom(el))T.dir=-1;else return;
   T.base=p.clientY;if(e.cancelable)e.preventDefault();return;
  }
  const raw=p.clientY-T.base;
  if(raw*T.dir<=0){if(el._ob)set(el,0,false);T.base=null;return} // zurück in normales Scrollen
  if(e.cancelable)e.preventDefault();
  set(el,band(raw,el.clientHeight),false);
 },{passive:false,capture:true});
 const end=()=>{if(T)release(T.el);T=null};
 document.addEventListener('touchend',end,{passive:true,capture:true});
 document.addEventListener('touchcancel',end,{passive:true,capture:true});

 /* ---- Mausrad / Trackpad ---- */
 document.addEventListener('wheel',e=>{
  if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  const t=e.target;if(!(t instanceof Element)||skip(t))return;
  const el=t.closest(SEL);if(!el)return;
  const dy=e.deltaMode===1?e.deltaY*16:e.deltaMode===2?e.deltaY*el.clientHeight:e.deltaY;
  let raw=el._obRaw||0;
  if(raw===0){
   if(!((dy<0&&atTop(el))||(dy>0&&atBottom(el))))return; // es gibt noch etwas zu scrollen
  }
  // Mausrad-Rasten (große Sprünge) dämpfen, Trackpad-Deltas direkt
  const step=Math.abs(dy)>=50?Math.sign(dy)*45:dy;
  const nr=raw-step;
  if(raw!==0&&nr*raw<=0){el._obRaw=0;set(el,0,false);e.preventDefault();return}
  el._obRaw=Math.max(-el.clientHeight,Math.min(el.clientHeight,nr));
  e.preventDefault();
  set(el,band(el._obRaw,el.clientHeight),false);
  clearTimeout(el._obW);el._obW=setTimeout(()=>{el._obRaw=0;release(el)},140);
 },{passive:false,capture:true});
})();
