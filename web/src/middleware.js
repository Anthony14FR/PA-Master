import { NextResponse } from 'next/server';
import { getTargetDomainFromCountry, buildRedirectHost, getLocaleFromCountry } from './lib/i18n';
import { getCountryFromIP } from './lib/geoip';
import i18nConfig from './config/i18n.config.json';
import { getAccessToken, setAccessToken, deleteAuthTokens } from '@/shared/utils/cookies.server';
import { extractRoles, isTokenExpired } from '@/shared/utils/jwt.server';
import { accessControlService } from '@/shared/services/access-control.service';
import { tokenRefreshService } from '@/shared/services/token-refresh.service';
import { cookieUtils } from './shared/utils/cookies';

const NOT_FOUND_PAGE = '/not-found';
const LOGIN_PAGE = '/auth/login';

function getBaseDomain(host) {
  if (!host) return null;
  const parts = host.split('.');
  return parts.length >= 2 ? parts.slice(-2).join('.') : host;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const currentHost = request.headers.get('host')?.split(':')[0];

  let accessToken = getAccessToken(request);
  let userRoles = [];
  let tokenRefreshed = false;

  if (accessToken) {
    try {
      if (isTokenExpired(accessToken)) {
        const newToken = await tokenRefreshService.attemptTokenRefresh(request);
        if (newToken) {
          accessToken = newToken;
          tokenRefreshed = true;
        } else {
          accessToken = null;
        }
      }

      if (accessToken) {
        userRoles = await extractRoles(accessToken);
      }
    } catch (error) {
      accessToken = null;
    }
  }

  const hasAccessTo = (route) => {
    return accessControlService.checkRouteAccess(route, userRoles).allowed;
  };

  const isAuthenticated = !!accessToken;

  if (accessControlService.isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL(accessControlService.getUserHomePage(userRoles), request.url));
  }

  if (accessControlService.isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(LOGIN_PAGE, request.url));
    }

    if (!hasAccessTo(pathname)) {
      return NextResponse.redirect(new URL(NOT_FOUND_PAGE, request.url));
    }
  }

  let response = NextResponse.next();

  if (tokenRefreshed && accessToken) {
    setAccessToken(response, accessToken);
  }

  if (!accessToken && request.cookies.get('access_token')) {
    deleteAuthTokens(response);
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             request.ip;

  const country = await getCountryFromIP(ip);
  const targetDomain = getTargetDomainFromCountry(currentHost, country);

  if (targetDomain) {
    const newHost = buildRedirectHost(currentHost, targetDomain);
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = newHost;
    redirectUrl.port = '';

    if (tokenRefreshed && accessToken) {
      const redirectResponse = NextResponse.redirect(redirectUrl, { status: 307 });
      setAccessToken(redirectResponse, accessToken);
      return redirectResponse;
    }

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

      if (autoDetectedLocale !== detectedLocale) {
        cookieUtils.setCookie(response, 'auto_detected_locale', detectedLocale, {
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
          sameSite: 'lax'
        });
      }
    }
  }

  return response;
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ]
}
