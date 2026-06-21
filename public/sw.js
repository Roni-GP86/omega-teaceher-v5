const CACHE_NAME = 'omega-guru-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('Failed to cache assets on install:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and local scope
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Exclude API requests from caching
  if (event.request.url.includes('/api/')) {
    return;
  }

  const url = event.request.url;

  // OPTIMASI KRUSIAL: Lewati intersep cache Service Worker untuk seluruh modul prapengembangan Vite
  // (misal node_modules, src, query ?import/?v=/?t=) agar reload halaman instan, responsif, dan tidak hung di layar putih.
  if (
    url.includes('/node_modules/') ||
    url.includes('/@vite/') ||
    url.includes('/@id/') ||
    url.includes('/@react-refresh') ||
    url.includes('/src/') ||
    url.includes('?import') ||
    url.includes('?v=') ||
    url.includes('?t=') ||
    url.includes('__vite_ping') ||
    self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1' ||
    self.location.hostname.includes('10.0.') ||
    self.location.hostname.includes('192.168.')
  ) {
    return; // Pass through directly from the network, do not touch or cache!
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to update cache (stale-while-revalidate pattern)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {/* Ignore network errors offline */});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback for index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});

// Listen for SKIP_WAITING from the UI to apply instant updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
