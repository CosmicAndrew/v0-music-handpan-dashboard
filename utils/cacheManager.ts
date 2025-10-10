"use client"

interface CacheItem {
  data: any
  timestamp: number
  expiresIn: number
}

class CacheManager {
  private cache: Map<string, CacheItem> = new Map()
  private readonly DEFAULT_EXPIRY = 1000 * 60 * 60 // 1 hour

  set(key: string, data: any, expiresIn: number = this.DEFAULT_EXPIRY): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    const isExpired = Date.now() - item.timestamp > item.expiresIn

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  async preloadSongLibrary(songs: any[]): Promise<void> {
    try {
      this.set("songLibrary", songs, 1000 * 60 * 60 * 24) // Cache for 24 hours
      console.log("[CacheManager] Song library preloaded:", songs.length, "songs")
    } catch (error) {
      console.error("[CacheManager] Failed to preload song library:", error)
    }
  }

  getSongLibrary(): any[] | null {
    return this.get("songLibrary")
  }
}

export const cacheManager = new CacheManager()
