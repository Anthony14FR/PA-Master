/**
 * Sitemap Configuration
 * Priority: 1.0 (highest) - 0.0 (lowest)
 * ChangeFrequency: always, hourly, daily, weekly, monthly, yearly, never
 */
export const SITEMAP_ROUTES = [
    {
        path: '',
        priority: 1.0,
        changeFrequency: 'weekly',
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
