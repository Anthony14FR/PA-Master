import { NextResponse } from 'next/server';
import {
    getTargetDomainFromCountry,
    getCountryFromIP,
    getLocaleFromCountry,
    isValidLocale
} from './lib/i18n';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host');
    const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    const token = request.cookies.get('auth_token');

    if (pathname.match(/^\/(auth)/) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (pathname.match(/^\/(dashboard)/) && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const userCountry = await getCountryFromIP(ip);
    const countryLocale = getLocaleFromCountry(userCountry);

    if (hostname?.includes('kennelo.com')) {
        const targetDomain = getTargetDomainFromCountry(hostname, userCountry);

        if (targetDomain) {
            const redirectUrl = new URL(pathname + request.nextUrl.search, `https://${targetDomain}`);
            const response = NextResponse.redirect(redirectUrl, { status: 302 });

            response.cookies.set('NEXT_LOCALE', countryLocale, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 jours
                sameSite: 'lax'
            });

            const localePreference = request.cookies.get('locale_preference')?.value;
            if (localePreference && isValidLocale(localePreference)) {
                response.cookies.set('locale_preference', localePreference, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365, // 365 jours
                    sameSite: 'lax'
                });
            }

            response.headers.set('x-next-locale', countryLocale);
            return response;
        }
    }

    const response = NextResponse.next();

    response.cookies.set('NEXT_LOCALE', countryLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 jours
        sameSite: 'lax'
    });
    
    response.headers.set('x-next-locale', countryLocale);
    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    ]
}
