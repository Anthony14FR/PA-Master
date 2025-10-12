/**
 * JWT Configuration
 *
 * Configuration centralisée pour la gestion des JWT (JSON Web Tokens).
 * Ces valeurs doivent correspondre exactement à celles du backend Laravel.
 */

export const jwtConfig = {
  /**
   * Secret utilisé pour vérifier la signature des JWT
   * IMPORTANT: Doit être identique au JWT_SECRET du backend Laravel
   */
  secret: process.env.JWT_SECRET || '',

  /**
   * Algorithme de signature (HS256, HS384, HS512, RS256, etc.)
   * IMPORTANT: Doit correspondre au JWT_ALGORITHM du backend Laravel
   */
  algorithm: process.env.JWT_ALGORITHM || 'HS256',

  /**
   * Durée de vie de l'access token en secondes
   * Utilisé pour les validations côté client
   */
  accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10),

  /**
   * Durée de vie du refresh token en secondes
   * Utilisé pour les validations côté client
   */
  refreshTokenTTL: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '2592000', 10),

  /**
   * Marge de tolérance pour l'expiration des tokens (en secondes)
   * Permet de compenser les décalages d'horloge entre serveurs
   */
  leeway: parseInt(process.env.JWT_LEEWAY || '60', 10),
};

/**
 * Configuration des cookies pour stocker les tokens JWT
 */
export const cookieConfig = {
  /**
   * Nom du cookie contenant l'access token
   */
  accessTokenName: 'access_token',

  /**
   * Nom du cookie contenant le refresh token
   */
  refreshTokenName: 'refresh_token',

  /**
   * Domaine pour les cookies (permet le partage cross-domaine)
   * Ex: .kennelo.com permet l'accès depuis kennelo.fr, kennelo.com, etc.
   */
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,

  /**
   * Options par défaut pour l'access token
   */
  accessTokenOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10),
  },

  /**
   * Options par défaut pour le refresh token
   */
  refreshTokenOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '2592000', 10),
  },
};

/**
 * Configuration des rôles et permissions
 */
export const roleConfig = {
  /**
   * Hiérarchie des rôles (du plus au moins privilégié)
   * Un rôle hérite des permissions des rôles inférieurs
   */
  hierarchy: ['admin', 'manager', 'user'],

  /**
   * Routes protégées par rôle
   */
  protectedRoutes: {
    admin: ['/dashboard/admin'],
    manager: ['/dashboard/manager', '/dashboard/establishments'],
    user: ['/dashboard'],
  },
};
