import { apiClient } from './client.service.js';
import { cookieUtils } from '../../utils/cookies.js';
import { cookieConfig } from '@/config/jwt.config';

/**
 * Get dynamic cookie domain based on current hostname
 * Matches server-side logic for consistency
 * @returns {string|undefined} Cookie domain (e.g., '.kennelo.fr') or undefined
 */
function getDynamicCookieDomain() {
  if (typeof window === 'undefined') return cookieConfig.domain;

  const hostname = window.location.hostname;

  // Skip domain for localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined;
  }

  // Skip domain if it's an IP address
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return undefined;
  }

  // Extract base domain (last 2 parts)
  const parts = hostname.split('.');

  // If hostname has at least 2 parts (e.g., kennelo.com, app.kennelo.fr)
  if (parts.length >= 2) {
    const baseDomain = parts.slice(-2).join('.');
    return `.${baseDomain}`;  // Prefix with dot for subdomain sharing
  }

  return undefined;
}

export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/login', credentials);

    if (response.access_token) {
      apiClient.setAuthToken(response.access_token);
      this.setTokens(response.access_token, response.refresh_token);
    }

    return response;
  },

  async register(userData) {
    const payload = {
      first_name: userData.firstName || userData.first_name,
      last_name: userData.lastName || userData.last_name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      password_confirmation: userData.confirmPassword || userData.password_confirmation,
      locale: userData.locale,
    };

    const response = await apiClient.post('/register', payload);

    if (response.access_token) {
      apiClient.setAuthToken(response.access_token);
      this.setTokens(response.access_token, response.refresh_token);
    }

    return response;
  },

  async logout() {
    const refreshToken = cookieUtils.get(cookieConfig.refreshTokenName);

    try {
      await apiClient.post('/logout', { refresh_token: refreshToken });
    } catch (error) {
    } finally {
      apiClient.clearAuthToken();
      this.clearTokens();
    }
  },

  async refresh() {
    const refreshToken = cookieUtils.get(cookieConfig.refreshTokenName);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post('/refresh', {
        refresh_token: refreshToken
      });

      if (response.access_token) {
        const dynamicDomain = getDynamicCookieDomain();

        apiClient.setAuthToken(response.access_token);
        cookieUtils.set(
          cookieConfig.accessTokenName,
          response.access_token,
          cookieConfig.accessTokenOptions.maxAge / (24 * 60 * 60),
          {
            secure: cookieConfig.accessTokenOptions.secure,
            sameSite: cookieConfig.accessTokenOptions.sameSite,
            domain: dynamicDomain,
          }
        );
      }

      return response;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  },

  async getCurrentUser() {
    return apiClient.get('/user');
  },

  async forgotPassword(email) {
    return apiClient.post('/forgot-password', { email });
  },

  async resetPassword(resetData) {
    return apiClient.post('/reset-password', resetData);
  },

  initializeAuth() {
    const accessToken = cookieUtils.get(cookieConfig.accessTokenName);
    if (accessToken) {
      apiClient.setAuthToken(accessToken);
    }
  },

  isAuthenticated() {
    return !!cookieUtils.get(cookieConfig.accessTokenName);
  },

  async updateLocale(locale) {
    return apiClient.put('/user/locale', { locale });
  },

  setTokens(accessToken, refreshToken) {
    const dynamicDomain = getDynamicCookieDomain();

    cookieUtils.set(
      cookieConfig.accessTokenName,
      accessToken,
      cookieConfig.accessTokenOptions.maxAge / (24 * 60 * 60),
      {
        secure: cookieConfig.accessTokenOptions.secure,
        sameSite: cookieConfig.accessTokenOptions.sameSite,
        domain: dynamicDomain,
      }
    );

    if (refreshToken) {
      cookieUtils.set(
        cookieConfig.refreshTokenName,
        refreshToken,
        cookieConfig.refreshTokenOptions.maxAge / (24 * 60 * 60),
        {
          secure: cookieConfig.refreshTokenOptions.secure,
          sameSite: cookieConfig.refreshTokenOptions.sameSite,
          domain: dynamicDomain,
        }
      );
    }
  },

  clearTokens() {
    const dynamicDomain = getDynamicCookieDomain();

    cookieUtils.remove(cookieConfig.accessTokenName, {
      domain: dynamicDomain,
    });
    cookieUtils.remove(cookieConfig.refreshTokenName, {
      domain: dynamicDomain,
    });
    cookieUtils.remove('auth_token', {
      domain: dynamicDomain,
    });
  },

  getAccessToken() {
    return cookieUtils.get(cookieConfig.accessTokenName);
  },

  getRefreshToken() {
    return cookieUtils.get(cookieConfig.refreshTokenName);
  },
}; 