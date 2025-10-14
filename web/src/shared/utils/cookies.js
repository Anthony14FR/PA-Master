/**
 * Client-Side Cookie Utilities
 * For browser-side cookie management only
 * 
 * IMPORTANT: Do not use for sensitive data (use httpOnly cookies instead)
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

  /**
   * Set a cookie with maxAge instead of expires
   * @param {NextResponse} response - Next.js response (server-side)
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {Object} options - Cookie options
   */
  setCookie(response, name, value, options = {}) {
    if (!response?.cookies?.set) {
      console.warn('setCookie called without valid response object');
      return response;
    }

    response.cookies.set(name, value, {
      path: '/',
      sameSite: 'lax',
      ...options
    });

    return response;
  }
}

// Export singleton instance
export const cookieUtils = new CookieUtils();