import { apiClient } from './client.js';

export const authService = {
  async login(credentials) {
    const response = await apiClient.post('/login', credentials);
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
      }
    }
    
    return response;
  },

  async register(userData) {
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword || userData.password_confirmation,
    };

    const response = await apiClient.post('/register', payload);
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
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
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiClient.setAuthToken(token);
      }
    }
  },

  isAuthenticated() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  },
}; 