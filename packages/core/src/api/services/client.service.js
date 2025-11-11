import { getLocaleFromDomain } from '@kennelo/i18n/lib/i18n';
import { LOGIN_CONFIG } from '@kennelo/core/auth/configs/access-control.config';
import i18nConfig from '@kennelo/i18n/configs/i18n.config.json';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;
    this.refreshPromise = null;
  }

  setAuthToken(token) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
    this.refreshPromise = null;
  }

  getLocaleFromRequest() {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';
    }
    const hostname = window.location.hostname;
    return getLocaleFromDomain(hostname);
  }

  async attemptRefresh() {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const { authService } = await import('@kennelo/core/auth/services/auth.service.js');
        const response = await authService.refresh();

        if (response.access_token) {
          this.setAuthToken(response.access_token);
          return true;
        }

        return false;
      } catch (error) {
        this.clearAuthToken();

        if (typeof window !== 'undefined') {
          if (process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_REDIRECT !== 'false') {
            window.location.href = `https://${LOGIN_CONFIG.subdomain}.${i18nConfig.defaultDomaine}${LOGIN_CONFIG.path}`;
          } else {
            window.location.href = `/s/${LOGIN_CONFIG.subdomain}${LOGIN_CONFIG.path}`;
          }
        }

        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request(endpoint, options = {}, isRetry = false) {
    const url = `${this.baseURL}/api${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': this.getLocaleFromRequest(),
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401 && !isRetry && endpoint !== '/refresh' && endpoint !== '/login') {
        const refreshed = await this.attemptRefresh();
        if (refreshed) {
          return this.request(endpoint, options, true);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP error! status: ${response.status}`,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(0, 'Network error or server unavailable', {
        originalError: error.message
      });
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(status, message, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const apiClient = new ApiClient();
export { apiClient, ApiError };
