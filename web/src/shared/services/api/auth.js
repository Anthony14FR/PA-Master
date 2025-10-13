import { apiClient } from './client.js';
import { cookieUtils } from '../../utils/cookies.js';

export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/login', credentials);
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
      cookieUtils.set('auth_token', response.token, 7);
    }
    
    return response;
  },

  async register(userData) {
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword || userData.password_confirmation,
      locale: userData.locale,
    };

    const response = await apiClient.post('/register', payload);
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
      cookieUtils.set('auth_token', response.token, 7);
    }
    
    return response;
  },

  async logout() {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      apiClient.clearAuthToken();
      cookieUtils.remove('auth_token');
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
    const token = cookieUtils.get('auth_token');
    if (token) {
      apiClient.setAuthToken(token);
    }
  },

  isAuthenticated() {
    return !!cookieUtils.get('auth_token');
  },

  async updateLocale(locale) {
    return apiClient.put('/user/locale', { locale });
  },
}; 