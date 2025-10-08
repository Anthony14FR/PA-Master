import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['maxmind', 'mmdb-lib'],

    experimental: {
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },

    webpack: (config, { isServer }) => {
        if (!isServer) {
            const TranslationManifestPlugin = require('./plugins/TranslationManifestPlugin');

            config.plugins.push(
                new TranslationManifestPlugin({
                    messagesPath: path.join(__dirname, 'messages')
                })
            );
        }

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
