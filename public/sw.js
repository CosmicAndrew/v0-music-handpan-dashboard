const CACHE_VERSION = "v2"
const CACHE_NAME = `handpan-worship-${CACHE_VERSION}`
const STATIC_CACHE = `static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`
const IMAGE_CACHE = `images-${CACHE_VERSION}`
const AUDIO_CACHE = `audio-${CACHE_VERSION}`

// Static assets to cache immediately
const STATIC_ASSETS = ["/", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg", "/offline.html"]

// Install service worker and cache static resources
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error)
      }),
  )
})

// Activate service worker and clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== AUDIO_CACHE
            ) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Helper function to determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url)

  // Cache-first for images
  if (request.destination === "image" || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    return "cache-first"
  }

  // Cache-first for audio files
  if (request.destination === "audio" || url.pathname.match(/\.(mp3|wav|ogg|m4a)$/)) {
    return "cache-first"
  }

  // Cache-first for fonts
  if (request.destination === "font" || url.pathname.match(/\.(woff|woff2|ttf|eot)$/)) {
    return "cache-first"
  }

  // Cache-first for static assets
  if (
    url.pathname.match(/\.(js|css)$/) ||
    url.pathname.includes("/_next/static/") ||
    url.pathname === "/manifest.json"
  ) {
    return "cache-first"
  }

  // Stale-while-revalidate for API calls and data
  if (url.pathname.includes("/api/") || url.pathname.includes("/data/")) {
    return "stale-while-revalidate"
  }

  // Network-first for HTML pages
  if (request.destination === "document" || request.headers.get("accept")?.includes("text/html")) {
    return "network-first"
  }

  // Default: network-first
  return "network-first"
}

// Helper function to get appropriate cache name
function getCacheName(request) {
  const url = new URL(request.url)

  if (request.destination === "image" || url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    return IMAGE_CACHE
  }

  if (request.destination === "audio" || url.pathname.match(/\.(mp3|wav|ogg|m4a)$/)) {
    return AUDIO_CACHE
  }

  if (
    url.pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/) ||
    url.pathname.includes("/_next/static/") ||
    url.pathname === "/manifest.json"
  ) {
    return STATIC_CACHE
  }

  return DYNAMIC_CACHE
}

// Cache-first strategy
async function cacheFirst(request) {
  const cacheName = getCacheName(request)
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    console.log("[SW] Cache hit:", request.url)
    return cachedResponse
  }

  console.log("[SW] Cache miss, fetching:", request.url)
  try {
    const networkResponse = await fetch(request)
    const cache = await caches.open(cacheName)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    console.error("[SW] Fetch failed:", error)
    // Return offline fallback if available
    if (request.destination === "document") {
      return caches.match("/offline.html")
    }
    throw error
  }
}

// Network-first strategy
async function networkFirst(request) {
  const cacheName = getCacheName(request)

  try {
    const networkResponse = await fetch(request)
    const cache = await caches.open(cacheName)
    cache.put(request, networkResponse.clone())
    console.log("[SW] Network response cached:", request.url)
    return networkResponse
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url)
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      console.log("[SW] Serving from cache:", request.url)
      return cachedResponse
    }

    // Return offline fallback for HTML pages
    if (request.destination === "document") {
      return caches.match("/offline.html")
    }

    throw error
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cacheName = getCacheName(request)
  const cachedResponse = await caches.match(request)

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      const cache = caches.open(cacheName)
      cache.then((c) => c.put(request, networkResponse.clone()))
      return networkResponse
    })
    .catch((error) => {
      console.error("[SW] Background fetch failed:", error)
      return cachedResponse
    })

  return cachedResponse || fetchPromise
}

// Main fetch event handler
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip chrome extensions and other non-http(s) requests
  if (!event.request.url.startsWith("http")) {
    return
  }

  // Skip Spline iframe requests (they need to be fresh)
  if (event.request.url.includes("spline.design")) {
    return
  }

  const strategy = getCacheStrategy(event.request)

  if (strategy === "cache-first") {
    event.respondWith(cacheFirst(event.request))
  } else if (strategy === "network-first") {
    event.respondWith(networkFirst(event.request))
  } else if (strategy === "stale-while-revalidate") {
    event.respondWith(staleWhileRevalidate(event.request))
  }
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)

  if (event.tag === "sync-offline-actions") {
    event.waitUntil(syncOfflineActions())
  }
})

async function syncOfflineActions() {
  console.log("[SW] Syncing offline actions...")
  // Implement offline action sync logic here
  // This could include syncing user preferences, practice sessions, etc.
}

// Handle messages from clients
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data)

  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }),
    )
  }

  if (event.data.type === "GET_CACHE_SIZE") {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map(async (cacheName) => {
              const cache = await caches.open(cacheName)
              const keys = await cache.keys()
              return { name: cacheName, size: keys.length }
            }),
          )
        })
        .then((cacheInfo) => {
          event.ports[0].postMessage({ type: "CACHE_SIZE", data: cacheInfo })
        }),
    )
  }
})

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  console.log("[SW] Periodic sync triggered:", event.tag)

  if (event.tag === "update-content") {
    event.waitUntil(updateContent())
  }
})

async function updateContent() {
  console.log("[SW] Updating content in background...")
  // Implement periodic content update logic here
}

console.log("[SW] Service worker loaded successfully")
