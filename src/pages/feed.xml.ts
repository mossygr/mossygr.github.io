import type {APIRoute} from 'astro';
import {allDocs,sorted} from '../lib/content';
import {site} from '../config/site';
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const GET:APIRoute=async()=>{const docs=sorted((await allDocs()).filter(d=>d.data.lang==='el'));
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>m0ss1</title><link>${site.url}/</link><description>Τεχνικοί οδηγοί και projects</description><language>el</language>${docs.map(d=>`<item><title>${esc(d.data.title)}</title><link>${esc(new URL(d.data.permalink,site.url).href)}</link><guid>${esc(new URL(d.data.permalink,site.url).href)}</guid><pubDate>${d.data.date.toUTCString()}</pubDate><description>${esc(d.data.description)}</description></item>`).join('')}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
};
