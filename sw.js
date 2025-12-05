
const CACHE_NAME = 'mi-ceria-app-v4'; // Bump version to ensure update
const urlsToCache = [
    '/',
    '/index.html',
    '/index.tsx', // Cache the main app script
    '/assets/icon.svg',
    '/assets/manifest.json',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/apple-touch-icon.png'
];

// Install the service worker and cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache and caching static assets');
            return cache.addAll(urlsToCache);
        })
    );
});

// Serve cached content when offline with a network-first fallback strategy
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Do not cache API requests to Google
    if (event.request.url.includes('generativelanguage')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // If we have a cached response, return it.
            if (cachedResponse) {
                return cachedResponse;
            }

            // Otherwise, fetch from the network.
            return fetch(event.request).then((networkResponse) => {
                // If we get a valid response, clone it and cache it.
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If the network request fails and it's a navigation request,
                // return the main index.html page from the cache.
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                // For other failed requests (like images), we don't need to do anything special.
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
        })
    );
});