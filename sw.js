const CACHE_NAME = 'catalog-cache-v2';
const urlsToCache = [
  '/CATALOGOLOSPARRITAS/',
  '/CATALOGOLOSPARRITAS/index.html',
  '/CATALOGOLOSPARRITAS/styles.css',
  '/CATALOGOLOSPARRITAS/app.js',
  '/CATALOGOLOSPARRITAS/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cacheando archivos estáticos');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Estrategia de red, luego caché para el CSV y las imágenes
  if (event.request.url.includes('pub?output=csv') || event.request.url.includes('/img/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Si la red es exitosa, actualizamos el caché y devolvemos la respuesta
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Si la red falla, devolvemos lo que tenemos en caché
          return caches.match(event.request);
        })
    );
  } else {
    // Para los otros archivos (HTML, CSS, JS), usamos la estrategia de solo caché
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});