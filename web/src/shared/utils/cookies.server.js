/**
 * Server-Side Cookie Utilities
 *
 * Utilitaires pour la gestion des cookies côté serveur (middleware, API routes, server components).
 * Supporte les cookies HTTP-only pour une sécurité accrue.
 *
 * IMPORTANT: Ce fichier ne doit être utilisé que côté serveur.
 */

import { cookieConfig } from '@/config/jwt.config';

/**
 * Récupère un cookie depuis une NextRequest
 *
 * @param {NextRequest} request - La requête Next.js
 * @param {string} name - Nom du cookie
 * @returns {string|null} Valeur du cookie ou null
 */
export function getCookie(request, name) {
  const cookie = request.cookies.get(name);
  return cookie?.value || null;
}

/**
 * Définit un cookie dans une NextResponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @param {string} name - Nom du cookie
 * @param {string} value - Valeur du cookie
 * @param {Object} options - Options du cookie
 * @returns {NextResponse} La réponse modifiée
 */
export function setCookie(response, name, value, options = {}) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...options,
  };

  // Ajouter le domaine si configuré
  if (cookieConfig.domain) {
    cookieOptions.domain = cookieConfig.domain;
  }

  response.cookies.set(name, value, cookieOptions);
  return response;
}

/**
 * Supprime un cookie dans une NextResponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @param {string} name - Nom du cookie à supprimer
 * @returns {NextResponse} La réponse modifiée
 */
export function deleteCookie(response, name) {
  const cookieOptions = {
    path: '/',
    maxAge: 0,
  };

  // Ajouter le domaine si configuré
  if (cookieConfig.domain) {
    cookieOptions.domain = cookieConfig.domain;
  }

  response.cookies.set(name, '', cookieOptions);
  return response;
}

/**
 * Récupère l'access token depuis une requête
 *
 * @param {NextRequest} request - La requête Next.js
 * @returns {string|null} L'access token ou null
 */
export function getAccessToken(request) {
  return getCookie(request, cookieConfig.accessTokenName);
}

/**
 * Récupère le refresh token depuis une requête
 *
 * @param {NextRequest} request - La requête Next.js
 * @returns {string|null} Le refresh token ou null
 */
export function getRefreshToken(request) {
  return getCookie(request, cookieConfig.refreshTokenName);
}

/**
 * Définit l'access token dans une réponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @param {string} token - Le token à stocker
 * @returns {NextResponse} La réponse modifiée
 */
export function setAccessToken(response, token) {
  return setCookie(
    response,
    cookieConfig.accessTokenName,
    token,
    cookieConfig.accessTokenOptions
  );
}

/**
 * Définit le refresh token dans une réponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @param {string} token - Le token à stocker
 * @returns {NextResponse} La réponse modifiée
 */
export function setRefreshToken(response, token) {
  return setCookie(
    response,
    cookieConfig.refreshTokenName,
    token,
    cookieConfig.refreshTokenOptions
  );
}

/**
 * Définit les deux tokens (access et refresh) dans une réponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @param {string} accessToken - L'access token
 * @param {string} refreshToken - Le refresh token
 * @returns {NextResponse} La réponse modifiée
 */
export function setAuthTokens(response, accessToken, refreshToken) {
  setAccessToken(response, accessToken);
  setRefreshToken(response, refreshToken);
  return response;
}

/**
 * Supprime l'access token dans une réponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @returns {NextResponse} La réponse modifiée
 */
export function deleteAccessToken(response) {
  return deleteCookie(response, cookieConfig.accessTokenName);
}

/**
 * Supprime le refresh token dans une réponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @returns {NextResponse} La réponse modifiée
 */
export function deleteRefreshToken(response) {
  return deleteCookie(response, cookieConfig.refreshTokenName);
}

/**
 * Supprime les deux tokens (access et refresh) dans une réponse
 *
 * @param {NextResponse} response - La réponse Next.js
 * @returns {NextResponse} La réponse modifiée
 */
export function deleteAuthTokens(response) {
  deleteAccessToken(response);
  deleteRefreshToken(response);
  return response;
}

/**
 * Vérifie si un utilisateur est authentifié (possède un access token)
 *
 * @param {NextRequest} request - La requête Next.js
 * @returns {boolean} True si l'utilisateur a un access token
 */
export function isAuthenticated(request) {
  return !!getAccessToken(request);
}
