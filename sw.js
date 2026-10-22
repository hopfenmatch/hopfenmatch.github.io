/* HopfenMatch Service Worker – offline-fähig wie Galaxy Empire:
   HTML network-first (Updates kommen sofort an), alles andere cache-first. */
const CACHE='hopfenmatch-v9';
const ASSETS=[
  "./",
  "./css/app.css",
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
  "./img/home_bier.webp",
  "./img/home_wein.webp",
  "./img/home_whisky.webp",
  "./img/hop_logo_t.webp",
  "./img/intro_etikett.webp",
  "./img/intro_flasche.webp",
  "./img/intro_hals.webp",
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
  "./index.html",
  "./js/app.js",
  "./js/bottle.js",
  "./js/bounce.js",
  "./js/catalog.js",
  "./js/data.js",
  "./js/home.js",
  "./js/whisky.js",
  "./js/wine.js",
  "./manifest.webmanifest",
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const isHTML=r.mode==='navigate'||(r.headers.get('accept')||'').includes('text/html');
  if(isHTML){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})));
  }
});
