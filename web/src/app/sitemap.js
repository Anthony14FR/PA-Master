import { getLocaleFromDomain, getDomainForLocale, getHreflangUrls, AVAILABLE_LOCALES } from '@/lib/i18n';

export default function sitemap() {
    const hostname = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://kennelo.com';

    const domain = hostname.replace('https://', '').replace('http://', '');
    const locale = getLocaleFromDomain(domain);
    const currentDomain = getDomainForLocale(locale);

    const routes = [
        '',
        '/auth/login',
        '/auth/register',
        '/dashboard',
        '/dashboard/home',
    ];

    return routes.map(route => {
        const hreflangUrls = getHreflangUrls(route || '/');

        return {
            url: `https://${currentDomain}${route}`,
            lastModified: new Date(),
            changeFrequency: route === '' ? 'daily' : 'weekly',
            priority: route === '' ? 1 : 0.8,
            alternates: {
                languages: Object.entries(hreflangUrls).reduce((acc, [key, url]) => {
                    if (key === 'x-default') {
                        acc['x-default'] = url;
                    } else {
                        const hreflangCode = key === 'fr' ? 'fr-FR'
                            : key === 'en' ? 'en-US'
                                : key === 'it' ? 'it-IT'
                                    : key === 'de' ? 'de-DE'
                                        : key;
                        acc[hreflangCode] = url;
                    }
                    return acc;
                }, {}),
            },
        };
    });
}