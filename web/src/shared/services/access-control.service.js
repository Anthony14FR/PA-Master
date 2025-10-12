/**
 * Access Control Service - Handles route protection and role-based access
 * Centralized service for managing user permissions and route access
 */

import {
  PROTECTED_SUBDOMAINS,
  ROUTE_ROLES,
  HOME_PAGES,
  DEFAULT_HOME_PAGE,
  AUTH_ROUTE_PATTERN,
} from '@/config/access-control.config';

class AccessControlService {
  /**
   * Get required roles for a given pathname
   * Normalizes /s/subdomain/path format for consistent role checking
   * @param {string} pathname - Path to check
   * @param {string|null} subdomain - Current subdomain (optional)
   * @returns {string[]|null} Required roles or null if public
   */
  getRequiredRoles(pathname, subdomain = null) {
    // Normalize pathname: handle both formats
    // - Direct: admin.kennelo.com/overview → pathname=/overview, subdomain=admin
    // - Internal: www.kennelo.com/s/admin/overview → pathname=/s/admin/overview
    let normalizedPath = pathname;
    let effectiveSubdomain = subdomain;

    if (pathname.startsWith('/s/')) {
      const parts = pathname.split('/').filter(Boolean);
      effectiveSubdomain = parts[1]; // Extract subdomain from path
      normalizedPath = parts.length > 2 ? '/' + parts.slice(2).join('/') : '/';
    }

    // If we have a subdomain, prepend it to the path for role matching
    // This ensures /s/admin/overview and admin.kennelo.com/overview both check /admin/overview
    if (effectiveSubdomain && PROTECTED_SUBDOMAINS.includes(effectiveSubdomain)) {
      normalizedPath = `/${effectiveSubdomain}${normalizedPath === '/' ? '' : normalizedPath}`;
    }

    // Check exact matches first, then check if path starts with route
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

    // Public route
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
   * Handles both formats: /s/subdomain/path and direct subdomain routing
   * @param {string} pathname - Path to check
   * @param {string|null} subdomain - Current subdomain (optional)
   * @returns {boolean} True if protected
   */
  isProtectedRoute(pathname, subdomain = null) {
    // Extract subdomain from /s/ format if present
    if (pathname.startsWith('/s/')) {
      const parts = pathname.split('/').filter(Boolean);
      const extractedSubdomain = parts[1];

      // If subdomain is in protected list, the entire space is protected
      if (PROTECTED_SUBDOMAINS.includes(extractedSubdomain)) {
        return true;
      }

      // Otherwise check the normalized path against protected routes
      const normalizedPath = parts.length > 2 ? '/' + parts.slice(2).join('/') : '/';
      return this._isPathProtected(normalizedPath);
    }

    // Direct subdomain routing: check if subdomain is protected
    if (subdomain && PROTECTED_SUBDOMAINS.includes(subdomain)) {
      return true;
    }

    // Classic path-based protection: check against protected routes
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
    // Check if path matches any route in ROUTE_ROLES
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

