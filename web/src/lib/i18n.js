function parseEnvDomainLocales() {
    const envValue = process.env.NEXT_PUBLIC_DOMAIN_LOCALES || 'kennelo.fr:fr,kennelo.com:en,kennelo.it:it,kennelo.be:fr,kennelo.de:de';
    const domainLocales = {};
    const localeDomains = {};

    envValue.split(',').forEach(pair => {
        const [domain, locale] = pair.trim().split(':');
        if (domain && locale) {
            domainLocales[domain] = locale;
            if (!localeDomains[locale]) {
                localeDomains[locale] = domain;
            }
        }
    });

    return { domainLocales, localeDomains };
}

const { domainLocales: DOMAIN_LOCALES, localeDomains: LOCALE_DOMAINS } = parseEnvDomainLocales();

const COUNTRY_LOCALES = {
    'FR': 'fr',
    'GB': 'en',
    'US': 'en',
    'CA': 'en',
    'AU': 'en',
    'IT': 'it',
    'DE': 'de',
    'AT': 'de',
    'CH': 'de',
    'BE': 'fr',
    'LU': 'fr'
};

const AVAILABLE_LOCALES = (process.env.NEXT_PUBLIC_AVAILABLE_LOCALES || 'fr,en,it,de').split(',').map(l => l.trim());
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';

function parseLocalesCodes() {
    const envValue = process.env.NEXT_PUBLIC_LOCALES_CODES || 'fr:fr-FR,en:en-US,it:it-IT,de:de-DE';
    const localesCodes = {};

    envValue.split(',').forEach(pair => {
        const [locale, code] = pair.trim().split(':');
        if (locale && code) {
            localesCodes[locale] = code;
        }
    });

    return localesCodes;
}

const LOCALES_CODES = parseLocalesCodes();

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

export function shouldRedirectFromCom(hostname, userCountry, preferredLocale) {
    if (!hostname?.includes('kennelo.com')) {
        return null;
    }

    if (preferredLocale && isValidLocale(preferredLocale)) {
        const targetDomain = getDomainForLocale(preferredLocale);
        return targetDomain !== 'kennelo.com' ? targetDomain : null;
    }

    const localeFromCountry = getLocaleFromCountry(userCountry);
    const targetDomain = getDomainForLocale(localeFromCountry);

    return targetDomain !== 'kennelo.com' ? targetDomain : null;
}

let messagesCache = new Map();
let translationManifest = null;
let preloadPromise = null; // Pour le préchargement

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
        const module = await import(`../../messages/${locale}/${filePath}`);
        return module.default || module;
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

export { AVAILABLE_LOCALES, DEFAULT_LOCALE, DOMAIN_LOCALES, LOCALE_DOMAINS, LOCALES_CODES };