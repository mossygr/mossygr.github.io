import { getCollection, type CollectionEntry } from 'astro:content';
import preservation from '../../preserved/manifest.json';
import { prefix, type Language } from '../config/site';
export type Doc = CollectionEntry<'docs'>;
export async function allDocs():Promise<Doc[]> {
 const docs=await getCollection('docs'),paths=new Set<string>(),pairs=new Map<string,Set<string>>();
 for(const doc of docs){
  const path=decodeURI(doc.data.permalink);
  if(paths.has(path))throw new Error(`Duplicate document URL: ${path}`);
  if(preservation.hidden_paths.some(hidden=>path===hidden.replace(/\/$/,'')||path.startsWith(hidden)))throw new Error(`Document occupies a preserved route: ${doc.id}`);
  if(path.startsWith('/en/')!==(doc.data.lang==='en'))throw new Error(`Language and permalink disagree: ${doc.id}`);
  paths.add(path);const languages=pairs.get(doc.data.key)||new Set<string>();
  if(languages.has(doc.data.lang))throw new Error(`Duplicate language/key: ${doc.data.key}`);
  languages.add(doc.data.lang);pairs.set(doc.data.key,languages);
 }
 for(const [key,languages] of pairs)if(!languages.has('el')||!languages.has('en'))throw new Error(`Missing full Greek/English content pair: ${key}`);
 return docs;
}
export const sorted = (docs: Doc[]) => [...docs].sort((a,b) => b.data.date.getTime()-a.data.date.getTime());
export const slug = (name: string) => name.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-');
export const categoryHref = (name: string, lang: Language) => `${prefix(lang)}categories/${slug(name)}/`;
export const tagHref = (name: string, lang: Language) => `${prefix(lang)}tags/${slug(name)}/`;
export const formatDate = (date: Date, lang: Language) => new Intl.DateTimeFormat(lang === 'el' ? 'el-GR' : 'en-GB', {day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Athens'}).format(date);
export function counterpart(doc: Doc, docs: Doc[]) { return docs.find(d => d.data.key === doc.data.key && d.data.lang !== doc.data.lang)?.data.permalink; }
export function categoryGroups(docs: Doc[], lang: Language) {
  const names = [...new Set(docs.filter(d=>d.data.lang===lang).flatMap(d=>d.data.categories))];
  return names.map(name => ({ name, href: categoryHref(name,lang), docs: sorted(docs.filter(d=>d.data.lang===lang&&d.data.categories.includes(name))) }));
}

export const articleCount=(count:number,lang:Language)=>`${count} ${lang==='el'?(count===1?'άρθρο':'άρθρα'):(count===1?'article':'articles')}`;
