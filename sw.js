// Migration from Chirpy PWA to the server-rendered notebook. Root scope only.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 if(self.registration.scope!==new URL('/',self.location.origin).href)return;
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith('chirpy-')).map(key=>caches.delete(key)));
 await self.clients.claim();
 await self.registration.unregister();
 const windows=await self.clients.matchAll({type:'window'});
 await Promise.all(windows.filter(client=>{const u=new URL(client.url);return u.origin===self.location.origin&&!/^\/gym-app(?:\/|$)/.test(u.pathname)}).map(client=>client.navigate(client.url)));
})()));
// No fetch interception: current pages and articles always come from the network.
