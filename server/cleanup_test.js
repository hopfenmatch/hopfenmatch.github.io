// Entfernt alle Testkonten (Name beginnt mit "Zz") samt Daten rückstandslos + Test-Sitzungen von Sascha/Martin
const q=require('./q.js'),fs=require('fs');
const C=JSON.parse(fs.readFileSync('/workspace/biermatch/work/mu_created.json','utf8'));
const users=q("select id,name from hm_user where name like 'Zz%'");const ids=[...new Set([...users.map(u=>u.id),...C.users])].filter(x=>/^u[0-9a-f]+$/.test(x));
console.log('Testkonten',ids.length,users.map(u=>u.name).join(','));
const L=ids.map(i=>`'${i}'`).join(',')||"''";
const like=ids.map(i=>`id like '${i}:%' or id like '${i}|%' or id like '%|${i}' or data->>'user'='${i}' or data->>'to'='${i}' or data->>'from'='${i}' or data->>'host'='${i}' or data->>'by'='${i}' or data->'participants' ? '${i}'`).join(' or ')||'false';
const tids=q(`select id from hm_item where kind='tasting' and (by_user in (${L}) or ${like})`).map(r=>r.id);
const TL=tids.map(t=>`'${t}'`).join(',')||"''";
const del=`delete from hm_item where by_user in (${L}) or ${like} or (kind='tscore' and split_part(id,'|',1) in (${TL})) or (kind='event' and data->>'tid' in (${TL})) returning kind,id`;
const r=q(del);console.log('hm_item gelöscht',Array.isArray(r)?r.length:r);
const tk=C.tokens.map(t=>`'${t}'`).join(',')||"''";
console.log(JSON.stringify(q(`delete from hm_friend where a in (${L}) or b in (${L}) returning a; `)).length,'friend');
console.log(JSON.stringify(q(`delete from hm_session where usr in (${L}) or token in (${tk}) returning usr`)));
console.log(JSON.stringify(q(`delete from hm_user where id in (${L}) returning name`)));
console.log(JSON.stringify(q(`delete from hm_fail returning k`)));
