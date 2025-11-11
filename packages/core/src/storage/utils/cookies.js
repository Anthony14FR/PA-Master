import { cookieConfig } from '@kennelo/core/api/configs/jwt.config';

/**
 * Get dynamic cookie domain based on current hostname
 * Matches server-side logic for consistency
 * @returns {string|undefined} Cookie domain (e.g., '.kennelo.fr') or undefined
 */
export function getDynamicCookieDomain() {
  return typeof window === 'undefined' ? cookieConfig.domain : getCookieDomain(window.location.hostname);
}

/**
 * Extract base domain for cookie sharing across subdomains
 * @param {string} host - Current host (e.g., 'app.kennelo.fr:3000')
 * @returns {string|undefined} Cookie domain (e.g., '.kennelo.fr') or undefined
 */
export function getCookieDomain(host) {
  if (!host) return undefined;

  const hostname = host.split(':')[0];

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined;
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return undefined;
  }

  const parts = hostname.split('.');

  if (parts.length >= 2) {
    const baseDomain = parts.slice(-2).join('.');
    return `.${baseDomain}`;
  }

  return undefined;
}

/**
 * Client-Side Cookie Utilities
 * For browser-side cookie management only
 */
class CookieUtils {
  /**
   * Set a cookie in the browser
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} days - Expiration in days (default: 7)
   * @param {Object} options - Additional cookie options
   */
  set(name, value, days = 7, options = {}) {
    if (typeof window === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const defaultOptions = {
      expires: expires.toUTCString(),
      path: '/',
      secure: window.location.protocol === 'https:',
      sameSite: 'lax'
    };

    const cookieOptions = { ...defaultOptions, ...options };
    const host = window.location.hostname;
    if (host) {
      const dynamicDomain = getCookieDomain(host);
      if (dynamicDomain) {
        cookieOptions.domain = dynamicDomain;
      }
    } else if (cookieConfig.domain) {
      cookieOptions.domain = cookieConfig.domain;
    }

    // Remove httpOnly as it's not supported in browser
    if (cookieOptions.httpOnly) {
      delete cookieOptions.httpOnly;
    }

    let cookieString = `${name}=${encodeURIComponent(value)}`;

    Object.entries(cookieOptions).forEach(([key, val]) => {
      if (val === true) {
        cookieString += `; ${key}`;
      } else if (val !== false && val !== null && val !== undefined) {
        cookieString += `; ${key}=${val}`;
      }
    });

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value from the browser
   * @param {string} name - Cookie name
   * @returns {string|null} Cookie value or null
   */
  get(name) {
    if (typeof window === 'undefined') return null;

    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  /**
   * Remove a cookie from the browser
   * @param {string} name - Cookie name
   * @param {Object} options - Additional cookie options
   */
  remove(name, options = {}) {
    if (typeof window === 'undefined') return;

    const defaultOptions = {
      path: '/',
      expires: 'Thu, 01 Jan 1970 00:00:00 UTC'
    };

    const cookieOptions = { ...defaultOptions, ...options };

    let cookieString = `${name}=`;

    Object.entries(cookieOptions).forEach(([key, val]) => {
      if (val === true) {
        cookieString += `; ${key}`;
      } else if (val !== false && val !== null && val !== undefined) {
        cookieString += `; ${key}=${val}`;
      }
    });

    document.cookie = cookieString;
  }
}

export const cookieUtils = new CookieUtils();