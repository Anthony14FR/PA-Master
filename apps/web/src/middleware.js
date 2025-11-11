import { NextResponse } from 'next/server';
import { getLocaleFromCountry } from '@kennelo/i18n/lib/i18n';
import { getCountryFromIP } from '@/lib/geoip';
import { setAccessToken, deleteAuthTokens, getCookie, setCookie } from '@kennelo/core/storage/utils/cookies.server';
import { accessControlService } from '@kennelo/core/auth/services/access-control.service';
import { authenticationService } from '@kennelo/core/auth/services/authentication.service';
import { redirectService } from '@kennelo/core/api/services/redirect.service';
import { domainService } from '@kennelo/core/api/services/domain.service';
import { PAGES } from '@kennelo/core/auth/configs/access-control.config';
import i18nConfig from '@kennelo/i18n/configs/i18n.config.json';

/**
 * Next.js Middleware - Handles authentication, authorization, and routing
 */
export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const currentHost = request.headers.get('host')?.split(':')[0];

    const sessionTokenResponse = redirectService.handleSessionTokenFromUrl(request);
    if (sessionTokenResponse) {
        return sessionTokenResponse;
    }

    const subdomain = domainService.extractSubdomain(request);
    const normalizedPathname = subdomain && !pathname.startsWith('/s/')
        ? `/s/${subdomain}${pathname}`
        : pathname;

    const { accessToken, userRoles, tokenRefreshed } = await authenticationService.authenticateRequest(request);
    const isAuthenticated = authenticationService.isAuthenticated(accessToken);

    if (accessControlService.isAuthRoute(normalizedPathname) && isAuthenticated) {
        return redirectService.handleAuthRedirect(
            request,
            currentHost,
            accessToken,
            userRoles,
            (roles) => accessControlService.getUserHomePage(roles)
        );
    }

    if (accessControlService.isProtectedRoute(normalizedPathname, subdomain)) {
        if (!isAuthenticated) {
            const loginUrl = redirectService.buildLoginRedirect(request, pathname, subdomain);
            return NextResponse.redirect(loginUrl, { status: 307 });
        }

        const { allowed } = accessControlService.checkRouteAccess(normalizedPathname, userRoles, subdomain);
        if (!allowed) {
            return NextResponse.rewrite(new URL(PAGES.NOT_FOUND, request.url));
        }
    }

    const subdomainRedirect = redirectService.handleSubdomainRedirect(request, pathname);
    if (subdomainRedirect) {
        return subdomainRedirect;
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.ip;
    const country = await getCountryFromIP(ip);

    const geoRedirect = redirectService.handleGeoRedirect(
        request,
        currentHost,
        country,
        subdomain,
        accessToken,
        tokenRefreshed
    );
    if (geoRedirect) {
        return geoRedirect;
    }

    const response = NextResponse.next();
    const host = request.headers.get('host');

    const urlLocale = request.nextUrl.searchParams.get('locale');

    if (urlLocale) {
        const validLocales = i18nConfig.locales.map(locale => locale.code);
        if (validLocales.includes(urlLocale)) {
            setCookie(response, 'locale_preference', urlLocale, {
                maxAge: 60 * 60 * 24 * 365,
                path: '/',
                sameSite: 'lax'
            }, host);
        }
    }

    //if (domainService.isDefaultDomain(currentHost)) {
    const localePreference = getCookie(request, 'locale_preference');
    const autoDetectedLocale = getCookie(request, 'auto_detected_locale');

    if (!localePreference && country) {
        const detectedLocale = getLocaleFromCountry(country);

        if (autoDetectedLocale !== detectedLocale) {
            setCookie(response, 'auto_detected_locale', detectedLocale, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
                sameSite: 'lax'
            }, host);
        }
    }
    //}

    if (tokenRefreshed && accessToken) {
        setAccessToken(response, accessToken, host);
    }

    if (!accessToken && getCookie(request, 'access_token')) {
        deleteAuthTokens(response, host);
    }

    const subdomainRewrite = redirectService.handleSubdomainRewrite(request, subdomain, pathname);
    if (subdomainRewrite) {
        if (urlLocale) {
            const validLocales = i18nConfig.locales.map(locale => locale.code);
            if (validLocales.includes(urlLocale)) {
                setCookie(subdomainRewrite, 'locale_preference', urlLocale, {
                    maxAge: 60 * 60 * 24 * 365,
                    path: '/',
                    sameSite: 'lax'
                }, host);
            }
        }

        if (tokenRefreshed && accessToken) {
            setAccessToken(subdomainRewrite, accessToken, host);
        }

        return subdomainRewrite;
    }

    return response;
}

export const config = {
    runtime: 'nodejs',
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    ]
};
