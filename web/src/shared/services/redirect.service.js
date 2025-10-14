import { NextResponse } from 'next/server';
import { setAccessToken } from '@/shared/utils/cookies.server';
import { domainService } from './domain.service';
import { getTargetDomainFromCountry, buildRedirectHost } from '@/lib/i18n';
import { AUTH_NAMESPACE, PAGES } from '@/config/access-control.config';

const ENABLE_SUBDOMAIN_REDIRECT = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_REDIRECT !== 'false';

/**
 * Redirect Service - Handles all redirect logic
 * Centralized service for authentication, geo-location, and subdomain redirects
 */
class RedirectService {
    /**
     * Handle authentication redirect after successful login
     * @param {NextRequest} request - Next.js request
     * @param {string} currentHost - Current host
     * @param {string} accessToken - Access token to pass
     * @param {string[]} userRoles - User roles
     * @param {Function} getHomePage - Function to get home page by roles
     * @returns {NextResponse} Redirect response
     */
    handleAuthRedirect(request, currentHost, accessToken, userRoles, getHomePage) {
        const returnUrl = request.nextUrl.searchParams.get('returnUrl');

        if (!returnUrl) {
            return NextResponse.redirect(new URL(getHomePage(userRoles), request.url));
        }

        const decodedReturnUrl = decodeURIComponent(returnUrl);

        // Validate return URL
        if (!domainService.isValidReturnUrl(decodedReturnUrl)) {
            return NextResponse.redirect(new URL(getHomePage(userRoles), request.url));
        }

        try {
            const returnUrlObj = new URL(decodedReturnUrl);
            const returnHostname = returnUrlObj.hostname;
            const currentBaseDomain = domainService.getBaseDomain(currentHost);
            const returnBaseDomain = domainService.getBaseDomain(returnHostname);

            // Cross-domain redirect with session token
            if (currentBaseDomain !== returnBaseDomain) {
                returnUrlObj.searchParams.set('session_token', accessToken);
                return NextResponse.redirect(returnUrlObj, { status: 307 });
            }

            // Same domain redirect
            return NextResponse.redirect(new URL(decodedReturnUrl, request.url), { status: 307 });
        } catch {
            return NextResponse.redirect(new URL(getHomePage(userRoles), request.url));
        }
    }

    /**
     * Build login redirect URL for unauthenticated users
     * @param {NextRequest} request - Next.js request
     * @param {string} pathname - Current pathname
     * @param {string|null} subdomain - Current subdomain
     * @returns {URL} Login URL with returnUrl parameter
     */
    buildLoginRedirect(request, pathname, subdomain) {
        const protocol = request.nextUrl.protocol;
        const host = request.headers.get('host') || '';

        const [hostname, port] = host.split(':');
        const cleanHostname = hostname.replace(/^www\./, '');
        const tld = cleanHostname.split('.').pop();

        const cleanHost = port ? `${cleanHostname}:${port}` : cleanHostname;

        let returnUrl = `${protocol}//${host}${pathname}${request.nextUrl.search}`;

        if (ENABLE_SUBDOMAIN_REDIRECT) {
            returnUrl = this._transformReturnUrl(pathname, subdomain, protocol, host, tld, request.nextUrl.search);
        }

        let loginUrl;

        if (ENABLE_SUBDOMAIN_REDIRECT) {
            // Use subdomain routing: account.localhost:3000/login
            const isLocalhost = cleanHostname.includes('localhost') || cleanHostname.includes('127.0.0.1');
            let loginHost;

            if (isLocalhost) {
                // For localhost, extract base domain using regex (localhost has single TLD)
                const localhostMatch = cleanHostname.match(/\.(localhost|127\.0\.0\.1)$/);
                const baseDomain = localhostMatch ? localhostMatch[1] : cleanHostname;
                loginHost = port ? `${baseDomain}:${port}` : baseDomain;
            } else {
                // For production, replace TLD with .com
                loginHost = cleanHostname.replace(`.${tld}`, '.com');
            }

            loginUrl = new URL(`${protocol}//${AUTH_NAMESPACE}.${loginHost}/login`);
        } else {
            // Use path-based routing: localhost:3000/s/account/login
            loginUrl = new URL(`${protocol}//${cleanHost}/s/${AUTH_NAMESPACE}/login`);
        }

        loginUrl.searchParams.set('returnUrl', returnUrl);

        return loginUrl;
    }

    /**
     * Transform return URL based on subdomain routing
     * @private
     * @param {string} pathname - Current pathname
     * @param {string|null} subdomain - Current subdomain
     * @param {string} protocol - Protocol (http/https)
     * @param {string} host - Host
     * @param {string} tld - Top level domain
     * @param {string} search - URL search params
     * @returns {string} Transformed URL
     */
    _transformReturnUrl(pathname, subdomain, protocol, host, tld, search) {
        // Remove www prefix to ensure clean subdomain URLs
        const cleanHost = host.replace(/^www\./, '');

        if (pathname.startsWith('/s/')) {
            const pathParts = pathname.split('/').filter(Boolean);
            const targetSubdomain = pathParts[1];

            if (targetSubdomain) {
                const newPathname = '/' + (pathParts.slice(2).join('/') || '');
                let finalHost = cleanHost;

                if (targetSubdomain === AUTH_NAMESPACE) {
                    finalHost = cleanHost.replace(`.${tld}`, '.com');
                }

                return `${protocol}//${targetSubdomain}.${finalHost}${newPathname}${search}`;
            }
        } else if (subdomain) {
            let finalHost = cleanHost;
            if (subdomain === AUTH_NAMESPACE) {
                finalHost = cleanHost.replace(`.${tld}`, '.com');
            }
            return `${protocol}//${finalHost}${pathname}${search}`;
        }

        return `${protocol}//${host}${pathname}${search}`;
    }

    /**
     * Handle geo-location based redirect
     * @param {NextRequest} request - Next.js request
     * @param {string} currentHost - Current host
     * @param {string} country - Country code
     * @param {string|null} subdomain - Current subdomain
     * @param {string|null} accessToken - Access token (if refreshed)
     * @param {boolean} tokenRefreshed - Whether token was refreshed
     * @returns {NextResponse|null} Redirect response or null
     */
    handleGeoRedirect(request, currentHost, country, subdomain, accessToken, tokenRefreshed) {
        const targetDomain = getTargetDomainFromCountry(currentHost, country);

        if (!targetDomain || subdomain === AUTH_NAMESPACE) {
            return null;
        }

        const newHost = buildRedirectHost(currentHost, targetDomain);
        const redirectUrl = new URL(request.url);
        redirectUrl.hostname = newHost;
        redirectUrl.port = '';

        if (tokenRefreshed && accessToken) {
            const redirectResponse = NextResponse.redirect(redirectUrl, { status: 307 });
            // Pass new host for dynamic cookie domain
            setAccessToken(redirectResponse, accessToken, `${newHost}:${redirectUrl.port || ''}`);
            return redirectResponse;
        }

        return NextResponse.redirect(redirectUrl, { status: 307 });
    }

    /**
     * Handle subdomain redirect (/s/subdomain → subdomain.domain.tld)
     * @param {NextRequest} request - Next.js request
     * @param {string} pathname - Current pathname
     * @returns {NextResponse|null} Redirect response or null
     */
    handleSubdomainRedirect(request, pathname) {
        if (!ENABLE_SUBDOMAIN_REDIRECT || !pathname.startsWith('/s/')) {
            return null;
        }

        const pathParts = pathname.split('/').filter(Boolean);
        const targetSubdomain = pathParts[1];

        if (!targetSubdomain) {
            return NextResponse.redirect(new URL(PAGES.NOT_FOUND, request.url));
        }

        let host = request.headers.get('host') || '';

        // Remove www prefix if present to avoid app.www.domain.tld
        host = host.replace(/^www\./, '');

        const newPathname = '/' + (pathParts.slice(2).join('/') || '');
        const protocol = request.nextUrl.protocol;
        const tld = host.split('.').pop();

        if (targetSubdomain === AUTH_NAMESPACE) {
            host = host.replace(`.${tld}`, '.com');
        }

        return NextResponse.redirect(
            new URL(`${protocol}//${targetSubdomain}.${host}${newPathname}${request.nextUrl.search}`),
            { status: 307 }
        );
    }

    /**
     * Handle subdomain rewrite (subdomain.domain.tld → /s/subdomain)
     * @param {NextRequest} request - Next.js request
     * @param {string} subdomain - Subdomain to rewrite
     * @param {string} pathname - Current pathname
     * @returns {NextResponse|null} Rewrite response or null
     */
    handleSubdomainRewrite(request, subdomain, pathname) {
        if (!subdomain || pathname.startsWith('/s/')) {
            return null;
        }

        return NextResponse.rewrite(
            new URL(`/s/${subdomain}${pathname}${request.nextUrl.search}`, request.url)
        );
    }

    /**
     * Handle session token from URL parameter
     * @param {NextRequest} request - Next.js request
     * @returns {NextResponse|null} Redirect response or null
     */
    handleSessionTokenFromUrl(request) {
        const sessionToken = request.nextUrl.searchParams.get('session_token');

        if (!sessionToken) {
            return null;
        }

        const cleanUrl = new URL(request.url);
        cleanUrl.searchParams.delete('session_token');

        const response = NextResponse.redirect(cleanUrl, { status: 307 });

        // Pass host for dynamic cookie domain
        const host = request.headers.get('host');
        setAccessToken(response, sessionToken, host);

        return response;
    }
}

export const redirectService = new RedirectService();