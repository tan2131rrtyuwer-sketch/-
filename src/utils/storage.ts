/**
 * Safe localStorage wrapper with in-memory fallback.
 * Prevents crashes in private browsing mode, restricted iframes, or when storage is disabled.
 */

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem<T = string>(key: string, fallback: T | null = null): T | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item === null) return fallback;
        try {
          return JSON.parse(item) as T;
        } catch {
          return item as unknown as T;
        }
      }
    } catch {
      // In private browsing or sandboxed iframes, window.localStorage may throw
    }

    if (key in memoryStore) {
      try {
        return JSON.parse(memoryStore[key]) as T;
      } catch {
        return memoryStore[key] as unknown as T;
      }
    }
    return fallback;
  },

  setItem(key: string, value: any): boolean {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    memoryStore[key] = stringValue;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, stringValue);
        return true;
      }
    } catch {
      // localStorage is unavailable or quota exceeded
    }
    return false;
  },

  removeItem(key: string): boolean {
    delete memoryStore[key];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  },

  clear(): void {
    Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {
      // ignore
    }
  },
};
