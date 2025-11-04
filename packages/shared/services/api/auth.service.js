import { apiClient } from './client.service.js';
import { getStorageInstance } from '@kennelo/lib/storage-provider';
import { cookieConfig } from '@kennelo/config/jwt.config';

export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/login', credentials);

    if (response.access_token) {
      apiClient.setAuthToken(response.access_token);
      await this.setTokens(response.access_token, response.refresh_token);
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
      await this.setTokens(response.access_token, response.refresh_token);
    }

    return response;
  },

  async logout() {
    const storage = getStorageInstance();
    const refreshToken = await storage.get(cookieConfig.refreshTokenName);

    try {
      await apiClient.post('/logout', { refresh_token: refreshToken });
    } catch (error) {
    } finally {
      apiClient.clearAuthToken();
      await this.clearTokens();
    }
  },

  async refresh() {
    const storage = getStorageInstance();
    const refreshToken = await storage.get(cookieConfig.refreshTokenName);

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.post('/refresh', {
        refresh_token: refreshToken
      });

      if (response.access_token) {
        apiClient.setAuthToken(response.access_token);
        await storage.set(
          cookieConfig.accessTokenName,
          response.access_token,
          {
            days: cookieConfig.accessTokenOptions.maxAge / (24 * 60 * 60),
            secure: cookieConfig.accessTokenOptions.secure,
            sameSite: cookieConfig.accessTokenOptions.sameSite,
          }
        );
      }

      return response;
    } catch (error) {
      await this.clearTokens();
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

  async initializeAuth() {
    const storage = getStorageInstance();
    const accessToken = await storage.get(cookieConfig.accessTokenName);
    if (accessToken) {
      apiClient.setAuthToken(accessToken);
    }
  },

  async isAuthenticated() {
    const storage = getStorageInstance();
    return !!(await storage.get(cookieConfig.accessTokenName));
  },

  async updateLocale(locale) {
    return apiClient.put('/user/locale', { locale });
  },

  async setTokens(accessToken, refreshToken) {
    const storage = getStorageInstance();

    await storage.set(
      cookieConfig.accessTokenName,
      accessToken,
      {
        days: cookieConfig.accessTokenOptions.maxAge / (24 * 60 * 60),
        secure: cookieConfig.accessTokenOptions.secure,
        sameSite: cookieConfig.accessTokenOptions.sameSite,
      }
    );

    if (refreshToken) {
      await storage.set(
        cookieConfig.refreshTokenName,
        refreshToken,
        {
          days: cookieConfig.refreshTokenOptions.maxAge / (24 * 60 * 60),
          secure: cookieConfig.refreshTokenOptions.secure,
          sameSite: cookieConfig.refreshTokenOptions.sameSite,
        }
      );
    }
  },

  async clearTokens() {
    const storage = getStorageInstance();

    await storage.remove(cookieConfig.accessTokenName);
    await storage.remove(cookieConfig.refreshTokenName);
    await storage.remove('auth_token');
  },

  async getAccessToken() {
    const storage = getStorageInstance();
    return storage.get(cookieConfig.accessTokenName);
  },

  async getRefreshToken() {
    const storage = getStorageInstance();
    return storage.get(cookieConfig.refreshTokenName);
  },
}; 