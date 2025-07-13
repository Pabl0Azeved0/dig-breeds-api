interface CacheEntry {
  value: any;
  expiry: number;
}

class Cache {
  private store = new Map<string, CacheEntry>();

  /**
   * Sets a value in the cache with a specific TTL (time-to-live) in seconds.
   * @param key The key to store the value under.
   * @param value The value to be cached.
   * @param ttl The time-to-live in seconds.
   */
  set(key: string, value: any, ttl: number): void {
    const expiry = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiry });
  }

  /**
   * Retrieves a value from the cache. Returns null if the key does not exist or has expired.
   * @param key The key to retrieve.
   * @returns The cached value or null.
   */
  get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.store.delete(key); // Entry has expired, so we remove it.
      return null;
    }

    return entry.value;
  }

  /**
   * Deletes a key from the cache.
   * @param key The key to delete.
   */
  del(key: string): void {
    this.store.delete(key);
  }
}

export const cache = new Cache();