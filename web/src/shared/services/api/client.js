import { getLocaleFromDomain } from '@/lib/i18n';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = null;

    if (process.env.NODE_ENV === 'development') {
      console.debug(`[ApiClient] API Base URL: ${this.baseURL}`);
    }
  }

  setAuthToken(token) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }

  /**
   * Récupère la locale depuis le domaine ou les variables d'environnement
   * @returns {string} Code de locale (fr, en, it, de)
   */
  getLocaleFromRequest() {
    if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en';
    }

    const hostname = window.location.hostname;
    return getLocaleFromDomain(hostname);
  }

  /**
   * Effectue une requête HTTP vers l'API
   * @param {string} endpoint - Endpoint de l'API (ex: "/login")
   * @param {Object} options - Options fetch
   * @returns {Promise<Object>} Réponse JSON
   */
  async request(endpoint, options = {}) {
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
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[ApiClient] ${config.method || 'GET'} ${url}`);
      }

      const response = await fetch(url, config);

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

      console.error('[ApiClient] Network error:', error);
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

