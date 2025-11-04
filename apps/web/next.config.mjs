import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['maxmind', 'mmdb-lib'],

    turbopack: {
        root: path.resolve(__dirname, '../..'),
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },

    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@kennelo/config': path.resolve(__dirname, '../../packages/config'),
            '@kennelo/features': path.resolve(__dirname, '../../packages/features'),
            '@kennelo/locales': path.resolve(__dirname, '../../packages/locales'),
            '@kennelo/ui': path.resolve(__dirname, '../../packages/shared/components/ui'),
            '@kennelo/components': path.resolve(__dirname, '../../packages/shared/components'),
            '@kennelo/contexts': path.resolve(__dirname, '../../packages/shared/contexts'),
            '@kennelo/hooks': path.resolve(__dirname, '../../packages/shared/hooks'),
            '@kennelo/lib': path.resolve(__dirname, '../../packages/shared/lib'),
            '@kennelo/services': path.resolve(__dirname, '../../packages/shared/services'),
            '@kennelo/utils': path.resolve(__dirname, '../../packages/shared/utils'),
            '@kennelo/plugins': path.resolve(__dirname, '../../packages/plugins'),
        };
        return config;
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                ],
            },
        ];
    },

    async redirects() {
        return [
            {
                source: '/www.:path*',
                destination: '/:path*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
