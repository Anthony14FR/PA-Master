import { useCallback } from "react";
import { useI18nService } from "./use-services";
import { useI18nContext } from "../contexts/i18n.context";

export interface UseTranslationResult {
    t: (key: string) => string;
    locale: string;
    isReady: boolean;
    changeLocale: (locale: string) => Promise<void>;
}

export function useTranslation(namespace?: string): UseTranslationResult {
    const i18nService = useI18nService();
    const { locale, isReady, changeLocale } = useI18nContext();

    const t = useCallback(
        (key: string): string => {
            return i18nService.t(key, namespace);
        },
        [i18nService, namespace, locale]
    );

    return { t, locale, isReady, changeLocale };
}
