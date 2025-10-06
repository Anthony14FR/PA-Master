'use client';

import { useCallback, useMemo } from 'react';
import { t } from '@/lib/i18n';
import { useTranslationContext } from '../contexts/translation-context';
import { TranslatedText } from '../components/translated-text';

export function useTranslation(namespace = null, subNamespace = null) {
    const { allMessages, locale, loading } = useTranslationContext();

    const messages = useMemo(() => {
        if (!namespace) {
            return allMessages;
        }

        if (subNamespace) {
            return allMessages[namespace]?.[subNamespace] || {};
        }

        return allMessages[namespace] || {};
    }, [allMessages, namespace, subNamespace]);

    const translate = useCallback((key, params = {}) => {
        return t(messages, key, params);
    }, [messages]);

    const T = useCallback((props) => {
        return <TranslatedText {...props} t={translate} />;
    }, [translate]);

    return {
        t: translate,
        T,
        messages,
        locale,
        loading
    };
}

export function useCommonTranslation() {
    return useTranslation();
}