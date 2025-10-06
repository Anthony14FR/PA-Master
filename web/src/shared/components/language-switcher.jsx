'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  getDomainForLocale,
  getLocaleFromDomain,
  AVAILABLE_LOCALES
} from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/shared/services/api/auth';

const LOCALE_LABELS = {
  fr: '🇫🇷 Français',
  en: '🇺🇸 English', 
  it: '🇮🇹 Italiano',
  de: '🇩🇪 Deutsch'
};

const LOCALE_FLAGS = {
  fr: '🇫🇷',
  en: '🇺🇸',
  it: '🇮🇹', 
  de: '🇩🇪'
};

export function LanguageSwitcher() {
  const [isChanging, setIsChanging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Fonction pour lire le cookie NEXT_LOCALE
  const getCookieLocale = () => {
    if (typeof document === 'undefined') return null;
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1];
    return cookieLocale || null;
  };

  // Détecter le montage côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback pour SSR : toujours 'en' côté serveur
  const getFallbackLocale = () => {
    if (typeof window === 'undefined') return 'en';
    return getLocaleFromDomain(window.location.hostname);
  };

  // Priorité : user.locale > cookie NEXT_LOCALE > domaine
  // Utiliser fallback pendant SSR pour éviter hydration mismatch
  const currentLocale = mounted
    ? (user?.locale || getCookieLocale() || getFallbackLocale())
    : 'en';

  const handleLocaleChange = async (newLocale) => {
    if (newLocale === currentLocale || isChanging) return;

    setIsChanging(true);

    try {
      // Mettre à jour les cookies (NEXT_LOCALE + locale_preference)
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      document.cookie = `locale_preference=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

      // Si utilisateur connecté, mettre à jour la BDD via authService
      if (user) {
        try {
          await authService.updateLocale(newLocale);
        } catch (error) {
          console.warn('Failed to update user locale preference:', error);
        }
      }

      // Redirection uniquement en production (pas localhost)
      if (typeof window !== 'undefined') {
        const currentHostname = window.location.hostname;
        const isDevelopment = currentHostname === 'localhost' || currentHostname.startsWith('127.0.0.1');

        if (isDevelopment) {
          // En dev : recharger la page pour appliquer la nouvelle locale
          window.location.reload();
        } else {
          // En prod : rediriger vers le domaine approprié
          const targetDomain = getDomainForLocale(newLocale);
          const targetUrl = `https://${targetDomain}${pathname}`;
          window.location.href = targetUrl;
        }
      }

    } catch (error) {
      console.error('Error changing locale:', error);
      setIsChanging(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          disabled={isChanging}
          className="flex items-center gap-2"
        >
          <span>{LOCALE_FLAGS[currentLocale]}</span>
          <span className="hidden sm:inline">
            {LOCALE_LABELS[currentLocale]?.split(' ')[1]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {AVAILABLE_LOCALES.map(locale => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            disabled={locale === currentLocale || isChanging}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{LOCALE_FLAGS[locale]}</span>
            <span>{LOCALE_LABELS[locale]?.split(' ')[1]}</span>
            {locale === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}