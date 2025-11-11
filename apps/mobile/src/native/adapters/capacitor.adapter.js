import { BaseStorageAdapter } from '@kennelo/core/storage/adapters/base.adapter';
import { Preferences } from '@capacitor/preferences';

export class CapacitorAdapter extends BaseStorageAdapter {
    constructor(options = {}) {
        super();
        this.prefix = options.prefix || '';
    }

    _getKey(key) {
        return this.prefix ? `${this.prefix}:${key}` : key;
    }

    async set(key, value, options = {}) {
        const data = {
            value,
            timestamp: Date.now()
        };

        if (options.ttl) {
            data.expiresAt = Date.now() + (options.ttl * 1000);
        }

        await Preferences.set({
            key: this._getKey(key),
            value: JSON.stringify(data)
        });
    }

    async get(key) {
        const { value } = await Preferences.get({ key: this._getKey(key) });

        if (!value) return null;

        try {
            const data = JSON.parse(value);

            if (data.expiresAt && Date.now() > data.expiresAt) {
                await this.remove(key);
                return null;
            }

            return data.value;
        } catch (error) {
            console.error('Error parsing Capacitor Preferences item:', error);
            return null;
        }
    }

    async remove(key) {
        await Preferences.remove({ key: this._getKey(key) });
    }

    async clear() {
        if (this.prefix) {
            const { keys } = await Preferences.keys();
            for (const key of keys) {
                if (key.startsWith(`${this.prefix}:`)) {
                    await Preferences.remove({ key });
                }
            }
        } else {
            await Preferences.clear();
        }
    }

    async keys() {
        const { keys } = await Preferences.keys();
        if (this.prefix) {
            return keys
                .filter(key => key.startsWith(`${this.prefix}:`))
                .map(key => key.replace(`${this.prefix}:`, ''));
        }
        return keys;
    }
}
