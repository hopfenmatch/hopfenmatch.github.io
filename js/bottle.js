/* HopfenMatch – gezeichnete Flaschen, Dosen & Gläser (SVG) */
'use strict';
let _gid=0;
const GLASS={brown:['#3a1a06','#7a3f10','#b0631c'],green:['#0f2f14','#2e6a2a','#5c9a4a'],clear:['#8a8a7a','#d8d4c0','#f4f1e4']};
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=(n>>8)&255,b=n&255;const f=amt<0?0:255,p=Math.abs(amt);r=Math.round((f-r)*p+r);g=Math.round((f-g)*p+g);b=Math.round((f-b)*p+b);return '#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)}
function lumOf(h){const n=parseInt(String(h).slice(1),16);return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255}
/* Schrift im Akzentband: Etikettfarbe, außer der Kontrast reicht nicht */
function subInk(s){if(s.label===s.label2)return '#fff';const a=lumOf(s.label2);return Math.abs(lumOf(s.label)-a)>=0.3?s.label:(a>0.55?'#2a1a10':'#fff')}
/* Stil-Infos (Farbe, dunkel, Weizenglas) aus dem Katalog, sonst Grundwerte */
function styleInfo(st){const M=(typeof STYLE_META!=='undefined'&&STYLE_META[st])||{};
 return {col:M.c||STYLE_COLORS[st]||'#f0b733',dark:M.d!=null?!!M.d:['Stout','Schwarzbier','Doppelbock','Rauchbier','Dunkel'].includes(st),weizen:M.w!=null?!!M.w:['Weißbier','Weizenbock'].includes(st)}}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function labelText(t,cx,cy,w,ink,maxFs){
  const parts=t.split('-').length>1&&t.length>11?[t.split('-')[0]+'-',t.split('-').slice(1).join('-')]:(t.length>12&&t.includes(' ')?[t.slice(0,t.lastIndexOf(' ')),t.slice(t.lastIndexOf(' ')+1)]:[t]);
  const longest=Math.max(...parts.map(p=>p.length));
  const fs=Math.min(maxFs,w/(longest*0.6));
  const lh=fs*1.0, y0=cy-(parts.length-1)*lh/2+fs*0.35;
  return parts.map((p,i)=>`<text x="${cx}" y="${(y0+i*lh).toFixed(1)}" font-family="Lora,Georgia,serif" font-weight="700" font-size="${fs.toFixed(1)}" fill="${ink}" text-anchor="middle">${esc(p)}</text>`).join('');
}
/* Flasche in Box 40 x 150 (x 0..40) */
function bottleShape(s){
  const g=GLASS[s.glass]||GLASS.brown, id='g'+(++_gid);
  const sh=s.shape||'nrw';
  let body,neckTop,neckBot,shoulder,bodyTop,labelY,labelH,bottom=148,capH=7,neckW=6.2;
  if(sh==='longneck'){neckTop=6;neckBot=48;shoulder=74;labelY=92;labelH=40}
  else if(sh==='steinie'){neckTop=34;neckBot=56;shoulder=76;labelY=90;labelH=40;neckW=6.8}
  else if(sh==='swing'){neckTop=14;neckBot=44;shoulder=72;labelY=90;labelH=42;neckW=7}
  else {neckTop=8;neckBot=40;shoulder=70;labelY=88;labelH=44}
  const L=20-neckW,R=20+neckW, bw=sh==='steinie'?19:18;
  const p=`M${L},${neckTop} L${R},${neckTop} L${R},${neckBot} C${R},${neckBot+12} ${20+bw},${shoulder-12} ${20+bw},${shoulder} L${20+bw},${bottom-4} Q${20+bw},${bottom} ${16+bw},${bottom} L${24-bw},${bottom} Q${20-bw},${bottom} ${20-bw},${bottom-4} L${20-bw},${shoulder} C${20-bw},${shoulder-12} ${L},${neckBot+12} ${L},${neckBot} Z`;
  let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset=".22" stop-color="${g[1]}"/><stop offset=".34" stop-color="${g[2]}"/><stop offset=".46" stop-color="${g[1]}"/><stop offset=".85" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[0]}"/></linearGradient>
  <linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".3" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>`;
  o+=`<ellipse cx="20" cy="${bottom+1}" rx="${bw+2}" ry="2.2" fill="#000" opacity=".18"/>`;
  o+=`<path d="${p}" fill="url(#${id})"/>`;
  // Kronkorken / Bügel
  if(sh==='swing'){
    o+=`<rect x="${L-1}" y="${neckTop-8}" width="${2*neckW+2}" height="9" rx="3" fill="${s.cap}"/><rect x="${L-1}" y="${neckTop-2}" width="${2*neckW+2}" height="3" fill="#b2392b"/><path d="M${L-2},${neckTop+14} L${L-3},${neckTop-4} M${R+2},${neckTop+14} L${R+3},${neckTop-4}" stroke="#9aa0a6" stroke-width="1.3" fill="none"/>`;
  } else {
    o+=`<rect x="${L-0.8}" y="${neckTop-capH+1}" width="${2*neckW+1.6}" height="${capH}" rx="1.5" fill="${s.cap}"/><rect x="${L-0.8}" y="${neckTop-capH+1}" width="${2*neckW+1.6}" height="${capH}" rx="1.5" fill="url(#${id}l)"/>`;
  }
  // Halsetikett
  const ny=neckBot-6;
  o+=`<path d="M${L-0.5},${ny} L${R+0.5},${ny} L${R+3},${ny+11} L20,${ny+16} L${17-neckW+0},${ny+11} Z" fill="${s.neck}"/><path d="M${L+1},${ny+3} L${R-1},${ny+3}" stroke="${s.label2===s.neck?s.label:s.label2}" stroke-width=".8" opacity=".8"/>`;
  // Hauptetikett
  const lx=20-bw+0.4,lw=2*bw-0.8;
  o+=`<rect x="${lx}" y="${labelY}" width="${lw}" height="${labelH}" fill="${s.label}"/>`;
  o+=`<rect x="${lx+2}" y="${labelY+2}" width="${lw-4}" height="${labelH-4}" fill="none" stroke="${s.label2}" stroke-width="1.1"/>`;
  o+=`<rect x="${lx}" y="${labelY+labelH-9}" width="${lw}" height="7" fill="${s.label2}" opacity=".95"/>`;
  o+=`<text x="20" y="${labelY+labelH-3.8}" font-family="'Source Sans 3',Arial,sans-serif" font-weight="700" font-size="${Math.min(4.2,lw/(s.sub.length*0.62))}" fill="${subInk(s)}" text-anchor="middle" letter-spacing=".2">${esc(s.sub)}</text>`;
  o+=`<circle cx="20" cy="${labelY+9}" r="4.2" fill="${s.label2}"/><path d="M20,${labelY+5.8} l1,2 2.2,.3 -1.6,1.5 .4,2.2 -2,-1.1 -2,1.1 .4,-2.2 -1.6,-1.5 2.2,-.3z" fill="${s.label}"/>`;
  o+=labelText(s.text,20,labelY+(labelH-9)/2+5,lw-5,s.ink,9.5);
  o+=`<rect x="${lx}" y="${labelY}" width="${lw}" height="${labelH}" fill="url(#${id}l)"/>`;
  // Glanzlicht
  o+=`<path d="M${20-bw+4},${shoulder+2} L${20-bw+4},${bottom-6}" stroke="#fff" stroke-opacity=".28" stroke-width="2.2" stroke-linecap="round"/><path d="M${L+2},${neckTop+3} L${L+2},${neckBot-8}" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>`;
  return o;
}
function canShape(s){
  const id='c'+(++_gid);
  let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(s.label,-0.35)}"/><stop offset=".3" stop-color="${shade(s.label,0.25)}"/><stop offset=".5" stop-color="${s.label}"/><stop offset="1" stop-color="${shade(s.label,-0.4)}"/></linearGradient><linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#8d9397"/><stop offset=".35" stop-color="#eef1f2"/><stop offset="1" stop-color="#7c8286"/></linearGradient></defs>`;
  o+=`<ellipse cx="20" cy="149" rx="19" ry="2" fill="#000" opacity=".18"/>`;
  o+=`<path d="M4,62 Q4,56 8,54 L32,54 Q36,56 36,62 L36,140 Q36,147 30,148 L10,148 Q4,147 4,140 Z" fill="url(#${id})"/>`;
  o+=`<rect x="7" y="50" width="26" height="6" rx="2" fill="url(#${id}m)"/><rect x="5" y="143" width="30" height="5" rx="2" fill="url(#${id}m)"/>`;
  o+=labelText(s.text,20,96,28,s.ink,8.5);
  o+=`<text x="20" y="122" font-family="'Source Sans 3',Arial" font-weight="700" font-size="${Math.min(4.4,27/(s.sub.length*0.7)).toFixed(2)}" fill="${s.ink}" text-anchor="middle" letter-spacing=".6">${esc(s.sub)}</text>`;
  o+=`<path d="M10,62 L10,140" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/>`;
  return o;
}
/* Schriftzug auf dem Glas: muss auf der Bierfarbe lesbar sein */
function glassInk(s,col){if(lumOf(col)<0.3)return '#d9c08a';for(const c of [s.label2,s.ink,s.label]){if(c&&c!=='#ffffff'&&lumOf(c)<0.5)return shade(c,-0.1)}return '#5a3a10'}
/* Glas in Box 0..44 x 60..150 */
function glassShape(beer,s,dx){
  const si=styleInfo(beer.style), id='q'+(++_gid), col=si.col, dark=si.dark&&!si.weizen;
  const weizen=si.weizen;
  const foam=dark?'#e9d7bb':'#fdf5e3';
  let glass,liquid,top;
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
  const s=beer.svg;
  const body=s.shape==='can'?canShape(s):bottleShape(s);
  if(kind==='pair') return `<svg viewBox="-4 -4 96 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${body}${glassShape(beer,s,44)}</svg>`;
  return `<svg viewBox="-6 -4 52 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${body}</svg>`;
}
