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
        const userCountry = await getCountryFromIP(ip);
        const targetDomain = shouldRedirectFromCom(hostname, userCountry);

        if (targetDomain) {
            const redirectUrl = new URL(pathname + request.nextUrl.search, `https://${targetDomain}`);

            const response = NextResponse.redirect(redirectUrl, { status: 302 });
            const existingLocale = request.cookies.get('NEXT_LOCALE')?.value;
            if (existingLocale) {
                response.cookies.set('NEXT_LOCALE', existingLocale, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30,
                    sameSite: 'lax'
                });
            }

            return response;
        }
    }

    const response = NextResponse.next();
    const existingLocale = request.cookies.get('NEXT_LOCALE')?.value;

    if (!existingLocale) {
        const locale = getLocaleFromDomain(hostname);
        response.cookies.set('NEXT_LOCALE', locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'lax'
        });
        response.headers.set('x-next-locale', locale);
    } else {
        response.headers.set('x-next-locale', existingLocale);
    }

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