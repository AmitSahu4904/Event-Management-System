/**
 * Storage Adapter Interface
 * Provides both localStorage (persistent across browser tabs) and sessionStorage (isolated per browser tab).
 */
export const storageAdapter = {
  get: (key, fallback = null) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from storageAdapter`, e);
      return fallback;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to storageAdapter`, e);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key} from storageAdapter`, e);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error("Error clearing storageAdapter", e);
      return false;
    }
  }
};

export const sessionStorageAdapter = {
  get: (key, fallback = null) => {
    try {
      const saved = sessionStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from sessionStorageAdapter`, e);
      return fallback;
    }
  },

  set: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to sessionStorageAdapter`, e);
      return false;
    }
  },

  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key} from sessionStorageAdapter`, e);
      return false;
    }
  }
};
