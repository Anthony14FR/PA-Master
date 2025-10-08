import { NextResponse } from 'next/server';
import { getTargetDomainFromCountry, buildRedirectHost, getLocaleFromCountry } from './lib/i18n';
import { getCountryFromIP } from './lib/geoip';
import i18nConfig from './config/i18n.config.json';

function getBaseDomain(host) {
    if (!host) return null;
    const parts = host.split('.');
    return parts.length >= 2 ? parts.slice(-2).join('.') : host;
}

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const currentHost = request.headers.get('host')?.split(':')[0];
    const token = request.cookies.get('auth_token');

    if (pathname.match(/^\/(auth)/) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.match(/^\/(dashboard)/) && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               request.ip;

    console.log('[Middleware] IP:', ip);

    const country = await getCountryFromIP(ip);
    console.log('[Middleware] Country detected:', country);

    const targetDomain = getTargetDomainFromCountry(currentHost, country);

    if (targetDomain) {
        const newHost = buildRedirectHost(currentHost, targetDomain);
        const redirectUrl = new URL(request.url);
        redirectUrl.hostname = newHost;
        redirectUrl.port = '';
        return NextResponse.redirect(redirectUrl, { status: 307 });
    }

    const currentBaseDomain = getBaseDomain(currentHost);
    const defaultBaseDomain = getBaseDomain(i18nConfig.defaultDomaine);
    const isDefaultDomain = currentBaseDomain === defaultBaseDomain;

    if (isDefaultDomain) {
        const localePreference = request.cookies.get('locale_preference')?.value;
        const autoDetectedLocale = request.cookies.get('auto_detected_locale')?.value;

        if (!localePreference && country) {
            const detectedLocale = getLocaleFromCountry(country);
            console.log('[Middleware] Detected locale from country:', detectedLocale);

            if (autoDetectedLocale !== detectedLocale) {
                const response = NextResponse.next();
                response.cookies.set('auto_detected_locale', detectedLocale, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: '/',
                    sameSite: 'lax'
                });
                console.log('[Middleware] Setting auto_detected_locale cookie to:', detectedLocale);
                return response;
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    runtime: 'nodejs',
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    ]
}
