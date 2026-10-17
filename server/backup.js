// JSON-Backup aller HopfenMatch-Tabellen nach /workspace/biermatch/backups/
const q=require('./q.js'),fs=require('fs');
const ts=new Date().toISOString().replace(/[-:]/g,'').replace(/\..*/,'')+'Z';
const tabs=q("select table_name from information_schema.tables where table_schema='public' and table_name like 'hm\\_%'").map(r=>r.table_name);
for(const t of tabs){const rows=q(`select * from public.${t}`);fs.writeFileSync(`/workspace/biermatch/backups/${ts}_${t}.json`,JSON.stringify(rows,null,1));console.log(t,Array.isArray(rows)?rows.length:rows)}
fs.writeFileSync(`/workspace/biermatch/backups/${ts}_hm_rev_seq.json`,JSON.stringify(q('select last_value from public.hm_rev_seq')));
console.log('backup',ts);
