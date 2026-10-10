import fs from "node:fs";
import { spawnSync } from "node:child_process";
const config=JSON.parse(fs.readFileSync("wrangler.jsonc","utf8"));
if(config.d1_databases[0].database_id==="00000000-0000-4000-8000-000000000000"){
 throw new Error("Create your Cloudflare D1 database and put its ID in wrangler.jsonc first.");
}
const run=(args)=>{const result=spawnSync(process.execPath,["node_modules/wrangler/bin/wrangler.js",...args],{stdio:"inherit"});if(result.status!==0)process.exit(result.status||1)};
run(["d1","migrations","apply","DB","--remote","--config","wrangler.jsonc"]);
run(["deploy","--config","dist/server/wrangler.json"]);
