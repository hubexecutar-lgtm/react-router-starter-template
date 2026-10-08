const CACHE="executar-miniapp-v1",BASE="/ferramentas/processo-de-trabalho/";
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll([BASE,BASE+"manifest.webmanifest"])).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!=="GET"||u.origin!==self.location.origin||!u.pathname.startsWith(BASE))return;if(r.mode==="navigate"){e.respondWith(fetch(r).then(v=>{if(v.ok)caches.open(CACHE).then(c=>c.put(BASE,v.clone()));return v}).catch(()=>caches.match(BASE).then(v=>v||Response.error())));return;}e.respondWith(caches.match(r).then(v=>v||fetch(r).then(x=>{if(x.ok)caches.open(CACHE).then(c=>c.put(r,x.clone()));return x})));});
