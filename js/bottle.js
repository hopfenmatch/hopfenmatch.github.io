/* HopfenMatch – gezeichnete Flaschen, Dosen & Gläser (SVG)
   v1.10: eigene, generische Etikett-Layouts (8) mit echtem Brauerei- und Biernamen in neutraler Schrift,
   Markenfarben, Gebinde und Glasfarbe aus js/brands.js (sonst Stil-Fallback). Keine Logos/Schriftzüge. */
'use strict';
let _gid=0;
const GLASS={brown:['#3a1a06','#7a3f10','#b0631c'],green:['#0f2f14','#2e6a2a','#5c9a4a'],clear:['#8a8a7a','#d8d4c0','#f4f1e4']};
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=amt<0?0:255,p=Math.abs(amt);r=Math.round((f-r)*p+r);g=Math.round((f-g)*p+g);b=Math.round((f-b)*p+b);return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
function lumOf(h){const n=parseInt(String(h).slice(1),16);return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255}
/* lesbare Schrift auf Fläche bg: bevorzugt die Wunschfarben, sonst dunkel/hell */
function onCol(bg,...pref){const b=lumOf(bg);for(const c of pref)if(c&&Math.abs(lumOf(c)-b)>=0.36)return c;return b>0.55?'#1d1408':'#fbf6ea'}
function subInk(s){if(s.label===s.label2)return '#fff';const a=lumOf(s.label2);return Math.abs(lumOf(s.label)-a)>=0.3?s.label:(a>0.55?'#2a1a10':'#fff')}
function styleInfo(st){const M=(typeof STYLE_META!=='undefined'&&STYLE_META[st])||{};
 return {col:M.c||STYLE_COLORS[st]||'#f0b733',dark:M.d!=null?!!M.d:['Stout','Schwarzbier','Doppelbock','Rauchbier','Dunkel'].includes(st),weizen:M.w!=null?!!M.w:['Weißbier','Weizenbock'].includes(st)}}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
const SERIF='Lora,Georgia,serif',SANS="'Source Sans 3',Arial,sans-serif";
function split2(t){if(t.length<=11)return [t];const i=t.indexOf('-');if(i>2&&t.length-i>3)return [t.slice(0,i+1),t.slice(i+1)];
 const sp=[...t.matchAll(/ /g)].map(m=>m.index);if(!sp.length)return [t];let best=sp[0];for(const p of sp)if(Math.abs(p-t.length/2)<Math.abs(best-t.length/2))best=p;return [t.slice(0,best),t.slice(best+1)]}
function labelText(t,cx,cy,w,ink,maxFs){
  const parts=split2(String(t));const longest=Math.max(...parts.map(p=>p.length));
  const fs=Math.min(maxFs,w/(longest*0.6));const lh=fs*1.0, y0=cy-(parts.length-1)*lh/2+fs*0.35;
  return parts.map((p,i)=>`<text x="${cx}" y="${(y0+i*lh).toFixed(1)}" font-family="${SERIF}" font-weight="700" font-size="${fs.toFixed(1)}" fill="${ink}" text-anchor="middle">${esc(p)}</text>`).join('');
}
/* kleine Zeile in Sans (Brauerei, Stil) */
function smallText(t,cx,y,w,ink,maxFs,ls){t=String(t).toUpperCase();const fs=Math.min(maxFs,w/(t.length*0.64+0.01));
 return `<text x="${cx}" y="${y.toFixed(1)}" font-family="${SANS}" font-weight="700" font-size="${fs.toFixed(2)}" fill="${ink}" text-anchor="middle"${ls?` letter-spacing="${ls}"`:''}>${esc(t)}</text>`}
/* ---------- 8 eigene, generische Etikett-Layouts ---------- */
function drawLabel(s,lx,ly,lw,lh,can){
  const G=s.label,M=s.label2,A=s.acc||s.label2,I=s.ink,cx=lx+lw/2;
  const brw=s.brw||'',name=s.text,sub=s.sub||'';
  const lay=s.lay==null?-1:s.lay;let o='';
  const nameMax=can?11:8.2;
  if(lay===-1){ // bisheriges Etikett (Altdaten)
    o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${G}"/><rect x="${lx+2}" y="${ly+2}" width="${lw-4}" height="${lh-4}" fill="none" stroke="${M}" stroke-width="1.1"/><rect x="${lx}" y="${ly+lh-9}" width="${lw}" height="7" fill="${M}" opacity=".95"/>`;
    o+=smallText(sub,cx,ly+lh-3.8,lw-2,subInk(s),4.2,.2);
    o+=`<circle cx="${cx}" cy="${ly+9}" r="4.2" fill="${M}"/>`+labelText(name,cx,ly+(lh-9)/2+5,lw-5,I,9.5);return o}
  switch(lay){
  case 0: // Rahmen + Fußband
    o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${G}"/><rect x="${lx+1.8}" y="${ly+1.8}" width="${lw-3.6}" height="${lh-3.6}" fill="none" stroke="${M}" stroke-width="1"/><rect x="${lx+1.8}" y="${ly+lh-10}" width="${lw-3.6}" height="8.2" fill="${M}"/>`;
    o+=smallText(brw,cx,ly+7.6,lw-8,onCol(G,M,I),3.6,.3)+labelText(name,cx,ly+(lh-10)/2+4,lw-6,I,nameMax)+smallText(sub,cx,ly+lh-4.6,lw-6,onCol(M,G,A),3.8,.2);break;
  case 1: // breiter Kopfbalken
    {const h=lh*0.3;o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${G}"/><rect x="${lx}" y="${ly}" width="${lw}" height="${h}" fill="${M}"/><rect x="${lx}" y="${ly+h}" width="${lw}" height="1.3" fill="${A}"/>`;
    o+=smallText(brw,cx,ly+h/2+1.4,lw-5,onCol(M,G,A),4,.3)+labelText(name,cx,ly+h+(lh-h-7)/2+1,lw-5,I,nameMax)+smallText(sub,cx,ly+lh-3.2,lw-6,onCol(G,M,I),3.6,.2);}break;
  case 2: // Oval auf Vollfläche
    o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${M}"/><ellipse cx="${cx}" cy="${ly+lh*0.5}" rx="${lw*0.47}" ry="${lh*0.31}" fill="${G}" stroke="${A}" stroke-width="1"/>`;
    o+=smallText(brw,cx,ly+5.6,lw-5,onCol(M,G,A),3.6,.3)+labelText(name,cx,ly+lh*0.5,lw*0.8,onCol(G,I,M),nameMax*0.92)+smallText(sub,cx,ly+lh-2.6,lw-6,onCol(M,G,A),3.5,.2);break;
  case 3: // Schild mit abgeschrägten Ecken
    {const c=4;o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${G}"/><path d="M${lx+c+1},${ly+1.5} H${lx+lw-c-1} L${lx+lw-1.5},${ly+c+1} V${ly+lh-c-1} L${lx+lw-c-1},${ly+lh-1.5} H${lx+c+1} L${lx+1.5},${ly+lh-c-1} V${ly+c+1} Z" fill="none" stroke="${M}" stroke-width="1.6"/><rect x="${lx+6}" y="${ly+lh-11}" width="${lw-12}" height="6.4" rx="1" fill="${A}"/>`;
    o+=smallText(brw,cx,ly+8,lw-10,onCol(G,M,I),3.5,.3)+labelText(name,cx,ly+(lh-11)/2+4.5,lw-8,I,nameMax*0.95)+smallText(sub,cx,ly+lh-6.5,lw-14,onCol(A,G,I),3.4,.1);}break;
  case 4: // Seitenstreifen
    o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${G}"/><rect x="${lx}" y="${ly}" width="3.4" height="${lh}" fill="${M}"/><rect x="${lx+lw-3.4}" y="${ly}" width="3.4" height="${lh}" fill="${M}"/><rect x="${lx+4.4}" y="${ly}" width=".8" height="${lh}" fill="${A}"/><rect x="${lx+lw-5.2}" y="${ly}" width=".8" height="${lh}" fill="${A}"/>`;
    o+=smallText(brw,cx,ly+7,lw-12,onCol(G,M,I),3.4,.2)+`<rect x="${cx-5}" y="${ly+10}" width="10" height=".8" fill="${A}"/>`+labelText(name,cx,ly+lh/2+1.5,lw-12,I,nameMax*0.92)+smallText(sub,cx,ly+lh-4,lw-12,onCol(G,M,I),3.4,.1);break;
  case 5: // Querbalken in der Mitte
    {const h=lh*0.4,y=ly+lh*0.3;o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${G}"/><rect x="${lx}" y="${y}" width="${lw}" height="${h}" fill="${M}"/><rect x="${lx}" y="${y-1.6}" width="${lw}" height=".8" fill="${A}"/><rect x="${lx}" y="${y+h+.8}" width="${lw}" height=".8" fill="${A}"/>`;
    o+=smallText(brw,cx,ly+lh*0.3/2+2.2,lw-5,onCol(G,M,I),3.8,.3)+labelText(name,cx,y+h/2,lw-5,onCol(M,G,A),nameMax)+smallText(sub,cx,y+h+(lh*0.3)/2+2.6,lw-6,onCol(G,I,M),3.5,.2);}break;
  case 6: // Medaillon mit Initiale
    {const r=Math.min(6.5,lh*0.16),my=ly+r+3;o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${G}"/><rect x="${lx}" y="${ly+lh-2.4}" width="${lw}" height="2.4" fill="${M}"/><circle cx="${cx}" cy="${my}" r="${r}" fill="${M}" stroke="${A}" stroke-width=".9"/>`;
    o+=`<text x="${cx}" y="${(my+r*0.42).toFixed(1)}" font-family="${SERIF}" font-weight="700" font-size="${(r*1.2).toFixed(1)}" fill="${onCol(M,G,A)}" text-anchor="middle">${esc((brw||name).trim()[0]||'')}</text>`;
    o+=labelText(name,cx,my+r+(lh-r*2-10)/2+1.5,lw-5,I,nameMax*0.9)+smallText(brw?sub+' · '+brw:sub,cx,ly+lh-5,lw-4,onCol(G,M,I),3.2,.1);}break;
  default: // 7: Bogenfeld
    {const t=ly+7;o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${M}"/><path d="M${lx+2},${ly+lh-9} V${t+4} Q${cx},${ly-1} ${lx+lw-2},${t+4} V${ly+lh-9} Z" fill="${G}"/><rect x="${lx}" y="${ly+lh-9}" width="${lw}" height="1" fill="${A}"/>`;
    o+=smallText(brw,cx,t+5,lw-10,onCol(G,M,I),3.4,.3)+labelText(name,cx,ly+(lh-9)/2+5.5,lw-7,I,nameMax*0.95)+smallText(sub,cx,ly+lh-3,lw-6,onCol(M,G,A),3.6,.2);}
  }
  return o;
}
/* Flaschenformen in Box 40 x 150 (x 0..40) */
const SHAPES={ // neckTop,neckBot,shoulder,bw,neckW,labelY,labelH,curv
 nrw:[8,40,70,18,6.2,88,44,12], longneck:[6,48,74,18,6.2,92,40,12], steinie:[34,56,76,19,6.8,90,40,12], swing:[14,44,72,18,7,90,42,12],
 euro:[22,42,68,19,6.4,85,46,19], vichy:[28,44,64,19.5,6.8,82,48,17], ale:[12,34,82,17.5,6.4,94,40,20]};
function bottleShape(s){
  const g=GLASS[s.glass]||GLASS.brown, id='g'+(++_gid);
  const sh=SHAPES[s.shape]?s.shape:'nrw';
  const [neckTop,neckBot,shoulder,bw,neckW,labelY,labelH,cv]=SHAPES[sh];const bottom=148,capH=7;
  const L=20-neckW,R=20+neckW;
  const p=`M${L},${neckTop} L${R},${neckTop} L${R},${neckBot} C${R},${neckBot+cv} ${20+bw},${shoulder-cv} ${20+bw},${shoulder} L${20+bw},${bottom-4} Q${20+bw},${bottom} ${16+bw},${bottom} L${24-bw},${bottom} Q${20-bw},${bottom} ${20-bw},${bottom-4} L${20-bw},${shoulder} C${20-bw},${shoulder-cv} ${L},${neckBot+cv} ${L},${neckBot} Z`;
  let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset=".22" stop-color="${g[1]}"/><stop offset=".34" stop-color="${g[2]}"/><stop offset=".46" stop-color="${g[1]}"/><stop offset=".85" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[0]}"/></linearGradient>
  <linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".3" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>`;
  o+=`<ellipse cx="20" cy="${bottom+1}" rx="${bw+2}" ry="2.2" fill="#000" opacity=".18"/><path d="${p}" fill="url(#${id})"/>`;
  if(sh==='swing'){
    o+=`<rect x="${L-1}" y="${neckTop-8}" width="${2*neckW+2}" height="9" rx="3" fill="${s.lay==null?s.cap:'#efece4'}"/><rect x="${L-1}" y="${neckTop-2}" width="${2*neckW+2}" height="3" fill="#b2392b"/><path d="M${L-2},${neckTop+14} L${L-3},${neckTop-4} M${R+2},${neckTop+14} L${R+3},${neckTop-4}" stroke="#9aa0a6" stroke-width="1.3" fill="none"/>`;
  } else {
    o+=`<rect x="${L-0.8}" y="${neckTop-capH+1}" width="${2*neckW+1.6}" height="${capH}" rx="1.5" fill="${s.cap}"/><rect x="${L-0.8}" y="${neckTop-capH+1}" width="${2*neckW+1.6}" height="${capH}" rx="1.5" fill="url(#${id}l)"/>`;
  }
  // Halsetikett (eigene, schlichte Banderole)
  const ny=neckBot-(sh==='vichy'||sh==='euro'?9:7),nh=sh==='steinie'||sh==='vichy'?8:10;
  if(s.lay==null){o+=`<path d="M${L-0.5},${ny+1} L${R+0.5},${ny+1} L${R+3},${ny+12} L20,${ny+17} L${17-neckW},${ny+12} Z" fill="${s.neck}"/>`}
  else{o+=`<rect x="${L-0.4}" y="${ny}" width="${2*neckW+0.8}" height="${nh}" fill="${s.neck}"/><rect x="${L-0.4}" y="${ny+nh-2.2}" width="${2*neckW+0.8}" height="1" fill="${s.acc||s.label}"/><rect x="${L-0.4}" y="${ny}" width="${2*neckW+0.8}" height="${nh}" fill="url(#${id}l)"/>`}
  const lx=20-bw+0.4,lw=2*bw-0.8;
  o+=drawLabel(s,lx,labelY,lw,labelH);
  o+=`<rect x="${lx}" y="${labelY}" width="${lw}" height="${labelH}" fill="url(#${id}l)"/>`;
  o+=`<path d="M${20-bw+4},${shoulder+2} L${20-bw+4},${bottom-6}" stroke="#fff" stroke-opacity=".28" stroke-width="2.2" stroke-linecap="round"/><path d="M${L+2},${neckTop+3} L${L+2},${neckBot-8}" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>`;
  return o;
}
function canShape(s){
  const id='c'+(++_gid),body=s.lay==null?s.label:(s.canc||s.label);
  const top=s.lay==null?54:34;
  let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(body,-0.35)}"/><stop offset=".3" stop-color="${shade(body,0.25)}"/><stop offset=".5" stop-color="${body}"/><stop offset="1" stop-color="${shade(body,-0.4)}"/></linearGradient><linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#8d9397"/><stop offset=".35" stop-color="#eef1f2"/><stop offset="1" stop-color="#7c8286"/></linearGradient>
  <linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".3" stop-color="#fff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient></defs>`;
  o+=`<ellipse cx="20" cy="149" rx="19" ry="2" fill="#000" opacity=".18"/>`;
  o+=`<path d="M4,${top+8} Q4,${top+2} 8,${top} L32,${top} Q36,${top+2} 36,${top+8} L36,140 Q36,147 30,148 L10,148 Q4,147 4,140 Z" fill="url(#${id})"/>`;
  o+=`<rect x="7" y="${top-4}" width="26" height="6" rx="2" fill="url(#${id}m)"/><rect x="5" y="143" width="30" height="5" rx="2" fill="url(#${id}m)"/>`;
  if(s.lay==null){
    o+=labelText(s.text,20,96,28,s.ink,8.5);
    o+=`<text x="20" y="122" font-family="${SANS}" font-weight="700" font-size="${Math.min(4.4,27/(s.sub.length*0.7)).toFixed(2)}" fill="${s.ink}" text-anchor="middle" letter-spacing=".6">${esc(s.sub)}</text>`;
  } else {
    o+=`<g>`+drawLabel(s,4.6,top+16,30.8,92,1)+`</g><rect x="4.6" y="${top+16}" width="30.8" height="92" fill="url(#${id}l)"/>`;
  }
  o+=`<path d="M10,${top+8} L10,140" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/>`;
  return o;
}
/* Schriftzug auf dem Glas: muss auf der Bierfarbe lesbar sein */
function glassInk(s,col){if(lumOf(col)<0.3)return '#d9c08a';for(const c of [s.label2,s.ink,s.label]){if(c&&c!=='#ffffff'&&lumOf(c)<0.5)return shade(c,-0.1)}return '#5a3a10'}
/* Glas in Box 0..44 x 60..150 */
function glassShape(beer,s,dx){
  const si=styleInfo(beer.style), id='q'+(++_gid), col=si.col, dark=si.dark&&!si.weizen;
  const weizen=si.weizen;
  const foam=dark?'#e9d7bb':'#fdf5e3';
  let glass,top;
  if(weizen){glass=`M${dx+6},64 C${dx+4},86 ${dx+10},98 ${dx+11},112 C${dx+12},126 ${dx+9},136 ${dx+11},148 L${dx+33},148 C${dx+35},136 ${dx+32},126 ${dx+33},112 C${dx+34},98 ${dx+40},86 ${dx+38},64 Z`;top=64}
  else if(dark){glass=`M${dx+4},70 L${dx+40},70 L${dx+38.5},88 L${dx+40},92 L${dx+35},148 L${dx+9},148 L${dx+4},92 L${dx+5.5},88 Z`;top=70}
  else {glass=`M${dx+5},72 L${dx+39},72 L${dx+35},148 L${dx+9},148 Z`;top=72}
  let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(col,-0.35)}"/><stop offset=".3" stop-color="${shade(col,dark?0.08:0.25)}"/><stop offset=".55" stop-color="${col}"/><stop offset="1" stop-color="${shade(col,-0.3)}"/></linearGradient><clipPath id="${id}c"><path d="${glass}"/></clipPath></defs>`;
  o+=`<ellipse cx="${dx+22}" cy="149" rx="16" ry="2" fill="#000" opacity=".16"/>`;
  o+=`<g clip-path="url(#${id}c)"><rect x="${dx}" y="${top}" width="44" height="90" fill="url(#${id})"/><rect x="${dx}" y="${top-2}" width="44" height="${dark?12:13}" fill="${foam}"/>`;
  if(!dark)for(let i=0;i<9;i++){o+=`<circle cx="${dx+10+((i*37)%24)}" cy="${top+22+((i*53)%60)}" r=".7" fill="#fff" opacity=".7"/>`}
  o+=`<rect x="${dx+8}" y="${top+4}" width="3" height="80" fill="#fff" opacity=".22"/></g>`;
  o+=`<path d="M${dx+3},${top+3} Q${dx+10},${top-6} ${dx+22},${top-3} Q${dx+34},${top-7} ${dx+41},${top+3} L${dx+40},${top+6} L${dx+4},${top+6}Z" fill="${foam}" stroke="#e3d3b0" stroke-width=".5"/>`;
  o+=`<path d="${glass}" fill="none" stroke="#5a3a10" stroke-opacity=".18" stroke-width=".7"/>`;
  if(s){o+=labelText(s.text.split('-')[0].split(' ')[0],dx+22,top+44,26,glassInk(s,col),6)}
  return o;
}
function beerSVG(beer,kind){
  if(beer.kat==='wein'&&window.wineSVG)return wineSVG(beer,kind);
  if(beer.kat==='whisky'&&window.whiskySVG)return whiskySVG(beer,kind);
  const s=beer.svg;
  const body=s.shape==='can'?canShape(s):bottleShape(s);
  if(kind==='pair') return `<svg viewBox="-4 -4 96 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${body}${glassShape(beer,s,44)}</svg>`;
  return `<svg viewBox="-6 -4 52 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${body}</svg>`;
}
