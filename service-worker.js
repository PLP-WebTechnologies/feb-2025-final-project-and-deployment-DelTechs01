const CACHE_NAME = 'wanderlust-odyssey-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/manifest.json',
  'https://i.pinimg.com/736x/79/7a/25/797a258c020baa1cbbe64910bbb07361.jpg',
  'https://i.pinimg.com/736x/3d/f8/9f/3df89ff2ef171d95ed22b457e4c09400.jpg',
  'https://i.pinimg.com/736x/3f/d1/1c/3fd11cde6740d8a6c1f9b0e93596230e.jpg',
  'https://i.pinimg.com/736x/94/d5/c1/94d5c1a4b0fe0cc3c105dd0472953c64.jpg',
  'https://i.pinimg.com/736x/82/35/ce/8235cea867da62c679f7f7603545c320.jpg',
  'https://i.pinimg.com/736x/8a/e9/99/8ae999537dfdc473c8af9a9c2a2b6859.jpg',
  'https://i.pinimg.com/736x/26/d9/45/26d945bc383f77ef6f6b5a36f80529b0.jpg',
  'https://i.pinimg.com/736x/23/15/54/2315548891ddb9b7b8ec25e5acd1b475.jpg',
  'https://i.pinimg.com/736x/26/b3/0c/26b30c0400e3a27cc9aaf7de789e7ac7.jpg',
  'https://i.pinimg.com/736x/01/36/78/0136787a3d562a8392531f7955424dd0.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});