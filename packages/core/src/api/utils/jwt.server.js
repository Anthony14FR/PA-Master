import * as jose from 'jose';
import { jwtConfig } from '@kennelo/core/api/configs/jwt.config';

/**
 * JWT Service - Centralized JWT handling
 * Provides secure token verification and payload extraction
 */

class JWTService {
  /**
   * Verify and decode a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Promise<Object>} Decoded payload
   * @throws {Error} If token is invalid or expired
   */
  async verify(token) {
    if (!token) {
      throw new Error('Token is required');
    }

    if (!jwtConfig.secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      const secret = new TextEncoder().encode(jwtConfig.secret);
      const { payload } = await jose.jwtVerify(token, secret, {
        algorithms: [jwtConfig.algorithm],
        clockTolerance: jwtConfig.leeway,
      });
      return payload;
    } catch (error) {
      if (error.code === 'ERR_JWT_EXPIRED') {
        throw new Error('Token has expired');
      }
      if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        throw new Error('Invalid token signature');
      }
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  /**
   * Decode token without verification (unsafe - use only for client-side checks)
   * @param {string} token - JWT token to decode
   * @returns {Object|null} Decoded payload or null
   */
  decodeUnsafe(token) {
    if (!token) return null;
    try {
      return jose.decodeJwt(token);
    } catch {
      return null;
    }
  }

  /**
   * Get token payload (verified)
   * @param {string} token - JWT token
   * @returns {Promise<Object|null>} Payload or null if invalid
   */
  async getPayload(token) {
    try {
      return await this.verify(token);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired (client-side check without verification)
   * @param {string} token - JWT token
   * @returns {boolean} True if expired
   */
  isExpired(token) {
    const payload = this.decodeUnsafe(token);
    if (!payload?.exp) return true;
    return payload.exp < Math.floor(Date.now() / 1000);
  }

  /**
   * Extract user roles from token
   * @param {string} token - JWT token
   * @returns {Promise<string[]>} Array of roles
   */
  async extractRoles(token) {
    const payload = await this.getPayload(token);
    return payload?.roles || [];
  }

  /**
   * Check if token has specific role
   * @param {string} token - JWT token
   * @param {string} role - Required role
   * @returns {Promise<boolean>} True if has role
   */
  async hasRole(token, role) {
    const roles = await this.extractRoles(token);
    return roles.includes(role);
  }

  /**
   * Check if token has any of the required roles
   * @param {string} token - JWT token
   * @param {string[]} requiredRoles - Array of required roles
   * @returns {Promise<boolean>} True if has any role
   */
  async hasAnyRole(token, requiredRoles) {
    const roles = await this.extractRoles(token);
    return requiredRoles.some(role => roles.includes(role));
  }

  /**
   * Check if token has all required roles
   * @param {string} token - JWT token
   * @param {string[]} requiredRoles - Array of required roles
   * @returns {Promise<boolean>} True if has all roles
   */
  async hasAllRoles(token, requiredRoles) {
    const roles = await this.extractRoles(token);
    return requiredRoles.every(role => roles.includes(role));
  }
}

export const jwtService = new JWTService();

export const decodeJWT = (token) => jwtService.verify(token);
export const decodeJWTUnsafe = (token) => jwtService.decodeUnsafe(token);
export const isTokenExpired = (token) => jwtService.isExpired(token);
export const extractRoles = (token) => jwtService.extractRoles(token);
export const getTokenPayload = (token) => jwtService.getPayload(token);
export const hasRole = (token, role) => jwtService.hasRole(token, role);
export const hasAnyRole = (token, roles) => jwtService.hasAnyRole(token, roles);
export const hasAllRoles = (token, roles) => jwtService.hasAllRoles(token, roles);