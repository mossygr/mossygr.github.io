import type { APIRoute } from 'astro';
import {allDocs} from '../lib/content';
import {listings} from '../lib/routes';
import {site} from '../config/site';
const escape=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
export const GET:APIRoute=async()=>{
 const docs=await allDocs();
 const urls=[...docs.map(d=>({path:d.data.permalink,date:d.data.date.toISOString()})),...listings(docs).filter(r=>r.kind!=='search'&&!r.path.includes('/page2/')).map(r=>({path:r.path,date:undefined}))];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${escape(new URL(u.path,site.url).href)}</loc>${u.date?`<lastmod>${u.date}</lastmod>`:''}</url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
