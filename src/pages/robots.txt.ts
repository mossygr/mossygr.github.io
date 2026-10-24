import type { APIRoute } from 'astro';
export const GET:APIRoute=()=>new Response('User-agent: *\nAllow: /\nDisallow: /norobots/\nSitemap: https://mossygr.github.io/sitemap.xml\n',{headers:{'Content-Type':'text/plain'}});
