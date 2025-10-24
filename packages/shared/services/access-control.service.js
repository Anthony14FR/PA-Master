<<<<<<< HEAD:packages/shared/services/access-control.service.js
import {
  PROTECTED_SUBDOMAINS,
  ROUTE_ROLES,
  HOME_PAGES,
  DEFAULT_HOME_PAGE,
  AUTH_ROUTE_PATTERN,
} from '@kennelo/config/access-control.config';

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

    if (pathname.startsWith('/s/')) {
      const parts = pathname.split('/').filter(Boolean);
      effectiveSubdomain = parts[1];
      normalizedPath = parts.length > 2 ? '/' + parts.slice(2).join('/') : '/';
    }

    if (effectiveSubdomain && PROTECTED_SUBDOMAINS.includes(effectiveSubdomain)) {
      normalizedPath = `/${effectiveSubdomain}${normalizedPath === '/' ? '' : normalizedPath}`;
    }

    for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
      if (normalizedPath === route || normalizedPath.startsWith(route + '/')) {
=======
const ROUTE_ROLES = {
  '/admin': ['admin'],
  '/dashboard': ['admin', 'manager'],
  '/dashboard/manager': ['admin', 'manager'],
  '/dashboard': ['admin', 'manager'],
};

const ADMIN_HOME_PAGE = '/admin';
const DASHBOARD_HOME_PAGE = '/dashboard';
const DEFAULT_HOME_PAGE = '/';

export const accessControlService = {
  getRequiredRoles(pathname) {
    for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
      if (pathname.startsWith(route)) {
>>>>>>> 52d48cb (feat: Added routing's restrictions from user roles):web/src/shared/services/access-control.service.js
        return roles;
      }
    }
    return null;
<<<<<<< HEAD:packages/shared/services/access-control.service.js
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
   * @param {string[]} userRoles - User's roles
   * @param {string[]} requiredRoles - Required roles
   * @returns {boolean} True if user has at least one required role
   */
  hasRequiredRole(userRoles, requiredRoles) {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
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

      if (PROTECTED_SUBDOMAINS.includes(extractedSubdomain)) {
        return true;
      }

      const normalizedPath = parts.length > 2 ? '/' + parts.slice(2).join('/') : '/';
      return this._isPathProtected(normalizedPath);
    }

    if (subdomain && PROTECTED_SUBDOMAINS.includes(subdomain)) {
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
=======
  },

  getUserHomePage(userRoles) {
    if (this.hasRequiredRole(userRoles, ['admin'])) {
      return ADMIN_HOME_PAGE;
    } else if (this.hasRequiredRole(userRoles, ['manager'])) {
      return DASHBOARD_HOME_PAGE;
    } else {
      return DEFAULT_HOME_PAGE;
    }
  },

  hasRequiredRole(userRoles, requiredRoles) {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userRoles || userRoles.length === 0) return false;
    return requiredRoles.some(role => userRoles.includes(role));
  },

  checkRouteAccess(pathname, userRoles) {
    const requiredRoles = this.getRequiredRoles(pathname);
    if (!requiredRoles) return { allowed: true };

    const allowed = this.hasRequiredRole(userRoles, requiredRoles);
    return { allowed, requiredRoles };
  },

  isAuthRoute(pathname) {
    return pathname.match(/^\/(auth)/);
  },

  isProtectedRoute(pathname) {
    return pathname.match(/^\/(dashboard)/);
  },
};
>>>>>>> 52d48cb (feat: Added routing's restrictions from user roles):web/src/shared/services/access-control.service.js
