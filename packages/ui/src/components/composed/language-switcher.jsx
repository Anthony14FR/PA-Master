'use client';

import { useState, useEffect } from 'react';
import { Button } from '@kennelo/ui/components/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kennelo/ui/components/shadcn/dropdown-menu';
import { useAuth } from '@kennelo/core/auth/hooks/use-auth';
import { authService } from '@kennelo/core/auth/services/auth.service';
import { useTranslationContext } from '@kennelo/i18n/contexts/translation-context';
import { getStorageInstance } from '@kennelo/core/storage/hooks/storage-provider';
import i18nConfig from '@kennelo/i18n/configs/i18n.config.json';

export function LanguageSwitcher() {
  const [isChanging, setIsChanging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { locale: contextLocale } = useTranslationContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLocale = mounted ? contextLocale : i18nConfig.defaultLocale;

  const getCurrentLocaleInfo = () => {
    return i18nConfig.locales.find(l => l.code === currentLocale);
  };

  const currentLocaleInfo = getCurrentLocaleInfo();

  const handleLocaleChange = async (newLocale) => {
    if (newLocale === currentLocale || isChanging) return;

    setIsChanging(true);

    try {
      const storage = getStorageInstance();
      await storage.set('locale_preference', newLocale, { days: 365, sameSite: 'lax' });

      if (user) {
        try {
          await authService.updateLocale(newLocale);
        } catch (error) {
          console.warn('Failed to update user locale preference:', error);
        }
      }

      // window.location.reload();
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
          <span>{currentLocaleInfo?.flag || '🌐'}</span>
          <span className="hidden sm:inline">
            {currentLocaleInfo?.name || currentLocale.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[140px]">
        {i18nConfig.locales.map(localeConfig => (
          <DropdownMenuItem
            key={localeConfig.code}
            onClick={() => handleLocaleChange(localeConfig.code)}
            disabled={localeConfig.code === currentLocale || isChanging}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{localeConfig.flag || '🌐'}</span>
            <span>{localeConfig.name}</span>
            {localeConfig.code === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}