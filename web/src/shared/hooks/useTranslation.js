'use client';

import { useCallback, useEffect, useState } from 'react';
import { getMessages, getMessagesForNamespace, t, getLocaleFromDomain } from '@/lib/i18n';

export function useTranslation(namespace = null, subNamespace = null) {
    const [messages, setMessages] = useState({});
    const [locale, setLocale] = useState('en');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const detectLocale = () => {
            if (typeof window !== 'undefined') {
                const hostname = window.location.hostname;
                return getLocaleFromDomain(hostname);
            }
            return 'en';
        };

        const currentLocale = detectLocale();
        setLocale(currentLocale);

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
    }, [namespace, subNamespace]);

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