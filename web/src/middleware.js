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
 * Récupère la préférence de langue de l'utilisateur depuis le cookie locale_preference
 * Ce cookie n'affecte QUE la langue affichée, pas les redirections géographiques
 */
function getUserPreferredLocale(request) {
    const preferredLocale = request.cookies.get('locale_preference')?.value;
    if (preferredLocale && isValidLocale(preferredLocale)) {
        return preferredLocale;
    }
    return null;
}

/**
 * Détermine la locale (langue) à utiliser selon la priorité :
 * 1. Cookie locale_preference (choix explicite de l'utilisateur)
 * 2. Géolocalisation IP (pays de l'utilisateur)
 * 3. Domaine actuel (locale par défaut du domaine)
 * 4. Locale par défaut (en)
 *
 * IMPORTANT: Cette fonction détermine la LANGUE, pas le domaine
 */
function determineLocale(request, hostname, userCountry) {
    // Priorité 1 : Préférence explicite de l'utilisateur (langue choisie)
    const userPreference = getUserPreferredLocale(request);
    if (userPreference) {
        return userPreference;
    }

    // Priorité 2 : Géolocalisation IP (langue du pays)
    const localeFromIP = getLocaleFromCountry(userCountry);
    if (isValidLocale(localeFromIP)) {
        return localeFromIP;
    }

    // Priorité 3 : Domaine actuel (langue par défaut du domaine)
    const localeFromDomain = getLocaleFromDomain(hostname);
    if (localeFromDomain !== DEFAULT_LOCALE) {
        return localeFromDomain;
    }

    // Priorité 4 : Fallback
    return DEFAULT_LOCALE;
}

/**
 * Configure le cookie NEXT_LOCALE (locale/langue actuellement utilisée)
 * Ce cookie reflète la langue affichée sur le site
 */
function setLocaleOnResponse(response, locale) {
    response.cookies.set('locale_preference', locale, {
        path: '/',
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax'
    });
    response.headers.set('x-next-locale', locale);
}

/**
 * Préserve le cookie locale_preference lors d'une redirection
 * Cela permet de conserver le choix de langue de l'utilisateur
 */
function preserveLocalePreference(response, request) {
    const preferredLocale = getUserPreferredLocale(request);
    if (preferredLocale) {
        response.cookies.set('locale_preference', preferredLocale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 an
            sameSite: 'lax'
        });
    }
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
 *
 * LOGIQUE:
 * 1. Redirection géographique TOUJOURS basée sur le pays (IP)
 * 2. Langue affichée basée sur locale_preference OU pays
 *
 * EXEMPLE:
 * - Utilisateur en France avec locale_preference=de
 * - kennelo.com → Redirigé vers kennelo.fr (pays FR)
 * - Sur kennelo.fr → Langue allemande affichée (préférence)
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
        // La redirection géographique se fait TOUJOURS selon le pays, indépendamment de locale_preference
        const targetDomain = getTargetDomainFromCountry(hostname, userCountry);

        // Si redirection géographique nécessaire (ex: FR vers kennelo.fr)
        if (targetDomain) {
            const redirectUrl = new URL(pathname + request.nextUrl.search, `https://${targetDomain}`);
            const response = NextResponse.redirect(redirectUrl, { status: 302 });

            // Préserver le cookie locale_preference lors de la redirection
            preserveLocalePreference(response, request);

            // Déterminer la langue à afficher sur le domaine cible
            // Si locale_preference existe, l'utiliser, sinon utiliser la langue du domaine cible
            const locale = determineLocale(request, targetDomain, userCountry);
            setLocaleOnResponse(response, locale);

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
