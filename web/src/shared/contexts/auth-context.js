'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/api/auth.service.js';
import { ApiError } from '../services/api/client.service.js';
import { cookieUtils } from '@/shared/utils/cookies';
import i18nConfig from '@/config/i18n.config.json';
import { AUTH_NAMESPACE } from '@/config/access-control.config';

const AuthContext = createContext(null);

export function AuthProvider({ children, locale = 'en' }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        authService.initializeAuth();

        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          setUser(userData);

          if (userData?.roles) {
            const userRoles = Array.isArray(userData.roles)
              ? userData.roles
              : [userData.roles];
            setRoles(userRoles);
          }

          if (userData?.locale) {
            const cookieLocale = cookieUtils.get('locale_preference');

            if (cookieLocale !== userData.locale) {
              cookieUtils.set('locale_preference', userData.locale, 365, { sameSite: 'lax' });
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);

        authService.clearTokens();
        setUser(null);
        setRoles([]);
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

      if (userData?.roles) {
        const userRoles = Array.isArray(userData.roles)
          ? userData.roles
          : [userData.roles];
        setRoles(userRoles);
      }

      if (userData?.locale) {
        cookieUtils.set('locale_preference', userData.locale, 365, { sameSite: 'lax' });
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

      if (newUser?.roles) {
        const userRoles = Array.isArray(newUser.roles)
          ? newUser.roles
          : [newUser.roles];
        setRoles(userRoles);
      }

      if (newUser?.locale) {
        cookieUtils.set('locale_preference', newUser.locale, 365, { sameSite: 'lax' });
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
      setRoles([]);

      const currentHostname = window.location.hostname;
      const currentBaseDomain = currentHostname.split('.').slice(-2).join('.');
      const defaultBaseDomain = i18nConfig.defaultDomaine;

      const returnUrl = encodeURIComponent(window.location.origin);

      if (currentBaseDomain !== defaultBaseDomain) {
        window.location.href = `https://${AUTH_NAMESPACE}.${defaultBaseDomain}/logout?returnUrl=${returnUrl}`;
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      authService.clearTokens();
      setUser(null);
      setRoles([]);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        setUser(userData);

        if (userData?.roles) {
          const userRoles = Array.isArray(userData.roles)
            ? userData.roles
            : [userData.roles];
          setRoles(userRoles);
        }
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      setUser(null);
      setRoles([]);
    }
  }, []);

  const isAuthenticated = authService.isAuthenticated();

  const hasRole = useCallback((role) => {
    return roles.includes(role);
  }, [roles]);

  const hasAnyRole = useCallback((requiredRoles) => {
    return requiredRoles.some(role => roles.includes(role));
  }, [roles]);

  const hasAllRoles = useCallback((requiredRoles) => {
    return requiredRoles.every(role => roles.includes(role));
  }, [roles]);

  const isAdmin = useCallback(() => {
    return roles.includes('admin');
  }, [roles]);

  const isManager = useCallback(() => {
    return roles.includes('manager') || roles.includes('admin');
  }, [roles]);

  const value = {
    user,
    roles,
    loading,
    error,
    isAuthenticated,

    login,
    register,
    logout,
    refreshUser,
    clearError: () => setError(null),

    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isManager,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };