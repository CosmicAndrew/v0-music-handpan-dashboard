"use client"

export class CacheManager {
  private static instance: CacheManager
  private cacheVersion = "v2"

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  async getCacheSize(): Promise<{ name: string; size: number }[]> {
    if (!("caches" in window)) {
      return []
    }

    try {
      const cacheNames = await caches.keys()
      const cacheInfo = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name)
          const keys = await cache.keys()
          return { name, size: keys.length }
        }),
      )
      return cacheInfo
    } catch (error) {
      console.error("[CacheManager] Failed to get cache size:", error)
      return []
    }
  }

  async clearAllCaches(): Promise<void> {
    if (!("caches" in window)) {
      return
    }

    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))
      if (process.env.NODE_ENV === "development") {
        console.log("[CacheManager] All caches cleared")
      }
    } catch (error) {
      console.error("[CacheManager] Failed to clear caches:", error)
    }
  }

  async clearOldCaches(): Promise<void> {
    if (!("caches" in window)) {
      return
    }

    try {
      const cacheNames = await caches.keys()
      const currentCaches = [
        `static-${this.cacheVersion}`,
        `dynamic-${this.cacheVersion}`,
        `images-${this.cacheVersion}`,
        `audio-${this.cacheVersion}`,
      ]

      await Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => {
            if (process.env.NODE_ENV === "development") {
              console.log("[CacheManager] Deleting old cache:", name)
            }
            return caches.delete(name)
          }),
      )
    } catch (error) {
      console.error("[CacheManager] Failed to clear old caches:", error)
    }
  }

  async cacheData(key: string, data: any): Promise<void> {
    if (!("caches" in window)) {
      return
    }

    try {
      const cache = await caches.open(`dynamic-${this.cacheVersion}`)
      const response = new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      await cache.put(key, response)
      if (process.env.NODE_ENV === "development") {
        console.log("[CacheManager] Data cached:", key)
      }
    } catch (error) {
      console.error("[CacheManager] Failed to cache data:", error)
    }
  }

  async getCachedData(key: string): Promise<any | null> {
    if (!("caches" in window)) {
      return null
    }

    try {
      const cache = await caches.open(`dynamic-${this.cacheVersion}`)
      const response = await cache.match(key)
      if (response) {
        const data = await response.json()
        if (process.env.NODE_ENV === "development") {
          console.log("[CacheManager] Data retrieved from cache:", key)
        }
        return data
      }
      return null
    } catch (error) {
      console.error("[CacheManager] Failed to get cached data:", error)
      return null
    }
  }

  async preloadSongLibrary(songs: any[]): Promise<void> {
    await this.cacheData("/api/songs", songs)
    if (process.env.NODE_ENV === "development") {
      console.log("[CacheManager] Song library preloaded to cache")
    }
  }

  async isOnline(): Promise<boolean> {
    if (!navigator.onLine) {
      return false
    }

    try {
      const response = await fetch("/manifest.json", {
        method: "HEAD",
        cache: "no-cache",
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncWhenOnline(callback: () => Promise<void>): Promise<void> {
    if (await this.isOnline()) {
      await callback()
    } else {
      if ("serviceWorker" in navigator && "sync" in ServiceWorkerRegistration.prototype) {
        try {
          const registration = await navigator.serviceWorker.ready
          await registration.sync.register("sync-offline-actions")
          if (process.env.NODE_ENV === "development") {
            console.log("[CacheManager] Background sync registered")
          }
        } catch (error) {
          console.error("[CacheManager] Background sync failed:", error)
        }
      }
    }
  }
}

export const cacheManager = CacheManager.getInstance()
