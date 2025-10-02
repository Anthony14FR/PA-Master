import { NextResponse } from 'next/server';
import {
    getLocaleFromDomain,
    shouldRedirectFromCom,
    getCountryFromIP
} from './lib/i18n';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host');
    const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    if (hostname?.includes('kennelo.com')) {
        const preferredLocale = request.cookies.get('locale_preference')?.value;
        const userCountry = await getCountryFromIP(ip);
        const targetDomain = shouldRedirectFromCom(hostname, userCountry, preferredLocale);

        if (targetDomain) {
            const redirectUrl = new URL(pathname + request.nextUrl.search, `https://${targetDomain}`);
            return NextResponse.redirect(redirectUrl, { status: 302 });
        }
    }

    const locale = getLocaleFromDomain(hostname);
    const response = NextResponse.next();

    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax'
    });

    response.headers.set('x-next-locale', locale);

    if (pathname.match(/^\/(auth)/)) {
        const token = request.cookies.get('auth_token');
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    if (pathname.match(/^\/(dashboard)/)) {
        const token = request.cookies.get('auth_token');
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    ]
}