
const CACHE_NAME = 'mi-ceria-app-v1';
const urlsToCache = [
    './',
    './index.html',
    './icon.svg'
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

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // If the request is in the cache, return it.
            if (response) {
                return response;
            }

            // Otherwise, fetch it from the network.
            return fetch(event.request).then((networkResponse) => {
                // If we get a valid response, cache it for future use.
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    // Do not cache calls to the Gemini API
                    if (!event.request.url.includes('generativelanguage')) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                }
                return networkResponse;
            }).catch(err => {
                console.error('Fetch failed; returning offline page instead.', err);
                // You could return a custom offline page here if you had one.
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
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});