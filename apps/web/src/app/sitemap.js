import { headers } from 'next/headers';
import { getLocaleFromDomain, getHreflangUrls, getHreflangCode } from '@kennelo/lib/i18n';
import { SITEMAP_ROUTES } from '@kennelo/config/sitemap.config';

/**
 * Dynamic sitemap generation - Domain-aware
 * Automatically adapts URLs based on the requesting domain
 * Each domain (kennelo.fr, kennelo.com, etc.) gets its own sitemap with correct URLs
 */
export default async function sitemap() {
    const headersList = await headers();
    const host = headersList.get('host') || 'kennelo.com';

    const currentDomain = host.split(':')[0].replace(/^www\./, '');
    const locale = getLocaleFromDomain(currentDomain);

    return SITEMAP_ROUTES.map(route => {
        const hreflangUrls = getHreflangUrls(route.path || '/');

        return {
            url: `https://${currentDomain}${route.path}`,
            lastModified: new Date(),
            changeFrequency: route.changeFrequency,
            priority: route.priority,
            alternates: {
                languages: Object.entries(hreflangUrls).reduce((acc, [key, url]) => {
                    if (key === 'x-default') {
                        acc['x-default'] = url;
                    } else {
                        acc[getHreflangCode(key)] = url;
                    }
                    return acc;
                }, {}),
            },
        };
    });
}