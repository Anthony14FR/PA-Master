import { NextResponse } from 'next/server';
import {
    getTargetDomainFromCountry,
    getCountryFromIP
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

    if (hostname?.includes('kennelo.com')) {
        const targetDomain = getTargetDomainFromCountry(hostname, userCountry);

        if (targetDomain) {
            const redirectUrl = new URL(pathname + request.nextUrl.search, `https://${targetDomain}`);
            const response = NextResponse.redirect(redirectUrl, { status: 302 });

            const localePreference = request.cookies.get('locale_preference')?.value;
            if (localePreference) {
                response.cookies.set('locale_preference', localePreference, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365, // 365 days
                    sameSite: 'lax'
                });
            }

            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    ]
}
