/**
 * useProtectedRoute Hook
 *
 * Hook pour protéger les composants/pages selon les rôles utilisateur.
 * Redirige automatiquement si l'utilisateur n'a pas les permissions requises.
 *
 * Usage:
 * ```jsx
 * function AdminPage() {
 *   useProtectedRoute({ requiredRoles: ['admin'] });
 *   return <div>Admin Content</div>;
 * }
 * ```
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * Hook pour protéger une route selon les rôles
 *
 * @param {Object} options - Options de protection
 * @param {string[]} options.requiredRoles - Rôles requis (au moins un)
 * @param {boolean} options.requireAllRoles - Si true, nécessite tous les rôles (défaut: false)
 * @param {string} options.redirectTo - URL de redirection si accès refusé (défaut: '/dashboard')
 * @param {boolean} options.requireAuth - Si true, nécessite juste d'être authentifié (défaut: true)
 */
export function useProtectedRoute({
  requiredRoles = [],
  requireAllRoles = false,
  redirectTo = '/dashboard',
  requireAuth = true,
} = {}) {
  const { isAuthenticated, roles, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Attendre que le chargement soit terminé
    if (loading) return;

    // Vérifier l'authentification si requise
    if (requireAuth && !isAuthenticated) {
      console.log('[useProtectedRoute] User not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }

    // Si des rôles sont requis, vérifier les permissions
    if (requiredRoles.length > 0) {
      let hasPermission = false;

      if (requireAllRoles) {
        // Nécessite TOUS les rôles requis
        hasPermission = requiredRoles.every(role => roles.includes(role));
      } else {
        // Nécessite AU MOINS UN des rôles requis
        hasPermission = requiredRoles.some(role => roles.includes(role));
      }

      if (!hasPermission) {
        console.log('[useProtectedRoute] Access denied. Required roles:', requiredRoles, 'User roles:', roles);
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, roles, loading, requiredRoles, requireAllRoles, redirectTo, requireAuth, router]);

  // Retourner l'état de chargement pour permettre un affichage conditionnel
  return { loading, isAuthenticated, roles };
}

/**
 * Hook pour protéger une route admin uniquement
 */
export function useAdminRoute() {
  return useProtectedRoute({
    requiredRoles: ['admin'],
    redirectTo: '/dashboard',
  });
}

/**
 * Hook pour protéger une route manager (admin ou manager)
 */
export function useManagerRoute() {
  return useProtectedRoute({
    requiredRoles: ['admin', 'manager'],
    redirectTo: '/dashboard',
  });
}

/**
 * Hook pour vérifier si une route est accessible (sans redirection)
 *
 * @param {Object} options - Options de vérification
 * @param {string[]} options.requiredRoles - Rôles requis
 * @param {boolean} options.requireAllRoles - Nécessite tous les rôles
 * @returns {boolean} True si l'accès est autorisé
 */
export function useCanAccess({
  requiredRoles = [],
  requireAllRoles = false,
} = {}) {
  const { isAuthenticated, roles, loading } = useAuth();

  if (loading || !isAuthenticated) {
    return false;
  }

  if (requiredRoles.length === 0) {
    return true;
  }

  if (requireAllRoles) {
    return requiredRoles.every(role => roles.includes(role));
  }

  return requiredRoles.some(role => roles.includes(role));
}
