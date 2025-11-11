import {
  SPACES_PROTECTIONS,
  ROUTE_ROLES,
  HOME_PAGES,
  DEFAULT_HOME_PAGE,
  AUTH_ROUTE_PATTERN,
} from '@kennelo/core/auth/configs/access-control.config';

class AccessControlService {
  /**
   * Get required roles for a given pathname
   * @param {string} pathname - Path to check
   * @param {string|null} subdomain - Current subdomain (optional)
   * @returns {string[]|null} Required roles or null if public
   */
  getRequiredRoles(pathname, subdomain = null) {
    let normalizedPath = pathname;
    let effectiveSubdomain = subdomain;

    // Extract subdomain from /s/ paths
    if (pathname.startsWith('/s/')) {
      const parts = pathname.split('/').filter(Boolean);
      effectiveSubdomain = parts[1];
      normalizedPath = parts.length > 2 ? '/' + parts.slice(2).join('/') : '/';
    }

    if (effectiveSubdomain && SPACES_PROTECTIONS[effectiveSubdomain]) {
      return SPACES_PROTECTIONS[effectiveSubdomain];
    }

    for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
      if (normalizedPath === route || normalizedPath.startsWith(route + '/')) {
        return roles;
      }
    }

    return null;
  }

  /**
   * Get user's home page based on their highest role
   * @param {string[]} userRoles - User's roles
   * @returns {string} Home page path
   */
  getUserHomePage(userRoles) {
    if (!userRoles || userRoles.length === 0) {
      return DEFAULT_HOME_PAGE;
    }

    for (let key in HOME_PAGES) {
      if (userRoles.includes(key)) return HOME_PAGES[key];
    }

    return DEFAULT_HOME_PAGE;
  }

  /**
   * Check if user has any of the required roles
   * @param {string[]} userRoles - User's roles (can be empty array for authenticated users without roles)
   * @param {string[]} requiredRoles - Required roles (can include "*" wildcard)
   * @returns {boolean} True if user has at least one required role
   */
  hasRequiredRole(userRoles, requiredRoles) {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (requiredRoles.includes("*")) {
      return userRoles !== null && userRoles !== undefined && Array.isArray(userRoles);
    }

    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    return requiredRoles.some(role => userRoles.includes(role));
  }

  /**
   * Check if user can access a route
   * @param {string} pathname - Path to check
   * @param {string[]} userRoles - User's roles
   * @param {string|null} subdomain - Current subdomain (optional)
   * @returns {{ allowed: boolean, requiredRoles?: string[] }} Access check result
   */
  checkRouteAccess(pathname, userRoles, subdomain = null) {
    const requiredRoles = this.getRequiredRoles(pathname, subdomain);

    if (!requiredRoles) {
      return { allowed: true };
    }

    const allowed = this.hasRequiredRole(userRoles, requiredRoles);
    return { allowed, requiredRoles };
  }

  /**
   * Check if pathname is an authentication route
   * @param {string} pathname - Path to check
   * @returns {boolean} True if auth route
   */
  isAuthRoute(pathname) {
    return AUTH_ROUTE_PATTERN.test(pathname);
  }

  /**
   * Check if pathname is a protected route
   * @param {string} pathname - Path to check
   * @param {string|null} subdomain - Current subdomain (optional)
   * @returns {boolean} True if protected
   */
  isProtectedRoute(pathname, subdomain = null) {
    if (pathname.startsWith('/s/')) {
      const parts = pathname.split('/').filter(Boolean);
      const extractedSubdomain = parts[1];

      if (extractedSubdomain && extractedSubdomain in SPACES_PROTECTIONS) {
        return true;
      }

      const normalizedPath = parts.length > 2 ? '/' + parts.slice(2).join('/') : '/';
      return this._isPathProtected(normalizedPath);
    }

    if (subdomain && subdomain in SPACES_PROTECTIONS) {
      return true;
    }

    return this._isPathProtected(pathname);
  }

  /**
   * Check if a path matches any protected route patterns
   * Uses ROUTE_ROLES configuration to determine protected routes
   * @private
   * @param {string} pathname - Path to check
   * @returns {boolean} True if path is protected
   */
  _isPathProtected(pathname) {
    for (const route of Object.keys(ROUTE_ROLES)) {
      if (pathname === route || pathname.startsWith(route + '/')) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if pathname is a public route (accessible without authentication)
   * @param {string} pathname - Path to check
   * @returns {boolean} True if public
   */
  isPublicRoute(pathname) {
    return !this.isProtectedRoute(pathname) && !this.isAuthRoute(pathname);
  }
}

export const accessControlService = new AccessControlService();