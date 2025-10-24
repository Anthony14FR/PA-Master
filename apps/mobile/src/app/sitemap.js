import { getHreflangUrls, getHreflangCode } from '@kennelo/lib/i18n';
import { SITEMAP_ROUTES } from '@kennelo/config/sitemap.config';

/**
 * Static sitemap generation for mobile app
 * Force static export for Capacitor compatibility
 */
export const dynamic = 'force-static';

export default function sitemap() {
    const currentDomain = 'kennelo.com'; // Default domain for mobile app

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