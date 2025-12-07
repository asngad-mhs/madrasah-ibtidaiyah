
const CACHE_NAME = 'mi-ceria-app-v10'; // Bump version to force update
const urlsToCache = [
    '/',
    '/index.html',
    '/index.tsx',
    '/App.tsx',
    '/types.ts',
    '/constants.ts',
    '/services/geminiService.ts',
    '/components/BottomNav.tsx',
    '/components/FeedbackModal.tsx',
    '/components/InstallPwaButton.tsx',
    '/components/RegistrationForm.tsx',
    '/components/Timetable.tsx',
    '/components/icons/AiTutorIcon.tsx',
    '/components/icons/ChatBubbleLeftRightIcon.tsx',
    '/components/icons/DownloadIcon.tsx',
    '/components/icons/FinanceIcon.tsx',
    '/components/icons/GradesIcon.tsx',
    '/components/icons/HomeIcon.tsx',
    '/components/icons/HomeworkIcon.tsx',
    '/components/icons/InformationIcon.tsx',
    '/components/icons/MoonIcon.tsx',
    '/components/icons/ProfileIcon.tsx',
    '/components/icons/SparklesIcon.tsx',
    '/components/icons/SunIcon.tsx',
    '/components/icons/TrophyIcon.tsx',
    '/views/About.tsx',
    '/views/Achievements.tsx',
    '/views/AiTutor.tsx',
    '/views/Dashboard.tsx',
    '/views/Finance.tsx',
    '/views/Grades.tsx',
    '/views/Homework.tsx',
    '/views/Profile.tsx',
    '/assets/icon.svg',
    '/assets/manifest.json',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/apple-touch-icon.png'
];

// Install the service worker, cache static assets, and activate immediately.
self.addEventListener('install', (event) => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache and caching static assets');
            return cache.addAll(urlsToCache);
        })
    );
});

// Use a "Network falling back to cache" strategy.
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Do not cache API requests to Google, always fetch from network.
    if (event.request.url.includes('generativelanguage')) {
        return fetch(event.request);
    }

    event.respondWith(
        // 1. Try to fetch from the network first.
        fetch(event.request)
            .then((networkResponse) => {
                // If the network request is successful, update the cache with the new version.
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // 2. If the network fails (e.g., offline), serve from the cache.
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If also not in cache (for navigation), return the offline page.
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return;
                });
            })
    );
});

// Clean up old caches on activation and take control of the page.
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
        }).then(() => self.clients.claim()) // Take control of all open clients immediately.
    );
});
