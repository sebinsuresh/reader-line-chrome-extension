// StorageService: abstraction layer for chrome.storage.local
// Filters storage.onChanged events to only 'local' namespace

class StorageService {
  /**
   * Retrieve all stored settings
   * @returns {Promise<{color: string, height: number, enabled: boolean, mode: string}>}
   */
  getAll() {
    return chrome.storage.local.get([
      STORAGE_KEYS.COLOR,
      STORAGE_KEYS.HEIGHT,
      STORAGE_KEYS.ENABLED,
      STORAGE_KEYS.MODE,
    ]);
  }

  /**
   * Save one or more settings to local storage
   * @param {Object} data - key-value pairs to save
   * @returns {Promise<void>}
   */
  set(data) {
    return chrome.storage.local.set(data);
  }

  /**
   * Register a callback for storage changes (filters to 'local' namespace only)
   * @param {Function} callback - called with (changes) when storage is updated
   */
  onChange(callback) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        callback(changes);
      }
    });
  }
}
