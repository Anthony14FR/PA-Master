import i18nConfig from '@/config/i18n.config.json';

function parseI18nConfig() {
    const domainLocales = {};
    const localeDomains = {};
    const countryDomains = {};
    const countryLocales = {};
    const localesCodes = {};
    const availableLocales = [];
    const googleVerifications = {};

    i18nConfig.locales.forEach(localeConfig => {
        const { code, hreflang, domains = [] } = localeConfig;

        availableLocales.push(code);
        localesCodes[code] = hreflang;

        if (domains.length === 0) {
            console.warn(`[i18n] Locale "${code}" has no domains configured. It will be available on the default domain.`);
            return;
        }

        domains.forEach(({ domain, countries = [], googleSiteVerification }) => {
            domainLocales[domain] = code;

            if (!localeDomains[code]) {
                localeDomains[code] = domain;
            }

            if (googleSiteVerification) {
                googleVerifications[domain] = googleSiteVerification;
            }

            countries.forEach(country => {
                countryDomains[country] = domain;
                countryLocales[country] = code;
            });
        });
    });

    return {
        domainLocales,
        localeDomains,
        countryDomains,
        countryLocales,
        localesCodes,
        availableLocales,
        googleVerifications,
        defaultLocale: i18nConfig.defaultLocale
    };
}

const {
    domainLocales: DOMAIN_LOCALES,
    localeDomains: LOCALE_DOMAINS,
    countryDomains: COUNTRY_DOMAINS,
    countryLocales: COUNTRY_LOCALES,
    localesCodes: LOCALES_CODES,
    availableLocales: AVAILABLE_LOCALES,
    googleVerifications: GOOGLE_VERIFICATIONS,
    defaultLocale: DEFAULT_LOCALE
} = parseI18nConfig();


export function getLocaleFromDomain(hostname) {
    if (!hostname) return DEFAULT_LOCALE;

    const domain = hostname.replace('www.', '').toLowerCase();
    return DOMAIN_LOCALES[domain] || DEFAULT_LOCALE;
}

export function getDomainForLocale(locale) {
    return LOCALE_DOMAINS[locale] || LOCALE_DOMAINS[DEFAULT_LOCALE];
}

export function getLocaleFromCountry(countryCode) {
    return COUNTRY_LOCALES[countryCode?.toUpperCase()] || DEFAULT_LOCALE;
}

export function isValidLocale(locale) {
    return AVAILABLE_LOCALES.includes(locale);
}

export function getDomainFromCountry(countryCode) {
    return COUNTRY_DOMAINS[countryCode?.toUpperCase()] || null;
}

export function getHreflangUrls(pathname = '/') {
    const urls = {};

    for (const locale of AVAILABLE_LOCALES) {
        const domain = getDomainForLocale(locale);
        urls[locale] = `https://${domain}${pathname}`;
    }

    urls['x-default'] = `https://kennelo.com${pathname}`;
    return urls;
}

export function getHreflangCode(locale) {
    return LOCALES_CODES[locale] || LOCALES_CODES[DEFAULT_LOCALE];
}

export async function getCountryFromIP(ip) {
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
        return 'US';
    }

    try {
        const response = await fetch(`https://ipapi.co/${ip}/country/`, {
            headers: { 'User-Agent': 'Kennelo/1.0' },
            next: { revalidate: 3600 }
        });

        if (response.ok) {
            const countryCode = await response.text();
            return countryCode.trim().toUpperCase();
        }
    } catch (error) {
        console.warn('IP geolocation failed:', error.message);
    }

    return 'US';
}

/**
 * Détermine le domaine cible basé sur le pays de l'utilisateur
 * Utilisé pour la redirection géographique depuis kennelo.com
 * @param {string} hostname - Le nom de domaine actuel
 * @param {string} userCountry - Le code pays de l'utilisateur (ISO 3166-1 alpha-2)
 * @returns {string|null} Le domaine cible ou null si pas de redirection nécessaire
 */
export function getTargetDomainFromCountry(hostname, userCountry) {
    if (!hostname?.includes('kennelo.com')) {
        return null;
    }

    const targetDomain = getDomainFromCountry(userCountry);

    // Ne pas rediriger si le domaine cible est kennelo.com (déjà dessus)
    if (targetDomain && targetDomain !== 'kennelo.com') {
        return targetDomain;
    }

    return null;
}

/**
 * Alias pour compatibilité ascendante
 * @deprecated Utiliser getTargetDomainFromCountry à la place
 */
export function shouldRedirectFromCom(hostname, userCountry) {
    return getTargetDomainFromCountry(hostname, userCountry);
}

let messagesCache = new Map();
let translationManifest = null;
let preloadPromise = null;

async function loadTranslationManifest() {
    if (translationManifest) {
        return translationManifest;
    }

    try {
        const manifestModule = await import('./translation-manifest.json');
        translationManifest = manifestModule.default || manifestModule;
        return translationManifest;
    } catch (error) {
        console.warn('Translation manifest not found, falling back to empty manifest');
        translationManifest = {};
        return translationManifest;
    }
}

function buildNestedObject(path, content) {
    const parts = path.replace('.json', '').split('/');
    const result = {};

    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
    }

    const lastKey = parts[parts.length - 1];
    current[lastKey] = content;

    return result;
}

function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            target[key] = target[key] || {};
            mergeDeep(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

async function tryLoadFile(locale, filePath) {
    try {
        const importedModule = await import(`../../messages/${locale}/${filePath}`);
        return importedModule.default || importedModule;
    } catch (error) {
        return null;
    }
}

async function discoverAndLoadFiles(locale) {
    const messages = {};
    const manifest = await loadTranslationManifest();
    const availablePaths = manifest[locale] || [];

    console.debug(`Loading ${availablePaths.length} translation files for locale: ${locale}`);

    for (const filePath of availablePaths) {
        const content = await tryLoadFile(locale, filePath);

        if (content) {
            if (filePath.includes('/')) {
                const nested = buildNestedObject(filePath, content);
                mergeDeep(messages, nested);
            } else {
                const fileName = filePath.replace('.json', '');
                if (fileName === 'common') {
                    mergeDeep(messages, content);
                } else {
                    messages[fileName] = content;
                }
            }
        }
    }

    return messages;
}

export async function getMessages(locale) {
    if (!isValidLocale(locale)) {
        locale = DEFAULT_LOCALE;
    }

    if (messagesCache.has(locale)) {
        return messagesCache.get(locale);
    }

    try {
        const messages = await discoverAndLoadFiles(locale);
        messagesCache.set(locale, messages);
        return messages;
    } catch (error) {
        console.warn(`Failed to load messages for locale ${locale}:`, error);

        if (locale !== DEFAULT_LOCALE) {
            return getMessages(DEFAULT_LOCALE);
        }

        return {};
    }
}

export async function getMessagesForNamespace(locale, namespace, subNamespace = null) {
    const messages = await getMessages(locale);

    if (subNamespace) {
        return messages[namespace]?.[subNamespace] || {};
    }

    return messages[namespace] || {};
}

export function t(messages, key, params = {}) {
    const keys = key.split('.');
    let value = messages;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return key;
        }
    }

    if (typeof value !== 'string') {
        return key;
    }

    return Object.keys(params).reduce((str, param) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    }, value);
}

export function preloadMessages(locale) {
    if (!preloadPromise || messagesCache.has(locale)) {
        preloadPromise = getMessages(locale);
    }
    return preloadPromise;
}

export function getMessagesSync(locale) {
    return messagesCache.get(locale) || {};
}

export function getGoogleSiteVerification(hostname) {
    if (!hostname) return '';
    const domain = hostname.replace('www.', '').toLowerCase();
    return GOOGLE_VERIFICATIONS[domain] || '';
}

export { AVAILABLE_LOCALES, DEFAULT_LOCALE, DOMAIN_LOCALES, LOCALE_DOMAINS, LOCALES_CODES };