/* HopfenMatch Service Worker – offline-fähig.
   1.11: Kategorie-Übersicht statt 3D-Flaschenkarussell (keine Karussell-Sprites/Etiketten mehr im Cache). 1.10: Biergrafiken mit Markenfarben (brands.js). 1.9.1: kein Neustart mitten in der Nutzung.
   - Installation lädt nur das Nötigste (HTML, CSS, JS, Schriften, Icons) → neue Version ist nach ~1 s bereit,
     Bilder werden danach im Hintergrund nachgeladen bzw. aus dem vorigen Cache übernommen.
   - CSS/JS sind versioniert (?v=N) und werden exakt gesucht: neue Seite bekommt nie altes JS (keine Versionsmischung).
   - Der vorige Cache bleibt erhalten, damit eine noch offene ältere Seite weiter alles findet.
   HTML network-first, alles andere cache-first. */
const V=15,CACHE='hopfenmatch-v'+V;
const CORE=[
  "./",
  "./css/app.css?v=15",
  "./fonts/lora.woff2",
  "./fonts/sourcesans3-italic.woff2",
  "./fonts/sourcesans3.woff2",
  "./icons/apple-touch-icon-120.png",
  "./icons/apple-touch-icon-152.png",
  "./icons/apple-touch-icon-167.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./index.html",
  "./js/app.js?v=15",
  "./js/bottle.js?v=15",
  "./js/bounce.js?v=15",
  "./js/catalog.js?v=15",
  "./js/brands.js?v=15",
  "./js/data.js?v=15",
  "./js/whisky.js?v=15",
  "./js/wine.js?v=15",
  "./manifest.webmanifest",
  "./js/home.js?v=15",
];
const REST=[
  "./img/bot_augustiner-hell.webp",
  "./img/bot_ayinger-kellerbier.webp",
  "./img/bot_bitburger.webp",
  "./img/bot_guinness.webp",
  "./img/bot_paulaner-helles.webp",
  "./img/bot_paulaner-weissbier.webp",
  "./img/bot_schneider-tap7.webp",
  "./img/bot_tegernseer-hell.webp",
  "./img/cheers.webp",
  "./img/hero_tegernseer.webp",
  "./img/hop_logo_t.webp",
  "./img/hop_illu.webp",
  "./img/hop_logo.webp",
  "./img/martin.jpg",
  "./img/mugs.webp",
  "./img/pair_augustiner-hell.webp",
  "./img/pair_bitburger.webp",
  "./img/pair_guinness.webp",
  "./img/pair_paulaner-weissbier.webp",
  "./img/pair_schneider-tap7.webp",
  "./img/pair_tegernseer-hell.webp",
  "./img/sascha.jpg",
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
const num=k=>{const m=/^hopfenmatch-v(\d+)$/.exec(k);return m?+m[1]:-1};
async function warm(){const c=await caches.open(CACHE);for(const u of REST){try{if(await c.match(u))continue;const o=await caches.match(u,{ignoreSearch:true});if(o){await c.put(u,o);continue}const r=await fetch(u);if(r.ok)await c.put(u,r)}catch(x){}}}
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&num(k)<V-1).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>warm()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const isHTML=r.mode==='navigate'||(r.headers.get('accept')||'').includes('text/html');
  const put=(res)=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res};
  if(isHTML){
    e.respondWith(fetch(r).then(put).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
  }else if(new URL(r.url).search){
    /* versionierte Datei: exakt aus einem Cache, sonst Netz; offline notfalls ältere Fassung */
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(put).catch(()=>caches.match(r,{ignoreSearch:true}))));
  }else{
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(put)));
  }
});
