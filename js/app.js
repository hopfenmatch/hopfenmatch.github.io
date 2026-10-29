/* HopfenMatch – App-Logik */
'use strict';
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
/* ---------- Icons ---------- */
const IC={
 bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 9H3c0-1 3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
 home:'<path class="f" d="M3.5 10.2 12 3.3l8.5 6.9V20a1 1 0 0 1-1 1H15v-6.2H9V21H4.5a1 1 0 0 1-1-1z"/>',
 chart:'<rect class="f" x="4" y="11" width="4" height="9" rx="1"/><rect class="f" x="10" y="5" width="4" height="15" rx="1"/><rect class="f" x="16" y="9" width="4" height="11" rx="1"/>',
 users:'<circle class="f" cx="9" cy="8" r="3.6"/><path class="f" d="M2.5 19.5c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6v.5h-13z"/><circle class="f" cx="17" cy="9" r="2.8"/><path class="f" d="M16.4 13.6c3 0 5.6 2 5.6 5.4v1h-5c0-2.6-.3-4.6-1.8-6.2.4-.1.8-.2 1.2-.2z"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 heart:'<path d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8 2.9c0 6.1-8 11-8 11z"/>',
 heartf:'<path class="f" d="M12 20.5s-8-4.9-8-11A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8 2.9c0 6.1-8 11-8 11z"/>',
 chev:'<path d="m9 6 6 6-6 6"/>',
 back:'<path d="m15 5-7 7 7 7"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 edit:'<path class="f" d="M4 17.2V20h2.8l9.6-9.6-2.8-2.8zM18.7 8.1a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0l-1.2 1.2 2.8 2.8z"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 house:'<path class="f" d="M3.5 11 12 4l8.5 7v9h-6v-5.5h-5V20h-6z"/>',
 people:'<circle class="f" cx="9" cy="8.5" r="3.3"/><path class="f" d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5z"/><circle class="f" cx="16.5" cy="9.3" r="2.6"/><path class="f" d="M16.2 13.8c2.8 0 5 1.9 5 5.2h-4.6c0-2-.6-3.8-1.7-5.1z"/>',
 userplus:'<circle class="f" cx="9.5" cy="8" r="3.8"/><path class="f" d="M2.5 20c0-3.900 3.1-6.5 7-6.5s7 2.6 7 6.5z"/><path d="M19 8v6M16 11h6" stroke-width="2.2"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 share:'<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
 trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
 star:'<path class="f" d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/>',
 crown:'<path class="f" d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5z"/>',
 trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3M8 21h8M9.5 17h5l.5 4h-6z"/>',
 spark:'<path class="f" d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/>',
 beer:'<path d="M5 8h10v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M15 10h2.5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H15"/><path d="M5 8a2.5 2.5 0 0 1 3-3 3 3 0 0 1 5 0 2.5 2.5 0 0 1 2 3"/>',
 pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 refresh:'<path d="M20 11a8 8 0 0 0-14.7-4.3L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.7 4.3l1.3-1.8M20 20v-4.5h-4.5"/>',
 phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
 mail:'<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
 msg:'<path class="f" d="M12 3C6.5 3 2.5 6.6 2.5 11c0 2.4 1.2 4.6 3.2 6l-.9 3.7 4.1-2.1c1 .3 2 .4 3.1.4 5.5 0 9.5-3.6 9.5-8S17.5 3 12 3z"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 logout:'<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="m9 16-4-4 4-4M5 12h11"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
 eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 sig:'<rect class="f" x="1" y="9" width="3" height="4" rx=".8"/><rect class="f" x="6" y="6.5" width="3" height="6.5" rx=".8"/><rect class="f" x="11" y="4" width="3" height="9" rx=".8"/><rect class="f" x="16" y="1" width="3" height="12" rx=".8"/>',
 wifi:'<path class="f" d="M9 12.6a1.6 1.6 0 1 1 0 .01zM4.6 8.6a6.3 6.3 0 0 1 8.8 0l-1.3 1.3a4.5 4.5 0 0 0-6.2 0zM1.7 5.7a10.4 10.4 0 0 1 14.6 0L15 7a8.6 8.6 0 0 0-12 0z"/>'
};
const ic=(n,cls='')=>`<svg class="i ${cls}" viewBox="0 0 24 24">${IC[n].replace(/class="f"/g,'class="f" fill="currentColor" stroke="none"')}</svg>`;
const STAR='<svg viewBox="0 0 24 24"><path fill="currentColor" d="m12 2.3 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.2l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';

/* ---------- Zustand ---------- */
const LS='hopfenmatch.v1';
let S;
function uid(){return Math.random().toString(36).slice(2,9)}
/* Leerer Startzustand (v1.3: alles auf null – keine Beispieldaten mehr) */
function emptyState(){return {v:2,ratings:[],checkins:[],tastings:[],customBeers:[],events:[],notifs:[],likes:{},favs:{},settings:(S&&S.settings)||{push:true,sounds:true},owner:(S&&S.owner)||''}}
function seed(noSave){S=emptyState();if(!noSave)save()}
/* Daten-Epoche: wird bei einem Neustart der Daten hochgezählt. Ältere lokale Zwischenspeicher werden dann verworfen,
   damit alte Geräte keine alten Bewertungen erneut hochladen. */
const DATA_EPOCH=2, LS_EPOCH='hopfenmatch.epoch';
function wipeLocal(ep){
 S=emptyState();try{localStorage.setItem(LS,JSON.stringify(S));localStorage.setItem(LS_EPOCH,String(ep))}catch(e){}
 if(typeof SY!=='undefined'){SY.rev=null;SY.snap={};SY.epoch=ep;saveSync()}
}
function load(){
 let ep=null;try{ep=localStorage.getItem(LS_EPOCH)}catch(e){}
 if(!(+ep>=DATA_EPOCH)){wipeLocal(DATA_EPOCH);return}
 try{S=JSON.parse(localStorage.getItem(LS));if(!S||S.v!==2)throw 0;save(true)}catch(e){S=emptyState();save(true)}
}
function save(fromSync){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}if(!fromSync&&typeof scheduleSync==='function')scheduleSync()}

/* ---------- Daten-Helfer ---------- */
/* v1.6: beliebig viele Nutzer. ME = eigene Nutzer-ID, Freunde + Namen/Bilder kommen vom Server (DIR, offline zwischengespeichert). */
let ME='';
const LS_USER='hopfenmatch.user', LS_DIR='hopfenmatch.dir';
const LOGGED=()=>{try{return !!ME&&localStorage.getItem(LS_USER)===ME}catch(e){return false}};
function setUser(u){ME=u;UC={}}
let DIR=(()=>{try{const o=JSON.parse(localStorage.getItem(LS_DIR));if(o&&o.users)return o}catch(e){}return {me:'',users:{},friends:[],incoming:[],outgoing:[],fv:''}})();
function saveDir(){try{localStorage.setItem(LS_DIR,JSON.stringify(DIR))}catch(e){}}
function setDir(d){const a=canon(DIR);DIR={me:d.me,users:d.users||{},friends:d.friends||[],incoming:d.incoming||[],outgoing:d.outgoing||[],fv:d.fv||''};UC={};saveDir();return canon(DIR)!==a}
// Freunde (bis zum ersten Server-Kontakt: Sascha und Martin kennen sich schon)
const FRIENDS=()=>DIR.me===ME?DIR.friends.filter(f=>f!==ME):(ME==='sascha'?['martin']:ME==='martin'?['sascha']:[]);
const isFriend=f=>FRIENDS().includes(f);
const FN=f=>U(f).name, FG=f=>{const n=U(f).name;return /[sßxz]$/i.test(n)?n+'’':n+'s'};
/* Profilbilder: eigenes Foto (Server), eingebaute Fotos von Sascha/Martin oder Initialen-Avatar in Bierfarben */
const BUILTIN_IMG={sascha:'img/sascha.jpg',martin:'img/martin.jpg'};
const BEERPAL=[['#f7cf5a','#d8921a'],['#f3b23a','#b8660f'],['#e08a3a','#9c4a16'],['#c4572e','#7c2a14'],['#8a4a22','#3b1a0b'],['#f2dc8a','#c9a227'],['#5a3420','#1e0f07'],['#e9b04a','#a86412']];
function initials(n){const w=String(n||'?').trim().split(/[\s._'-]+/).filter(Boolean);return ((w[0]||'?')[0]+(w.length>1?w[w.length-1][0]:(w[0]||'').slice(1,2))).toUpperCase()}
function initialsAvatar(seed,name){let h=0;for(const c of String(seed))h=(h*33+c.charCodeAt(0))>>>0;const [c1,c2]=BEERPAL[h%BEERPAL.length];const dark=(h%BEERPAL.length)===4||(h%BEERPAL.length)===6;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><path d="M0 0h100v22c-8 6-15 1-22 4s-12 8-20 4-12-6-19-2-12 5-18 1-10-4-21 0z" fill="#fffaf0" opacity=".93"/><circle cx="24" cy="70" r="2.6" fill="#fff" opacity=".35"/><circle cx="78" cy="58" r="2" fill="#fff" opacity=".35"/><circle cx="70" cy="80" r="3" fill="#fff" opacity=".28"/><text x="50" y="69" font-family="Georgia,'Times New Roman',serif" font-size="36" font-weight="700" text-anchor="middle" fill="${dark?'#f7d27a':'#fff'}" style="paint-order:stroke" stroke="rgba(90,40,10,.25)" stroke-width="1.5">${esc(initials(name))}</text></svg>`;
 return 'data:image/svg+xml,'+encodeURIComponent(svg)}
let UC={};
function U(id){if(UC[id])return UC[id];const d=(DIR.users||{})[id]||(USERS[id]?{id,name:USERS[id].name,av:0}:null);
 const name=d?d.name:(id?'Ehemaliges Mitglied':'?');
 const img=d&&d.av>0?API+'/avatar/'+id+'?v='+d.av:BUILTIN_IMG[id]||initialsAvatar(id||'x',name);
 return UC[id]={id,name,full:id==='sascha'&&name==='Sascha'?'Sascha Hammel':name,handle:'@'+name.toLowerCase().replace(/\s+/g,''),img,known:!!d}}
const myFavs=()=>{S.favs=S.favs||{};return S.favs[ME]=S.favs[ME]||[]};
const myLikes=()=>{S.likes=S.likes||{};return S.likes[ME]=S.likes[ME]||{}};
const myNotifs=()=>S.notifs.filter(n=>(n.to||'sascha')===ME);
/* ---------- Kategorien (v1.7): Bier, Wein, Whisky ----------
   Bier-Ids bleiben unverändert; Wein = wn-…, Whisky = wk-… (eigene Anlagen: c-… / wn-c-… / wk-c-…). Tastings: kat (fehlt = Bier). */
const KATS=['bier','wein','whisky'];
const WINES=(window.HM_WINE&&HM_WINE.items)||[],WHISKIES=(window.HM_WHISKY&&HM_WHISKY.items)||[];
const KD={
 bier:{items:BEERS,groups:STYLE_GROUPS,tags:TAGS,em:'🍺',w:{one:'Bier',many:'Biere',erst:'dein erstes Bier',neu:'Neues Bier',neuA:'Neues Bier',dies:'dieses Bier',dasselbe:'dasselbe Bier',das:'das',next:'Nächstes Bier',match:'Bier-Match',matches:'Bier-Matches',list:'Bier-Liste',katalog:'Bierkatalog',maker:'Brauerei',style:'Stil',styles:'Alle Stile',emo:'🍻',ph:'Bier, Brauerei, Stil oder Land',ueber:'Über das Bier',lieb:'Lieblingsbier',liebstil:'Lieblingsstil',hint:'Stöbere nach Stil und Land – von Kölsch bis Trappist.',tag:'GUTE BIERE. GUTE LEUTE.',nameph:'z. B. Unertl Weißbier',makerph:'z. B. Brauerei Unertl',abv:'5,0',prost:'Prost'}},
 wein:{items:WINES,groups:HM_WINE.groups,tags:['Trocken','Feinherb','Fruchtig','Mineralisch','Elegant','Frisch','Säurebetont','Vollmundig','Cremig','Samtig','Tanninreich','Holzfass','Würzig','Blumig','Zitrus','Steinobst','Beerig','Kirsche','Pflaume','Perlend','Süß','Komplex','Langer Abgang','Leicht','Kräftig','Harmonisch','Zum Essen'],em:'🍷',w:{one:'Wein',many:'Weine',erst:'deinen ersten Wein',neu:'Neuer Wein',neuA:'Neuen Wein',dies:'diesen Wein',dasselbe:'denselben Wein',das:'den',next:'Nächster Wein',match:'Wein-Match',matches:'Wein-Matches',list:'Weinliste',katalog:'Weinkatalog',maker:'Weingut',style:'Rebsorte',styles:'Alle Weinarten',emo:'🍷',ph:'Wein, Weingut, Rebsorte oder Region',ueber:'Über den Wein',lieb:'Lieblingswein',liebstil:'Lieblingsrebsorte',hint:'Stöbere nach Rebsorte, Land und Anbaugebiet – von der Mosel bis Mendoza.',tag:'GUTE WEINE. GUTE LEUTE.',nameph:'z. B. Silvaner trocken',makerph:'z. B. Weingut Müller',abv:'12,5',prost:'Zum Wohl'}},
 whisky:{items:WHISKIES,groups:HM_WHISKY.groups,tags:['Rauchig','Torfig','Mild','Weich','Süß','Vanille','Karamell','Honig','Fruchtig','Sherry','Trockenfrüchte','Würzig','Pfeffrig','Eiche','Malzig','Nussig','Schokoladig','Maritim','Salzig','Blumig','Zitrus','Kräftig','Komplex','Langer Abgang','Ölig','Fassstärke'],em:'🥃',w:{one:'Whisky',many:'Whiskys',erst:'deinen ersten Whisky',neu:'Neuer Whisky',neuA:'Neuen Whisky',dies:'diesen Whisky',dasselbe:'denselben Whisky',das:'den',next:'Nächster Whisky',match:'Whisky-Match',matches:'Whisky-Matches',list:'Whiskyliste',katalog:'Whiskykatalog',maker:'Brennerei',style:'Typ',styles:'Alle Typen',emo:'🥃',ph:'Whisky, Brennerei, Typ oder Region',ueber:'Über den Whisky',lieb:'Lieblingswhisky',liebstil:'Lieblingstyp',hint:'Stöbere nach Typ, Land und Region – von Islay bis Kentucky.',tag:'GUTER WHISKY. GUTE LEUTE.',nameph:'z. B. Single Cask 2014',makerph:'z. B. Brennerei Müller',abv:'46',prost:'Sláinte'}}};
let KAT=(()=>{try{const k=localStorage.getItem('hopfenmatch.kat');return KATS.includes(k)?k:'bier'}catch(e){return 'bier'}})();
let w=KD[KAT].w;
const katOf=id=>{id=String(id||'');return id.startsWith('wn-')?'wein':id.startsWith('wk-')?'whisky':'bier'};
const inK=id=>katOf(id)===KAT;
const wOf=id=>KD[katOf(id)].w;
const TSK=()=>S.tastings.filter(t=>(t.kat||'bier')===KAT);
let _AM=null,_AMc=null,_AMn=-1;
function allMap(){const c=S.customBeers;if(!_AM||_AMc!==c||_AMn!==c.length){_AM=new Map();KATS.forEach(k=>KD[k].items.forEach(b=>_AM.set(b.id,b)));c.forEach(b=>_AM.set(b.id,b));_AMc=c;_AMn=c.length}return _AM}
const beers=()=>KD[KAT].items.concat(S.customBeers.filter(b=>inK(b.id)));
const FALLBACK={bier:id=>({id,name:id,brewery:'',style:'Helles',abv:5,svg:{shape:'nrw',glass:'brown',label:'#f3ead2',label2:'#7a3f10',ink:'#3b1a0b',cap:'#c9a227',neck:'#7a3f10',text:'Bier',sub:'BIER'}}),
 wein:id=>({id,kat:'wein',name:id.slice(3),brewery:'',style:'Wein',grp:'weiss',abv:12,svg:{shape:'bur',glass:'gr',label:'#f6f1e4',accent:'#6b1d24',ink:'#2a1a10',liq:'#e8d88a',text:'Wein',sub:'WEIN',grp:'weiss'}}),
 whisky:id=>({id,kat:'whisky',name:id.slice(3),brewery:'',style:'Whisky',grp:'malt',abv:40,svg:{shape:'rd',glass:'cl',label:'#f4eedc',accent:'#1d1d1d',ink:'#1d1d1d',liq:'#c47f28',text:'Whisky',sub:'WHISKY',age:''}})};
const B=id=>allMap().get(id)||FALLBACK[katOf(id)](id);
function grpOf(b){return b.grp||(katOf(b.id)==='bier'?styleGroup(b.style):'')}
const TAGSK=()=>KD[KAT].tags;
function setKat(k,quiet){if(!KATS.includes(k))k='bier';const ch=k!==KAT;KAT=k;w=KD[k].w;try{localStorage.setItem('hopfenmatch.kat',k)}catch(e){}
 document.documentElement.classList.remove('k-bier','k-wein','k-whisky');document.documentElement.classList.add('k-'+k);
 if(ch){RFILTER='all';CAT.q='';CAT.g='';CAT.c='';CAT.r='';CAT.s='';const pl=$('#plus');if(pl)pl.setAttribute('aria-label',w.one+' bewerten')}
 if(ch&&!quiet)renderAll();return ch}
const rOf=(u,b)=>S.ratings.find(r=>r.user===u&&r.beer===b);
const rList=u=>S.ratings.filter(r=>r.user===u&&inK(r.beer)).sort((a,b)=>b.score-a.score||b.ts-a.ts);
// Match = du und ein Freund gebt beide über 90 Punkte
const both90=(b,f)=>{const a=rOf(ME,b),c=rOf(f,b);return !!(a&&c&&a.score>90&&c.score>90)};
const mFr=b=>FRIENDS().filter(f=>both90(b,f));
const isMatch=b=>mFr(b).length>0;
const matches=()=>rList(ME).filter(r=>isMatch(r.beer));
const matchesWith=f=>rList(ME).filter(r=>both90(r.beer,f));
// Biere, die Freunde über 90 lieben (pro Bier zusammengefasst, by = welche Freunde)
function friendLoved(f,pred){const m={};(f?[f]:FRIENDS()).forEach(u=>rList(u).forEach(r=>{if(r.score>90&&pred(rOf(ME,r.beer))){const x=m[r.beer];if(!x)m[r.beer]=Object.assign({},r,{by:[u]});else{x.by.push(u);if(r.score>x.score)Object.assign(x,r,{by:x.by})}}}));return Object.values(m).sort((a,b)=>b.score-a.score||b.ts-a.ts)}
const chances=f=>friendLoved(f,m=>!m);
const nearMatches=f=>friendLoved(f,m=>m&&m.score<=90&&m.score>=84);
const nameList=ids=>{const n=ids.map(x=>U(x).name);return n.length<=1?n.join(''):n.slice(0,-1).join(', ')+' und '+n[n.length-1]};
// Namen in Mitteilungen ({{u:ID}}) immer aktuell anzeigen
const ntext=t=>String(t||'').replace(/\{\{u:([a-z0-9]+)\}\}/g,(m,id)=>'<b>'+esc(U(id).name)+'</b>');
function starsHTML(score,size=17,gap=4){
 const v=Math.round(score/20*2)/2, w=Math.floor(v)*(size+gap)+(v%1?size/2:0);
 const row=STAR.repeat(5);
 return `<span class="stars" style="--ss:${size}px;--sg:${gap}px"><span class="s0">${row}</span><span class="s1" style="width:${w}px">${row}</span></span>`;
}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
/* Leerzustand-Karte */
function emptyCard(icon,title,text,btns,small){return `<div class="ecard ${small?'sm':''}"><span class="eic">${ic(icon)}</span><div class="etx"><b>${title}</b><p>${text}</p>${btns?`<div class="ebtns">${btns}</div>`:''}</div></div>`}
const PVK={wein:['wn-dr-loosen-riesling-kabinett-blauschiefer','wn-antinori-tignanello','wn-moet-chandon-brut-imperial'],whisky:['wk-laphroaig-10-years-old','wk-the-macallan-12-years-sherry-oak','wk-maker-s-mark']};
function tImg(t){const k=t&&t.kat;if(!k||!PVK[k])return '<div class="timg"></div>';
 const ids=(t.beers.length?t.beers:PVK[k]).slice(0,3);return `<div class="timg gen g-${k}"><span class="glow"></span><div class="tb n${ids.length}">${ids.length===1?thumb(B(ids[0]),'pair'):ids.map(id=>thumb(B(id))).join('')}</div></div>`}
function thumb(b,kind='bot'){
 b=typeof b==='string'?B(b):b;
 if(b.img){const src=b.img[kind]||b.img.bot;return `<img src="img/${src}.webp" alt="${esc(b.name)}" loading="lazy" draggable="false">`}
 return beerSVG(b,kind);
}
const av=(u,extra='')=>`<span class="av" ${extra}><img crossorigin="anonymous" src="${U(u).img}" alt="${esc(U(u).name)}" draggable="false"></span>`;
const fmtAbv=a=>(Math.round(a*10)/10).toString().replace('.',',')+' % vol';
function rel(ts){
 const d=Date.now()-ts, m=Math.round(d/60000);
 if(m<1)return 'gerade eben'; if(m<60)return `vor ${m} Minute${m===1?'':'n'}`;
 const h=Math.floor(m/60); if(h<24)return `vor ${h} Stunde${h===1?'':'n'}`;
 const dd=Math.floor(h/24); if(dd===1)return 'gestern'; if(dd<7)return `vor ${dd} Tagen`;
 if(dd<14)return 'vor 1 Woche'; if(dd<31)return `vor ${Math.floor(dd/7)} Wochen`;
 return new Date(ts).toLocaleDateString('de-DE',{day:'numeric',month:'short'});
}
const WD=['So','Mo','Di','Mi','Do','Fr','Sa'], MO=['Jan.','Feb.','März','Apr.','Mai','Juni','Juli','Aug.','Sep.','Okt.','Nov.','Dez.'];
const fmtDate=ts=>{const d=new Date(ts);return `${WD[d.getDay()]}, ${d.getDate()}. ${MO[d.getMonth()]} ${d.getFullYear()}`};
const fmtTime=ts=>{const d=new Date(ts);return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} Uhr`};
function verdict(s){return s>=95?'Weltklasse! 🏆':s>90?'Überragend – Match-Niveau':s>=85?'Richtig gut':s>=75?'Gut':s>=60?'Ganz okay':s>=40?'Eher nicht':'Nie wieder'}

/* Aktivitäten */
function activities(){
 const ev=[], ms={}, F=new Set([ME,...FRIENDS()]);
 rList(ME).forEach(a=>{if(a.score<=90)return;FRIENDS().forEach(f=>{const c=rOf(f,a.beer);if(c&&c.score>90){const later=a.ts>c.ts?a:c;ms[later.id]=true;ev.push({type:'match',beer:a.beer,f,ts:later.ts,by:later.user,key:'m-'+a.beer+'-'+f})}})});
 S.ratings.forEach(r=>{if(!ms[r.id]&&F.has(r.user)&&inK(r.beer))ev.push({type:'rate',user:r.user,beer:r.beer,score:r.score,comment:r.comment,ts:r.ts,key:'r-'+r.id})});
 S.checkins.forEach(c=>{if(F.has(c.user)&&inK(c.beer))ev.push({type:'drink',user:c.user,beer:c.beer,comment:c.comment,ts:c.ts,key:'c-'+c.id})});
 S.events.forEach(e=>{const t=e.tid&&S.tastings.find(x=>x.id===e.tid);if(t?(t.kat||'bier')===KAT:(F.has(e.user)&&(!e.beer||inK(e.beer))))ev.push(Object.assign({},e))});
 return ev.sort((a,b)=>b.ts-a.ts);
}
function actRow(e){
 const b=B(e.beer||'');
 if(e.type==='match'){
  return `<button class="card act match pressable" data-go="beer" data-id="${e.beer}">
   ${av(e.f)}<div class="tx"><div class="t1"><b>Du</b> und <b>${esc(FN(e.f))}</b> habt einen <b>${w.match}!</b> ${w.emo}</div><div class="t2">${rel(e.ts)}</div><div class="t3">Ihr mögt beide ${w.das} ${esc(b.name)}.</div></div>
   <div class="bt">${thumb(b)}</div><div class="rt"><div class="matchpill"><div class="mp">${av(e.f)}${av(ME)}${ic('heartf')}</div><small>${w.match}</small></div></div></button>`}
 if(e.type==='tasting'){
  const t=S.tastings.find(x=>x.id===e.tid); if(!t)return '';
  return `<button class="card act pressable" data-go="tasting" data-id="${t.id}">${av(e.user||ME)}<div class="tx"><div class="t1"><b>${e.user===ME?'Du':esc(U(e.user).name)}</b> ${e.user===ME?'hast':'hat'} ein Tasting geplant: <b>${esc(t.name)}</b></div><div class="t2">${rel(e.ts)}</div><div class="t3">${fmtDate(t.date)} · ${esc(t.place)}</div></div><div class="rt"><span class="circlebtn">${ic('cal')}</span></div></button>`}
 const who=e.user===ME?'Du':esc(U(e.user).name), liked=!!myLikes()[e.key];
 if(e.type==='drink'){
  return `<button class="card act pressable" data-go="beer" data-id="${e.beer}">${av(e.user)}<div class="tx"><div class="t1"><b>${who}</b> ${e.user===ME?'magst':'mag'} <b>${esc(b.short||b.name)}</b></div><div class="t2">${rel(e.ts)}</div><div class="t3">„${esc(e.comment)}“</div></div>
  <div class="bt">${thumb(b)}</div><div class="rt"><span class="circlebtn heart ${liked?'on':''}" data-like="${e.key}">${ic('heart')}</span></div></button>`}
 const cm=e.comment?esc(e.comment.replace(/[.!]?\s*$/,''))+'. '+e.score+'/100.':e.score+'/100';
 return `<button class="card act pressable" data-go="beer" data-id="${e.beer}">${av(e.user)}<div class="tx"><div class="t1"><b>${who}</b> ${e.user===ME?'hast':'hat'} <b>${esc(b.short||b.name)}</b> bewertet</div><div class="t2">${rel(e.ts)}</div><div class="t3" style="font-style:normal">„${cm}“</div></div>
  <div class="bt">${thumb(b)}</div><div class="rt"><span class="scorepill"><b>${e.score}</b>/100</span></div></button>`;
}

/* ---------- Kopf & Navigation ---------- */
function header(){
 const unread=myNotifs().some(n=>!n.read);
 return `<div class="hdr"><button class="bell" data-go="notifs" aria-label="Benachrichtigungen">${ic('bell')}${unread?'<span class="dot"></span>':''}</button>
 <div class="logo"><div class="hoprow"><i></i><img src="img/hop_logo.webp" alt=""><i></i></div><div class="wm">Hopfen<b>Match</b></div><button class="katsw" data-act="home" aria-label="Kategorie wechseln (jetzt ${w.one})"><span class="ke">${KD[KAT].em}</span>${w.tag}<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
 <button class="me" data-go="profile" aria-label="Profil &amp; Einstellungen"><img crossorigin="anonymous" src="${U(ME).img}" alt="${esc(U(ME).name)}"></button></div>`;
}
let TAB='start', RFILTER='all';
const TABS=['start','rangliste','freunde','planen'];
function renderTab(t){
 const el=$('#tab-'+t); const st=el.scrollTop;
 // Fokus/Cursor in Eingabefeldern (z. B. Freundessuche) über Neuzeichnen hinweg behalten
 const ae=document.activeElement,fid=ae&&ae.id&&el.contains(ae)?ae.id:null,ss=fid?ae.selectionStart:null;
 el.innerHTML=header()+VIEWS[t]();
 el.scrollTop=st;
 if(fid){const n=el.querySelector('#'+fid);if(n){n.focus({preventScroll:true});try{if(ss!=null)n.setSelectionRange(ss,ss)}catch(e){}}}
}
function renderAll(){TABS.forEach(renderTab);STACK.forEach(p=>refreshPage(p));if(window.HMHome&&HMHome.update&&HMHome.visible()&&LOGGED())HMHome.update(homeInfo())}
function showTab(t){
 if(STACK.length){closeAllPages()}
 if(TAB===t){const el=$('#tab-'+t);el.scrollTo({top:0,behavior:'smooth'});return}
 TAB=t;$$('.tabview').forEach(v=>v.classList.toggle('on',v.id==='tab-'+t));
 $$('#nav .it').forEach(i=>i.classList.toggle('on',i.dataset.tab===t));
 renderTab(t);
}

/* ---------- Ansichten (Tabs) ---------- */
const VIEWS={};
VIEWS.start=()=>{
 const last=S.ratings.filter(r=>r.user===ME).sort((a,b)=>b.ts-a.ts)[0];
 let hero='';
 if(last){const b=B(last.beer), fav=myFavs().includes(b.id);
  const himg=b.img&&b.img.hero?`<div class="himg" style="background-image:url(img/${b.img.hero}.webp)"></div>`:`<div class="himg gen"><div class="hb">${thumb(b,'pair')}</div></div>`;
  hero=`<div class="card hero pressable" data-go="beer" data-id="${b.id}" role="button">${himg}
   <span class="heart ${fav?'on':''}" data-fav="${b.id}">${ic('heart')}</span>
   <div class="hc"><div class="hl" data-tab-go="rangliste">Zuletzt bewertet ${ic('chev')}</div><div class="bn">${esc(b.name)}</div><div class="br">${esc(b.brewery)}</div><div class="st">${esc(b.style)} · ${fmtAbv(b.abv)}</div>
   <div class="scorebig"><b>${last.score}</b><span>/100</span></div>${starsHTML(last.score,18,4.5)}
   <div class="cm">„${esc(last.comment||'Noch kein Kommentar.')}“</div><div class="chips">${(last.tags||[]).slice(0,3).map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div></div></div>`}
 else{const pv=(KAT==='wein'?['wn-dr-loosen-riesling-kabinett-blauschiefer','wn-antinori-tignanello','wn-moet-chandon-brut-imperial']:KAT==='whisky'?['wk-laphroaig-10-years-old','wk-the-macallan-12-years-sherry-oak','wk-maker-s-mark']:['augustiner-hell','paulaner-weissbier','guinness']).map(id=>B(id));
  hero=`<div class="card hero first pressable" data-act="rate" role="button"><div class="fh-bottles">${pv.map(b=>`<span>${thumb(b,'bot')}</span>`).join('')}</div>
   <div class="fh-tx"><div class="fh-k">Willkommen, ${esc(U(ME).name)}!</div><h2>Bewerte ${w.erst}</h2><p>${KD[KAT].items.length} ${w.many} aus ${new Set(KD[KAT].items.map(b=>b.country)).size} Ländern warten. Gib 0–100 Punkte – über 90 bei dir und einem Freund ist ein ${w.match}.</p>
   <div class="fh-btns"><span class="btn gold sm">${ic('plus')} ${w.one} bewerten</span><span class="btn ghost sm" data-go="catalog">${ic('search')} Katalog</span></div></div></div>`}
 const acts=activities().filter(e=>!((e.type==='rate'||e.type==='drink')&&e.user===ME)).slice(0,3);
 const ch=chances().length;
 return `<div class="wrap">${hero}
 <div class="sect"><h2>Heute spannend</h2><button class="more" data-go="activities">Alle Aktivitäten ${ic('chev')}</button></div>
 <div class="acts">${acts.map(actRow).join('')||(FRIENDS().length?emptyCard('people','Noch ruhig hier',`Sobald deine Freunde ${w.many} bewerten oder ihr einen ${w.match} habt, siehst du es hier.`,'',true):emptyCard('userplus','Finde deine Freunde','Such sie unter „Freunde“ nach Namen oder lade sie zu HopfenMatch ein – dann seht ihr eure Matches.',`<button class="btn gold sm" data-tab-go="freunde">${ic('search')} Freund finden</button>`,true))}</div>
 ${ch?`<div class="banner"><img src="img/hop_illu.webp" alt=""><div class="bt"><h3><em>${ch}</em>Match-Chance${ch===1?'':'n'} heute</h3><p>Diese ${w.many} könnten dir und deinen Freunden auch schmecken.</p></div><button class="btn-green" data-go="discover">Jetzt entdecken ${ic('chev')}</button></div>`
 :`<div class="banner"><img src="img/hop_illu.webp" alt=""><div class="bt"><h3><em>${KD[KAT].items.length}</em>${w.many} im Katalog</h3><p>${w.hint}</p></div><button class="btn-green" data-go="catalog">Entdecken ${ic('chev')}</button></div>`}
 </div>`;
};
function styleGroup(s){return (STYLE_META[s]||{}).g||'hell'}
function rankRow(r,i,user){
 const b=B(r.beer), mf=user&&user!==ME?(both90(r.beer,user)?[user]:[]):mFr(r.beer), m=mf.length>0;
 return `<button class="card rrow pressable" data-go="beer" data-id="${b.id}"><span class="rank ${i<3?'r'+(i+1):''}">${i+1}</span>
 <div class="pic">${thumb(b,'pair')}</div>
 <div class="mid"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)}</div><div class="sb">${esc(b.style)} · ${fmtAbv(b.abv)}</div><div class="chips sm">${(r.tags||[]).slice(0,3).map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div></div>
 <div class="rt"><div class="sc"><b>${r.score}</b><span>/100</span></div>${starsHTML(r.score,13.5,2)}${m?`<span class="mbadge" data-match="${b.id}" data-f="${mf[0]}" title="Match mit ${esc(nameList(mf))}"><span class="mavs">${mf.slice(0,3).map(f=>av(f)).join('')}</span>${mf.length>3?'+'+(mf.length-3)+' ':''}Match</span>`:''}</div></button>`;
}
VIEWS.rangliste=()=>{
 const all=rList(ME);
 const gc={};all.forEach(r=>{const g=grpOf(B(r.beer));gc[g]=(gc[g]||0)+1});
 const groups=[['all','Alle',all.length],['match','Matches',all.filter(r=>isMatch(r.beer)).length]].concat(KD[KAT].groups.filter(g=>gc[g[0]]).map(g=>[g[0],g[1],gc[g[0]]]));
 if(!groups.some(g=>g[0]===RFILTER))RFILTER='all';
 if(!all.length)return `<div class="wrap"><h1 class="ptitle big">Rangliste</h1><p class="psub">Meine bewerteten ${w.many}</p>${emptyCard('trophy','Deine Rangliste ist noch leer',`Bewerte ${w.erst} – hier entsteht deine persönliche Top-Liste, sortiert nach Punkten.`,`<button class="btn gold sm" data-act="rate">${ic('plus')} Bier bewerten</button><button class="btn ghost sm" data-go="catalog">${ic('search')} Katalog</button>`)}</div>`;
 const list=all.filter(r=>RFILTER==='all'||(RFILTER==='match'?isMatch(r.beer):grpOf(B(r.beer))===RFILTER));
 return `<div class="wrap"><h1 class="ptitle big">Rangliste</h1><p class="psub">Meine bewerteten ${w.many}</p>
 <div class="filters">${groups.map(g=>`<button class="fchip ${RFILTER===g[0]?'on':''}" data-filter="${g[0]}">${g[1]}${g[2]!=null?` <span class="n">${g[2]}</span>`:''}</button>`).join('')}</div>
 <div class="rlist">${list.length?list.map(r=>rankRow(r,all.indexOf(r),ME)).join(''):`<div class="card empty">Keine ${w.many} in dieser Gruppe.<br><br><button class="btn gold sm" data-act="rate">${ic('plus')} ${w.one} bewerten</button></div>`}</div></div>`;
};
function friendStatus(f){
 const c=S.checkins.filter(x=>x.user===f).sort((a,b)=>b.ts-a.ts)[0];
 const r=S.ratings.filter(x=>x.user===f).sort((a,b)=>b.ts-a.ts)[0];
 if(c&&(!r||c.ts>r.ts)&&Date.now()-c.ts<6*H)return {live:true,label:'trinkt gerade',beer:c.beer,comment:c.comment,ts:c.ts};
 if(!r)return {live:false,label:'noch nichts bewertet',beer:null,comment:'',ts:0};
 return {live:false,label:'hat bewertet · '+rel(r.ts),beer:r.beer,comment:r.comment,ts:r.ts};
}
/* Freunde finden (Suche auf dem Server: nur Name + Bild) */
const FQ={q:'',res:null,busy:false,err:'',t:null,seq:0};
function relBtn(u){
 const r=u.rel||(isFriend(u.id)?'friend':DIR.outgoing.some(x=>x.id===u.id)?'outgoing':DIR.incoming.some(x=>x.id===u.id)?'incoming':'none');
 if(r==='friend')return `<button class="frbtn ok" data-go="friend" data-id="${u.id}">${ic('check')} Freund</button>`;
 if(r==='outgoing')return `<button class="frbtn wait" data-fr="cancel" data-id="${u.id}" title="Anfrage zurückziehen">${ic('clock')} Angefragt</button>`;
 if(r==='incoming')return `<button class="frbtn" data-fr="accept" data-id="${u.id}">${ic('check')} Annehmen</button>`;
 return `<button class="frbtn" data-fr="request" data-id="${u.id}">${ic('userplus')} Anfrage senden</button>`;
}
function userAv(u){if(u.id&&u.name){DIR.users[u.id]=DIR.users[u.id]||{id:u.id,name:u.name,av:u.av||0};if(DIR.users[u.id].av!==(u.av||0)||DIR.users[u.id].name!==u.name){DIR.users[u.id]={id:u.id,name:u.name,av:u.av||0};delete UC[u.id]}}return av(u.id)}
function fresHTML(){
 if(!FQ.q.trim())return '';
 if(FQ.err)return `<div class="fres-msg">${esc(FQ.err)}</div>`;
 if(!FQ.res)return `<div class="fres-msg"><span class="spin"></span> Suche …</div>`;
 if(!FQ.res.length)return `<div class="fres-msg">Niemand mit „${esc(FQ.q.trim())}“ gefunden. Vielleicht ist dein Freund noch nicht dabei – <button class="lnk" data-act="invite">lade ihn ein</button>.</div>`;
 return `<div class="group fres">${FQ.res.map(u=>`<div class="frres">${userAv(u)}<div class="tx"><div class="nm">${esc(u.name)}</div><div class="sb">${u.rel==='friend'?'Ihr seid befreundet':u.rel==='outgoing'?'Anfrage gesendet':u.rel==='incoming'?'möchte dein Freund sein':'HopfenMatch-Mitglied'}</div></div>${relBtn(u)}</div>`).join('')}</div>`;
}
function drawFres(){const el=$('#fres');if(el)el.innerHTML=fresHTML()}
function friendSearch(q){
 FQ.q=q;clearTimeout(FQ.t);FQ.err='';
 if(!q.trim()){FQ.res=null;drawFres();return}
 FQ.res=null;drawFres();
 const my=++FQ.seq;
 FQ.t=setTimeout(async()=>{
  if(!syncOn()){FQ.err='Die Suche braucht den HopfenMatch-Server.';drawFres();return}
  try{const j=await api('/friend',{method:'POST',body:{action:'search',q}});if(my!==FQ.seq)return;FQ.res=j.users||[]}
  catch(e){if(my!==FQ.seq)return;FQ.err=e.status===401?'Bitte neu anmelden.':'Keine Verbindung – die Suche braucht Internet.'}
  drawFres();
 },220);
}
async function friendAct(action,id,btn){
 if(btn){btn.disabled=true}
 try{
  const j=await api('/friend',{method:'POST',body:{action,id}});
  if(FQ.res)FQ.res.forEach(u=>{if(u.id===id)u.rel=j.rel});
  const nm=U(id).name;
  toast(action==='request'?(j.rel==='friend'?'Ihr seid jetzt Freunde 🍻':'Anfrage an '+nm+' gesendet'):action==='accept'?'Du und '+nm+' seid jetzt Freunde 🍻':action==='decline'?'Anfrage abgelehnt':action==='cancel'?'Anfrage zurückgezogen':'Freund entfernt',action==='decline'||action==='remove'||action==='cancel'?'x':'check');
  await sync(true);
  if(action==='remove'){const p=curPage();if(p&&p.name==='friend'&&p.params.id===id)pop()}
  renderAll();drawFres();
 }catch(e){if(btn)btn.disabled=false;toast(e.status===0||!navigator.onLine?'Keine Verbindung – bitte online versuchen':(e.message||'Hat nicht geklappt'),'info')}
}
VIEWS.freunde=()=>{
 const fr=FRIENDS().slice().sort((a,b)=>matchesWith(b).length-matchesWith(a).length||U(a).name.localeCompare(U(b).name,'de'));
 const ms=matches();
 const inc=DIR.me===ME?DIR.incoming:[], out=DIR.me===ME?DIR.outgoing:[];
 const frow=f=>{const st=friendStatus(f),b=B(st.beer||''),n=matchesWith(f).length;return `<button class="card frow pressable" data-go="friend" data-id="${f}">${av(f)}
  <div class="tx"><div class="nm">${esc(FN(f))}</div><div class="stt"><span class="dotg ${st.live?'':'dotx'}"></span>${st.label}</div><div class="bnm">${st.beer?esc(b.name):''}</div>${st.comment?`<div class="cm">„${esc(st.comment)}“</div>`:''}</div>
  <div class="bt">${st.beer?thumb(b):''}</div>
  <div class="fmatch"><div class="mp">${av(f)}${av(ME)}${ic('heartf')}</div><div class="mt">${n} Match${n===1?'':'es'} ${ic('chev')}</div></div></button>`};
 return `<div class="wrap" style="position:relative"><h1 class="ptitle big">Freunde</h1><p class="psub">Wer mag ${w.dasselbe}?</p><button class="addf" data-act="invite" aria-label="Freund einladen">${ic('userplus')}</button>
 <div class="lbl" style="margin-top:14px">Freund finden</div>
 <div class="search fsearch">${ic('search')}<input id="fq" type="search" placeholder="Namen eingeben, z. B. Martin" value="${esc(FQ.q)}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></div>
 <div id="fres">${fresHTML()}</div>
 ${inc.length?`<div class="sect"><h2>Freundschaftsanfragen <span class="cnt">${inc.length}</span></h2></div><div class="group">${inc.map(x=>`<div class="frres">${av(x.id)}<div class="tx"><div class="nm">${esc(U(x.id).name)}</div><div class="sb">möchte dein Freund sein · ${rel(x.ts)}</div></div><button class="frbtn" data-fr="accept" data-id="${x.id}">${ic('check')} Annehmen</button><button class="frbtn ghost" data-fr="decline" data-id="${x.id}" aria-label="Ablehnen">${ic('x')}</button></div>`).join('')}</div>`:''}
 ${out.length?`<div class="sect"><h2>Gesendete Anfragen</h2></div><div class="group">${out.map(x=>`<div class="frres">${av(x.id)}<div class="tx"><div class="nm">${esc(U(x.id).name)}</div><div class="sb">wartet auf Bestätigung · ${rel(x.ts)}</div></div><button class="frbtn wait" data-fr="cancel" data-id="${x.id}">${ic('x')} Zurückziehen</button></div>`).join('')}</div>`:''}
 ${fr.length?`<div class="banner" style="margin-top:16px"><img src="img/hop_illu.webp" alt=""><div class="bt"><h3><em>${ms.length}</em>Top-Match${ms.length===1?'':'es'}</h3><p>${w.many}, die du und mindestens ein Freund mit über 90 Punkten liebt.</p></div><button class="btn-green" data-go="friend" data-id="${fr[0]}" data-seg="matches">Ansehen ${ic('chev')}</button></div>
 <div class="sect"><h2>Meine Freunde <span class="cnt">${fr.length}</span></h2></div>
 <div class="stack">${fr.map(frow).join('')}</div>
 <div class="sect"><h2>Eure Matches</h2></div>
 <div class="hscroll">${ms.map(r=>{const bb=B(r.beer),mf=mFr(r.beer);return `<button class="card mcard pressable" data-go="beer" data-id="${bb.id}"><div class="pic">${thumb(bb)}</div><div class="nm">${esc(bb.name)}</div><div class="both"><span class="mini">${av(ME)}${r.score}</span>${mf.slice(0,2).map(f=>`<span class="mini">${av(f)}${rOf(f,r.beer).score}</span>`).join('')}</div></button>`}).join('')||`<div class="ecard sm" style="width:100%"><span class="eic">${ic('heartf')}</span><div><b>Noch keine Matches</b><p>Gebt beide über 90 Punkte für ${w.dasselbe}.</p></div></div>`}</div>`
 :`<div style="margin-top:16px">${emptyCard('people','Noch keine Freunde',inc.length?'Nimm oben eine Anfrage an – oder such nach weiteren Freunden.':'Gib oben den Namen deines Freundes ein und sende eine Anfrage. Noch nicht dabei? Lade ihn ein.',`<button class="btn gold sm" data-act="invite">${ic('userplus')} Einladen</button>`)}</div>`}
 <button class="card invite pressable" data-act="invite" style="width:100%;text-align:left"><span class="ic">${ic('userplus')}</span><div style="flex:1"><h4>Freund einladen</h4><p>Teile den Link zu HopfenMatch – dann sucht er dich hier nach Namen.</p></div><span style="color:#b5a99c">${ic('chev')}</span></button>
 </div>`;
};
function curTasting(){
 const T=TSK();return T.filter(x=>x.status==='live')[0]||T.filter(x=>x.status==='planned').sort((a,b)=>a.date-b.date)[0]||T.slice().sort((a,b)=>b.date-a.date)[0];
}
function avgOf(t,b){const s=t.scores[b]||{};const v=t.participants.map(u=>s[u]).filter(x=>x!=null);return v.length?Math.round(v.reduce((a,c)=>a+c,0)/v.length):null}
function tastingBlock(t){
 if(!t)return emptyCard('cal','Noch kein Tasting geplant',`Plane einen Abend mit deinen Freunden, stellt eine ${w.list} zusammen und bewertet live gemeinsam.`,`<button class="btn gold sm" data-act="newTasting">${ic('plus')} Abend planen</button>`);
 const pill=t.status==='live'?'<span class="livepill"><i></i>Live aktiv</span>':t.status==='planned'?'<span class="livepill pl"><i></i>Geplant</span>':'<span class="livepill dn"><i></i>Beendet</span>';
 const inv=t.participants.filter(u=>u!==ME).length;
 const parts=t.participants.map(u=>`<button class="part" data-go="${u===ME?'profile':'friend'}" data-id="${u}"><span class="av"><img crossorigin="anonymous" src="${U(u).img}" alt="">${u===t.host?`<span class="crown">${ic('crown')}</span>`:''}<span class="on"></span></span>${u===ME?'Du':esc(U(u).name)}</button>`).join('');
 const rows=t.beers.map(bid=>{const b=B(bid),s=t.scores[bid]||{},a=avgOf(t,bid);
  return `<button class="card trow pressable" data-act="tbeer" data-t="${t.id}" data-id="${bid}"><div class="pic">${thumb(b)}</div><div class="tx"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)}</div><div class="sb">${esc(b.style)} · ${fmtAbv(b.abv)}</div></div>
  ${t.participants.map(u=>`<span class="sbox ${u===ME?'me':''} ${s[u]==null?'wait':''}" data-sb="${t.id}-${bid}-${u}">${u===ME?`<span class="who">${av(ME)}Du</span>`:`<span class="who">${esc(U(u).name)}</span>`}<b>${s[u]==null?'–':s[u]}</b></span>`).join('')}
  <span class="avgp"><small>Ø</small>${a==null?'–':a}</span><span class="chev">${ic('chev')}</span></button>`}).join('');
 const ban=t.status==='live'?`<div class="banner"><img src="img/mugs.webp" alt="" style="width:66px"><div class="bt"><h3>Tasting läuft!</h3><p>Alle bewerten die ${w.many} während des Abends in Echtzeit.</p></div><button class="btn-green" data-go="live" data-id="${t.id}">Live bewerten ${ic('chev')}</button></div>`
  :t.status==='planned'?`<div class="banner"><img src="img/mugs.webp" alt="" style="width:66px"><div class="bt"><h3>Bereit für das Tasting?</h3><p>Alle können die ${w.many} während des Abends in Echtzeit bewerten.</p></div><button class="btn-green" data-act="startTasting" data-id="${t.id}">Tasting starten ${ic('chev')}</button></div>`
  :`<div class="banner"><img src="img/mugs.webp" alt="" style="width:66px"><div class="bt"><h3>Abend beendet</h3><p>Schau dir die Auswertung und den Sieger des Abends an.</p></div><button class="btn-green" data-go="result" data-id="${t.id}">Ergebnis ${ic('chev')}</button></div>`;
 return `<button class="card tcard pressable" data-act="editTasting" data-id="${t.id}">${tImg(t)}${pill}<div class="tc"><h3>${esc(t.name)} ${ic('edit')}</h3>
 <div class="ti">${ic('cal')}${fmtDate(t.date)}<span class="sp"></span>${ic('clock')}${fmtTime(t.date)}</div><div class="ti">${ic('house')}${esc(t.place)}</div><div class="ti">${ic('people')}${inv} Freund${inv===1?'':'e'} eingeladen</div></div></button>
 <div class="sect"><h2>Teilnehmer</h2><button class="more" data-act="parts" data-id="${t.id}">${t.participants.length} von ${t.participants.length} dabei ${ic('chev')}</button></div>
 <div class="card parts">${parts}<button class="part" data-act="addFriend" data-id="${t.id}"><span class="addc">${ic('plus')}</span><span>+ Freund</span></button><button class="part" data-act="invite"><span class="addc ol">${ic('people')}</span><span>Einladen</span></button></div>
 <div class="sect"><h2>${w.list}</h2><span class="hint">Bewertet gemeinsam &amp; live während des Abends.</span>${t.status!=='done'?`<button class="btn-soft" data-act="addBeer" data-id="${t.id}">${ic('plus')} ${w.one}</button>`:''}</div>
 <div class="tlist">${rows||`<div class="card empty">Noch keine ${w.many} auf der Liste.</div>`}</div>${ban}`;
}
VIEWS.planen=()=>{
 const t=curTasting();
 const others=TSK().filter(x=>!t||x.id!==t.id).sort((a,b)=>{const ra=a.status==='done'?1:0,rb=b.status==='done'?1:0;return ra-rb||(ra?b.date-a.date:a.date-b.date)});
 return `<div class="wrap"><h1 class="ptitle mid">Planen</h1><p class="psub small">Tasting-Abend</p>${tastingBlock(t)}
 ${t?`<div class="sect"><h2>Weitere Abende</h2><button class="btn-soft" data-act="newTasting">${ic('plus')} Neu</button></div>
 <div class="stack">${others.map(ocard).join('')||'<p class="note" style="margin-top:0">Keine weiteren Abende geplant.</p>'}</div>`:''}</div>`;
};
function katFromT(t){const k=t&&(t.kat||'bier');if(k&&k!==KAT&&setKat(k,true))setTimeout(()=>TABS.forEach(renderTab),0)}
function ocard(t){const d=new Date(t.date);const win=t.status==='done'?winner(t):null;
 return `<button class="card ocard pressable" data-go="tasting" data-id="${t.id}"><span class="dt"><small>${MO[d.getMonth()].replace('.','')}</small><b>${d.getDate()}</b></span><div class="tx"><div class="nm">${esc(t.name)}</div><div class="sb">${WD[d.getDay()]}, ${fmtTime(t.date)} · ${esc(t.place)}</div><div class="sb">${t.beers.length} ${KD[t.kat||'bier'].w.many}${win?` · 🏆 ${esc(B(win.b).name)} (Ø ${win.a})`:''}</div></div>
 <span class="tag2 ${t.status==='live'?'live':t.status==='planned'?'pl':''}">${t.status==='live'?'Live':t.status==='planned'?'Geplant':'Vorbei'}</span></button>`}
function winner(t){let best=null;t.beers.forEach(b=>{const a=avgOf(t,b);if(a!=null&&(!best||a>best.a))best={b,a}});return best}

/* ---------- Seiten-Stapel ---------- */
const STACK=[];
const PAGES={};
function push(name,params={}){
 const def=PAGES[name]; if(!def)return;
 const el=document.createElement('section'); el.className='page';
 const prev=STACK.length?STACK[STACK.length-1]:null;
 const backLabel=prev?(prev.short||prev.title):({start:'Start',rangliste:'Rangliste',freunde:'Freunde',planen:'Planen'}[TAB]);
 const p={name,params,el,backLabel};
 STACK.push(p);
 buildPage(p);
 $('#screen').appendChild(el);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{el.classList.add('in');(prev?prev.el:$('.layer.tabs')).classList.add('under');$('#shade').classList.add('on')}));
 attachSwipe(p);
}
function buildPage(p){
 const r=PAGES[p.name](p.params,p);
 p.title=r.title;p.short=r.short;
 p.el.innerHTML=`<div class="pnav"><button class="back" data-act="back">${ic('back')}<span>${esc(p.backLabel)}</span></button><div class="tt">${esc(r.title)}</div>${r.action||''}</div><div class="pbody">${r.body}</div>`;
 const pb=$('.pbody',p.el),nav=$('.pnav',p.el);pb.addEventListener('scroll',()=>nav.classList.toggle('sc',pb.scrollTop>4),{passive:true});
 if(r.after)r.after(p.el);
}
function refreshPage(p){const pb=$('.pbody',p.el),st=pb?pb.scrollTop:0;const l=$('#clist',p.el);if(l&&l._count)p.shown=l._count();buildPage(p);const nb=$('.pbody',p.el);if(nb)nb.scrollTop=st}
function pop(){
 const p=STACK.pop(); if(!p)return;
 if(p.cleanup)p.cleanup();
 p.el.classList.remove('in');p.el.classList.add('out');
 const prev=STACK.length?STACK[STACK.length-1]:null;
 (prev?prev.el:$('.layer.tabs')).classList.remove('under');
 if(!prev)$('#shade').classList.remove('on');
 setTimeout(()=>p.el.remove(),380);
 if(prev)refreshPage(prev); else renderTab(TAB);
}
function closeAllPages(){while(STACK.length){const p=STACK.pop();if(p.cleanup)p.cleanup();p.el.remove()}$('.layer.tabs').classList.remove('under');$('#shade').classList.remove('on')}
function attachSwipe(p){
 let sx=0,sy=0,dx=0,on=false;const el=p.el;
 el.addEventListener('touchstart',e=>{const t=e.touches[0];const r=el.getBoundingClientRect();if(t.clientX-r.left<24){on=true;sx=t.clientX;sy=t.clientY;dx=0;el.style.transition='none'}},{passive:true});
 el.addEventListener('touchmove',e=>{if(!on)return;const t=e.touches[0];dx=Math.max(0,t.clientX-sx);if(Math.abs(t.clientY-sy)>40&&dx<20){on=false;el.style.transform='';el.style.transition='';return}el.style.transform=`translateX(${dx}px)`},{passive:true});
 el.addEventListener('touchend',()=>{if(!on)return;on=false;el.style.transition='';el.style.transform='';if(dx>el.offsetWidth*.33)pop()});
}

PAGES.beer=({id})=>{if(id&&katOf(id)!==KAT&&setKat(katOf(id),true))setTimeout(()=>TABS.forEach(renderTab),0);
 const b=B(id),mine=rOf(ME,id),fav=myFavs().includes(id),mf=mFr(id),fr=FRIENDS();
 const fr8=fr.map(f=>rOf(f,id)).filter(Boolean).sort((x,y)=>y.score-x.score);
 const best=fr8[0];
 const st=mf.length?`<div class="mstatus yes"><span class="ic">${ic('heartf')}</span><div><b>${w.match} mit ${esc(nameList(mf))}! ${w.emo}</b><small>Ihr habt alle über 90 Punkte vergeben.</small></div></div>`
  :(best&&best.score>90&&(!mine||mine.score<=90))?`<div class="mstatus chance"><span class="ic">${ic('spark')}</span><div><b>Match-Chance</b><small>${esc(FN(best.user))} gibt ${best.score} Punkte. ${mine?'Mit über 90 hättet ihr einen Match.':'Probier es – vielleicht wird’s ein Match!'}</small></div></div>`
  :`<div class="mstatus no"><span class="ic">${ic('people')}</span><div><b>Kein Match</b><small>${!fr.length?`Füge Freunde hinzu, um ${w.matches} zu finden.`:!mine&&!fr8.length?`Noch keiner von euch hat ${w.dies} bewertet.`:'Ein Match gibt es, wenn du und ein Freund über 90 Punkte vergebt.'}</small></div></div>`;
 const rc=(u,r)=>r?`<div class="card rcard"><div class="hd">${av(u)}<div class="who"><b>${u===ME?'Deine Bewertung':esc(FG(u))+' Bewertung'}</b><small>${rel(r.ts)}</small></div><div class="sc2"><b>${r.score}</b><span>/100</span></div></div>
   <div style="margin-top:8px">${starsHTML(r.score,16,3)}</div>${r.comment?`<div class="cm">„${esc(r.comment)}“</div>`:''}<div class="chips sm">${(r.tags||[]).map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div>
   ${u===ME?`<div class="tools"><button class="btn ghost sm" data-act="rate" data-id="${id}">${ic('edit')} Bearbeiten</button><button class="btn danger sm" data-act="delRating" data-id="${r.id}">${ic('trash')} Löschen</button></div>`:''}</div>`
  :`<div class="card rcard"><div class="hd">${av(u)}<div class="who"><b>Deine Bewertung</b><small>Du hast ${w.dies} noch nicht bewertet</small></div></div><div class="tools"><button class="btn gold sm" data-act="rate" data-id="${id}">${ic('plus')} Jetzt bewerten</button></div></div>`;
 const others=fr.length?(fr8.length?fr8.map(r=>rc(r.user,r)).join(''):`<div class="card rcard"><div class="hd"><span class="nic" style="background:#7a5a3a1f;color:#7a5a3a;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center">${ic('people')}</span><div class="who"><b>Deine Freunde</b><small>Noch keiner deiner ${fr.length} Freund${fr.length===1?'':'e'} hat es bewertet</small></div></div></div>`):'';
 const his=null;
 const inT=S.tastings.filter(t=>t.beers.includes(id));
 const avg=[mine,...fr8].filter(Boolean);const a=avg.length?Math.round(avg.reduce((s,r)=>s+r.score,0)/avg.length):'–';void his;
 const hasHero=b.img&&b.img.hero;
 return {title:b.name,short:w.one,body:`<div class="card dhero ${hasHero?'img':''}" ${hasHero?`style="background-image:url(img/${b.img.hero}.webp)"`:''}>${hasHero?'':`<div class="pk">${thumb(b,'pair')}</div>`}<span class="heart ${fav?'on':''}" data-fav="${id}">${ic('heart')}</span></div>
 <h1 class="dname">${esc(b.name)}</h1><div class="dmeta">${esc(b.brewery)}${b.origin?' · '+esc(b.origin):''}</div>
 <div class="facts"><div class="fact"><b>${esc(b.style)}</b><small>${w.style}</small></div><div class="fact"><b>${fmtAbv(b.abv).replace(' vol','')}</b><small>Alkohol</small></div><div class="fact"><b>Ø ${a}</b><small>${fr8.length?'Du & Freunde':'Punkte'}</small></div></div>
 ${st}${rc(ME,mine)}${others}
 ${b.desc?`<div class="sect"><h2>${w.ueber}</h2></div><p class="desc" style="margin-top:0">${esc(b.desc)}</p>`:''}
 ${inT.length?`<div class="sect"><h2>In Tastings</h2></div><div class="stack">${inT.map(ocard).join('')}</div>`:''}
 <div class="btnrow"><button class="btn gold" data-act="rate" data-id="${id}">${ic(mine?'edit':'star')} ${mine?'Bewertung ändern':'Bewerten'}</button><button class="btn ghost" data-act="toTasting" data-id="${id}">${ic('cal')} Zum Tasting</button></div>`};
};
PAGES.activities=({f})=>{
 const filt=f||'all';
 const all=activities().filter(e=>filt==='all'||(filt==='me'?(e.user===ME||e.type==='match'):filt==='friend'?((e.user&&e.user!==ME)||(e.type==='match')):e.type==='match'));
 const groups={};const lab=ts=>{const t0=new Date();t0.setHours(0,0,0,0);const d=Date.now()-ts;if(ts>=t0.getTime())return 'Heute';if(ts>=t0.getTime()-D)return 'Gestern';if(d<7*D)return 'Diese Woche';if(d<30*D)return 'Diesen Monat';return 'Früher'};
 all.forEach(e=>{(groups[lab(e.ts)]=groups[lab(e.ts)]||[]).push(e)});
 return {title:'Aktivitäten',body:`<div class="filters" style="margin-top:6px">${[['all','Alle'],['friend','Freunde'],['me','Ich'],['match','Matches']].map(x=>`<button class="fchip ${filt===x[0]?'on':''}" data-actf="${x[0]}">${x[1]}</button>`).join('')}</div>
 ${Object.keys(groups).map(g=>`<div class="daylbl">${g}</div><div class="acts">${groups[g].map(actRow).join('')}</div>`).join('')||emptyCard('clock','Keine Aktivitäten','Bewertungen, Matches und Tastings von dir und deinen Freunden erscheinen hier.',`<button class="btn gold sm" data-act="rate">${ic('plus')} ${w.one} bewerten</button>`)}`};
};
PAGES.discover=()=>{
 const ch=chances(),nm=nearMatches();
 const pool=beers().filter(b=>!rOf(ME,b.id)&&!FRIENDS().some(f=>rOf(f,b.id))),day=Math.floor(Date.now()/D),best=[];for(let k=0;k<6&&pool.length;k++)best.push(pool.splice((day*7919+k*104729)%pool.length,1)[0]);
 const card=(r,why)=>{const b=B(r.beer||r.id);return `<button class="card disc pressable" data-go="beer" data-id="${b.id}"><div class="pic">${thumb(b)}</div><div class="tx"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)} · ${esc(b.style)} · ${fmtAbv(b.abv)}</div><div class="why">${why}</div></div><span class="btn gold sm" data-act="rate" data-id="${b.id}" style="height:34px;padding:0 12px">Bewerten</span></button>`};
 return {title:'Entdecken',body:`<div class="banner" style="margin-top:4px"><img src="img/hop_illu.webp" alt=""><div class="bt"><h3><em>${ch.length}</em>Match-Chance${ch.length===1?'':'n'}</h3><p>Deine Freunde lieben diese ${w.many} (über 90). Bewertest du sie auch über 90, habt ihr einen Match!</p></div></div>
 <div class="sect"><h2>Favoriten deiner Freunde</h2></div><div class="stack">${ch.map(r=>card(r,`<span class="mavs">${r.by.slice(0,3).map(f=>av(f)).join('')}</span> ${esc(nameList(r.by.slice(0,2)))}${r.by.length>2?' +'+(r.by.length-2):''}: ${r.score}/100`)).join('')||`<div class="card empty">${!FRIENDS().length?'Füge Freunde hinzu – ihre Lieblingsbiere tauchen dann hier auf.':FRIENDS().some(f=>rList(f).length)?'Du hast alle Favoriten deiner Freunde schon bewertet. 💪':`Deine Freunde haben noch keine Favoriten – sobald sie ${w.many} über 90 bewerten, tauchen sie hier auf.`}</div>`}</div>
 <div class="sect"><h2>Fast ein Match</h2></div><p class="note" style="margin-top:-4px">Du liegst knapp darunter – vielleicht nochmal probieren?</p><div class="stack">${nm.map(r=>{const m=rOf(ME,r.beer);return card(r,`<span class="pill-mini">Du ${m.score}</span><span class="pill-mini">${esc(FN(r.user))} ${r.score}</span>`)}).join('')||'<div class="card empty">Keine knappen Kandidaten.</div>'}</div>
 <div class="sect"><h2>Noch unentdeckt</h2><button class="more" data-go="catalog">Ganzer Katalog ${ic('chev')}</button></div><div class="stack">${best.map(b=>card({id:b.id},`<span style="color:#8a7e74;font-weight:500">${flag(b)} Hat noch keiner von euch probiert</span>`)).join('')}</div>
 <div class="btnrow"><button class="btn ghost" data-go="catalog">${ic('search')} Alle ${beers().length} ${w.many} durchsuchen</button></div>`};
};
PAGES.notifs=()=>{
 const list=myNotifs().sort((a,b)=>b.ts-a.ts);
 const icn={match:['#5f8a35','heartf'],rate:['#d8921a','star'],drink:['#c47d14','beer'],tasting:['#7a5a3a','cal'],chance:['#62803a','spark'],like:['#d8921a','heartf'],freq:['#3b82c4','userplus'],friend:['#62803a','people']};
 const pend=id=>DIR.incoming.some(x=>x.id===id);
 return {title:'Mitteilungen',action:`<button class="act2" data-act="readAll">Alle gelesen</button>`,body:`<div class="group" style="margin-top:8px">${list.map(n=>{const k=icn[n.kind]||icn.rate;return `<div class="notif" role="button" tabindex="0" data-notif="${n.id}">${n.from?av(n.from):`<span class="nic" style="background:${k[0]}1f;color:${k[0]}">${ic(k[1])}</span>`}<div class="tx">${ntext(n.text)}<small>${rel(n.ts)}</small>${n.kind==='freq'&&pend(n.from)?`<span class="nbtns"><button class="frbtn" data-fr="accept" data-id="${n.from}">${ic('check')} Annehmen</button><button class="frbtn ghost" data-fr="decline" data-id="${n.from}">Ablehnen</button></span>`:n.kind==='freq'&&isFriend(n.from)?'<span class="nok">✓ Ihr seid Freunde</span>':''}</div>${n.read?'':'<span class="ud"></span>'}</div>`}).join('')||`<div class="ecard flat"><span class="eic">${ic('bell')}</span><b>Keine Mitteilungen</b><p>Hier erfährst du, wenn Freunde bewerten, dich einladen, dir eine Freundschaftsanfrage schicken oder ihr einen Match habt.</p></div>`}</div>`};
};
function sinceOf(id){const d=(DIR.users||{})[id];return USERS[id]?USERS[id].since:''}
PAGES.profile=()=>{
 const mine=rList(ME);const avg=mine.length?Math.round(mine.reduce((a,r)=>a+r.score,0)/mine.length):0;
 const sc={};mine.forEach(r=>{const s=B(r.beer).style;sc[s]=(sc[s]||0)+1});const fav=Object.keys(sc).sort((a,b)=>sc[b]-sc[a])[0]||'–';
 const top=mine[0], nf=FRIENDS().length, u=U(ME);
 return {title:'Profil',body:`<div class="prof"><button class="avedit" data-act="accAvatar" aria-label="Profilbild ändern">${av(ME)}<span class="avcam">${ic('edit')}</span></button><h2>${esc(u.full)}</h2><div class="hs">${esc(u.handle)}${sinceOf(ME)?' · dabei seit '+sinceOf(ME):''}</div>
 <div class="stats"><div class="stat"><b>${mine.length}</b><small>Bewertungen</small></div><div class="stat"><b>${matches().length}</b><small>Matches</small></div><div class="stat"><b>${avg}</b><small>Ø Punkte</small></div></div></div>
 <div class="lbl">Mein Konto</div><div class="group">
  <button class="gi" data-act="accName"><span class="ic" style="background:#d8921a">${ic('edit')}</span><span class="lb">Name ändern</span><span class="vl">${esc(u.name)}</span><span class="chev">${ic('chev')}</span></button>
  <button class="gi" data-act="accPass"><span class="ic" style="background:#7a5a3a">${ic('lock')}</span><span class="lb">Passwort ändern</span><span class="vl">••••</span><span class="chev">${ic('chev')}</span></button>
  <button class="gi" data-act="accAvatar"><span class="ic" style="background:#3b82c4">${ic('people')}</span><span class="lb">Profilbild ändern</span><span class="chev">${ic('chev')}</span></button></div>
 <div class="lbl">Mein Geschmack</div><div class="group">
  <button class="gi" data-tab-go="rangliste"><span class="ic" style="background:#d8921a">${ic('trophy')}</span><span class="lb">${w.lieb}</span><span class="vl">${top?esc(B(top.beer).name):'–'}</span><span class="chev">${ic('chev')}</span></button>
  <div class="gi"><span class="ic" style="background:#62803a">${ic('beer')}</span><span class="lb">${w.liebstil}</span><span class="vl">${esc(fav)}</span></div>
  <button class="gi" data-tab-go="freunde"><span class="ic" style="background:#7a5a3a">${ic('people')}</span><span class="lb">Freunde</span><span class="vl">${nf}${nf===1?' · '+esc(FN(FRIENDS()[0])):''}</span><span class="chev">${ic('chev')}</span></button>
  <button class="gi" data-go="tastings"><span class="ic" style="background:#b5651d">${ic('cal')}</span><span class="lb">Tastings</span><span class="vl">${TSK().length}</span><span class="chev">${ic('chev')}</span></button>
  <button class="gi" data-go="catalog"><span class="ic" style="background:#3b6e8f">${ic('search')}</span><span class="lb">${w.katalog}</span><span class="vl">${beers().length} ${w.many}</span><span class="chev">${ic('chev')}</span></button>
  <button class="gi" data-act="home"><span class="ic" style="background:#8a2a3e">${ic('refresh')}</span><span class="lb">Kategorie wechseln</span><span class="vl">${KD[KAT].em} ${w.one}</span><span class="chev">${ic('chev')}</span></button></div>
 <div class="lbl">Einstellungen</div><div class="group">
  <div class="gi"><span class="ic" style="background:#e0543c">${ic('bell')}</span><span class="lb">Mitteilungen</span><button class="switch ${S.settings.push?'on':''}" data-toggle="push" aria-label="Mitteilungen"></button></div>
  <div class="gi"><span class="ic" style="background:#3b82c4">${ic('spark')}</span><span class="lb">Match-Feier mit Konfetti</span><button class="switch ${S.settings.sounds?'on':''}" data-toggle="sounds" aria-label="Konfetti"></button></div>
  <button class="gi" data-act="install"><span class="ic" style="background:#555">${ic('phone')}</span><span class="lb">Zum Home-Bildschirm</span><span class="chev">${ic('chev')}</span></button>
  <button class="gi" data-act="invite"><span class="ic" style="background:#62803a">${ic('userplus')}</span><span class="lb">Freund einladen</span><span class="chev">${ic('chev')}</span></button>
  <button class="gi" data-act="about"><span class="ic" style="background:#a08a70">${ic('info')}</span><span class="lb">Über HopfenMatch</span><span class="vl">1.11</span><span class="chev">${ic('chev')}</span></button></div>
 ${syncOn()?`<div class="lbl">Synchronisierung</div><div class="group"><button class="gi" data-act="syncNow"><span class="ic" style="background:${SYNC.online?'#62803a':'#a08a70'}">${ic('refresh')}</span><span class="lb">${SYNC.online?'Mit Server verbunden':'Offline'}</span><span class="vl">${syncLabel()}</span><span class="chev">${ic('chev')}</span></button></div>`:''}
 <div class="group"><button class="gi" data-act="logout"><span class="ic" style="background:#8a6a4a">${ic('logout')}</span><span class="lb">Abmelden</span><span class="vl">${esc(u.name)}</span><span class="chev">${ic('chev')}</span></button></div>
 <div class="group"><button class="gi red" data-act="reset"><span class="ic" style="background:#c0392b">${ic('refresh')}</span><span class="lb">${syncOn()?'Daten neu vom Server laden':'Daten zurücksetzen'}</span></button>
 ${syncOn()?`<button class="gi red" data-act="accDelete"><span class="ic" style="background:#8e2a20">${ic('trash')}</span><span class="lb">Konto löschen</span></button>`:''}</div>
 <p class="note">Angemeldet als ${esc(u.name)}. ${syncOn()?'Deine Bewertungen sehen nur deine Freunde. Fremde sehen nur deinen Namen und dein Profilbild. Offline gespeicherte Änderungen werden automatisch nachgesendet.':'Diese Version läuft ohne Server nur auf diesem Gerät.'}</p>`};
};
PAGES.friend=({id,seg},pg)=>{
 const f=id||FRIENDS()[0];if(!f)return {title:'Freund',body:emptyCard('people','Noch keine Freunde','Such unter „Freunde“ nach Namen.','',true)};
 if(pg)pg.params.id=f;
 const fu=U(f), friend=isFriend(f);
 if(!friend){const inc=DIR.incoming.some(x=>x.id===f),out=DIR.outgoing.some(x=>x.id===f);
  return {title:fu.name,short:fu.name,body:`<div class="prof">${av(f)}<h2>${esc(fu.name)}</h2><div class="hs">${esc(fu.handle)}</div></div>
  <div class="card" style="margin-top:16px;padding:16px;text-align:center"><p style="margin:0 0 12px;color:#5d4a3e">Bewertungen und Matches siehst du erst, wenn ihr befreundet seid.</p>${relBtn({id:f,rel:inc?'incoming':out?'outgoing':'none'})}</div>`}}
 const s=seg||'matches';const his=rList(f),ms=matchesWith(f);
 const both=rList(ME).filter(r=>rOf(f,r.beer));
 const avg=his.length?Math.round(his.reduce((a,r)=>a+r.score,0)/his.length):0;
 let body='';
 if(s==='matches')body=ms.length?`<div class="stack">${ms.map(r=>{const b=B(r.beer),o=rOf(f,r.beer);return `<button class="card lrow pressable" data-go="beer" data-id="${b.id}"><div class="pic">${thumb(b)}</div><div class="tx"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.style)} · ${esc(b.brewery)}</div></div><span class="mini">${av(ME)}${r.score}</span><span class="mini">${av(f)}${o.score}</span></button>`}).join('')}</div>`:emptyCard('heartf','Noch keine Matches',`Ein Match entsteht, wenn ihr beide ${w.dasselbe} mit über 90 Punkten bewertet.`,'',true);
 if(s==='list')body=his.length?`<div class="rlist">${his.map((r,i)=>rankRow(r,i,f)).join('')}</div>`:emptyCard('trophy',`${esc(fu.name)} hat noch nichts bewertet`,'Die Rangliste füllt sich mit jeder Bewertung.','',true);
 if(s==='cmp'&&!both.length)body=emptyCard('people','Noch nichts zu vergleichen',`Bewertet ihr beide ${w.dasselbe}, seht ihr hier eure Punkte nebeneinander.`,'',true);else
 if(s==='cmp')body=`<div class="card" style="padding:4px 0"><div class="cmp" style="padding-bottom:2px"><span class="pic"></span><span class="nm" style="color:#8a7e74;font-size:12px">${both.length} gemeinsam bewertete ${w.many}</span><span class="h">Du</span><span class="h">${esc(fu.name)}</span></div>${both.map(r=>{const b=B(r.beer),o=rOf(f,r.beer);return `<button class="cmp" data-go="beer" data-id="${b.id}"><span class="pic">${thumb(b)}</span><span class="nm">${esc(b.name)}</span><span class="v ${r.score>90?'hi':''}">${r.score}</span><span class="v ${o.score>90?'hi':''}">${o.score}</span></button>`}).join('')}</div>`;
 return {title:fu.name,short:fu.name,body:`<div class="prof">${av(f)}<h2>${esc(fu.full)}</h2><div class="hs">${esc(fu.handle)} · ${his.length?'zuletzt aktiv '+rel(his.slice().sort((a,b)=>b.ts-a.ts)[0].ts):'Freund'}</div>
 <div class="stats"><div class="stat"><b>${his.length}</b><small>Bewertungen</small></div><div class="stat"><b>${ms.length}</b><small>Matches</small></div><div class="stat"><b>${avg}</b><small>Ø Punkte</small></div></div></div>
 <div class="fab-row"><button class="btn gold" data-act="newTastingFr" data-id="${f}">${ic('cal')} Zum Tasting einladen</button></div>
 <div class="segs">${[['matches','Matches'],['list','Rangliste'],['cmp','Vergleich']].map(x=>`<button class="seg ${s===x[0]?'on':''}" data-seg2="${x[0]}">${x[1]}</button>`).join('')}</div>
 <div style="margin-top:12px">${body}</div>
 <div class="btnrow" style="margin-top:22px"><button class="btn ghost" data-act="removeFriend" data-id="${f}" style="color:#b03a2e">${ic('x')} Freund entfernen</button></div>`};
};
PAGES.tasting=({id})=>{const t=S.tastings.find(x=>x.id===id);katFromT(t);return {title:t?t.name:'Tasting',short:'Tasting',body:`<div style="height:4px"></div>${tastingBlock(t)}${t&&t.status!=='live'?`<div class="btnrow"><button class="btn danger" data-act="delTasting" data-id="${t.id}">${ic('trash')} Abend löschen</button></div>`:''}`}};
PAGES.tastings=()=>({title:'Alle Tastings',body:`<div class="stack" style="margin-top:6px">${TSK().slice().sort((a,b)=>b.date-a.date).map(ocard).join('')||emptyCard('cal','Noch keine Tastings','Lege deinen ersten Tasting-Abend an.','',true)}</div><div class="btnrow"><button class="btn gold" data-act="newTasting">${ic('plus')} Neuen Abend planen</button></div>`});

/* Live-Tasting */
PAGES.live=({id},p)=>{katFromT(S.tastings.find(x=>x.id===id));
 const t=S.tastings.find(x=>x.id===id); if(!t)return {title:'Live',body:''};
 if(p.idx==null){p.idx=t.beers.findIndex(b=>(t.scores[b]||{})[ME]==null);if(p.idx<0)p.idx=0}
 const i=Math.min(p.idx,t.beers.length-1), bid=t.beers[i], b=B(bid), s=t.scores[bid]||{};
 const done=t.beers.filter(x=>t.participants.every(u=>(t.scores[x]||{})[u]!=null)).length;
 if(p.curIdx!==i)p.cur=null;
 const mine=p.cur!=null?p.cur:s[ME]!=null?s[ME]:((rOf(ME,bid)||{}).score||80);
 const others=t.participants.filter(u=>u!==ME);
 const av2=avgOf(t,bid);
 p.cleanup=()=>{clearTimeout(p.tm)};
 return {title:'Live-Tasting',short:'Live',body:`<div class="card livehd"><span class="livepill" style="position:static;box-shadow:none"><i></i>Live</span><div class="pr"><b style="font-size:14.5px">${esc(t.name)}</b><div class="bar"><i style="width:${Math.round(done/t.beers.length*100)}%"></i></div></div><span style="font-size:13px;color:#8a7e74;font-weight:600">${done}/${t.beers.length} fertig</span></div>
 <div class="card lcard"><div class="top"><div class="pic">${thumb(b)}</div><div><div style="font-size:12.5px;font-weight:700;color:#c47d14;letter-spacing:.5px">BIER ${i+1} VON ${t.beers.length}</div><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)}<br>${esc(b.style)} · ${fmtAbv(b.abv)}</div></div></div>
 <div class="dial" style="padding-top:10px"><div class="num" id="lnum">${mine}<span>/100</span></div><div class="verdict" id="lver">${verdict(mine)}</div><div id="lstars">${starsHTML(mine,26,6)}</div></div>
 <input type="range" class="range" id="lrange" min="0" max="100" value="${mine}" style="--p:${mine}%"><div class="ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
 <div class="lscores"><div class="lscore me">${av(ME)}<div><b id="lme">${s[ME]!=null?s[ME]:'–'}</b><small>Du</small></div></div>${others.map(u=>`<div class="lscore" id="lo-${u}">${av(u)}<div>${s[u]!=null?`<b>${s[u]}</b><small>${esc(U(u).name)}</small>`:`<span class="typing"><i></i><i></i><i></i></span><small>${esc(U(u).name)} …</small>`}</div></div>`).join('')}<div class="lscore" style="background:#fcefd9;flex:.75;justify-content:center"><div style="text-align:center"><b id="lavg">${av2==null?'–':av2}</b><small>Ø</small></div></div></div>
 <div class="btnrow"><button class="btn ghost" data-act="lprev" ${i===0?'disabled':''}>${ic('back')} Zurück</button><button class="btn green" data-act="lsave" data-id="${t.id}">${ic('check')} ${s[ME]!=null?'Aktualisieren':'Speichern'}</button></div>
 <div class="dots">${t.beers.map((x,j)=>`<i class="${j===i?'on':(t.scores[x]||{})[ME]!=null?'done':''}"></i>`).join('')}</div></div>
 <div class="btnrow">${i<t.beers.length-1?`<button class="btn gold" data-act="lnext">${w.next} ${ic('chev')}</button>`:`<button class="btn gold" data-act="finishTasting" data-id="${t.id}">${ic('flag')} Abend abschließen</button>`}</div>
 <p class="note" style="text-align:center">${others.length?'Die Punkte von '+esc(nameList(others))+' erscheinen live, sobald '+(others.length===1?'er/sie':'sie')+' auf dem eigenen Handy bewertet '+(others.length===1?'hat':'haben')+'.':'Du bewertest allein.'}</p>`,
 after:el=>{
  const rg=$('#lrange',el);rg.addEventListener('input',()=>{const v=+rg.value;p.cur=v;p.curIdx=i;rg.style.setProperty('--p',v+'%');$('#lnum',el).innerHTML=v+'<span>/100</span>';$('#lver',el).textContent=verdict(v);$('#lstars',el).innerHTML=starsHTML(v,26,6)});
  // Punkte der anderen kommen per Server-Sync (Polling) dazu
 }};
};
PAGES.result=({id})=>{katFromT(S.tastings.find(x=>x.id===id));
 const t=S.tastings.find(x=>x.id===id); if(!t)return {title:'',body:''};
 const ranked=t.beers.map(b=>({b,a:avgOf(t,b)})).filter(x=>x.a!=null).sort((x,y)=>y.a-x.a);
 const pod=[ranked[1],ranked[0],ranked[2]];
 const mt=t.beers.filter(b=>{const s=t.scores[b]||{};return t.participants.every(u=>s[u]>90)});
 const cols=[ME,...t.participants.filter(u=>u!==ME)].slice(0,4);
 const diff=t.beers.map(b=>{const v=t.participants.map(u=>(t.scores[b]||{})[u]).filter(x=>x!=null);return v.length>1?{b,d:Math.max(...v)-Math.min(...v)}:null}).filter(Boolean).sort((a,b)=>b.d-a.d)[0];
 const notRated=t.beers.filter(b=>(t.scores[b]||{})[ME]!=null&&!rOf(ME,b));
 return {title:'Auswertung',short:'Ergebnis',body:`<div style="text-align:center;margin-top:8px"><div style="font-size:12.5px;font-weight:700;color:#c47d14;letter-spacing:.6px">${fmtDate(t.date).toUpperCase()}</div><h1 class="ptitle mid" style="margin-top:2px">${esc(t.name)}</h1><div class="dmeta">${esc(t.place)} · ${t.participants.length} Teilnehmer</div></div>
 <div class="podium">${pod.map((x,k)=>x?`<button class="pod p${[2,1,3][k]}" data-go="beer" data-id="${x.b}"><div class="pic">${thumb(x.b)}</div><div class="blk"><b>${x.a}</b><small>${[2,1,3][k]}. Platz</small></div><div class="nm">${esc(B(x.b).name)}</div></button>`:'<div class="pod"></div>').join('')}</div>
 ${mt.length?`<div class="mstatus yes"><span class="ic">${ic('heartf')}</span><div><b>${mt.length} Match${mt.length===1?'':'es'} am Abend ${w.emo}</b><small>${mt.map(b=>esc(B(b).name)).join(', ')}</small></div></div>`:''}
 ${diff?`<div class="mstatus no"><span class="ic">${ic('people')}</span><div><b>Größte Meinungsverschiedenheit</b><small>${esc(B(diff.b).name)}: ${diff.d} Punkte Unterschied</small></div></div>`:''}
 <div class="sect"><h2>Alle ${w.many}</h2></div><div class="card" style="padding:4px 0"><div class="cmp"><span class="pic"></span><span class="nm" style="color:#8a7e74;font-size:12px">${w.one}</span>${cols.map(u=>`<span class="h">${u===ME?'Du':esc(U(u).name)}</span>`).join('')}<span class="h">Ø</span></div>
 ${ranked.map(x=>{const s=t.scores[x.b]||{};return `<button class="cmp" data-go="beer" data-id="${x.b}"><span class="pic">${thumb(x.b)}</span><span class="nm">${esc(B(x.b).name)}</span>${cols.map(u=>`<span class="v ${s[u]>90?'hi':''}">${s[u]==null?'–':s[u]}</span>`).join('')}<span class="v" style="background:#fcefd9">${x.a}</span></button>`}).join('')}</div>
 ${notRated.length?`<div class="btnrow"><button class="btn green" data-act="importScores" data-id="${t.id}">${ic('check')} ${notRated.length} Wertung${notRated.length===1?'':'en'} in meine Rangliste</button></div>`:''}
 <div class="btnrow"><button class="btn ghost" data-act="shareResult" data-id="${t.id}">${ic('share')} Ergebnis teilen</button></div>`};
};

/* ---------- Sheets ---------- */
let SHEET=null;
function openSheet(html,{full=false,onclose}={}){
 closeSheet(true);
 const host=$('#sheets');host.innerHTML=`<div class="backdrop"></div><div class="sheet ${full?'full':''}"><div class="grab"></div>${html}</div>`;
 const bd=$('.backdrop',host),sh=$('.sheet',host);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{bd.classList.add('on');sh.classList.add('in')}));
 bd.addEventListener('click',()=>closeSheet());
 let sy=0,dy=0,drag=false;
 sh.addEventListener('touchstart',e=>{if(!e.target.closest('.grab,.sheet-hd'))return;drag=true;sy=e.touches[0].clientY;dy=0;sh.style.transition='none'},{passive:true});
 sh.addEventListener('touchmove',e=>{if(!drag)return;dy=Math.max(0,e.touches[0].clientY-sy);sh.style.transform=`translateY(${dy}px)`},{passive:true});
 sh.addEventListener('touchend',()=>{if(!drag)return;drag=false;sh.style.transition='';sh.style.transform='';if(dy>110)closeSheet()});
 SHEET={host,sh,onclose};host.style.pointerEvents='auto';
 return sh;
}
function closeSheet(instant){
 if(!SHEET)return;const {host,sh,onclose}=SHEET;SHEET=null;
 const bd=$('.backdrop',host);
 if(instant){host.innerHTML='';host.style.pointerEvents='none'}
 else{bd&&bd.classList.remove('on');sh.classList.remove('in');setTimeout(()=>{if(!SHEET){host.innerHTML='';host.style.pointerEvents='none'}},380)}
 if(onclose)onclose();
}
/* Bewertung anlegen */
let RATE=null;
function rateSheet(beerId,fixed){
 RATE={beer:beerId||null,q:'',score:80,tags:[],comment:'',fixed:!!(beerId&&fixed)};
 if(beerId){const r=rOf(ME,beerId);if(r){RATE.score=r.score;RATE.tags=r.tags.slice();RATE.comment=r.comment;RATE.edit=r.id}}
 openSheet('<div id="rate" style="display:flex;flex-direction:column;min-height:0;flex:1"></div>',{full:true});
 drawRate();
}
function drawRate(){
 const host=$('#rate');if(!host)return;
 if(!RATE.beer){
  host.innerHTML=`<div class="sheet-hd"><button class="l" data-act="closeSheet">Abbrechen</button><h3>${w.one} bewerten</h3><span class="r"></span></div>
  <div class="sheet-body"><div class="search">${ic('search')}<input id="rq" type="search" placeholder="${w.ph}" value="${esc(RATE.q)}" autocomplete="off" autocorrect="off" spellcheck="false"></div>
  <button class="card lrow pressable" data-act="newBeer" style="margin-top:10px"><span class="pic" style="color:#d8921a;font-size:28px;width:40px;height:44px">${ic('plus')}</span><div class="tx"><div class="nm">${w.neuA} anlegen</div><div class="sb">Nicht im Katalog? Einfach selbst hinzufügen.</div></div><span class="chev">${ic('chev')}</span></button>
  <div class="lbl" id="rcount"></div><div class="group" id="rlist"></div></div>`;
  const sb=$('.sheet-body',host),inp=$('#rq');
  const fill=()=>{const list=searchBeers(RATE.q,{}).sort((a,b)=>(rOf(ME,a.id)?1:0)-(rOf(ME,b.id)?1:0));
   $('#rcount').textContent=(RATE.q?'Treffer':'Katalog')+' · '+list.length+' '+w.many;
   lazyList($('#rlist'),sb,list,b=>{const r=rOf(ME,b.id);return `<button class="pickrow" data-pick="${b.id}"><span class="pic">${thumb(b)}</span><div class="tx"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)} · ${esc(b.style)} · ${fmtAbv(b.abv)}</div></div>${r?`<span class="yr">${r.score}</span>`:''}</button>`},`<div class="empty">Nichts gefunden. Lege ${w.das==="das"?"das":"ihn"} einfach neu an.</div>`)};
  fill();let qt;inp.addEventListener('input',()=>{RATE.q=inp.value;clearTimeout(qt);qt=setTimeout(fill,90)});
  return;
 }
 const b=B(RATE.beer), fo=FRIENDS().map(f=>rOf(f,b.id)).filter(Boolean).sort((x,y)=>y.score-x.score).slice(0,2);
 host.innerHTML=`<div class="sheet-hd"><button class="l" data-act="${RATE.fixed?'closeSheet':'rateBack'}">${RATE.fixed?'Abbrechen':ic('back')}</button><h3>${RATE.edit?'Bewertung bearbeiten':'Bewerten'}</h3><button class="r" data-act="saveRating">Sichern</button></div>
 <div class="sheet-body"><div class="card rate-head"><div class="pic">${thumb(b)}</div><div><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)}<br>${esc(b.style)} · ${fmtAbv(b.abv)}</div></div>${RATE.fixed?'':`<button class="chg" data-act="rateBack">Ändern</button>`}</div>
 <div class="dial"><div class="num" id="rnum">${RATE.score}<span>/100</span></div><div class="verdict" id="rver">${verdict(RATE.score)}</div><div id="rstars">${starsHTML(RATE.score,26,6)}</div></div>
 <input type="range" class="range" id="rrange" min="0" max="100" value="${RATE.score}" style="--p:${RATE.score}%" aria-label="Punkte"><div class="ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
 <div class="quick">${[70,80,85,90,95].map(v=>`<button data-q="${v}">${v}</button>`).join('')}<button data-q="-1">−1</button><button data-q="+1">+1</button></div>
 ${fo.map(o=>`<div class="mstatus ${o.score>90?'chance':'no'}" style="margin-top:14px">${av(o.user)}<div><b>${esc(FN(o.user))}: ${o.score}/100</b><small>${o.score>90?`Gib über 90 Punkte für einen ${w.match}!`:esc(FN(o.user))+' ist nicht ganz so begeistert.'}</small></div></div>`).join('')}
 <div class="lbl">Geschmack</div><div class="tagpick">${[...new Set(TAGSK().concat(RATE.tags))].map(t=>`<button class="${RATE.tags.includes(t)?'on':''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}</div>
 <div class="lbl">Kommentar</div><div class="field"><textarea id="rcm" placeholder="Wie schmeckt’s dir?" maxlength="200">${esc(RATE.comment)}</textarea></div>
 <div class="btnrow"><button class="btn gold" data-act="saveRating">${ic('check')} Bewertung speichern</button></div>
 ${RATE.edit?`<div class="btnrow" style="margin-top:8px"><button class="btn danger" data-act="delRating" data-id="${RATE.edit}">${ic('trash')} Bewertung löschen</button></div>`:''}</div>`;
 const rg=$('#rrange');rg.addEventListener('input',()=>setScore(+rg.value,true));
 $('#rcm').addEventListener('input',e=>RATE.comment=e.target.value);
}
function setScore(v,fromRange){
 v=Math.max(0,Math.min(100,v));RATE.score=v;
 const rg=$('#rrange');if(!rg)return;if(!fromRange)rg.value=v;rg.style.setProperty('--p',v+'%');
 $('#rnum').innerHTML=v+'<span>/100</span>';$('#rver').textContent=verdict(v);$('#rstars').innerHTML=starsHTML(v,26,6);
}
function saveRating(){
 const b=RATE.beer;if(!b)return;
 const was=new Set(mFr(b)), edit=!!RATE.edit;
 let r=rOf(ME,b);
 if(r){r.score=RATE.score;r.tags=RATE.tags.slice();r.comment=RATE.comment.trim();r.ts=Date.now()}
 else{r={id:ME+':'+b,user:ME,beer:b,score:RATE.score,tags:RATE.tags.slice(),comment:RATE.comment.trim(),ts:Date.now()};S.ratings.push(r)}
 save();closeSheet();
 const me=ME,nm=B(b).name;
 // Freunde sehen die Bewertung als Mitteilung
 FRIENDS().forEach(fr=>notify('rate',`{{u:${me}}} hat <b>${esc(nm)}</b> ${edit?'neu ':''}mit ${r.score} Punkten bewertet.`,'beer:'+b,false,fr,me));
 const nw=mFr(b).filter(f=>!was.has(f));
 nw.forEach(fr=>{notify('match',`Neuer <b>${wOf(b).match}</b> mit {{u:${fr}}}: <b>${esc(nm)}</b> ${wOf(b).emo}`,'beer:'+b,true,me);notify('match',`Neuer <b>${wOf(b).match}</b> mit {{u:${me}}}: <b>${esc(nm)}</b> ${wOf(b).emo}`,'beer:'+b,false,fr,me)});
 if(nw.length)setTimeout(()=>matchOverlay(b,nw[0]),350);
 else toast(edit?'Bewertung aktualisiert':'Bewertung gespeichert','check');
 renderAll();
}
let NB=null;
const LBL=[['#f3ead2','#7a3f10'],['#fbf8ef','#1d4fa0'],['#173f2a','#c9b26a'],['#7c1d1a','#d6b24c'],['#141414','#c9a24a'],['#f4c430','#1c3f7a'],['#fdfaf2','#e0701e'],['#2fb3c9','#ffffff']];
function nbSvg(st){return {shape:'nrw',glass:st.glass,label:st.label,label2:st.label2,ink:st.label2==='#ffffff'?'#fff':st.label2,cap:st.label2,neck:st.label2,text:(st.name||'Bier').split(' ')[0].slice(0,12),sub:(st.brewery||'BRAUEREI').toUpperCase().slice(0,18)}}
const NBSTY={bier:()=>STYLES,wein:()=>Object.keys(HM_WINE.grapes),whisky:()=>Object.keys(HM_WHISKY.types)};
const NBDEF={bier:'Helles',wein:'Riesling',whisky:'Single Malt'};
function nbGrp(st){if(KAT==='wein'){const c=(HM_WINE.grapes[st.style]||[])[1];return ['Sekt','Champagner','Prosecco','Cava'].includes(st.style)?'schaum':st.style==='Rosé'?'rose':st.style==='Portwein'||['Moscato','Sémillon','Welschriesling'].includes(st.style)?'suess':c&&lumOf(c)<0.4?'rot':'weiss'}if(KAT==='whisky')return HM_WHISKY.types[st.style]||'malt';return styleGroup(st.style)}
function nbItem(st){const g=nbGrp(st),nm=st.name||w.neu;
 if(KAT==='wein')return {id:'wn-new',kat:'wein',name:nm,style:st.style,grp:g,abv:12,svg:HM_WINE.newSvg(Object.assign({},st,{grp:g,shape:st.glass==='brown'?'sch':st.glass==='clear'?'bur':'bdx',glass:st.glass==='brown'?'br':st.glass==='clear'?'fl':'gr'}))};
 if(KAT==='whisky')return {id:'wk-new',kat:'whisky',name:nm,style:st.style,grp:g,abv:46,svg:HM_WHISKY.newSvg(Object.assign({},st,{grp:g,shape:st.glass==='brown'?'sq':st.glass==='clear'?'dc':'rd'}))};
 return {id:'c-new',name:nm,style:st.style,abv:5,svg:nbSvg(st)}}
function newBeerSheet(after){
 const st={name:'',brewery:'',style:NBDEF[KAT],abv:w.abv,glass:'brown',label:LBL[0][0],label2:LBL[0][1]};
 const draw=()=>{$('#nbprev').innerHTML=thumb(nbItem(st),'pair')};
 const sh=openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Abbrechen</button><h3>${w.neu}</h3><button class="r" data-act="nbSave">Fertig</button></div>
 <div class="sheet-body"><div class="newprev" id="nbprev"></div>
 <div class="field"><label>Name</label><input id="nbn" placeholder="${w.nameph}"></div>
 <div class="field"><label>${w.maker}</label><input id="nbb" placeholder="${w.makerph}"></div>
 <div class="field"><label>${w.style}</label><select id="nbs">${NBSTY[KAT]().map(s=>`<option ${s===NBDEF[KAT]?'selected':''}>${esc(s)}</option>`).join('')}</select></div>
 <div class="field"><label>Alkohol</label><input id="nba" inputmode="decimal" value="${w.abv}"><span style="color:#8a7e74">% vol</span></div>
 <div class="lbl">Flasche</div><div class="swatches">${[['brown','#7a3f10'],['green','#2e6a2a'],['clear','#d8d4c0']].map(g=>`<button class="swatch ${g[0]==='brown'?'on':''}" data-glass="${g[0]}" style="background:${g[1]}"></button>`).join('')}</div>
 <div class="lbl">Etikett</div><div class="swatches" style="flex-wrap:wrap">${LBL.map((l,i)=>`<button class="swatch ${i===0?'on':''}" data-lbl="${i}" style="background:linear-gradient(135deg,${l[0]} 50%,${l[1]} 50%)"></button>`).join('')}</div>
 <div class="btnrow"><button class="btn gold" data-act="nbSave">${ic('check')} ${w.one} anlegen &amp; bewerten</button></div></div>`,{full:true});
 draw();
 $('#nbn').addEventListener('input',e=>{st.name=e.target.value;draw()});
 $('#nbb').addEventListener('input',e=>{st.brewery=e.target.value;draw()});
 $('#nbs').addEventListener('change',e=>{st.style=e.target.value;draw()});
 $('#nba').addEventListener('input',e=>st.abv=e.target.value);
 sh.addEventListener('click',e=>{const g=e.target.closest('[data-glass]'),l=e.target.closest('[data-lbl]');
  if(g){st.glass=g.dataset.glass;$$('[data-glass]',sh).forEach(x=>x.classList.toggle('on',x===g));draw()}
  if(l){const v=LBL[+l.dataset.lbl];st.label=v[0];st.label2=v[1];$$('[data-lbl]',sh).forEach(x=>x.classList.toggle('on',x===l));draw()}});
 NB={st,after};
}
function nbSave(){
 const st=NB.st;const name=st.name.trim();if(!name){toast('Bitte einen Namen eingeben','info');$('#nbn').focus();return}
 const pre={bier:'c-',wein:'wn-c-',whisky:'wk-c-'}[KAT],id=pre+uid();const abv=parseFloat(String(st.abv).replace(',','.'))||parseFloat(w.abv)||5;
 const it=nbItem(st);
 S.customBeers.push(Object.assign({id,name,brewery:st.brewery.trim()||'Unbekannte '+w.maker,style:st.style,abv,origin:'',country:'DE',custom:true,by:ME,desc:'Von '+U(ME).name+' angelegt.',svg:it.svg},KAT==='bier'?{}:{kat:KAT,grp:it.grp}));save();
 const after=NB.after;NB=null;
 if(after)after(id);else rateSheet(id,true);
 toast(w.one+' angelegt','check');
}
/* Tasting-Sheets */
let TS=null;
function tastingSheet(t,preBeer,preFriends){
 const isNew=!t;const nd=new Date();nd.setDate(nd.getDate()+7);nd.setHours(19,0,0,0);
 const st=t?{date:t.date,parts:t.participants.slice(),beers:t.beers.slice()}:{date:nd.getTime(),parts:[ME,...(preFriends||(FRIENDS().length===1?FRIENDS():[]))],beers:preBeer?[preBeer]:[]};
 const host=t?(t.host||ME):ME, nmOf=u=>u===ME?'Du':esc(U(u).name);
 // wählbar: eigene Freunde + bereits Eingeladene (außer Gastgeber)
 const pickable=[...new Set([...(host===ME?[]:[ME]),...FRIENDS(),...st.parts])].filter(u=>u!==host);
 const d=new Date(st.date),p2=n=>String(n).padStart(2,'0'),ds=`${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`,tm=`${p2(d.getHours())}:${p2(d.getMinutes())}`;
 const sh=openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Abbrechen</button><h3>${isNew?'Abend planen':'Abend bearbeiten'}</h3><button class="r" data-act="tsSave">Sichern</button></div>
 <div class="sheet-body"><div class="field"><label>Name</label><input id="tsn" placeholder="z. B. Freitag Tasting" value="${t?esc(t.name):''}"></div>
 <div class="field"><label>Datum</label><input id="tsd" type="date" value="${ds}"></div>
 <div class="field"><label>Uhrzeit</label><input id="tst" type="time" value="${tm}"></div>
 <div class="field"><label>Ort</label><input id="tsp" value="${t?esc(t.place):'Bei mir'}"></div>
 <div class="field"><label>Notiz</label><input id="tso" placeholder="optional" value="${t?esc(t.note||''):''}"></div>
 <div class="lbl">Teilnehmer · <span id="tspc">${st.parts.length}</span></div><div class="group"><div class="pickrow on"><span class="av" style="width:36px;height:36px"><img crossorigin="anonymous" src="${U(host).img}" alt=""></span><div class="tx"><div class="nm">${nmOf(host)} (Gastgeber)</div></div><span class="ck">${ic('check')}</span></div>${pickable.map(o=>`<button class="pickrow ${st.parts.includes(o)?'on':''}" data-tpart="${o}"><span class="av" style="width:36px;height:36px"><img crossorigin="anonymous" src="${U(o).img}" alt=""></span><div class="tx"><div class="nm">${nmOf(o)}</div><div class="sb">${o===ME?'':matchesWith(o).length+' Matches'}</div></div><span class="ck">${ic('check')}</span></button>`).join('')}${!FRIENDS().length?`<div class="pickrow" style="color:#8a7e74;font-size:14px">Noch keine Freunde – füge sie unter „Freunde“ hinzu.</div>`:''}</div>
 <div class="lbl">${w.list} · <span id="tscount">${st.beers.length}</span> ausgewählt</div><div class="search">${ic('search')}<input id="tsq" type="search" placeholder="${w.many} suchen" autocomplete="off" autocorrect="off" spellcheck="false"></div>
 <div class="group" id="tsbeers" style="margin-top:8px"></div>
 <div class="btnrow"><button class="btn gold" data-act="tsSave">${ic('check')} ${isNew?'Abend anlegen':'Änderungen sichern'}</button></div>
 ${!isNew?`<div class="btnrow" style="margin-top:8px"><button class="btn danger" data-act="delTasting" data-id="${t.id}">${ic('trash')} Abend löschen</button></div>`:''}</div>`,{full:true});
 sh.addEventListener('click',e=>{const pb=e.target.closest('[data-tbeer]'),pp=e.target.closest('[data-tpart]');
  if(pb){const id=pb.dataset.tbeer,i=st.beers.indexOf(id);if(i>=0)st.beers.splice(i,1);else st.beers.push(id);pb.classList.toggle('on',i<0);$('#tscount').textContent=st.beers.length}
  if(pp){const o=pp.dataset.tpart,i=st.parts.indexOf(o);if(i>=0)st.parts.splice(i,1);else st.parts.push(o);pp.classList.toggle('on',i<0);$('#tspc').textContent=st.parts.length}});
 const tsRow=b=>`<button class="pickrow ${st.beers.includes(b.id)?'on':''}" data-tbeer="${b.id}"><span class="pic">${thumb(b)}</span><div class="tx"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.style)} · ${fmtAbv(b.abv)}</div></div><span class="ck">${ic('check')}</span></button>`;
 const tsFill=q=>{const L=searchBeers(q,{});if(!q)L.sort((a,b)=>(st.beers.includes(b.id)?1:0)-(st.beers.includes(a.id)?1:0));lazyList($('#tsbeers'),$('.sheet-body',sh),L,tsRow,'<div class="empty">Nichts gefunden.</div>')};
 tsFill('');let tq;$('#tsq').addEventListener('input',e=>{clearTimeout(tq);tq=setTimeout(()=>tsFill(e.target.value),90)});
 TS={st,t};
}
function tsSave(){
 const {st,t}=TS;const name=$('#tsn').value.trim();if(!name){toast('Bitte einen Namen eingeben','info');$('#tsn').focus();return}
 const [y,mo,da]=($('#tsd').value||'').split('-').map(Number),[hh,mi]=($('#tst').value||'19:00').split(':').map(Number);
 const date=y?new Date(y,mo-1,da,hh||0,mi||0).getTime():st.date;
 const place=$('#tsp').value.trim()||'Bei mir', note=$('#tso').value;
 if(t){const before=t.participants.slice();Object.assign(t,{name,date,place,participants:st.parts.slice(),beers:st.beers.slice(),note});st.parts.filter(u=>u!==ME&&!before.includes(u)).forEach(u=>notify('tasting',`{{u:${ME}}} hat dich zu <b>${esc(t.name)}</b> eingeladen.`,'tasting:'+t.id,false,u,ME));TS=null;save();closeSheet();renderAll();toast('Abend aktualisiert','check');return}
 const nt={id:'t-'+uid(),name,date,place,host:ME,participants:st.parts.slice(),beers:st.beers.slice(),scores:{},status:'planned',note};if(KAT!=='bier')nt.kat=KAT;S.tastings.push(nt);
 S.events.push({type:'tasting',user:ME,tid:nt.id,ts:Date.now(),key:'e-'+nt.id});
 const me=ME;
 nt.participants.filter(u=>u!==me).forEach(fr=>notify('tasting',`{{u:${me}}} hat dich zu <b>${esc(nt.name)}</b> eingeladen.`,'tasting:'+nt.id,false,fr,me));
 TS=null;save();closeSheet();renderAll();toast('Abend angelegt','check');push('tasting',{id:nt.id});
}
let TB=null;
function tbeerSheet(tid,bid){
 const t=S.tastings.find(x=>x.id===tid),b=B(bid),s=t.scores[bid]||{};
 let v=s[ME]!=null?s[ME]:((rOf(ME,bid)||{}).score||80);
 const a=avgOf(t,bid);
 const sh=openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Schließen</button><h3>${esc(t.name)}</h3><span class="r"></span></div><div class="sheet-body">
 <div class="card rate-head"><div class="pic">${thumb(b)}</div><div><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)}<br>${esc(b.style)} · ${fmtAbv(b.abv)}</div></div><button class="chg" data-go="beer" data-id="${bid}">Details</button></div>
 ${t.status==='done'?'':`<div class="dial"><div class="num" id="tbn">${v}<span>/100</span></div><div class="verdict" id="tbv">${verdict(v)}</div></div><input type="range" class="range" id="tbr" min="0" max="100" value="${v}" style="--p:${v}%" aria-label="Punkte">`}
 <div class="lscores">${t.participants.map(u=>`<div class="lscore ${u===ME?'me':''}">${av(u)}<div><b>${s[u]==null?'–':s[u]}</b><small>${u===ME?'Du':U(u).name}</small></div></div>`).join('')}<div class="lscore" style="background:#fcefd9;flex:.7;justify-content:center"><div style="text-align:center"><b>${a==null?'–':a}</b><small>Ø</small></div></div></div>
 ${t.status==='done'?'':`<div class="btnrow"><button class="btn green" data-act="tbSave">${ic('check')} Meine Punkte speichern</button></div><div class="btnrow" style="margin-top:8px"><button class="btn danger" data-act="tbRemove">${ic('trash')} Von der Liste entfernen</button></div>`}</div>`);
 const rg=$('#tbr',sh);if(rg)rg.addEventListener('input',()=>{v=+rg.value;rg.style.setProperty('--p',v+'%');$('#tbn').innerHTML=v+'<span>/100</span>';$('#tbv').textContent=verdict(v)});
 TB={t,bid,get v(){return v}};
}
let AB=null;
function addBeerSheet(tid){
 const t=S.tastings.find(x=>x.id===tid);
 const sh=openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Abbrechen</button><h3>${w.one} hinzufügen</h3><button class="r" data-act="closeSheet">Fertig</button></div><div class="sheet-body"><div class="search">${ic('search')}<input id="abq" type="search" placeholder="Bier, Brauerei, Stil oder Land" autocomplete="off" autocorrect="off" spellcheck="false"></div>
 <button class="card lrow pressable" data-act="abNew" style="margin-top:10px"><span class="pic" style="color:#d8921a;font-size:28px;width:40px;height:44px">${ic('plus')}</span><div class="tx"><div class="nm">${w.neuA} anlegen</div></div></button>
 <div class="group" id="abl" style="margin-top:10px"></div></div>`,{full:true,onclose:()=>setTimeout(renderAll,10)});
 sh.addEventListener('click',e=>{const pb=e.target.closest('[data-abeer]');if(!pb)return;const id=pb.dataset.abeer,i=t.beers.indexOf(id);if(i>=0){t.beers.splice(i,1);delete t.scores[id]}else t.beers.push(id);pb.classList.toggle('on',i<0);save()});
 const abRow=b=>`<button class="pickrow ${t.beers.includes(b.id)?'on':''}" data-abeer="${b.id}"><span class="pic">${thumb(b)}</span><div class="tx"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)} · ${esc(b.style)}</div></div><span class="ck">${ic('check')}</span></button>`;
 const abFill=q=>{const L=searchBeers(q,{});if(!q)L.sort((a,b)=>(t.beers.includes(b.id)?1:0)-(t.beers.includes(a.id)?1:0));lazyList($('#abl'),$('.sheet-body',sh),L,abRow,'<div class="empty">Nichts gefunden.</div>')};
 abFill('');let aq;$('#abq').addEventListener('input',e=>{clearTimeout(aq);aq=setTimeout(()=>abFill(e.target.value),90)});
 AB=t;
}
function toTastingSheet(bid){
 const list=TSK().filter(t=>t.status!=='done');
 openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Abbrechen</button><h3>Zu welchem Abend?</h3><span class="r"></span></div><div class="sheet-body"><div class="group">${list.map(t=>`<button class="pickrow ${t.beers.includes(bid)?'on':''}" data-tt="${t.id}" data-b="${bid}"><span class="pic" style="font-size:22px;color:#c47d14">${ic('cal')}</span><div class="tx"><div class="nm">${esc(t.name)}</div><div class="sb">${fmtDate(t.date)} · ${esc(t.place)}</div></div><span class="ck">${ic('check')}</span></button>`).join('')}</div><div class="btnrow"><button class="btn ghost" data-act="newTastingWith" data-id="${bid}">${ic('plus')} Neuen Abend planen</button></div></div>`);
}
const APP_URL='https://hopfenmatch.github.io/';
function inviteSheet(){
 const link=APP_URL, nm=U(ME).name, txt=`Registrier dich bei HopfenMatch und such mich: ${nm} 🍻`;
 openSheet(`<div class="sheet-hd"><span class="l"></span><h3>Freund einladen</h3><button class="r" data-act="closeSheet">Fertig</button></div><div class="sheet-body" style="text-align:center">
 <div style="display:flex;justify-content:center;margin-top:6px">${av(ME,'style="width:72px;height:72px;box-shadow:0 0 0 3px #fff,0 3px 10px rgba(0,0,0,.15)"')}</div><h2 style="font-family:var(--serif);font-size:22px;margin:10px 0 4px;color:#3a1609">Prost mit Freunden!</h2><p style="color:#5d4a3e;font-size:14.5px;margin:0 10px 12px;line-height:1.4">Schick deinen Freunden den Link. Sie registrieren sich mit Name und Passwort und suchen dich unter „Freunde“ nach <b>${esc(nm)}</b>.</p>
 <div class="invmsg">„${esc(txt)}“<br><span>${link}</span></div>
 <div class="linkbox">${ic('link')}<span>${link.replace('https://','')}</span><button class="btn-soft" data-act="copyLink" data-link="${esc(txt+' '+link)}">${ic('copy')} Kopieren</button></div>
 <div class="sharegrid"><button class="shb" data-act="share" data-link="${link}" data-text="${esc(txt)}"><i style="background:#d8921a">${ic('share')}</i>Teilen</button><a class="shb" href="https://wa.me/?text=${encodeURIComponent(txt+' '+link)}" target="_blank" rel="noopener" style="text-decoration:none"><i style="background:#25d366">${ic('msg')}</i>WhatsApp</a><a class="shb" href="sms:?&body=${encodeURIComponent(txt+' '+link)}" style="text-decoration:none"><i style="background:#34c759">${ic('msg')}</i>SMS</a><a class="shb" href="mailto:?subject=${encodeURIComponent('Einladung zu HopfenMatch')}&body=${encodeURIComponent('Servus! '+txt+'\n\n'+link)}" style="text-decoration:none"><i style="background:#3b82c4">${ic('mail')}</i>E-Mail</a></div></div>`);
}
/* Freunde zu einem bestehenden Tasting hinzufügen */
function addPartSheet(t){
 const cand=FRIENDS().filter(f=>!t.participants.includes(f));
 if(!cand.length){infoDlg(FRIENDS().length?'Alle Freunde dabei':'Noch keine Freunde',FRIENDS().length?'Alle deine Freunde sind schon eingeladen. Weitere holst du über „Einladen“ zu HopfenMatch.':'Füge zuerst Freunde hinzu – unter „Freunde“ per Namenssuche.');return}
 const sel=new Set();
 const sh=openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Abbrechen</button><h3>Freunde einladen</h3><button class="r" id="apok">Einladen</button></div><div class="sheet-body"><div class="group">${cand.map(f=>`<button class="pickrow" data-ap="${f}">${av(f,'style="width:36px;height:36px"')}<div class="tx"><div class="nm">${esc(U(f).name)}</div><div class="sb">${matchesWith(f).length} Matches</div></div><span class="ck">${ic('check')}</span></button>`).join('')}</div></div>`);
 sh.addEventListener('click',e=>{const b=e.target.closest('[data-ap]');if(b){const f=b.dataset.ap;if(sel.has(f))sel.delete(f);else sel.add(f);b.classList.toggle('on',sel.has(f))}
  if(e.target.closest('#apok')){if(!sel.size){toast('Wähle mindestens einen Freund','info');return}sel.forEach(f=>{t.participants.push(f);notify('tasting',`{{u:${ME}}} hat dich zu <b>${esc(t.name)}</b> eingeladen.`,'tasting:'+t.id,false,f,ME)});save();closeSheet();renderAll();toast(nameList([...sel])+' eingeladen','check')}});
}

/* ---------- Overlays, Toasts ---------- */
let toastT;
function toast(msg,icon='check'){const t=$('#toast');t.innerHTML=ic(icon)+esc(msg);t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2300)}
function notify(kind,text,link,read,to=ME,from=null){S.notifs.push({id:uid(),to,from,ts:Date.now(),kind,text,link,read:!!read});save();if(!read&&to===ME)$$('.hdr .bell').forEach(b=>{if(!b.querySelector('.dot'))b.insertAdjacentHTML('beforeend','<span class="dot"></span>')})}
function matchOverlay(bid,f){
 f=f||mFr(bid)[0];if(!f)return;
 const b=B(bid),o=rOf(f,bid),m=rOf(ME,bid);if(!o||!m)return;const ov=$('#overlay');
 const conf=S.settings.sounds?`<div class="confetti">${Array.from({length:36},(_,i)=>`<i style="left:${Math.random()*100}%;background:${['#e6a42b','#62803a','#c47d14','#f2d27a','#8fb35a'][i%5]};animation-delay:${Math.random()*.6}s;animation-duration:${1.6+Math.random()*1.2}s"></i>`).join('')}</div>`:'';
 ov.innerHTML=`<div class="mbox">${conf}<div class="avs">${av(ME)}${av(f)}</div><span class="hrt">${ic('heartf')}</span><h2>${wOf(b.id).match}! ${wOf(b.id).emo}</h2><p>Du (${m.score}) und ${esc(FN(f))} (${o.score}) liebt beide<br><b>${esc(b.name)}</b>.</p><div class="pic">${thumb(b)}</div><div class="btnrow"><button class="btn ghost" data-act="ovClose">Prost!</button><button class="btn green" data-act="ovPlan" data-id="${bid}">Tasting planen</button></div></div>`;
 ov.classList.add('on');
}
function confirmDlg(title,text,okLabel,onOk,danger=true){
 const ov=$('#overlay');ov.innerHTML=`<div class="dlg"><h4>${title}</h4><p>${text}</p><div class="bb"><button data-act="ovClose">Abbrechen</button><button class="${danger?'red':''}" id="dlgok">${okLabel}</button></div></div>`;ov.classList.add('on');
 $('#dlgok').onclick=()=>{ov.classList.remove('on');onOk()};
}
function infoDlg(title,html){const ov=$('#overlay');ov.innerHTML=`<div class="dlg"><h4>${title}</h4><p>${html}</p><div class="bb"><button data-act="ovClose" style="font-weight:700">OK</button></div></div>`;ov.classList.add('on')}

/* ---------- Ereignisse ---------- */
function openLink(l){if(!l)return;const [k,v]=l.split(':');if(k==='beer')push('beer',{id:v});else if(k==='tasting')push('tasting',{id:v});else if(k==='discover')push('discover');else if(k==='user')push('friend',{id:v});else if(k==='freq'){closeAllPages();showTab('freunde')}else if(k==='activities')push('activities')}
function curPage(){return STACK[STACK.length-1]}
document.addEventListener('click',e=>{
 const el=e.target;
 if(el.closest('a[href]'))return;
 const like=el.closest('[data-like]');if(like){const k=like.dataset.like,L=myLikes();L[k]=!L[k];save();like.classList.toggle('on',L[k]);like.classList.remove('pop');void like.offsetWidth;like.classList.add('pop');if(L[k]){toast('Gefällt dir','heartf');likeNotify(k)}return}
 const fav=el.closest('[data-fav]');if(fav){const id=fav.dataset.fav,F=myFavs(),i=F.indexOf(id);if(i>=0)F.splice(i,1);else F.push(id);save();fav.classList.toggle('on',i<0);fav.classList.remove('pop');void fav.offsetWidth;fav.classList.add('pop');toast(i<0?'Zu Favoriten hinzugefügt':'Aus Favoriten entfernt','heartf');return}
 const frb=el.closest('[data-fr]');if(frb){friendAct(frb.dataset.fr,frb.dataset.id,frb);return}
 const mb=el.closest('[data-match]');if(mb){matchOverlay(mb.dataset.match,mb.dataset.f);return}
 const tg=el.closest('[data-tab-go]');if(tg){showTab(tg.dataset.tabGo);return}
 const tab=el.closest('[data-tab]');if(tab){showTab(tab.dataset.tab);return}
 const f=el.closest('[data-filter]');if(f){RFILTER=f.dataset.filter;renderTab('rangliste');return}
 const af=el.closest('[data-actf]');if(af){const p=curPage();p.params.f=af.dataset.actf;refreshPage(p);return}
 const sg=el.closest('[data-seg2]');if(sg){const p=curPage();p.params.seg=sg.dataset.seg2;refreshPage(p);return}
 const tgl=el.closest('[data-toggle]');if(tgl){const k=tgl.dataset.toggle;S.settings[k]=!S.settings[k];save();tgl.classList.toggle('on',S.settings[k]);return}
 const tagb=el.closest('[data-tag]');if(tagb&&RATE){const t=tagb.dataset.tag,i=RATE.tags.indexOf(t);if(i>=0)RATE.tags.splice(i,1);else RATE.tags.push(t);tagb.classList.toggle('on',i<0);return}
 const qb=el.closest('[data-q]');if(qb&&RATE){const q=qb.dataset.q;setScore(q==='-1'?RATE.score-1:q==='+1'?RATE.score+1:+q);return}
 const pk=el.closest('[data-pick]');if(pk&&RATE){RATE.beer=pk.dataset.pick;const r=rOf(ME,RATE.beer);if(r){RATE.score=r.score;RATE.tags=r.tags.slice();RATE.comment=r.comment;RATE.edit=r.id}else{RATE.score=80;RATE.tags=[];RATE.comment='';RATE.edit=null}drawRate();const sb=$('#rate .sheet-body');if(sb)sb.scrollTop=0;return}
 const tt=el.closest('[data-tt]');if(tt){const t=S.tastings.find(x=>x.id===tt.dataset.tt),b=tt.dataset.b;if(!t.beers.includes(b)){t.beers.push(b);tt.classList.add('on');toast('Zu „'+t.name+'“ hinzugefügt','check')}else{t.beers.splice(t.beers.indexOf(b),1);delete t.scores[b];tt.classList.remove('on');toast('Entfernt','check')}save();renderAll();return}
 const nt=el.closest('[data-notif]');if(nt&&!el.closest('[data-act]')){const n=S.notifs.find(x=>x.id===nt.dataset.notif);if(n){n.read=true;save();openLink(n.link);renderTab(TAB)}return}
 const go=el.closest('[data-go]'), act=el.closest('[data-act]');
 if(act&&(!go||go.contains(act))){handleAct(act.dataset.act,act,e);return}
 if(go){
  const g=go.dataset.go,id=go.dataset.id;
  if(SHEET)closeSheet();
  if(g==='activities'){push('activities',{f:go.dataset.f});return}
  if(g==='friend'){if(id===ME){push('profile');return}push('friend',{id:id||FRIENDS()[0],seg:go.dataset.seg});return}
  push(g,{id});return}
});
function handleAct(a,el){
 const id=el.dataset.id;
 switch(a){
  case 'back':pop();break;
  case 'rate':closeSheet(true);rateSheet(id,!!id);break;
  case 'rateBack':RATE.beer=null;RATE.edit=null;drawRate();break;
  case 'saveRating':saveRating();break;
  case 'closeSheet':closeSheet();break;
  case 'newBeer':newBeerSheet();break;
  case 'nbSave':nbSave();break;
  case 'abNew':{const t=AB;newBeerSheet(nid=>{t.beers.push(nid);save();renderAll();addBeerSheet(t.id)});break}
  case 'delRating':{const r=S.ratings.find(x=>x.id===id);if(!r||r.user!==ME)break;confirmDlg('Bewertung löschen?',`Deine Bewertung von „${esc(B(r.beer).name)}“ wird entfernt.`,'Löschen',()=>{S.ratings=S.ratings.filter(x=>x.id!==id);save();closeSheet();renderAll();toast('Bewertung gelöscht','trash')});break}
  case 'invite':inviteSheet();break;
  case 'copyLink':{const l=el.dataset.link;const fb=()=>{const ta=document.createElement('textarea');ta.value=l;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Link kopiert','copy')}catch(x){toast('Kopieren nicht möglich','info')}ta.remove()};if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(l).then(()=>toast('Link kopiert','copy')).catch(fb);else fb();break}
  case 'share':{const l=el.dataset.link;if(navigator.share)navigator.share({title:'HopfenMatch',text:el.dataset.text||'Komm zu HopfenMatch und lass uns Bier, Wein und Whisky matchen! 🍻',url:l}).catch(()=>{});else{toast('Teilen nicht verfügbar – Link kopiert','copy');navigator.clipboard&&navigator.clipboard.writeText(l).catch(()=>{})}break}
  case 'newTasting':closeSheet(true);tastingSheet();break;
  case 'newTastingWith':closeSheet(true);tastingSheet(null,id);break;
  case 'editTasting':tastingSheet(S.tastings.find(x=>x.id===id));break;
  case 'tsSave':tsSave();break;
  case 'delTasting':{const t=S.tastings.find(x=>x.id===id);confirmDlg('Abend löschen?',`„${esc(t.name)}“ und alle Wertungen werden gelöscht.`,'Löschen',()=>{S.tastings=S.tastings.filter(x=>x.id!==id);S.events=S.events.filter(x=>x.tid!==id);save();closeSheet();const p=curPage();if(p&&p.params.id===id)pop();renderAll();toast('Abend gelöscht','trash')});break}
  case 'tbeer':tbeerSheet(el.dataset.t,id);break;
  case 'tbSave':{const {t,bid}=TB;t.scores[bid]=t.scores[bid]||{};t.scores[bid][ME]=TB.v;save();closeSheet();renderAll();toast('Punkte gespeichert','check');break}
  case 'tbRemove':{const {t,bid}=TB;t.beers=t.beers.filter(x=>x!==bid);delete t.scores[bid];save();closeSheet();renderAll();toast('Von der Liste entfernt','trash');break}
  case 'addBeer':addBeerSheet(id);break;
  case 'addFriend':{const t=S.tastings.find(x=>x.id===id);if(t)addPartSheet(t);break}
  case 'newTastingFr':closeSheet(true);tastingSheet(null,null,[id]);break;
  case 'removeFriend':confirmDlg('Freund entfernen?',`${esc(U(id).name)} und du seht dann eure Bewertungen und Matches nicht mehr. Ihr könnt euch jederzeit wieder anfragen.`,'Entfernen',()=>friendAct('remove',id));break;
  case 'accName':accNameSheet();break;
  case 'accPass':accPassSheet();break;
  case 'accAvatar':accAvatarSheet();break;
  case 'accDelete':accDeleteSheet();break;
  case 'parts':{const t=S.tastings.find(x=>x.id===id);infoDlg('Teilnehmer',t.participants.map(u=>(u===ME?'Du':esc(U(u).name))+(u===t.host?' 👑 Gastgeber':' ✓ zugesagt')).join('<br>'));break}
  case 'startTasting':{const t=S.tastings.find(x=>x.id===id);if(!t.beers.length){toast('Füge zuerst '+w.many+' hinzu','info');addBeerSheet(id);break}S.tastings.forEach(x=>{if(x.status==='live'&&x.id!==id)x.status='done'});t.status='live';save();renderAll();push('live',{id});toast('Tasting gestartet – Prost! 🍻','beer');break}
  case 'lsave':{const p=curPage(),t=S.tastings.find(x=>x.id===id),bid=t.beers[p.idx],v=+$('#lrange',p.el).value;p.cur=null;t.scores[bid]=t.scores[bid]||{};t.scores[bid][ME]=v;save();toast('Gespeichert: '+v,'check');refreshPage(p);renderTab('planen');break}
  case 'lnext':{const p=curPage(),t=S.tastings.find(x=>x.id===p.params.id),bid=t.beers[p.idx];if((t.scores[bid]||{})[ME]==null){t.scores[bid]=t.scores[bid]||{};t.scores[bid][ME]=+$('#lrange',p.el).value;save()}clearTimeout(p.tm);p.cur=null;p.idx++;refreshPage(p);renderTab('planen');break}
  case 'lprev':{const p=curPage();clearTimeout(p.tm);p.cur=null;p.idx=Math.max(0,p.idx-1);refreshPage(p);break}
  case 'finishTasting':{const p=curPage(),t=S.tastings.find(x=>x.id===id),bid=t.beers[p.idx];if((t.scores[bid]||{})[ME]==null){t.scores[bid]=t.scores[bid]||{};t.scores[bid][ME]=+$('#lrange',p.el).value}
   t.status='done';save();clearTimeout(p.tm);STACK.pop();p.el.remove();renderAll();push('result',{id});toast('Abend abgeschlossen','flag');break}
  case 'importScores':{const t=S.tastings.find(x=>x.id===id);let n=0;const newM=[];t.beers.forEach(b=>{const v=(t.scores[b]||{})[ME];if(v!=null&&!rOf(ME,b)){S.ratings.push({id:uid(),user:ME,beer:b,score:v,tags:[],comment:'Beim '+t.name+' probiert.',ts:Date.now()-n*1000});n++;if(isMatch(b))newM.push(b)}});save();renderAll();toast(n+' Bewertung'+(n===1?'':'en')+' übernommen','check');if(newM.length)setTimeout(()=>matchOverlay(newM[0]),400);break}
  case 'shareResult':{const t=S.tastings.find(x=>x.id===id),w=winner(t);const txt=`${w.emo} ${t.name}: Sieger ist ${w?B(w.b).name+' mit Ø '+w.a:'–'}! #HopfenMatch`;if(navigator.share)navigator.share({title:'HopfenMatch',text:txt}).catch(()=>{});else{navigator.clipboard&&navigator.clipboard.writeText(txt).catch(()=>{});toast('Ergebnis kopiert','copy')}break}
  case 'toTasting':toTastingSheet(id);break;
  case 'readAll':myNotifs().forEach(n=>n.read=true);save();renderAll();toast('Alles gelesen','check');break;
  case 'reset':if(syncOn()){confirmDlg('Neu vom Server laden?','Der lokale Zwischenspeicher wird verworfen und alle Daten werden neu vom Server geladen. Noch nicht gesendete Änderungen gehen verloren.','Neu laden',()=>{resetCache();toast('Lade Daten vom Server …','refresh')});break}confirmDlg('Daten zurücksetzen?','Alle Bewertungen, Tastings und Mitteilungen auf diesem Gerät werden gelöscht.','Zurücksetzen',()=>{localStorage.removeItem(LS);seed();closeAllPages();RFILTER='all';TAB='';showTab('start');renderAll();toast('Alles auf null gesetzt','refresh')});break;
  case 'install':infoDlg('Als App installieren','iPhone (Safari): Tippe unten auf <b>Teilen</b> und wähle <b>„Zum Home-Bildschirm“</b>. HopfenMatch startet dann im Vollbild wie eine echte App – auch offline.');break;
  case 'logout':confirmDlg('Abmelden?',`Du bist als ${esc(U(ME).name)} angemeldet. Deine Daten bleiben auf dem Server gespeichert.`,'Abmelden',logout,false);break;
  case 'syncNow':sync(true).then(()=>{toast(SYNC.online?'Synchronisiert':'Offline – Änderungen werden später gesendet',SYNC.online?'check':'info');const p=curPage();p&&refreshPage(p)});break;
  case 'home':showHome();break;
  case 'about':infoDlg('HopfenMatch 1.11',`Bier, Wein &amp; Whisky. Gute Leute.<br>Bewerte von 0–100, finde Matches mit Freunden (beide über 90) und plane gemeinsame Tasting-Abende – getrennt für Bier, Wein und Whisky.<br><br>Katalog: ${BEERS.length} Biere, ${WINES.length} Weine und ${WHISKIES.length} Whiskys. Bier: ${BEERS.length} Biere aus ${new Set(BEERS.map(b=>b.country)).size} Ländern.`);break;
  case 'ovClose':$('#overlay').classList.remove('on');break;
  case 'ovPlan':$('#overlay').classList.remove('on');tastingSheet(null,id);break;
 }
}



/* ---------- Server-Sync (Supabase Edge Function "hopfenmatch") ----------
   Lokaler Zwischenspeicher S + Schnappschuss des letzten Server-Stands (SY.snap).
   Ausstehende Änderungen = Unterschied zwischen S und Schnappschuss -> werden gesendet, auch nach Offline-Phasen. */
const API='https://wlujgkbtpjxuekwsgnmg.supabase.co/functions/v1/hopfenmatch';
const LS_SYNC='hopfenmatch.sync';
const SYNC_DISABLED=/[?&]nosync/.test(location.search);
const syncOn=()=>!SYNC_DISABLED;
const SYNC={online:navigator.onLine!==false,busy:false,again:false,timer:null,poll:null,err:''};
let SY=(()=>{try{const o=JSON.parse(localStorage.getItem(LS_SYNC));if(o&&o.snap)return o}catch(e){}return {rev:null,snap:{},tokens:{},cred:{},last:0}})();
SY.tokens=SY.tokens||{};SY.cred=SY.cred||{};
function saveSync(){try{localStorage.setItem(LS_SYNC,JSON.stringify(SY))}catch(e){}}
function canon(v){if(Array.isArray(v))return '['+v.map(canon).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).filter(k=>v[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+canon(v[k])).join(',')+'}';return JSON.stringify(v===undefined?null:v)}
function itemsOf(s){
 const m={},put=(kind,id,data)=>{m[kind+'/'+id]={kind,id,data}};
 s.ratings.forEach(r=>put('rating',r.user+':'+r.beer,{user:r.user,beer:r.beer,score:r.score,tags:r.tags||[],comment:r.comment||'',ts:r.ts}));
 s.checkins.forEach(c=>put('checkin',c.id,{id:c.id,user:c.user,beer:c.beer,ts:c.ts,comment:c.comment||''}));
 s.tastings.forEach(t=>{const meta=Object.assign({},t);delete meta.scores;put('tasting',t.id,meta);const sc=t.scores||{};Object.keys(sc).forEach(b=>Object.keys(sc[b]||{}).forEach(u=>{if(sc[b][u]!=null)put('tscore',t.id+'|'+b+'|'+u,{v:sc[b][u]})}))});
 (s.customBeers||[]).forEach(b=>put('cbeer',b.id,b));
 (s.events||[]).forEach(e=>put('event',e.key,e));
 (s.notifs||[]).forEach(n=>put('notif',n.id,n));
 Object.keys(s.likes||{}).forEach(u=>Object.keys(s.likes[u]||{}).forEach(k=>{if(s.likes[u][k])put('like',u+'|'+k,{on:true})}));
 Object.keys(s.favs||{}).forEach(u=>(s.favs[u]||[]).forEach(b=>put('fav',u+'|'+b,{on:true})));
 return m;
}
function fromItems(m){
 const o={v:2,ratings:[],checkins:[],tastings:[],customBeers:[],events:[],notifs:[],likes:{},favs:{},settings:(S&&S.settings)||{push:true,sounds:true},owner:(S&&S.owner)||ME};
 const T={},sc=[],cut=id=>{const i=id.indexOf('|');return [id.slice(0,i),id.slice(i+1)]};
 Object.values(m).forEach(it=>{const d=it.data||{};switch(it.kind){
  case 'rating':o.ratings.push({id:it.id,user:d.user,beer:d.beer,score:d.score,tags:d.tags||[],comment:d.comment||'',ts:d.ts});break;
  case 'checkin':o.checkins.push(Object.assign({},d));break;
  case 'tasting':T[it.id]=Object.assign({},d,{scores:{}});break;
  case 'tscore':sc.push(it);break;
  case 'cbeer':o.customBeers.push(Object.assign({},d));break;
  case 'event':o.events.push(Object.assign({},d));break;
  case 'notif':o.notifs.push(Object.assign({},d));break;
  case 'like':{const [u,k]=cut(it.id);(o.likes[u]=o.likes[u]||{})[k]=true;break}
  case 'fav':{const [u,b]=cut(it.id);(o.favs[u]=o.favs[u]||[]).push(b);break}}});
 sc.forEach(it=>{const [tid,b,u]=it.id.split('|');const t=T[tid];if(t)(t.scores[b]=t.scores[b]||{})[u]=it.data.v});
 o.tastings=Object.values(T);o.ratings.sort((a,b)=>b.ts-a.ts);o.notifs.sort((a,b)=>a.ts-b.ts);
 return o;
}
// Wem gehört ein Eintrag? (gleiche Regel wie auf dem Server)
function ownerOf(it){const id=it.id;return it.kind==='rating'?id.split(':')[0]:(it.kind==='like'||it.kind==='fav')?id.split('|')[0]:it.kind==='tscore'?id.split('|')[2]:it.kind==='checkin'?(it.data&&it.data.user):null}
function pending(){
 const cur=itemsOf(S),out=[];
 for(const k in cur){if(SY.snap[k]!==canon(cur[k].data))out.push(cur[k])}
 for(const k in SY.snap){if(!cur[k]){const i=k.indexOf('/');out.push({kind:k.slice(0,i),id:k.slice(i+1),del:true})}}
 return out;
}
const myPending=()=>pending().filter(it=>{const o=ownerOf(it);return !o||o===ME});
async function api(path,{method='GET',body,token}={}){
 const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),12000);
 try{
  const h={'content-type':'application/json'};const tk=token||SY.tokens[ME];if(tk)h.Authorization='Bearer '+tk;
  const r=await fetch(API+path,{method,headers:h,body:body?JSON.stringify(body):undefined,cache:'no-store',signal:ctl.signal});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||j.bad||j.code){const e=new Error(j.error||('HTTP '+r.status));e.status=j.code||(j.bad?401:r.status);e.field=j.field;throw e}
  return j;
 }finally{clearTimeout(to)}
}
function scheduleSync(){if(!syncOn())return;clearTimeout(SYNC.timer);SYNC.timer=setTimeout(()=>sync(),400)}
function applyRemote(items,first,oldSnap){
 const cur=itemsOf(S);
 if(first&&oldSnap){
  // Neu-Abgleich (z. B. neuer Freund): kompletten sichtbaren Server-Stand übernehmen, nur eigene ungesendete Änderungen behalten
  const m={},snap={};items.forEach(it=>{if(!it.del){const k=it.kind+'/'+it.id;m[k]={kind:it.kind,id:it.id,data:it.data};snap[k]=canon(it.data)}});
  for(const k in cur){const it=cur[k],own=ownerOf(it);if(own&&own!==ME)continue;if(canon(it.data)!==oldSnap[k]&&!(k in snap&&snap[k]===canon(it.data)))m[k]=it}
  for(const k in oldSnap){if(!cur[k]&&snap[k]){const own=ownerOf(m[k]);if(!own||own===ME)delete m[k]}} // lokal gelöscht, noch nicht gesendet
  SY.snap=snap;const before=canon(cur);S=fromItems(m);save(true);return canon(itemsOf(S))!==before;
 }
 if(first){
  // Erste Verbindung dieses Geräts: Server-Stand übernehmen, eigene lokale Änderungen (z. B. aus v1) behalten
  const srv={};items.forEach(it=>{if(!it.del)srv[it.kind+'/'+it.id]=it});
  const keep={},sig=d=>canon({score:d.score,tags:d.tags||[],comment:d.comment||''});
  for(const k in cur){const it=cur[k],sv=srv[k],own=ownerOf(it);
   if(own&&own!==ME)continue;
   if(it.kind==='rating'){if(!sv||(sig(it.data)!==sig(sv.data)&&it.data.ts>sv.data.ts))keep[k]=it}
   else if(['cbeer','tasting','tscore','fav'].includes(it.kind)&&!sv)keep[k]=it}
  SY.snap={};const m={};
  Object.keys(srv).forEach(k=>{m[k]=srv[k];SY.snap[k]=canon(srv[k].data)});
  Object.assign(m,keep);S=fromItems(m);save(true);return true;
 }
 let changed=false;
 items.forEach(it=>{const k=it.kind+'/'+it.id,local=cur[k],lc=local?canon(local.data):undefined;
  if(lc!==SY.snap[k])return; // eigene, noch nicht gesendete Änderung hat Vorrang
  if(it.del){if(local){delete cur[k];changed=true}delete SY.snap[k]}
  else{const c=canon(it.data);SY.snap[k]=c;if(lc!==c){cur[k]={kind:it.kind,id:it.id,data:it.data};changed=true}}});
 if(changed){S=fromItems(cur);save(true)}
 return changed;
}
async function ensureToken(){
 if(SY.tokens[ME])return true;
 if(SY.cred[ME]){try{const j=await api('/login',{method:'POST',body:{name:ME,pass:SY.cred[ME]},token:'-'});SY.tokens[ME]=j.token;delete SY.cred[ME];saveSync();return true}catch(e){if(e.status===401){delete SY.cred[ME];saveSync()}return false}}
 return false;
}
async function sync(force){
 if(!syncOn()||!LOGGED())return;
 if(SYNC.busy){SYNC.again=true;return}
 SYNC.busy=true;const me=ME;
 try{
  if(!(await ensureToken()))throw Object.assign(new Error('Kein Token'),{status:navigator.onLine===false?0:401,soft:true});
  const first=SY.rev==null,items=first?[]:myPending().slice(0,400),oldSnap=first&&SY.resync?SY.snap:null;
  const beforeN=new Set(myNotifs().map(n=>n.id));
  const res=await api('/sync',{method:'POST',body:{since:first?0:SY.rev,items,epoch:SY.epoch||DATA_EPOCH}});
  if(ME!==me)return;
  const dirChanged=res.dir&&res.dir.me===ME?setDir(res.dir):false;
  if(res.resetRequired){
   // Daten wurden auf dem Server neu gestartet: lokalen Stand verwerfen und frisch laden
   wipeLocal(res.epoch);closeAllPages();renderAll();SYNC.online=true;SYNC.again=true;return;
  }
  const rej=new Set((res.rejected||[]).map(x=>x.kind+'/'+x.id));
  items.forEach(it=>{const k=it.kind+'/'+it.id;if(it.del)delete SY.snap[k];else if(!rej.has(k))SY.snap[k]=canon(it.data)});
  rej.forEach(k=>delete SY.snap[k]);
  const changed=applyRemote(res.items||[],first,oldSnap)||dirChanged;
  SY.rev=res.rev;SY.last=Date.now();SYNC.online=true;SYNC.err='';SY.resync=false;
  // Freundeskreis oder Tasting-Teilnahme geändert -> sichtbaren Stand komplett neu abgleichen (ältere Bewertungen neuer Freunde)
  if(res.dir&&res.dir.fv!==SY.fv){if(!first&&SY.fv){SY.rev=null;SY.resync=true;SYNC.again=true}SY.fv=res.dir.fv}
  if(res.dir&&res.dir.users&&res.dir.users[ME])rememberAcc(ME,res.dir.users[ME]);
  saveSync();
  if(changed){
   rerenderSoft();
   const fresh=myNotifs().filter(n=>!n.read&&!beforeN.has(n.id)&&n.ts>Date.now()-10*60e3);
   if(!first&&fresh.length){const d=document.createElement('div');d.innerHTML=ntext(fresh[fresh.length-1].text);toast(d.textContent,'bell')};
  }
  if(myPending().length)SYNC.again=true;
 }catch(e){
  SYNC.online=false;SYNC.err=e.message||'';
  if(e.status===401&&!e.soft){delete SY.tokens[ME];saveSync();if(!SY.cred[ME]){toast('Bitte neu anmelden','info');logout()}}
 }finally{
  SYNC.busy=false;
  if(SYNC.again){SYNC.again=false;setTimeout(sync,300)}
 }
}
function rerenderSoft(){
 // Tabs + offene Seiten neu zeichnen, ohne offene Sheets zu stören (Katalog bleibt stehen)
 TABS.forEach(renderTab);STACK.forEach(p=>{if(!p.static)refreshPage(p)});
 if(window.HMHome&&HMHome.update&&HMHome.visible()&&LOGGED())HMHome.update(homeInfo());
}
function syncLabel(){const n=myPending().length;if(!SYNC.online)return n?`${n} Änderung${n===1?'':'en'} warten`:'Daten lokal';if(n)return `${n} wird gesendet …`;if(!SY.last)return '–';const s=Math.round((Date.now()-SY.last)/1000);return s<5?'gerade eben':s<60?`vor ${s} s`:rel(SY.last)}
function pollLoop(){
 clearTimeout(SYNC.poll);
 const live=STACK.some(p=>p.name==='live')||(TAB==='planen'&&S.tastings.some(t=>t.status==='live'));
 const iv=document.hidden?60000:live?3000:10000;
 SYNC.poll=setTimeout(async()=>{if(!document.hidden)await sync();pollLoop()},iv);
}
function resetCache(){SY.rev=null;SY.snap={};SY.fv='';saveSync();S=fromItems({});save(true);closeAllPages();renderAll();sync(true)}
/* ---------- Katalog: Suche, Lazy-Listen, Seite ---------- */
const CAT={q:'',g:'',c:'',r:'',s:''};
function nrm(s){return HM_CATALOG.norm(s)}
function hayOf(b){if(!b.hay){const C=COUNTRIES[b.country]||['',''];b.hay=nrm([b.name,b.brewery,b.style,b.origin||'',C[0],b.reg||'',b.kat?grpName(b):(STYLE_META[b.style]||{}).g||''].join(' '))}if(!b.words)b.words=[...new Set(b.hay.split(/[^a-z0-9]+/).filter(w=>w.length>2))];return b.hay}
function ed1(a,b){ // Editierdistanz <= 1 (Tippfehler: fehlend, zu viel, vertauscht, falsch)
 if(a===b)return true;const la=a.length,lb=b.length;if(Math.abs(la-lb)>1)return false;
 let i=0;while(i<la&&i<lb&&a[i]===b[i])i++;
 if(la===lb){if(a.slice(i+1)===b.slice(i+1))return true;return a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2)}
 return la>lb?a.slice(i+1)===b.slice(i):a.slice(i)===b.slice(i+1)}
function tokOk(b,t){const h=hayOf(b);if(h.includes(t))return 2;if(t.length<4)return 0;
 for(const w of b.words){if(ed1(t,w)||(w.length>t.length&&ed1(t,w.slice(0,t.length)))||(w.length>t.length&&ed1(t,w.slice(0,t.length+1))))return 1}return 0}
function grpName(b){const g=(KD[katOf(b.id)].groups.find(x=>x[0]===b.grp)||[])[1]||'';return g+(b.kat==='wein'?' '+(b.grp==='rot'?'Rotwein':b.grp==='weiss'?'Weisswein':b.grp==='rose'?'Rosewein':b.grp==='schaum'?'Sekt Schaumwein':'Suesswein'):'')}
function searchBeers(q,{g,c,r,s:sty}={}){
 const toks=nrm(q||'').split(/[^a-z0-9]+/).filter(Boolean);
 const out=[],rb=r&&r.startsWith('by:')?r.slice(3):null;
 for(const b of beers()){
  if(g&&grpOf(b)!==g)continue;if(c&&(b.country||'DE')!==c)continue;if(sty&&b.style!==sty)continue;
  if(r&&(KAT==='bier'?(rb?b.reg!==rb:b.state!==r):b.reg!==r))continue;
  if(!toks.length){out.push({b,s:0});continue}
  let sc=0,ok=true;for(const t of toks){const r=tokOk(b,t);if(!r){ok=false;break}sc+=r}
  if(!ok)continue;const nn=nrm(b.name);if(nn.startsWith(toks[0]))sc+=3;else if(nn.includes(toks[0]))sc+=1;
  out.push({b,s:sc})}
 out.sort((x,y)=>y.s-x.s||x.b.name.localeCompare(y.b.name,'de'));
 return out.map(x=>x.b);
}
const flag=b=>(COUNTRIES[b.country||'DE']||['',''])[1];
/* Lazy-Liste: rendert in Häppchen, sobald das Ende in Sichtweite kommt (IntersectionObserver) */
function lazyList(host,scroller,items,row,empty,min){
 if(host._io)host._io.disconnect();
 const CH=40;let n=0;host.innerHTML='';
 if(!items.length){host.innerHTML=empty||'';return}
 const sent=document.createElement('div');sent.className='lz-sent';
 const more=k=>{const part=items.slice(n,n+k);n+=part.length;sent.remove();host.insertAdjacentHTML('beforeend',part.map(row).join(''));if(n<items.length)host.appendChild(sent);else if(host._io)host._io.disconnect()};
 more(Math.max(CH,min||0));
 if(n<items.length&&'IntersectionObserver' in window){host._io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting))more(CH)},{root:scroller||null,rootMargin:'600px 0px'});host._io.observe(sent)}
 else if(n<items.length)more(items.length);
 host._count=()=>n;
}
function catRow(b){const r=rOf(ME,b.id),o=FRIENDS().map(f=>rOf(f,b.id)).filter(Boolean).sort((x,y)=>y.score-x.score)[0];
 return `<button class="card crow pressable" data-go="beer" data-id="${b.id}"><div class="pic">${thumb(b)}</div><div class="tx"><div class="nm">${esc(b.name)}</div><div class="sb">${esc(b.brewery)}</div><div class="sb">${esc(b.style)} · ${fmtAbv(b.abv)} · ${flag(b)} ${esc(b.kat?(b.reg||''):(b.origin||'').split(',')[0])}</div></div>${r?`<span class="scorepill"><b>${r.score}</b>/100</span>`:o&&o.score>90?`<span class="pill-mini">${av(o.user)}${o.score}</span>`:`<span class="chev">${ic('chev')}</span>`}</button>`}
/* Deutsche Anbaugebiete zuerst, dann nach Anzahl */
const DE_WEIN=['Pfalz','Mosel','Rheinhessen','Franken','Rheingau','Nahe','Baden','Württemberg','Ahr','Mittelrhein','Saale-Unstrut','Sachsen','Hessische Bergstraße'];
PAGES.catalog=(prm,p)=>{
 p.static=true; // nicht beim Polling neu zeichnen (Suchfeld behält Fokus)
 const all=beers(),gc={},cc={};all.forEach(b=>{const g=grpOf(b);gc[g]=(gc[g]||0)+1;const c=b.country||'DE';cc[c]=(cc[c]||0)+1});
 const countries=Object.keys(cc).sort((a,b)=>cc[b]-cc[a]||(COUNTRIES[a]||[a])[0].localeCompare((COUNTRIES[b]||[b])[0],'de'));
 const regRow=()=>{
  if(KAT==='bier'){const rc={},bc={};all.forEach(b=>{if(b.state){rc[b.state]=(rc[b.state]||0)+1;if(b.reg)bc[b.reg]=(bc[b.reg]||0)+1}});
   const states=Object.keys(rc).filter(x=>x!=='Bayern').sort((a,b)=>rc[b]-rc[a]||a.localeCompare(b,'de'));
   return [['Bayern','Ganz Bayern',rc.Bayern],...((window.HM_CATALOG&&HM_CATALOG.BYREG)||[]).filter(x=>bc[x]).map(x=>['by:'+x,x,bc[x]]),...states.map(x=>[x,x,rc[x]])].filter(x=>x[2])}
  const rc={};all.forEach(b=>{if(b.reg&&(!CAT.c||b.country===CAT.c)){rc[b.reg]=(rc[b.reg]||0)+1}});
  const de=KAT==='wein'?DE_WEIN.filter(x=>rc[x]):[];
  return [...de.map(x=>[x,x,rc[x],1]),...Object.keys(rc).filter(x=>!de.includes(x)).sort((a,b)=>rc[b]-rc[a]||a.localeCompare(b,'de')).map(x=>[x,x,rc[x]])]};
 const regHTML=()=>{const regs=regRow();return regs.length?`<button class="fchip ${!CAT.r?'on':''}" data-cr="">📍 ${KAT==='wein'?'Alle Regionen &amp; Anbaugebiete':'Alle Regionen'}</button>${regs.map(x=>`<button class="fchip ${CAT.r===x[0]?'on':''} ${x[0].startsWith('by:')?'sub':''}" data-cr="${esc(x[0])}">${x[3]?'🇩🇪 ':''}${esc(x[1])} <span class="n">${x[2]}</span></button>`).join('')}`:''};
 // Wein: zusätzlich nach Rebsorte
 let styRow='';if(KAT==='wein'){const sc={};all.forEach(b=>{sc[b.style]=(sc[b.style]||0)+1});const st=Object.keys(sc).sort((a,b)=>sc[b]-sc[a]||a.localeCompare(b,'de'));
  styRow=`<div class="filters" id="cs" style="margin-top:-4px"><button class="fchip ${!CAT.s?'on':''}" data-cs="">🍇 Alle Rebsorten</button>${st.map(x=>`<button class="fchip ${CAT.s===x?'on':''}" data-cs="${esc(x)}">${esc(x)} <span class="n">${sc[x]}</span></button>`).join('')}</div>`}
 return {title:w.katalog,short:'Katalog',body:`<div class="cat-hd"><div class="search">${ic('search')}<input id="cq" type="search" placeholder="${w.ph}" value="${esc(CAT.q)}" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="search"></div>
 <div class="filters" id="cg"><button class="fchip ${!CAT.g?'on':''}" data-cg="">${w.styles} <span class="n">${all.length}</span></button>${KD[KAT].groups.filter(g=>gc[g[0]]).map(g=>`<button class="fchip ${CAT.g===g[0]?'on':''}" data-cg="${g[0]}">${g[1]} <span class="n">${gc[g[0]]}</span></button>`).join('')}</div>
 ${styRow}
 <div class="filters" id="cc" style="margin-top:-4px"><button class="fchip ${!CAT.c?'on':''}" data-cc="">🌍 Alle Länder</button>${countries.map(c=>`<button class="fchip ${CAT.c===c?'on':''}" data-cc="${c}">${(COUNTRIES[c]||['',''])[1]} ${esc((COUNTRIES[c]||[c])[0])} <span class="n">${cc[c]}</span></button>`).join('')}</div>
 <div class="filters" id="cr" style="margin-top:-4px">${regHTML()}</div></div>
 <div class="lbl" id="ccount"></div><div class="stack" id="clist"></div>`,
 after:el=>{
  const sc=$('.pbody',el),inp=$('#cq',el);
  const fill=keep=>{const L=searchBeers(CAT.q,{g:CAT.g,c:CAT.c,r:CAT.r,s:CAT.s});
   $('#ccount',el).textContent=L.length+' '+(L.length===1?w.one:w.many)+(CAT.q||CAT.g||CAT.c||CAT.r||CAT.s?' gefunden':' im Katalog');
   lazyList($('#clist',el),sc,L,catRow,emptyCard('search','Nichts gefunden',`Probier einen anderen Suchbegriff oder Filter – oder lege ${w.das==='das'?'das Bier':'ihn'} selbst an.`,`<button class="btn gold sm" data-act="newBeer">${ic('plus')} ${w.neu}</button>`,true),keep?p.shown:0);
   p.shown=0};
  fill(true);
  let qt;inp.addEventListener('input',()=>{CAT.q=inp.value;clearTimeout(qt);qt=setTimeout(()=>{fill();sc.scrollTop=0},90)});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')inp.blur()});
  const setOn=(a,v)=>$$('[data-'+a+']',el).forEach(x=>x.classList.toggle('on',x.dataset[a]===v));
  const redoReg=()=>{if(KAT!=='bier'){const r=$('#cr',el);r.innerHTML=regHTML();r.scrollLeft=0}};
  el.addEventListener('click',e=>{const g=e.target.closest('[data-cg]'),c=e.target.closest('[data-cc]'),r=e.target.closest('[data-cr]'),st=e.target.closest('[data-cs]');if(!g&&!c&&!r&&!st)return;e.stopPropagation();
   if(g){CAT.g=g.dataset.cg;setOn('cg',CAT.g)}
   if(st){CAT.s=st.dataset.cs;setOn('cs',CAT.s)}
   if(c){CAT.c=c.dataset.cc;setOn('cc',CAT.c);if(KAT==='bier'){if(CAT.c&&CAT.c!=='DE'&&CAT.r){CAT.r='';setOn('cr','')}}else{if(CAT.r&&!all.some(b=>b.reg===CAT.r&&(!CAT.c||b.country===CAT.c)))CAT.r='';redoReg()}}
   if(r){CAT.r=r.dataset.cr;setOn('cr',CAT.r);if(KAT==='bier'){if(CAT.r&&CAT.c!=='DE'){CAT.c='DE';setOn('cc','DE')}}else if(CAT.r){const b0=all.find(b=>b.reg===CAT.r);if(b0&&CAT.c&&CAT.c!==b0.country){CAT.c=b0.country;setOn('cc',CAT.c)}}}
   const x=g||c||st||(r&&r.isConnected?r:null);if(x)x.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});fill();sc.scrollTop=0},true);
  p.cleanup=()=>{const l=$('#clist',el);if(l&&l._io)l._io.disconnect()};
 }};
};
function likeNotify(k){
 let owner=null,txt='';
 if(k.startsWith('c-')){const c=S.checkins.find(x=>'c-'+x.id===k);if(c){owner=c.user;txt=`gefällt, dass du <b>${esc(B(c.beer).short||B(c.beer).name)}</b> trinkst 👍`}}
 else if(k.startsWith('r-')){const id=k.slice(2),[u,b]=id.split(':');owner=u;txt=`gefällt deine Bewertung von <b>${esc(B(b).name)}</b> 👍`}
 else if(k.startsWith('m-')){const i=k.lastIndexOf('-');owner=k.slice(i+1);txt=`freut sich über euren ${wOf(k.slice(2,i)).match} <b>${esc(B(k.slice(2,i)).name)}</b> ${wOf(k.slice(2,i)).emo}`}
 if(owner&&owner!==ME&&isFriend(owner))notify('like',`{{u:${ME}}} ${txt}`,'activities',false,owner,ME);
}
/* ---------- Anmeldung & Registrierung (v1.6) ---------- */
const PASS='BIER'; // nur für die Alt-Konten Sascha/Martin im Offline-Fall bzw. ohne Server
let LG={step:'home',user:null,av:null};
// Auf diesem Gerät zuletzt angemeldete Konten (Schnellwahl). v = lokaler Prüfwert fürs Offline-Anmelden (gesalzener SHA-256), kein Klartext.
function knownAccs(){SY.known=SY.known||{};
 ['sascha','martin'].forEach(u=>{if(!SY.known[u]&&(SY.tokens[u]||SY.cred[u]||(()=>{try{return localStorage.getItem(LS_USER)===u}catch(e){return false}})()))SY.known[u]={name:USERS[u].name,av:0,ts:1}});
 return Object.keys(SY.known).map(id=>Object.assign({id},SY.known[id])).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,4)}
async function verifier(pass,salt){try{if(!crypto.subtle)return '';const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('hm-local:'+salt+':'+pass));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return ''}}
async function rememberAcc(id,info,pass,ci){
 SY.known=SY.known||{};const k=SY.known[id]=Object.assign(SY.known[id]||{},{name:info.name,av:info.av||0});
 if(pass!=null){k.ts=Date.now();k.salt=k.salt||Math.random().toString(36).slice(2,12);k.ci=!!ci;k.v=await verifier(ci?pass.trim().toUpperCase():pass,k.salt)}
 saveSync();
}
function forgetAcc(id){if(SY.known)delete SY.known[id];delete SY.tokens[id];delete SY.cred[id];saveSync()}
function loginEl(){let el=$('#login');if(!el){el=document.createElement('div');el.id='login';$('#screen').insertBefore(el,$('#toast'));
 el.addEventListener('click',loginClick);el.addEventListener('submit',e=>{e.preventDefault();LG.step==='register'?tryRegister():tryLogin()});
 el.addEventListener('input',e=>{const f=e.target.closest('.lg-field');if(f)f.classList.remove('bad');const er=$('#lgerr');if(er)er.textContent='';if(e.target.id==='rgname'&&!LG.av){const ph=$('#rgav img');if(ph)ph.src=initialsAvatar('new:'+e.target.value.trim().toLowerCase(),e.target.value.trim()||'?')}});
 el.addEventListener('change',e=>{if(e.target.id==='rgfile')pickAvatar(e.target,'#rgav img').then(d=>{if(d){LG.av=d;const rm=$('#rgrm');if(rm)rm.hidden=false}})})}
 return el}
function showLogin(step){
 const el=loginEl();LG={step:step||'home',user:null,av:null};drawLogin();
 el.classList.remove('out');el.classList.add('on');document.documentElement.classList.add('locked');
}
const LOGO=`<div class="lg-logo"><div class="hoprow"><i></i><img src="img/hop_logo.webp" alt=""><i></i></div><div class="wm">Hopfen<b>Match</b></div><div class="tag">GUTE BIERE. GUTE LEUTE.</div></div>`;
const pwField=(id,ph,ac,extra='')=>`<div class="lg-field" id="${id}f">${ic('lock')}<input id="${id}" type="password" name="${id}" placeholder="${ph}" autocomplete="${ac}" autocorrect="off" autocapitalize="off" spellcheck="false" ${extra}><button type="button" class="lg-eye" data-lgact="eye" data-for="${id}" aria-label="Passwort anzeigen">${ic('eye')}</button></div>`;
function drawLogin(dir){
 const el=loginEl(),D=dir||'';
 if(LG.step==='home'){
  const acc=knownAccs();
  const card=a=>{const n=S.owner===a.id||!S.owner?S.ratings.filter(r=>r.user===a.id).length:null;return `<button class="lg-card pressable" data-login="${a.id}"><span class="lg-ph"><img crossorigin="anonymous" src="${U(a.id).known?U(a.id).img:(a.av>0?API+'/avatar/'+a.id+'?v='+a.av:BUILTIN_IMG[a.id]||initialsAvatar(a.id,a.name))}" alt="${esc(a.name)}" draggable="false"></span><b>${esc(a.name)}</b><small>${n==null?'Zuletzt hier':n+' Bewertung'+(n===1?'':'en')}</small><span class="lg-go">${ic('chev')}</span></button>`};
  el.innerHTML=`<div class="lg-in ${D}">${LOGO}<h1 class="lg-h">${acc.length?'Willkommen zurück!':'Willkommen!'}</h1><p class="lg-p">Bewerte Bier, Wein und Whisky, finde Matches mit deinen Freunden und plant gemeinsame Tastings.</p>
  ${acc.length?`<div class="lg-lbl">Zuletzt angemeldet auf diesem Gerät</div><div class="lg-cards ${acc.length>2?'many':''}">${acc.map(card).join('')}</div>`:`<div class="lg-hero"><img src="img/mugs.webp" alt=""></div>`}
  <div class="lg-actions"><button class="btn gold lg-btn" data-lgact="login">${ic('lock')} Anmelden</button><button class="btn lg-btn lg-reg" data-lgact="register">${ic('userplus')} Neu registrieren</button></div>
  <div class="lg-deco"><img src="img/hop_illu.webp" alt=""></div>
  <p class="lg-foot">${syncOn()?'Registrieren geht ohne E-Mail – nur Name und Passwort.':'Ohne Server (Testmodus): nur Sascha und Martin.'}</p></div>`;
  return;
 }
 if(LG.step==='login'){
  const k=LG.user&&SY.known&&SY.known[LG.user], nm=k?k.name:'';
  el.innerHTML=`<div class="lg-in ${D}"><button class="lg-back" data-lgact="back">${ic('back')}<span>Zurück</span></button>
  ${k?`<div class="lg-me"><span class="lg-ph big"><img crossorigin="anonymous" src="${U(LG.user).known?U(LG.user).img:(k.av>0?API+'/avatar/'+LG.user+'?v='+k.av:BUILTIN_IMG[LG.user]||initialsAvatar(LG.user,nm))}" alt="" draggable="false"></span></div><h1 class="lg-h">Hallo ${esc(nm)}!</h1><p class="lg-p">Gib dein Passwort ein, um dich anzumelden.</p>`
   :`<div class="lg-me sm">${LOGO}</div><h1 class="lg-h">Anmelden</h1><p class="lg-p">Mit deinem Namen und Passwort.</p>`}
  <form class="lg-form" autocomplete="on" novalidate>
   <div class="lg-field" id="lgnamef" ${k?'hidden':''}>${ic('people')}<input id="lgname" type="text" name="username" placeholder="Name" value="${esc(nm)}" autocomplete="username" autocorrect="off" autocapitalize="words" spellcheck="false" maxlength="24" enterkeyhint="next"></div>
   ${pwField('lgpw','Passwort','current-password','enterkeyhint="go"')}
   <div class="lg-err" id="lgerr" role="alert"></div>
   <button type="submit" class="btn gold lg-btn" id="lgsub">Anmelden</button></form>
  <button class="lg-switch" data-lgact="${k?'other':'register'}">${k?'Nicht '+esc(nm)+'? Anderes Konto':'Noch kein Konto? Jetzt registrieren'}</button></div>`;
  setTimeout(()=>{const i=k?$('#lgpw'):$('#lgname');i&&i.focus()},350);
  return;
 }
 // Registrieren
 el.innerHTML=`<div class="lg-in ${D}"><button class="lg-back" data-lgact="back">${ic('back')}<span>Zurück</span></button>
  <h1 class="lg-h" style="margin-top:44px">Konto erstellen</h1><p class="lg-p">Ohne E-Mail – nur Name und Passwort.</p>
  <div class="rg-av"><span class="lg-ph big" id="rgav"><img src="${LG.av||initialsAvatar('new:','?')}" alt="" draggable="false"></span>
   <div class="rg-avb"><label class="btn-soft rg-pick">${ic('people')} Foto wählen<input type="file" id="rgfile" accept="image/*" hidden></label><button type="button" class="lg-mini" id="rgrm" data-lgact="rmav" ${LG.av?'':'hidden'}>Entfernen</button></div>
   <small class="rg-hint">Optional – sonst bekommst du ein Initialen-Bild.</small></div>
  <form class="lg-form" autocomplete="on" novalidate style="margin-top:14px">
   <div class="lg-field" id="rgnamef">${ic('people')}<input id="rgname" type="text" name="username" placeholder="Dein Name (wie Freunde dich finden)" autocomplete="username" autocorrect="off" autocapitalize="words" spellcheck="false" maxlength="24" enterkeyhint="next"></div>
   <div style="height:10px"></div>${pwField('rgpw','Passwort (mind. 4 Zeichen)','new-password','enterkeyhint="next"')}
   <div style="height:10px"></div>${pwField('rgpw2','Passwort wiederholen','new-password','enterkeyhint="go"')}
   <div class="lg-err" id="lgerr" role="alert"></div>
   <button type="submit" class="btn gold lg-btn" id="rgsub">Registrieren &amp; loslegen</button></form>
  <p class="lg-foot" style="margin-top:12px">Merk dir dein Passwort gut: Ohne E-Mail lässt es sich nicht per Mail zurücksetzen. Ändern kannst du es jederzeit in den Einstellungen.</p>
  <button class="lg-switch" data-lgact="login">Schon dabei? Anmelden</button></div>`;
 setTimeout(()=>{const i=$('#rgname');i&&i.focus()},350);
}
function loginClick(e){
 const c=e.target.closest('[data-login]');if(c){LG={step:'login',user:c.dataset.login};drawLogin('fwd');return}
 const a=e.target.closest('[data-lgact]');if(!a)return;
 const k=a.dataset.lgact;
 if(k==='back'){LG={step:'home',user:null,av:null};drawLogin('bwd')}
 if(k==='login'){LG={step:'login',user:null};drawLogin('fwd')}
 if(k==='other'){LG={step:'login',user:null};drawLogin('fwd')}
 if(k==='register'){if(!syncOn()){toast('Registrieren geht nur mit Server','info');return}LG={step:'register',user:null,av:null};drawLogin('fwd')}
 if(k==='rmav'){LG.av=null;const n=($('#rgname')||{}).value||'';$('#rgav img').src=initialsAvatar('new:'+n.trim().toLowerCase(),n.trim()||'?');a.hidden=true;const f=$('#rgfile');if(f)f.value=''}
 if(k==='eye'){const i=$('#'+a.dataset.for);i.type=i.type==='password'?'text':'password';a.classList.toggle('on',i.type==='text');i.focus()}
}
function lgFail(fieldId,msg){const f=fieldId&&$('#'+fieldId+'f');if(f){f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake','bad');const i=$('#'+fieldId);if(i)i.select&&i.select()}$('#lgerr').textContent=msg;if(navigator.vibrate)navigator.vibrate([40,40,40])}
let LOGGING=false;
async function tryLogin(){
 if(LOGGING)return;
 const k=LG.user&&SY.known&&SY.known[LG.user];
 const name=(k?k.name:($('#lgname').value||'')).replace(/\s+/g,' ').trim(), pw=$('#lgpw').value, btn=$('#lgsub');
 if(!name){lgFail('lgname','Bitte gib deinen Namen ein.');return}
 if(!pw){lgFail('lgpw','Bitte gib dein Passwort ein.');return}
 const busy=on=>{LOGGING=on;btn.disabled=on;btn.textContent=on?'Anmelden …':'Anmelden'};
 if(!syncOn()){const id=name.toLowerCase();if(!USERS[id]||pw.trim().toUpperCase()!==PASS){lgFail('lgpw','Name oder Passwort stimmt nicht.');return}finishLogin(id,{name:USERS[id].name,av:0});return}
 busy(true);
 try{
  const j=await api('/login',{method:'POST',body:{name:k?LG.user:name,pass:pw},token:'-'});
  SY.tokens[j.user]=j.token;delete SY.cred[j.user];saveSync();
  await rememberAcc(j.user,{name:j.name,av:j.av},pw,j.user==='sascha'||j.user==='martin');
  busy(false);finishLogin(j.user,{name:j.name,av:j.av});
 }catch(e){
  busy(false);
  if(e.status===401){lgFail('lgpw',k?'Falsches Passwort. Versuch’s nochmal!':'Name oder Passwort stimmt nicht.');return}
  if(e.status===429){lgFail('lgpw',e.message);return}
  if(e.status&&e.status!==0&&e.status<500&&e.status!==404){lgFail('lgpw',e.message||'Anmelden fehlgeschlagen.');return}
  // Server nicht erreichbar: offline anmelden, wenn dieses Konto hier schon angemeldet war
  const acc=Object.entries(SY.known||{}).find(([id,a])=>id===LG.user||a.name.toLowerCase()===name.toLowerCase());
  if(acc){const [id,a]=acc;let ok=false;
   if(a.v&&a.salt)ok=(await verifier(a.ci?pw.trim().toUpperCase():pw,a.salt))===a.v;
   else if(USERS[id])ok=pw.trim().toUpperCase()===PASS;
   if(ok){SY.cred[id]=pw;saveSync();toast('Offline angemeldet – Sync folgt, sobald du online bist','info');finishLogin(id,{name:a.name,av:a.av||0});return}
   lgFail('lgpw','Falsches Passwort. Versuch’s nochmal!');return}
  lgFail('lgpw','Keine Verbindung zum Server. Bitte später nochmal versuchen.');
 }
}
async function tryRegister(){
 if(LOGGING)return;
 const name=($('#rgname').value||'').replace(/\s+/g,' ').trim(),p1=$('#rgpw').value,p2=$('#rgpw2').value,btn=$('#rgsub');
 if(name.length<2){lgFail('rgname','Der Name braucht mindestens 2 Zeichen.');return}
 if(!/^[\p{L}\p{N}](?:[\p{L}\p{N} ._'-]{0,22}[\p{L}\p{N}])?$/u.test(name)){lgFail('rgname','Erlaubt sind Buchstaben, Ziffern, Leerzeichen sowie . _ - \' (max. 24 Zeichen).');return}
 if(p1.length<4){lgFail('rgpw','Das Passwort braucht mindestens 4 Zeichen.');return}
 if(p1!==p2){lgFail('rgpw2','Die Passwörter stimmen nicht überein.');return}
 LOGGING=true;btn.disabled=true;btn.textContent='Konto wird erstellt …';
 try{
  const j=await api('/register',{method:'POST',body:{name,pass:p1,avatar:LG.av||undefined},token:'-'});
  SY.tokens[j.user]=j.token;saveSync();
  await rememberAcc(j.user,{name:j.name,av:j.av},p1,false);
  LOGGING=false;finishLogin(j.user,{name:j.name,av:j.av},true);
 }catch(e){
  LOGGING=false;btn.disabled=false;btn.innerHTML='Registrieren &amp; loslegen';
  lgFail(e.field==='pass'?'rgpw':e.field==='avatar'?null:'rgname',e.status===0||e.name==='AbortError'||!e.status?'Keine Verbindung – Registrieren geht nur online.':e.message);
 }
}
function finishLogin(u,info,fresh){const f=$('#lgpwf');if(f)f.classList.add('ok');document.activeElement&&document.activeElement.blur&&document.activeElement.blur();setTimeout(()=>doLogin(u,info,fresh),260)}
function doLogin(u,info,fresh){
 try{localStorage.setItem(LS_USER,u)}catch(e){}
 // Anderes Konto als zuletzt auf diesem Gerät: lokalen Zwischenspeicher leeren (Server-Daten bleiben unberührt)
 if(S.owner&&S.owner!==u){S=emptyState();SY.rev=null;SY.snap={};SY.fv='';SY.resync=false;saveSync()}
 S.owner=u;save(true);
 if(DIR.me!==u){DIR={me:'',users:{},friends:[],incoming:[],outgoing:[],fv:''};if(info)DIR.users[u]={id:u,name:info.name,av:info.av||0};saveDir()}
 setUser(u);FQ.q='';FQ.res=null;closeAllPages();closeSheet(true);$('#overlay').classList.remove('on');RFILTER='all';TAB='';showTab('start');renderAll();if(!/[?&]nohome/.test(location.search))showHome();
 const el=loginEl();el.classList.add('out');document.documentElement.classList.remove('locked');
 setTimeout(()=>{el.classList.remove('on','out');el.innerHTML=''},450);
 setTimeout(()=>toast(fresh?`Willkommen, ${U(u).name}! 🍻`:`Hallo ${U(u).name}! 🍻`,'beer'),900);
 sync(true);pollLoop();
}
async function logout(){
 const me=ME,tk=SY.tokens[me];
 if(syncOn()&&tk&&myPending().length)await sync(true).catch(()=>{});
 delete SY.tokens[me];delete SY.cred[me];saveSync();clearTimeout(SYNC.poll);
 if(syncOn()&&tk)api('/logout',{method:'POST',token:tk}).catch(()=>{});
 try{localStorage.removeItem(LS_USER)}catch(e){}
 closeAllPages();closeSheet(true);$('#overlay').classList.remove('on');showLogin();
}
/* ---------- Konto: Name, Passwort, Bild, Löschen ---------- */
async function pickAvatar(input,imgSel){
 const file=input.files&&input.files[0];if(!file)return null;
 try{const d=await resizeImage(file,256);const im=$(imgSel);if(im)im.src=d;return d}
 catch(e){toast('Dieses Bild kann nicht gelesen werden','info');return null}
}
async function resizeImage(file,size){
 const url=URL.createObjectURL(file);
 try{const img=await new Promise((ok,no)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=no;im.src=url});
  const w=img.naturalWidth,h=img.naturalHeight,s=Math.min(w,h);if(!s)throw new Error('leer');
  const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.imageSmoothingQuality='high';x.fillStyle='#fff';x.fillRect(0,0,size,size);
  x.drawImage(img,(w-s)/2,(h-s)/2,s,s,0,0,size,size);
  let q=.86,d=c.toDataURL('image/jpeg',q);while(d.length>120000&&q>.4){q-=.12;d=c.toDataURL('image/jpeg',q)}
  return d}
 finally{URL.revokeObjectURL(url)}
}
function accForm(title,body,btn,onSave,danger){
 const sh=openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Abbrechen</button><h3>${title}</h3><span class="r"></span></div><div class="sheet-body"><form class="accform" novalidate autocomplete="on">${body}<div class="lg-err" id="accerr" role="alert"></div><button type="submit" class="btn ${danger?'red-solid':'gold'}" id="accsub">${btn}</button></form></div>`);
 const f=$('form',sh),b=$('#accsub',sh);
 f.addEventListener('input',e=>{const x=e.target.closest('.lg-field');if(x)x.classList.remove('bad');$('#accerr').textContent=''});
 f.addEventListener('click',e=>{const a=e.target.closest('[data-lgact="eye"]');if(a){const i=$('#'+a.dataset.for);i.type=i.type==='password'?'text':'password';a.classList.toggle('on',i.type==='text')}});
 const fail=(id,msg)=>{const x=id&&$('#'+id+'f',sh);if(x){x.classList.remove('shake');void x.offsetWidth;x.classList.add('shake','bad')}$('#accerr').textContent=msg};
 f.addEventListener('submit',async e=>{e.preventDefault();if(b.disabled)return;const lbl=b.innerHTML;b.disabled=true;b.textContent='Einen Moment …';
  try{await onSave(fail)}catch(x){fail(null,x.status===0||!x.status?'Keine Verbindung – das geht nur online.':x.message)}finally{if(b.isConnected){b.disabled=false;b.innerHTML=lbl}}});
 setTimeout(()=>{const i=$('input',sh);i&&i.focus()},300);
 return sh;
}
function accNameSheet(){
 accForm('Name ändern',`<p class="note" style="margin-top:0">So finden dich deine Freunde. Der neue Name erscheint überall – auch bei deinen Freunden.</p><div class="lg-field" id="accnamef">${ic('people')}<input id="accname" type="text" value="${esc(U(ME).name)}" maxlength="24" autocomplete="username" autocapitalize="words" autocorrect="off" spellcheck="false"></div>`,`${ic('check')} Name speichern`,async fail=>{
  const n=$('#accname').value.replace(/\s+/g,' ').trim();
  if(n.length<2){fail('accname','Der Name braucht mindestens 2 Zeichen.');return}
  if(n===U(ME).name){closeSheet();return}
  try{const j=await api('/account',{method:'POST',body:{action:'rename',name:n}});
   DIR.users[ME]=Object.assign({},DIR.users[ME]||{id:ME,av:0},{name:j.name});UC={};saveDir();rememberAcc(ME,DIR.users[ME]);closeSheet();renderAll();toast('Name geändert: '+j.name,'check')}
  catch(e){if(e.field==='name'){fail('accname',e.message);return}throw e}
 });
}
function accPassSheet(){
 accForm('Passwort ändern',`${pwField('accold','Bisheriges Passwort','current-password')}<div style="height:10px"></div>${pwField('accnew','Neues Passwort (mind. 4 Zeichen)','new-password')}<div style="height:10px"></div>${pwField('accnew2','Neues Passwort wiederholen','new-password')}<p class="note">Andere Geräte, auf denen du angemeldet bist, werden danach abgemeldet.</p>`,`${ic('check')} Passwort ändern`,async fail=>{
  const o=$('#accold').value,n=$('#accnew').value,n2=$('#accnew2').value;
  if(!o){fail('accold','Bitte gib dein bisheriges Passwort ein.');return}
  if(n.length<4){fail('accnew','Das neue Passwort braucht mindestens 4 Zeichen.');return}
  if(n!==n2){fail('accnew2','Die Passwörter stimmen nicht überein.');return}
  try{await api('/account',{method:'POST',body:{action:'password',old:o,pass:n}});await rememberAcc(ME,U(ME),n,false);closeSheet();toast('Passwort geändert','check')}
  catch(e){if(e.field==='old'){fail('accold',e.message);return}if(e.field==='pass'){fail('accnew',e.message);return}throw e}
 });
}
function accAvatarSheet(){
 const d=(DIR.users||{})[ME]||{};
 const sh=openSheet(`<div class="sheet-hd"><button class="l" data-act="closeSheet">Schließen</button><h3>Profilbild</h3><span class="r"></span></div><div class="sheet-body" style="text-align:center">
  <div style="display:flex;justify-content:center;margin:8px 0 14px"><span class="lg-ph big" id="accav"><img crossorigin="anonymous" src="${U(ME).img}" alt=""></span></div>
  <label class="btn gold" style="cursor:pointer">${ic('people')} Foto wählen oder aufnehmen<input type="file" id="accfile" accept="image/*" hidden></label>
  ${d.av>0?`<div class="btnrow" style="margin-top:10px"><button class="btn ghost" id="accrm">${ic('trash')} Bild entfernen</button></div>`:''}
  <p class="note">Das Bild wird auf deinem Gerät verkleinert (256 × 256) und ist – wie dein Name – für alle sichtbar.</p></div>`);
 const up=async av=>{try{const j=await api('/account',{method:'POST',body:{action:'avatar',avatar:av}});DIR.users[ME]=Object.assign({},DIR.users[ME]||{id:ME,name:U(ME).name},{av:j.av});UC={};saveDir();rememberAcc(ME,DIR.users[ME]);closeSheet();renderAll();toast(av?'Profilbild gespeichert':'Profilbild entfernt','check')}catch(e){toast(e.status?e.message:'Keine Verbindung – das geht nur online','info')}};
 $('#accfile',sh).addEventListener('change',async e=>{const v=await pickAvatar(e.target,'#accav img');if(v)up(v)});
 const rm=$('#accrm',sh);if(rm)rm.addEventListener('click',()=>up(null));
}
function accDeleteSheet(){
 accForm('Konto löschen',`<div class="mstatus no" style="margin-top:0"><span class="ic">${ic('trash')}</span><div><b>Endgültig löschen?</b><small>Dein Konto, deine Bewertungen, Freundschaften und Mitteilungen werden vom Server entfernt. Das lässt sich nicht rückgängig machen.</small></div></div><div style="height:12px"></div>${pwField('accdel','Passwort zur Bestätigung','current-password')}`,`${ic('trash')} Konto endgültig löschen`,async fail=>{
  const pw=$('#accdel').value;if(!pw){fail('accdel','Bitte gib dein Passwort ein.');return}
  try{await api('/account',{method:'POST',body:{action:'delete',pass:pw}})}catch(e){if(e.field==='pass'){fail('accdel',e.message);return}throw e}
  const me=ME;forgetAcc(me);clearTimeout(SYNC.poll);S=emptyState();S.owner='';SY.rev=null;SY.snap={};SY.fv='';saveSync();save(true);
  DIR={me:'',users:{},friends:[],incoming:[],outgoing:[],fv:''};saveDir();
  try{localStorage.removeItem(LS_USER)}catch(e){}
  closeSheet(true);closeAllPages();showLogin();toast('Dein Konto wurde gelöscht','trash');
 },true);
}
/* ---------- Kategorie-Startseite & Intro (v1.7, ab 1.11 Kategorie-Übersicht statt Karussell) ---------- */
function homeInfo(){return {img:U(ME).img,name:(U(ME).name||'').split(' ')[0],stats:KATS.map(k=>({total:KD[k].items.length+S.customBeers.filter(b=>katOf(b.id)===k).length,many:KD[k].w.many,mine:S.ratings.filter(r=>r.user===ME&&katOf(r.beer)===k).length})),counts:KATS.map(k=>{const n=S.ratings.filter(r=>r.user===ME&&katOf(r.beer)===k).length,it=KD[k].items;return `${it.length} ${KD[k].w.many} · `+(n?`${n} von dir bewertet`:`${new Set(it.map(b=>b.country)).size} Länder`)})}}
function showHome(){if(!window.HMHome||!LOGGED())return;closeSheet(true);$('#overlay').classList.remove('on');HMHome.show(KAT,homeInfo());const h=$('#home');if(h)h.focus({preventScroll:true})}
function enterKat(k){const ch=setKat(k,true);if(STACK.length)closeAllPages();if(ch||TAB!=='start'){TAB='';showTab('start')}renderAll()}
function introDone(){window.HM_INTRO=true;const i=$('#intro');if(!i||window.HM_INTRO_HOLD)return;
 const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,min=rm?1000:2100,wait=Math.max(0,min-performance.now());
 setTimeout(()=>{i.classList.add('done');setTimeout(()=>i.remove(),700)},wait)}
/* ---------- Start ---------- */
function frame(){
 const q=new URLSearchParams(location.search).get('frame');
 const mobile=/iPhone|iPod|Android.*Mobile/i.test(navigator.userAgent)||(matchMedia('(pointer:coarse)').matches&&Math.min(screen.width,screen.height)<600);
 const framed=q==='1'||(q!=='0'&&!mobile&&!navigator.standalone&&innerWidth>=600);
 document.documentElement.classList.toggle('framed',framed);document.documentElement.classList.toggle('sim',q==='sim');
 if(framed){const s=Math.min(1,(innerHeight-24)/(844+26),(innerWidth-20)/(390+26));document.documentElement.style.setProperty('--scale',s.toFixed(3))}
}
function clock(){const d=new Date();$('#sbtime').textContent=d.getHours()+':'+String(d.getMinutes()).padStart(2,'0')}
function init(){
 load();
 $('#sbicons').innerHTML=`<svg viewBox="0 0 20 14" width="19" height="13"><g fill="#111">${IC.sig.replace(/class="f"/g,'')}</g></svg><svg viewBox="0 0 18 14" width="17" height="13"><g fill="#111">${IC.wifi.replace(/class="f"/g,'')}</g></svg><svg viewBox="0 0 28 13" width="27" height="13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="#111" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="#111"/><path d="M25 4.5v4c.8-.3 1.5-1 1.5-2s-.7-1.7-1.5-2z" fill="#111" opacity=".45"/></svg>`;
 frame();addEventListener('resize',frame);clock();setInterval(clock,15000);
 $('#nav').innerHTML=`<div class="navbg"></div><div class="items"><button class="it on" data-tab="start">${ic('home')}Start</button><button class="it" data-tab="rangliste">${ic('chart')}Rangliste</button><span></span><button class="it" data-tab="freunde">${ic('users')}Freunde</button><button class="it" data-tab="planen">${ic('cal')}Planen</button></div>`;
 $('#plus').innerHTML=ic('plus');$('#plus').addEventListener('click',()=>{closeSheet(true);rateSheet()});
 $('#overlay').addEventListener('click',e=>{if(e.target.id==='overlay')$('#overlay').classList.remove('on')});
 setKat(KAT,true);
 if(window.HMHome)HMHome.mount($('#home'),{kat:KAT,onEnter:enterKat,onProfile:()=>{HMHome.enter();setTimeout(()=>push('profile'),120)}});
 // Dauerhaft angemeldet: Ist ein Sitzungs-Token gespeichert, geht es ohne Anmeldebildschirm direkt los (Sitzungen laufen nicht ab).
 let su=null;try{su=localStorage.getItem(LS_USER)}catch(e){}
 const nohome=/[?&]nohome/.test(location.search);
 if(su&&(syncOn()?(SY.tokens[su]||SY.cred[su]):USERS[su])){setUser(su);if(!S.owner){S.owner=su;save(true)}renderAll();const h=location.hash.slice(1);if(TABS.includes(h)&&h!=='start'){showTab(h)}else if(!nohome)showHome();sync(true);pollLoop()}
 else{renderAll();showLogin()}
 introDone();
 setInterval(()=>{if(!SHEET&&!STACK.length&&!$('#login.on')&&!(window.HMHome&&HMHome.visible()))renderTab(TAB)},60000);
 if('serviceWorker' in navigator&&location.protocol.startsWith('http')&&!/nosw/.test(location.search)){
  /* 1.9.1: Neue Version nie mitten in der Nutzung neu laden. Nur ganz am Anfang (Logo/Anmeldung, noch nichts angetippt)
     einmal still neu laden – sonst gilt das Update beim nächsten Start. Schutz gegen Neulade-Schleifen über sessionStorage. */
  const had=!!navigator.serviceWorker.controller;let rl=false,touched=false;const t0=Date.now();
  ['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{touched=true},{capture:true,once:true}));
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||rl)return;
   let last=0;try{last=+sessionStorage.getItem('hm_swrl')||0}catch(e){}
   if(touched||Date.now()-t0>4000||Date.now()-last<60000||document.hidden)return;
   rl=true;try{sessionStorage.setItem('hm_swrl',String(Date.now()))}catch(e){}location.reload()});
  navigator.serviceWorker.register('sw.js').then(r=>r.update&&r.update()).catch(()=>{});
 }
 addEventListener('online',()=>{SYNC.online=true;sync(true)});addEventListener('offline',()=>{SYNC.online=false});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&LOGGED()){sync();pollLoop()}});
 document.addEventListener('input',e=>{if(e.target.id==='fq')friendSearch(e.target.value)});
 window.HM={kat:()=>KAT,setKat:k=>{if(window.HMHome)HMHome.hide();enterKat(k)},showHome,B,katOf,S:()=>S,me:()=>ME,dir:()=>DIR,friends:()=>FRIENDS(),sync,syncState:()=>SYNC,SY:()=>SY,pending:()=>myPending(),searchBeers,catalogSize:()=>beers().length,push,pop,showTab,rateSheet,matchOverlay,tastingSheet,inviteSheet,closeSheet,logout};
}
init();
})();
