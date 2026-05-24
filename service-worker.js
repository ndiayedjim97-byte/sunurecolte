const CACHE_NAME = 'dertady-agro-cache-v3'; // Changement de nom et version pour forcer la mise à jour
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './logo.png', // AJOUT : On met ton nouveau logo en cache
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
      icon: './logo.png', // MODIFICATION : Ton nouveau logo s'affichera sur la notification
      badge: './logo.png', // MODIFICATION : Ton nouveau logo dans la barre d'état
      vibrate: [300, 100, 300],
      tag: 'dertady-agro-chat',
      renotify: true
    };
    self.registration.showNotification(event.data.title, options);
  }
});
