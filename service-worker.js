const CACHE_NAME = 'darou-salam-cache-v2'; // Changement de version pour forcer la mise à jour
const ASSETS = [
  './',
  './index.html',
  './style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => { if (key !== CACHE_NAME) return caches.delete(key); })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

// Écouteur de messages internes pour réveiller l'écran du Samsung
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHAT_NOTIFICATION') {
    const options = {
      body: event.data.body,
      icon: 'https://cdn-icons-png.flaticon.com/512/2740/2740594.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/2740/2740594.png',
      vibrate: [300, 100, 300],
      tag: 'darou-salam-chat',
      renotify: true
    };
    self.registration.showNotification(event.data.title, options);
  }
});
