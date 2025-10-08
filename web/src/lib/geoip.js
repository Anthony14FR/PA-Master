let geoipReader = null;

async function initGeoIP() {
    if (geoipReader) {
        return geoipReader;
    }

    try {
        const maxmind = await import('maxmind');
        const dbPath = process.env.GEOIP_DB_PATH || '/var/geoip/GeoLite2-Country.mmdb';
        geoipReader = await maxmind.open(dbPath);
        return geoipReader;
    } catch (error) {
        console.error('[GeoIP] Failed to initialize:', error.message);
        return null;
    }
}

export async function getCountryFromIP(ip) {
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return null;
    }

    try {
        const reader = await initGeoIP();
        if (!reader) {
            return null;
        }

        const result = reader.get(ip);
        return result?.country?.iso_code || null;
    } catch (error) {
        console.warn('[GeoIP] Lookup failed for IP:', ip, error.message);
        return null;
    }
}
