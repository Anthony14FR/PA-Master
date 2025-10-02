import { getDomainForLocale, getLocaleFromDomain } from '@/lib/i18n';

export default function robots() {
    const hostname = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://kennelo.com';

    const domain = hostname.replace('https://', '').replace('http://', '');
    const locale = getLocaleFromDomain(domain);
    const currentDomain = getDomainForLocale(locale);

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/_next/'],
        },
        sitemap: `https://${currentDomain}/sitemap.xml`,
        host: `https://${currentDomain}`,
    };
}