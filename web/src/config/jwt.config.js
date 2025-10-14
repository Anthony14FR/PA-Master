/**
 * JWT Configuration
 * IMPORTANT: Must match backend Laravel configuration exactly
 */
export const jwtConfig = {
  secret: process.env.JWT_SECRET || '',
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
  accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10),
  refreshTokenTTL: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '2592000', 10),
  leeway: parseInt(process.env.JWT_LEEWAY || '60', 10), // Clock skew tolerance in seconds
};

/**
 * Cookie Configuration
 */
export const cookieConfig = {
  accessTokenName: 'access_token',
  refreshTokenName: 'refresh_token',

  /**
   * @deprecated Static domain used as fallback only.
   * Cookie domain is now dynamically extracted via getCookieDomain(host).
   * See cookies.server.js for implementation.
   */
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,

  accessTokenOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10),
  },

  refreshTokenOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '2592000', 10),
  },
};