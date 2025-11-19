export const locales = ["fr", "en", "it", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const domainLocaleMap: Record<string, Locale> = {
    "kennelo.fr": "fr",
    "kennelo.be": "fr",
    "kennelo.com": "en",
    "kennelo.it": "it",
    "kennelo.de": "de",
};
