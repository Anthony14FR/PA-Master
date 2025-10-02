'use client';

import { useState } from 'react';
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
import { useAuth } from '@/shared/hooks/useAuth';

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
  const pathname = usePathname();
  const { user } = useAuth();
  
  const currentLocale = getLocaleFromDomain(
    typeof window !== 'undefined' ? window.location.hostname : ''
  );

  const handleLocaleChange = async (newLocale) => {
    if (newLocale === currentLocale || isChanging) return;
    
    setIsChanging(true);

    try {
      document.cookie = `locale_preference=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

      if (user) {
        try {
          await fetch('/api/user/locale', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale: newLocale })
          });
        } catch (error) {
          console.warn('Failed to update user locale preference:', error);
        }
      }

      const targetDomain = getDomainForLocale(newLocale);
      const targetUrl = `https://${targetDomain}${pathname}`;
      
      window.location.href = targetUrl;
      
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