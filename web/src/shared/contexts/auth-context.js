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

          if (userData?.locale) {
            const cookieLocale = document.cookie
              .split('; ')
              .find(row => row.startsWith('locale_preference='))
              ?.split('=')[1];

            if (cookieLocale !== userData.locale) {
              document.cookie = `locale_preference=${userData.locale}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
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

      if (userData?.locale) {
        document.cookie = `locale_preference=${userData.locale}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
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

      if (newUser?.locale) {
        document.cookie = `locale_preference=${newUser.locale}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
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