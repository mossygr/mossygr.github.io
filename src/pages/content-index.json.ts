import type {APIRoute} from 'astro';
import {allDocs} from '../lib/content';
export const GET:APIRoute=async()=>new Response(JSON.stringify((await allDocs()).map(doc=>({key:doc.data.key,lang:doc.data.lang,path:doc.data.permalink}))),{headers:{'Content-Type':'application/json'}});
