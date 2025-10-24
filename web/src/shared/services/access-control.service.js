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
        return roles;
      }
    }
    return null;
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
