import { BaseAdapter } from '@kennelo/core/storage/adapters/base.adapter';
import { cookieUtils } from '@kennelo/core/storage/utils/cookies';

export class CookieAdapter extends BaseAdapter {
    constructor(options = {}) {
        super();
        this.defaultOptions = options;
    }

    async set(key, value, options = {}) {
        if (typeof window === 'undefined') {
            throw new Error('CookieAdapter can only be used in browser environment');
        }

        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        const days = options.days || (options.ttl ? Math.ceil(options.ttl / 86400) : 7);
        const { days: _, ttl: __, ...cookieOptions } = options;
        const finalOptions = { ...this.defaultOptions, ...cookieOptions };
        cookieUtils.set(key, serializedValue, days, finalOptions);
    }

    async get(key) {
        if (typeof window === 'undefined') return null;

        const value = cookieUtils.get(key);

        if (value === null) return null;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    async remove(key) {
        if (typeof window === 'undefined') return;

        cookieUtils.remove(key, this.defaultOptions);
    }

    async clear() {
        if (typeof window === 'undefined') return;

        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const name = cookie.split('=')[0].trim();
            await this.remove(name);
        }
    }
}
