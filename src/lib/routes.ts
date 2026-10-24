import {type Doc,categoryGroups,slug,tagHref} from './content';
import {prefix,text,type Language} from '../config/site';
import taxonomies from '../config/legacy-taxonomies.json';
export type ListingRoute = { path:string; lang:Language; alternate:string; title:string; kind:'home'|'list'|'categories'|'tags'|'search'; docs:Doc[]; description:string };
export function listings(docs:Doc[]):ListingRoute[] {
 const routes:ListingRoute[]=[];
 for (const lang of ['el','en'] as const) {
  const base=prefix(lang),other=prefix(lang==='el'?'en':'el'),local=docs.filter(d=>d.data.lang===lang),t=text[lang];
  for(const [suffix,title,kind,items] of [
   ['',t.home,'home',local],['archives/',t.archives,'list',local],['page2/',t.archives,'list',local],
   ['guides/',t.guides,'list',local.filter(d=>d.data.type!=='article')],['projects/',t.projects,'list',local.filter(d=>d.data.type==='project'||d.data.key.includes('robot-4wd'))],
   ['categories/',t.categories,'categories',local],['tags/',t.tags,'tags',local],['search/',t.search,'search',local],
  ] as const) routes.push({path:base+suffix,lang,alternate:other+suffix,title,kind,docs:[...items],description:lang==='el'?'Τεχνικοί οδηγοί, κατασκευές και σημειώσεις από την πράξη.':'Technical guides, projects, and notes from building things.'});
  for(const group of categoryGroups(docs,lang)) {
   const paired=Object.values(taxonomies).find(p=>decodeURI(p[lang])===decodeURI(group.href));
   routes.push({path:group.href,lang,alternate:paired?.[lang==='el'?'en':'el']||other+'categories/',title:group.name,kind:'list',docs:group.docs,description:`${t.categories} / ${group.name}`});
  }
  for (const tag of [...new Set(local.flatMap(d=>d.data.tags))]) {
   const path=tagHref(tag,lang),paired=Object.values(taxonomies).find(p=>decodeURI(p[lang])===decodeURI(path));
   routes.push({path,lang,alternate:paired?.[lang==='el'?'en':'el']||other+'tags/'+slug(tag)+'/',title:tag,kind:'list',docs:local.filter(d=>d.data.tags.includes(tag)),description:`${t.tags} / ${tag}`});
  }
 }
 // Keep historical taxonomy URLs even when their slug differs from the new normalized label.
 for(const pair of Object.values(taxonomies)) for(const lang of ['el','en'] as const) {
  if(routes.some(r=>decodeURI(r.path)===decodeURI(pair[lang])))continue;
  const name=decodeURI(pair[lang]).split('/').filter(Boolean).at(-1)!;
  const local=docs.filter(d=>d.data.lang===lang);
  const isTag=pair[lang].includes('/tags/');
  const selected=local.filter(d=>(isTag?d.data.tags:d.data.categories).some(label=>slug(label)===name));
  routes.push({path:pair[lang],lang,alternate:pair[lang==='el'?'en':'el'],title:name,kind:'list',docs:selected,description:isTag?text[lang].tags:text[lang].categories});
 }
 return routes;
}
