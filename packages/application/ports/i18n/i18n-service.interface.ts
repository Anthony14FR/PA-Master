import type { Locale } from "@kennelo/domain/values/locale.value";

export interface TranslationMessages {
  [key: string]: string | TranslationMessages;
}

export interface I18nService {
  getCurrentLocale(): Locale;
  setLocale(locale: Locale): Promise<void>;
  t(key: string, namespace?: string): string;
  isReady(): boolean;
  loadTranslations(locale: Locale): Promise<void>;
}
