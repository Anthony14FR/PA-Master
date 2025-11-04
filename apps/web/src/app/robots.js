import { headers } from 'next/headers';
import { SPACES_PROTECTIONS } from '@kennelo/config/access-control.config';

/**
 * Dynamic robots.txt generation - Domain-aware
 * Automatically adapts to the requesting domain
 */
export default async function robots() {
    const headersList = await headers();
    const host = headersList.get('host') || 'kennelo.com';

    const currentDomain = host.split(':')[0].replace(/^www\./, '');
    //const locale = getLocaleFromDomain(currentDomain);

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [...Object.keys(SPACES_PROTECTIONS).map(s => `/${s}/`), '/api/', '/_next/', '/s/'],
        },
        sitemap: `https://${currentDomain}/sitemap.xml`,
        host: `https://${currentDomain}`,
    };
}