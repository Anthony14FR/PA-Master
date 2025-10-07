import { NextResponse } from 'next/server';
import {
    getLocaleFromDomain,
    getTargetDomainFromCountry,
    getCountryFromIP,
    getLocaleFromCountry,
    isValidLocale,
    DEFAULT_LOCALE
} from './lib/i18n';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

/**
 * Détermine la locale à utiliser selon la priorité :
 * 1. Cookie NEXT_LOCALE (préférence utilisateur explicite)
 * 2. Géolocalisation IP (pays de l'utilisateur)
 * 3. Domaine actuel (locale par défaut du domaine)
 * 4. Locale par défaut (en)
 */
function determineLocale(request, hostname, userCountry) {
    // Priorité 1 : Cookie existant (préférence utilisateur)
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && isValidLocale(cookieLocale)) {
        return cookieLocale;
    }

    // Priorité 2 : Géolocalisation IP
    const localeFromIP = getLocaleFromCountry(userCountry);
    if (isValidLocale(localeFromIP)) {
        return localeFromIP;
    }

    // Priorité 3 : Domaine actuel
    const localeFromDomain = getLocaleFromDomain(hostname);
    if (localeFromDomain !== DEFAULT_LOCALE) {
        return localeFromDomain;
    }

    // Priorité 4 : Fallback
    return DEFAULT_LOCALE;
}

/**
 * Configure les cookies et headers de locale pour la réponse
 */
function setLocaleOnResponse(response, locale) {
    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax'
    });
    response.headers.set('x-next-locale', locale);
}

/**
 * Gère les redirections d'authentification
 */
function handleAuthRedirects(request, pathname) {
    const token = request.cookies.get('auth_token');

    // Rediriger vers dashboard si authentifié et sur page auth
    if (pathname.match(/^\/(auth)/) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Rediriger vers login si non authentifié et sur page protégée
    if (pathname.match(/^\/(dashboard)/) && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return null;
}

/**
 * Middleware principal pour gérer la localisation et l'authentification
 */
export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host');
    const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    // Détecter le pays de l'utilisateur via IP
    const userCountry = await getCountryFromIP(ip);

    // === Gestion spécifique pour kennelo.com (domaine principal) ===
    if (hostname?.includes('kennelo.com')) {
        // Déterminer le domaine cible selon le pays (redirection géographique)
        const targetDomain = getTargetDomainFromCountry(hostname, userCountry);

        // Si redirection géographique nécessaire (ex: FR vers kennelo.fr)
        if (targetDomain) {
            const redirectUrl = new URL(pathname + request.nextUrl.search, `https://${targetDomain}`);
            const response = NextResponse.redirect(redirectUrl, { status: 302 });

            // Conserver la locale préférée de l'utilisateur (cookie)
            const preferredLocale = determineLocale(request, targetDomain, userCountry);
            setLocaleOnResponse(response, preferredLocale);

            return response;
        }

        // Pas de redirection géographique : rester sur kennelo.com
        const response = NextResponse.next();
        const locale = determineLocale(request, hostname, userCountry);
        setLocaleOnResponse(response, locale);

        // Gérer les redirections d'authentification
        const authRedirect = handleAuthRedirects(request, pathname);
        if (authRedirect) return authRedirect;

        return response;
    }

    // === Gestion pour les autres domaines (kennelo.fr, kennelo.it, etc.) ===
    const response = NextResponse.next();
    const locale = determineLocale(request, hostname, userCountry);
    setLocaleOnResponse(response, locale);

    // Gérer les redirections d'authentification
    const authRedirect = handleAuthRedirects(request, pathname);
    if (authRedirect) return authRedirect;

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    ]
}
