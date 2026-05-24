const CACHE_NAME = 'darou-salam-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  'https://darou-salam-agritech-default-rtdb.firebaseio.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js'
];

// Installation du mode hors-ligne
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Nettoyage
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Gestion du hors-ligne
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});

// 🔥 LE MOTEUR DES NOTIFICATIONS EN ARRIÈRE-PLAN
self.addEventListener('push', (event) => {
  let data = { title: 'Darou Salam', body: 'Nouveau message reçu !' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Darou Salam', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2740/2740594.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2740/2740594.png',
    vibrate: [200, 100, 200],
    data: { dateOfArrival: Date.now() }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
