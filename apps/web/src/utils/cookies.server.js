import { cookieConfig } from '@kennelo/config/jwt.config';

/**
 * Extract base domain for cookie sharing across subdomains
 * @param {string} host - Current host (e.g., 'app.kennelo.fr:3000')
 * @returns {string|undefined} Cookie domain (e.g., '.kennelo.fr') or undefined
 */
function getCookieDomain(host) {
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
 * Get a cookie from NextRequest
 * @param {NextRequest} request - Next.js request
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
export function getCookie(request, name) {
  const cookie = request.cookies.get(name);
  return cookie?.value || null;
}

/**
 * Set a cookie in NextResponse
 * @param {NextResponse} response - Next.js response
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function setCookie(response, name, value, options = {}, host = null) {
  const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...options,
  };

  if (host) {
    const dynamicDomain = getCookieDomain(host);
    if (dynamicDomain) {
      cookieOptions.domain = dynamicDomain;
    }
  } else if (cookieConfig.domain) {
    cookieOptions.domain = cookieConfig.domain;
  }

  response.cookies.set(name, value, cookieOptions);
  return response;
}

/**
 * Delete a cookie in NextResponse
 * @param {NextResponse} response - Next.js response
 * @param {string} name - Cookie name to delete
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function deleteCookie(response, name, host = null, options = {}) {
  const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...options,
    maxAge: 0,
  };

  if (host) {
    const dynamicDomain = getCookieDomain(host);
    if (dynamicDomain) {
      cookieOptions.domain = dynamicDomain;
    }
  } else if (cookieConfig.domain) {
    cookieOptions.domain = cookieConfig.domain;
  }

  response.cookies.set(name, '', cookieOptions);
  return response;
}

/**
 * Get access token from request
 * @param {NextRequest} request - Next.js request
 * @returns {string|null} Access token or null
 */
export function getAccessToken(request) {
  return getCookie(request, cookieConfig.accessTokenName);
}

/**
 * Get refresh token from request
 * @param {NextRequest} request - Next.js request
 * @returns {string|null} Refresh token or null
 */
export function getRefreshToken(request) {
  return getCookie(request, cookieConfig.refreshTokenName);
}

/**
 * Set access token in response
 * @param {NextResponse} response - Next.js response
 * @param {string} token - Token to store
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function setAccessToken(response, token, host = null) {
  return setCookie(
    response,
    cookieConfig.accessTokenName,
    token,
    cookieConfig.accessTokenOptions,
    host
  );
}

/**
 * Set refresh token in response
 * @param {NextResponse} response - Next.js response
 * @param {string} token - Token to store
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function setRefreshToken(response, token, host = null) {
  return setCookie(
    response,
    cookieConfig.refreshTokenName,
    token,
    cookieConfig.refreshTokenOptions,
    host
  );
}

/**
 * Set both authentication tokens in response
 * @param {NextResponse} response - Next.js response
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function setAuthTokens(response, accessToken, refreshToken, host = null) {
  setAccessToken(response, accessToken, host);
  setRefreshToken(response, refreshToken, host);
  return response;
}

/**
 * Delete access token from response
 * @param {NextResponse} response - Next.js response
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function deleteAccessToken(response, host = null) {
  return deleteCookie(response, cookieConfig.accessTokenName, host, cookieConfig.accessTokenOptions);
}

/**
 * Delete refresh token from response
 * @param {NextResponse} response - Next.js response
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function deleteRefreshToken(response, host = null) {
  return deleteCookie(response, cookieConfig.refreshTokenName, host, cookieConfig.refreshTokenOptions);
}

/**
 * Delete both authentication tokens from response
 * @param {NextResponse} response - Next.js response
 * @param {string} host - Current host for dynamic domain extraction
 * @returns {NextResponse} Modified response
 */
export function deleteAuthTokens(response, host = null) {
  deleteAccessToken(response, host);
  deleteRefreshToken(response, host);
  return response;
}

/**
 * Check if user has an access token
 * @param {NextRequest} request - Next.js request
 * @returns {boolean} True if has access token
 */
export function isAuthenticated(request) {
  return !!getAccessToken(request);
}
