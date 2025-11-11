export class BaseAdapter {
    /**
     * Store a value
     * @param {string} key - Storage key
     * @param {any} value - Value to store (will be serialized)
     * @param {Object} options - Optional settings (ttl, days, etc.)
     * @returns {Promise<void>}
     */
    async set(key, value, options = {}) {
        throw new Error('Method set() must be implemented');
    }

    /**
     * Retrieve a value
     * @param {string} key - Storage key
     * @returns {Promise<any|null>} Retrieved value or null
     */
    async get(key) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * Remove a value
     * @param {string} key - Storage key
     * @returns {Promise<void>}
     */
    async remove(key) {
        throw new Error('Method remove() must be implemented');
    }

    /**
     * Clear all stored values
     * @returns {Promise<void>}
     */
    async clear() {
        throw new Error('Method clear() must be implemented');
    }

    /**
     * Check if a key exists
     * @param {string} key - Storage key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        const value = await this.get(key);
        return value !== null;
    }
}