const cacheName = 'engineering-calculator-v4-logo'
const appShell = ['/', '/index.html', '/manifest.webmanifest', '/calc.png', '/icon-192.png', '/icon-512.png']
const isOwnAsset = request => new URL(request.url).origin === self.location.origin

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(appShell)))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('engineering-calculator-') && key !== cacheName).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('frankfurter.app')) {
    event.respondWith(fetch(event.request).catch(() => new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } })))
    return
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')))
    return
  }
  if (!isOwnAsset(event.request)) return
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) void caches.open(cacheName).then(cache => cache.put(event.request, response.clone()))
    return response
  }).catch(() => new Response('Offline', { status: 503 }))))
})
