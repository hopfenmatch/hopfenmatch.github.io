// Einmaliger Startbestand auf dem Server (POST /seed funktioniert nur, solange noch nichts angelegt ist)
const {chromium}=require('/workspace/nc_test/node_modules/playwright');
const F='https://wlujgkbtpjxuekwsgnmg.supabase.co/functions/v1/hopfenmatch';
(async()=>{const br=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const pg=await br.newPage();
await pg.goto('http://localhost:8795/?nosync&nosw');await pg.waitForTimeout(800);
const items=await pg.evaluate(()=>HM.seedItems());await br.close();
const kinds={};items.forEach(i=>kinds[i.kind]=(kinds[i.kind]||0)+1);console.log(items.length,kinds);
const lg=await (await fetch(F+'/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user:'sascha',pass:'BIER'})})).json();
const r=await fetch(F+'/seed',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+lg.token},body:JSON.stringify({items})});
const j=await r.json();console.log(r.status,j.n,j.rev,j.error||'');
})();
