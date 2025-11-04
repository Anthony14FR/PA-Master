'use client';

import { createContext, useContext, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { getMessages, getMessagesSync, getLocaleFromDomain, DEFAULT_LOCALE } from '@kennelo/lib/i18n';
import { getStorageInstance } from '@kennelo/lib/storage-provider';

const TranslationContext = createContext(null);

async function getCookieLocale() {
    if (typeof document === 'undefined') return null;

    const storage = getStorageInstance();
    const cookieLocale = await storage.get('locale_preference');

    if (cookieLocale) {
        return cookieLocale;
    }

    const autoDetectedLocale = await storage.get('auto_detected_locale');

    return autoDetectedLocale || null;
}

export function TranslationProvider({ children, initialMessages = null, initialLocale: ssrLocale = null }) {
    const detectLocale = useCallback(async () => {
        if (typeof window !== 'undefined') {
            const cookieLocale = await getCookieLocale();
            if (cookieLocale) {
                return cookieLocale;
            }

            const hostname = window.location.hostname;
            return getLocaleFromDomain(hostname);
        }
        return DEFAULT_LOCALE;
    }, []);

    const initialLocale = ssrLocale || DEFAULT_LOCALE;

    const [allMessages, setAllMessages] = useState(() => {
        if (initialMessages && Object.keys(initialMessages).length > 0) {
            return initialMessages;
        }
        return getMessagesSync(initialLocale);
    });
    const [locale, setLocale] = useState(initialLocale);
    const [loading, setLoading] = useState(() => {
        if (initialMessages && Object.keys(initialMessages).length > 0) {
            return false;
        }
        return Object.keys(getMessagesSync(initialLocale)).length === 0;
    });

    useLayoutEffect(() => {
        let cancelled = false;

        const loadLocale = async () => {
            const currentLocale = await detectLocale();
            if (cancelled) return;

            setLocale(currentLocale);

            const cachedMessages = getMessagesSync(currentLocale);
            if (Object.keys(cachedMessages).length > 0) {
                setAllMessages(cachedMessages);
                setLoading(false);
                return;
            }

            try {
                const messages = await getMessages(currentLocale);
                if (!cancelled) {
                    setAllMessages(messages);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to load translations:', error);
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadLocale();

        return () => {
            cancelled = true;
        };
    }, [detectLocale]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentLocale = await detectLocale();
            if (currentLocale !== locale) {
                setLocale(currentLocale);
                setLoading(true);

                getMessages(currentLocale).then(messages => {
                    setAllMessages(messages);
                    setLoading(false);
                });
            }
        }, 100);

        return () => clearInterval(interval);
    }, [locale, detectLocale]);

    const value = {
        allMessages,
        locale,
        loading
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslationContext() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }
    return context;
}
