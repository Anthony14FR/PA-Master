import type { I18nService, TranslationMessages } from "@kennelo/application/ports/i18n/i18n-service.interface";
import type { LocaleDetector } from "@kennelo/application/ports/i18n/locale-detector.interface";
import type { StorageService } from "@kennelo/application/ports/services/storage-service.interface";
import { Locale } from "@kennelo/domain/values/locale.value";

export class SimpleI18nService implements I18nService {
  private currentLocale: Locale;
  private translations = new Map<string, TranslationMessages>();
  private ready = false;
  
  constructor(
    private detectors: LocaleDetector[],
    private storage: StorageService,
    private loader: (locale: string) => Promise<TranslationMessages>,
    defaultLocale: Locale = Locale.default()
  ) {
    this.currentLocale = defaultLocale;
    this.detectors.sort((a, b) => a.priority - b.priority);
  }
  
  async initialize(): Promise<void> {
    const detectedLocale = await this.detectLocale();
    
    if (detectedLocale) {
      const locale = Locale.create(detectedLocale);
      if (!(locale instanceof Error)) {
        this.currentLocale = locale;
      }
    }
    
    await this.loadTranslations(this.currentLocale);
    this.ready = true;
  }
  
  private async detectLocale(): Promise<string | null> {
    for (const detector of this.detectors) {
      try {
        const detected = await detector.detect();
        if (detected) return detected;
      } catch (error) {
        console.warn(`Locale detector failed:`, detector.constructor.name, error);
      }
    }
    return null;
  }
  
  getCurrentLocale(): Locale {
    return this.currentLocale;
  }
  
  async setLocale(locale: Locale): Promise<void> {
    if (this.currentLocale.equals(locale)) return;
    
    await this.loadTranslations(locale);
    this.currentLocale = locale;
    
    await this.storage.set("locale", locale.code);
  }
  
  async loadTranslations(locale: Locale): Promise<void> {
    if (this.translations.has(locale.code)) return;
    
    try {
      const messages = await this.loader(locale.code);
      this.translations.set(locale.code, messages);
    } catch (error) {
      console.error(`Failed to load translations for ${locale.code}:`, error);
      throw error;
    }
  }
  
  t(key: string, namespace?: string): string {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const messages = this.translations.get(this.currentLocale.code);
    
    if (!messages) return fullKey;
    
    return this.getNestedValue(messages, fullKey) || fullKey;
  }
  
  private getNestedValue(obj: TranslationMessages, path: string): string | null {
    const keys = path.split(".");
    let current: any = obj;
    
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return null;
      }
    }
    
    return typeof current === "string" ? current : null;
  }
  
  isReady(): boolean {
    return this.ready;
  }
}
