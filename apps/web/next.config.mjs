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
            '@kennelo/core': path.resolve(__dirname, '../../packages/core/src'),
            '@kennelo/features': path.resolve(__dirname, '../../packages/features/src'),
            '@kennelo/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
            '@kennelo/ui': path.resolve(__dirname, '../../packages/ui/src'),
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
