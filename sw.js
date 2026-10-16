
const CACHE = 'baya-v4';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  ...[
    'cover-page.png',
    'welcome.png',
    'menu-bg.png',
    'door-outside.png',
    'door-handle.png',
    'walk-1.png',
    'walk-2.png',
    'walk-cows.png',
    'dogs.png',
    'food-tunnel.png',
    'food-bag.png',
    'treat.png',
    'red-bone.png',
    'blue-rope.png',
    'giraffe.png',
    'cuddles.png'
  ].map(x => './assets/' + x)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('baya-') && key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
