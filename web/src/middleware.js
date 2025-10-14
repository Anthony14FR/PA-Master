import { NextResponse } from 'next/server';
import { getLocaleFromCountry } from './lib/i18n';
import { getCountryFromIP } from './lib/geoip';
import i18nConfig from './config/i18n.config.json';
import { setAccessToken, deleteAuthTokens } from '@/shared/utils/cookies.server';
import { accessControlService } from '@/shared/services/access-control.service';
import { authenticationService } from '@/shared/services/authentication.service';
import { redirectService } from '@/shared/services/redirect.service';
import { domainService } from '@/shared/services/domain.service';
import { cookieUtils } from './shared/utils/cookies';
import { PAGES } from '@/config/access-control.config';

/**
 * Next.js Middleware - Handles authentication, authorization, and routing
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const currentHost = request.headers.get('host')?.split(':')[0];

  // Handle session token from URL (cross-domain authentication)
  const sessionTokenResponse = redirectService.handleSessionTokenFromUrl(request);
  if (sessionTokenResponse) {
    return sessionTokenResponse;
  }

  // Extract subdomain and normalize pathname
  const subdomain = domainService.extractSubdomain(request);
  const normalizedPathname = subdomain && !pathname.startsWith('/s/')
    ? `/s/${subdomain}${pathname}`
    : pathname;

  // Authenticate request and refresh token if needed
  const { accessToken, userRoles, tokenRefreshed } = await authenticationService.authenticateRequest(request);
  const isAuthenticated = authenticationService.isAuthenticated(accessToken);

  // Handle auth routes - redirect authenticated users
  if (accessControlService.isAuthRoute(normalizedPathname) && isAuthenticated) {
    return redirectService.handleAuthRedirect(
      request,
      currentHost,
      accessToken,
      userRoles,
      (roles) => accessControlService.getUserHomePage(roles)
    );
  }

  // Handle protected routes - require authentication
  if (accessControlService.isProtectedRoute(normalizedPathname, subdomain)) {
    if (!isAuthenticated) {
      const loginUrl = redirectService.buildLoginRedirect(request, pathname, subdomain);
      return NextResponse.redirect(loginUrl, { status: 307 });
    }

    // Check role-based access
    const { allowed } = accessControlService.checkRouteAccess(normalizedPathname, userRoles, subdomain);
    if (!allowed) {
      return NextResponse.rewrite(new URL(PAGES.NOT_FOUND, request.url));
    }
  }

  // Handle subdomain redirect (/s/subdomain → subdomain.domain.tld)
  const subdomainRedirect = redirectService.handleSubdomainRedirect(request, pathname);
  if (subdomainRedirect) {
    return subdomainRedirect;
  }

  // Handle geo-location based redirect
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

  // Set locale cookies for default domain
  let response = NextResponse.next();

  if (domainService.isDefaultDomain(currentHost)) {
    const localePreference = request.cookies.get('locale_preference')?.value;
    const autoDetectedLocale = request.cookies.get('auto_detected_locale')?.value;

    if (!localePreference && country) {
      const detectedLocale = getLocaleFromCountry(country);

      if (autoDetectedLocale !== detectedLocale) {
        cookieUtils.setCookie(response, 'auto_detected_locale', detectedLocale, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
          sameSite: 'lax'
        });
      }
    }
  }

  // Update access token if refreshed
  if (tokenRefreshed && accessToken) {
    const host = request.headers.get('host');
    setAccessToken(response, accessToken, host);
  }

  // Clear auth tokens if no valid token
  if (!accessToken && request.cookies.get('access_token')) {
    const host = request.headers.get('host');
    deleteAuthTokens(response, host);
  }

  // Handle subdomain rewrite (subdomain.domain.tld → /s/subdomain)
  const subdomainRewrite = redirectService.handleSubdomainRewrite(request, subdomain, pathname);
  if (subdomainRewrite) {
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
