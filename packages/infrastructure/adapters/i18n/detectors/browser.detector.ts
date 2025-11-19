import type { LocaleDetector } from "@kennelo/application/ports/i18n/locale-detector.interface";

export class BrowserDetector implements LocaleDetector {
    constructor(readonly priority = 40) {}

    async detect(): Promise<string | null> {
        if (typeof navigator === "undefined") return null;

        const lang = navigator.language || (navigator as any).userLanguage;
        return lang?.split("-")[0] || null;
    }
}
