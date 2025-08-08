const CACHE_NAME = 'catalog-cache-v1';
const urlsToCache = [
  '/CATALOGOLOSPARRITAS/',
  '/CATALOGOLOSPARRITAS/index.html',
  '/CATALOGOLOSPARRITAS/styles.css',
  '/CATALOGOLOSPARRITAS/app.js',
  '/CATALOGOLOSPARRITAS/manifest.json',
  '/CATALOGOLOSPARRITAS/img/1921192.png',
  '/CATALOGOLOSPARRITAS/img/5120512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});