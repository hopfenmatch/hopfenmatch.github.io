// SQL über die Supabase Management API (gleicher Token wie die CLI, aus der Umgebung)
const {execSync}=require('child_process');
module.exports=sql=>{const o=execSync(`curl -s -X POST https://api.supabase.com/v1/projects/wlujgkbtpjxuekwsgnmg/database/query -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H "Content-Type: application/json" -d @-`,{input:JSON.stringify({query:sql})}).toString();try{return JSON.parse(o)}catch(e){return o}};
if(require.main===module){const fs=require('fs');const a=process.argv[2];console.log(JSON.stringify(module.exports(fs.existsSync(a)?fs.readFileSync(a,'utf8'):a),null,1))}
