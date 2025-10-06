'use client';

import { createContext, useContext, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { getMessages, getMessagesSync, preloadMessages, getLocaleFromDomain, DEFAULT_LOCALE } from '@/lib/i18n';

const TranslationContext = createContext(null);

function getCookieLocale() {
    if (typeof document === 'undefined') return null;

    const cookieLocale = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1];

    return cookieLocale || null;
}

export function TranslationProvider({ children, initialMessages = null, initialLocale: ssrLocale = null }) {
    const detectLocale = useCallback(() => {
        if (typeof window !== 'undefined') {
            const cookieLocale = getCookieLocale();
            if (cookieLocale) {
                return cookieLocale;
            }

            const hostname = window.location.hostname;
            return getLocaleFromDomain(hostname);
        }
        return DEFAULT_LOCALE;
    }, []);

    const initialLocale = ssrLocale || (typeof window !== 'undefined' ? detectLocale() : DEFAULT_LOCALE);

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
        const currentLocale = detectLocale();
        setLocale(currentLocale);

        const cachedMessages = getMessagesSync(currentLocale);
        if (Object.keys(cachedMessages).length > 0) {
            setAllMessages(cachedMessages);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const loadAllMessages = async () => {
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

        loadAllMessages();

        return () => {
            cancelled = true;
        };
    }, [detectLocale]);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentLocale = detectLocale();
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
