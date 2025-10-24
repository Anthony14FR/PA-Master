import * as jose from 'jose';
import { jwtConfig } from '@/config/jwt.config';

export async function decodeJWT(token) {
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

export function decodeJWTUnsafe(token) {
  if (!token) return null;
  try {
    return jose.decodeJwt(token);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJWTUnsafe(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export async function extractRoles(token) {
  try {
    const payload = await decodeJWT(token);
    return payload.roles || [];
  } catch (error) {
    return [];
  }
}

export async function extractRole(token) {
  const roles = await extractRoles(token);
  return roles.length > 0 ? roles[0] : null;
}

export async function extractUserId(token) {
  try {
    const payload = await decodeJWT(token);
    return payload.sub || null;
  } catch (error) {
    return null;
  }
}

export async function extractEmail(token) {
  try {
    const payload = await decodeJWT(token);
    return payload.email || null;
  } catch (error) {
    return null;
  }
}

export async function extractLocale(token) {
  try {
    const payload = await decodeJWT(token);
    return payload.locale || null;
  } catch (error) {
    return null;
  }
}

export async function getTokenPayload(token) {
  try {
    return await decodeJWT(token);
  } catch (error) {
    return null;
  }
}

export async function hasRole(token, requiredRole) {
  const roles = await extractRoles(token);
  return roles.includes(requiredRole);
}

export async function hasAnyRole(token, requiredRoles) {
  const roles = await extractRoles(token);
  return requiredRoles.some(role => roles.includes(role));
}

export async function hasAllRoles(token, requiredRoles) {
  const roles = await extractRoles(token);
  return requiredRoles.every(role => roles.includes(role));
}
