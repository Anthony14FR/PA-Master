/**
 * Access Control Configuration
 * Centralized configuration for authentication, authorization, and routing rules
 */
export const ROLES = {
    Admin: 'admin',
    Manager: 'manager',
    User: 'user'
}

/**
 * Protected subdomains/spaces that require authentication
 * Users must be logged in to access these subdomains
 * Supports both formats: /s/subdomain and subdomain.domain.tld
 */
export const PROTECTED_SUBDOMAINS = ['app', 'admin', 'dashboard'];

/**
 * Role-based route protection
 * Maps routes to required roles (user must have at least one)
 */
export const ROUTE_ROLES = {
    '/s/admin': [ROLES.Admin],
    '/s/app': [ROLES.Admin, ROLES.Manager],
    '/s/my': [ROLES.Admin, ROLES.Manager, ROLES.User],
    '/dashboard': [ROLES.Admin, ROLES.Manager]
};

/**
 * Default home pages based on user role
 * Used for redirects after login
 */
export const HOME_PAGES = {
    admin: '/s/admin',
    manager: '/s/app/overview',
    user: '/',
};

/**
 * Default home page for users without specific roles
 */
export const DEFAULT_HOME_PAGE = '/';

/**
 * Authentication namespace/subdomain
 * Used for auth routes like login, register, etc.
 */
export const AUTH_NAMESPACE = 'account';

export const AUTH_CONFIG = {
    subdomain: AUTH_NAMESPACE, // Login is on account.domain.tld
    tld: '.com'
};

export const LOGIN_CONFIG = {
    path: '/login',
    ...AUTH_CONFIG
};

/**
 * Authentication routes
 * These are accessible without authentication but handle auth logic
 */
export const AUTH_ROUTE_PATTERN = /^\/(s\/account\/(login|register)|login|register)/;

/**
 * Special pages configuration
 */
export const PAGES = {
    NOT_FOUND: '/not-found',
};
