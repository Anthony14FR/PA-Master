import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useI18nService } from "../hooks/use-services";
import { Locale } from "../../../domain/values/locale.value";

interface I18nContextValue {
  locale: Locale;
  isReady: boolean;
  setLocale: (locale: Locale) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const i18nService = useI18nService();
  const [locale, setLocaleState] = useState(i18nService.getCurrentLocale());
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    i18nService.initialize().then(() => {
      setLocaleState(i18nService.getCurrentLocale());
      setIsReady(true);
    });
  }, [i18nService]);
  
  const setLocale = async (newLocale: Locale) => {
    await i18nService.setLocale(newLocale);
    setLocaleState(newLocale);
  };
  
  return (
    <I18nContext.Provider value={{ locale, isReady, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18nContext() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18nContext must be used within I18nProvider");
  return ctx;
}
