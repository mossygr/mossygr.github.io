/** Index only the explicit documentation allowlist, never the whole output tree. */
import * as pagefind from 'pagefind';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const routes=JSON.parse(readFileSync('dist/content-index.json','utf8'));
const {index,errors}=await pagefind.createIndex();
if(errors?.length||!index)throw new Error(JSON.stringify(errors));
try{
 for(const route of routes){
  const file=join('dist',decodeURI(route.path),'index.html');
  const result=await index.addHTMLFile({url:route.path,content:readFileSync(file,'utf8')});
  if(result.errors?.length)throw new Error(JSON.stringify(result.errors));
 }
 const result=await index.writeFiles({outputPath:'dist/pagefind'});
 if(result.errors?.length)throw new Error(JSON.stringify(result.errors));
 writeFileSync('dist/pagefind/indexed-routes.json',JSON.stringify(routes.map(r=>r.path),null,2));
 console.log(`Pagefind: indexed ${routes.length} documentation pages from the allowlist.`);
}finally{await pagefind.close();}
