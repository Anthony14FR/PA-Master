'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/api/auth.js';
import { ApiError } from '../services/api/client.js';
import { getLocaleFromDomain, getDomainForLocale } from '@/lib/i18n';

const AuthContext = createContext(null);

export function AuthProvider({ children, locale = 'en' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        authService.initializeAuth();

        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);

          // Synchroniser le cookie NEXT_LOCALE avec user.locale
          if (userData?.locale) {
            const cookieLocale = document.cookie
              .split('; ')
              .find(row => row.startsWith('NEXT_LOCALE='))
              ?.split('=')[1];

            if (cookieLocale !== userData.locale) {
              document.cookie = `NEXT_LOCALE=${userData.locale}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      const userData = response.user || response;
      setUser(userData);

      // Mettre à jour le cookie NEXT_LOCALE avec la locale de l'utilisateur
      if (userData?.locale) {
        document.cookie = `NEXT_LOCALE=${userData.locale}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }

      // Rediriger vers le domaine de la locale de l'utilisateur si différent
      // Skip en mode développement (localhost)
      if (typeof window !== 'undefined' && userData?.locale) {
        const currentHostname = window.location.hostname;
        const isDevelopment = currentHostname === 'localhost' || currentHostname.startsWith('127.0.0.1');

        if (!isDevelopment) {
          const currentLocale = getLocaleFromDomain(currentHostname);

          if (userData.locale !== currentLocale) {
            const targetDomain = getDomainForLocale(userData.locale);
            const targetUrl = `https://${targetDomain}${window.location.pathname}`;
            window.location.href = targetUrl;
            return response;
          }
        }
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Erreur de connexion';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(userData);
      const newUser = response.user || response;
      setUser(newUser);

      // Mettre à jour le cookie NEXT_LOCALE avec la locale de l'utilisateur
      if (newUser?.locale) {
        document.cookie = `NEXT_LOCALE=${newUser.locale}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
      }

      // Rediriger vers le domaine de la locale de l'utilisateur si différent
      // Skip en mode développement (localhost)
      if (typeof window !== 'undefined' && newUser?.locale) {
        const currentHostname = window.location.hostname;
        const isDevelopment = currentHostname === 'localhost' || currentHostname.startsWith('127.0.0.1');

        if (!isDevelopment) {
          const currentLocale = getLocaleFromDomain(currentHostname);

          if (newUser.locale !== currentLocale) {
            const targetDomain = getDomainForLocale(newUser.locale);
            const targetUrl = `https://${targetDomain}${window.location.pathname}`;
            window.location.href = targetUrl;
            return response;
          }
        }
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };