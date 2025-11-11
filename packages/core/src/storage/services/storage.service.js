export class StorageService {
    constructor(adapter) {
        if (!adapter) {
            throw new Error('StorageService requires an adapter');
        }
        this.adapter = adapter;
    }

    /**
     * Store a value
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @param {Object} options - Storage options
     * @returns {Promise<void>}
     */
    async set(key, value, options = {}) {
        return this.adapter.set(key, value, options);
    }

    /**
     * Retrieve a value
     * @param {string} key - Storage key
     * @returns {Promise<any|null>}
     */
    async get(key) {
        return this.adapter.get(key);
    }

    /**
     * Remove a value
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    async remove(key) {
        return this.adapter.remove(key);
    }

    /**
     * Clear all values
     * @returns {Promise<void>}
     */
    async clear() {
        return this.adapter.clear();
    }

    /**
     * Check if a key exists
     * @param {string} key - Storage key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return this.adapter.has(key);
    }

    /**
     * Get/Set with automatic JSON handling
     */
    async getJSON(key) {
        const value = await this.get(key);
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    }

    async setJSON(key, value, options = {}) {
        const serialized = typeof value === 'object' ? JSON.stringify(value) : value;
        return this.set(key, serialized, options);
    }
}

/**
 * Create a storage instance with the given adapter
 * @param {BaseAdapter} adapter - Storage adapter
 * @returns {StorageService}
 */
export function createStorage(adapter) {
    return new StorageService(adapter);
}