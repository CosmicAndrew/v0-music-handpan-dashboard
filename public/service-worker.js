// Handpan Worship Suite - Service Worker v1.0
const CACHE_NAME = 'handpan-worship-v1';
const RUNTIME_CACHE = 'handpan-runtime-v1';
const AUDIO_CACHE = 'handpan-audio-v1';

// Core assets to cache immediately
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192x192.svg',
  '/icon-512x512.svg',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== AUDIO_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Skip Spline 3D background requests (always fetch fresh)
  if (request.url.includes('spline.design')) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first strategy for API calls
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for static assets (JS, CSS, images)
  if (request.url.match(/\.(js|css|svg|png|jpg|jpeg|gif|webp|woff2?)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Cache-first strategy for audio content
  if (request.url.match(/\.(mp3|wav|ogg|m4a)$/)) {
    event.respondWith(audioCache(request));
    return;
  }

  // Stale-while-revalidate for HTML pages
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default: Network-first with cache fallback
  event.respondWith(networkFirst(request));
});

// Cache strategies

// Cache first, fallback to network
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    throw error;
  }
}

// Network first, fallback to cache
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale while revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Special cache for audio files with larger quota
async function audioCache(request) {
  const cache = await caches.open(AUDIO_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Only cache audio files under 5MB to preserve space
      const contentLength = networkResponse.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 5 * 1024 * 1024) {
        cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Audio fetch failed:', error);
    throw error;
  }
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-worship-data') {
    event.waitUntil(syncWorshipData());
  }
});

// Sync worship data when back online
async function syncWorshipData() {
  console.log('[Service Worker] Syncing worship data...');
  // Implementation for syncing user's worship sessions, recordings, etc.
}

// Handle push notifications (for worship reminders)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time for worship and meditation',
    icon: '/icon-192x192.svg',
    badge: '/icon-72x72.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'close',
        title: 'Dismiss',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Handpan Worship Suite', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] Loaded successfully');