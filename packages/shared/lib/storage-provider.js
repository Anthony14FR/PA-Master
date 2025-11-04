import { StorageService } from '@kennelo/services/storage/storage.service';

let storageInstance = null;

export function initializeStorage(adapter) {
  if (!adapter) {
    throw new Error('Storage adapter is required');
  }

  if (storageInstance) {
    console.warn('Storage already initialized, returning existing instance');
    return storageInstance;
  }

  storageInstance = new StorageService(adapter);
  return storageInstance;
}

export function getStorageInstance() {
  if (!storageInstance) {
    if (typeof window === 'undefined') {
      return createServerFallback();
    }

    throw new Error(
      'Storage not initialized. Call initializeStorage() in your app entry point.'
    );
  }
  return storageInstance;
}

export function hasStorageInstance() {
  return storageInstance !== null;
}

export function clearStorageInstance() {
  storageInstance = null;
}

function createServerFallback() {
  return {
    async get() { return null; },
    async set() {},
    async remove() {},
    async clear() {},
    async has() { return false; },
    async getJSON() { return null; },
    async setJSON() {},
  };
}
