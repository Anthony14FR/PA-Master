'use client';

import { useCallback, useEffect, useState } from 'react';
import { getMessages, getMessagesForNamespace, t, getLocaleFromDomain } from '@/lib/i18n';

// Fonction utilitaire pour lire le cookie NEXT_LOCALE
function getCookieLocale() {
    if (typeof document === 'undefined') return null;

    const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];

    return cookieLocale || null;
}

export function useTranslation(namespace = null, subNamespace = null) {
    const [messages, setMessages] = useState({});
    const [loading, setLoading] = useState(true);

    // Fonction pour détecter la locale
    const detectLocale = useCallback(() => {
        if (typeof window !== 'undefined') {
            // Priorité 1: Cookie NEXT_LOCALE (synchronisé avec user.locale)
            const cookieLocale = getCookieLocale();
            if (cookieLocale) {
                return cookieLocale;
            }

            // Priorité 2: domaine
            const hostname = window.location.hostname;
            return getLocaleFromDomain(hostname);
        }
        return 'en';
    }, []);

    // Initialiser avec la détection immédiate
    const [locale, setLocale] = useState(() => detectLocale());

    useEffect(() => {
        const currentLocale = detectLocale();

        // Forcer la mise à jour si le cookie a changé
        if (currentLocale !== locale) {
            setLocale(currentLocale);
        }

        const loadMessages = async () => {
            try {
                let loadedMessages;

                if (namespace) {
                    loadedMessages = await getMessagesForNamespace(currentLocale, namespace, subNamespace);
                } else {
                    loadedMessages = await getMessages(currentLocale);
                }

                setMessages(loadedMessages);
            } catch (error) {
                console.error('Failed to load translations:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, [namespace, subNamespace, detectLocale, locale]);

    const translate = useCallback((key, params = {}) => {
        return t(messages, key, params);
    }, [messages]);

    return {
        t: translate,
        messages,
        locale,
        loading
    };
}

export function useCommonTranslation() {
    return useTranslation();
}