export const cookieUtils = {
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
  },

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
  },

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
};