import { PROTECTED_SUBDOMAINS } from '@kennelo/config/access-control.config';

/**
 * Static robots.txt generation for mobile app
 * Force static export for Capacitor compatibility
 */
export const dynamic = 'force-static';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [...PROTECTED_SUBDOMAINS.map(s => `/${s}/`), '/api/', '/_next/', '/s/'],
        },
    };
}