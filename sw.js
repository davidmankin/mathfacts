const CACHE_NAME = 'math-facts-v1';
const urlsToCache = [
  '/mathfacts/',
  '/mathfacts/index.html',
  '/mathfacts/script.js',
  '/mathfacts/styles.css',
  '/mathfacts/manifest.json',
  '/mathfacts/sounds/4-bing-things-82661.mp3',
  '/mathfacts/sounds/alert-sound-87478.mp3',
  '/mathfacts/sounds/belch-155023.mp3',
  '/mathfacts/sounds/bing-298405.mp3',
  '/mathfacts/sounds/cow_bells_01-98236.mp3',
  '/mathfacts/sounds/din-ding-89718.mp3',
  '/mathfacts/sounds/elevator_ping_02-40404.mp3',
  '/mathfacts/sounds/mission-success-41211.mp3',
  '/mathfacts/sounds/notification-sound-269266.mp3',
  '/mathfacts/sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3',
  '/mathfacts/sounds/success-221935.mp3',
  '/mathfacts/sounds/win-176035.mp3',
  '/mathfacts/sounds/wrong.mp3',
  '/mathfacts/sounds/celebration.mp3'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
