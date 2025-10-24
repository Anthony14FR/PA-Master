/**
 * Sitemap Configuration
 * Define all public routes to be included in sitemap.xml
 * Routes are automatically generated for all configured domains
 */

/**
 * Public routes available in sitemap
 * Priority: 1.0 (highest) - 0.0 (lowest)
 * ChangeFrequency: always, hourly, daily, weekly, monthly, yearly, never
 */
export const SITEMAP_ROUTES = [
    {
        path: '',
        priority: 1.0,
        changeFrequency: 'daily',
    },
    {
        path: '/about',
        priority: 0.8,
        changeFrequency: 'weekly',
    },
    {
        path: '/contact',
        priority: 0.8,
        changeFrequency: 'monthly',
    },
    {
        path: '/services',
        priority: 0.9,
        changeFrequency: 'weekly',
    },
    {
        path: '/pricing',
        priority: 0.9,
        changeFrequency: 'monthly',
    },
    {
        path: '/blog',
        priority: 0.7,
        changeFrequency: 'weekly',
    },
    {
        path: '/faq',
        priority: 0.6,
        changeFrequency: 'monthly',
    },
];

/**
 * Excluded paths from sitemap
 * These routes will never appear in sitemap.xml
 */
export const SITEMAP_EXCLUDED_PATHS = [
    '/api/*',
    '/admin/*',
    '/dashboard/*',
    '/s/*',
    '/_next/*',
    '/login',
    '/register',
    '/reset-password',
    '/verify-email',
];
