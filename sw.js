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
  // Estrategia: Cache, luego red. Siempre intenta la red para actualizaciones.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Primero, si el archivo está en caché, lo servimos
        if (response) {
          return response;
        }

        // Luego, si no está en caché, intentamos la red
        return fetch(event.request);
      })
      .catch(() => {
        // Si la red falla, y no tenemos el archivo en caché,
        // devolvemos una página sin conexión o un error
        // Para este caso, no hacemos nada, simplemente fallamos
      })
  );

  // Opcional: Revalidar y actualizar el caché en segundo plano
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return fetch(event.request).then(response => {
        // Si la solicitud fue exitosa, actualizamos el caché
        if (event.request.url.includes('productos.csv')) {
          console.log('Service Worker: Actualizando la caché del CSV.');
          return cache.put(event.request, response.clone());
        }
        return response;
      });
    })
  );
});