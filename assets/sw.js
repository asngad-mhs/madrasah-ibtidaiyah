
const CACHE_NAME = 'mi-ceria-app-v8'; // Bump version to ensure update
const urlsToCache = [
    '/',
    '/index.html',
    '/index.tsx', // Cache the main consolidated app script
    '/assets/icon.svg',
    '/assets/manifest.json',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/apple-touch-icon.png'
];

// Install the service worker and cache static assets
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force the new service worker to activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache and caching static assets');
            return cache.addAll(urlsToCache);
        })
    );
});

// Serve cached content when offline with a cache-first strategy
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Do not cache API requests to Google
    if (event.request.url.includes('generativelanguage')) {
        // Fallback to network for API calls
        return fetch(event.request);
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // If we have a cached response, return it.
            if (cachedResponse) {
                return cachedResponse;
            }

            // Otherwise, fetch from the network.
            return fetch(event.request).then((networkResponse) => {
                // We don't cache on the fly for this strategy to keep it simple
                return networkResponse;
            }).catch(() => {
                // If the network request fails and it's a navigation request,
                // return the main index.html page from the cache.
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return;
            });
        })
    );
});


// Clean up old caches on activation
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all open clients
    );
});