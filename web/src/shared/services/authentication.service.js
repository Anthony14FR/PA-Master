import { getAccessToken } from '@/shared/utils/cookies.server';
import { jwtService } from '@/shared/utils/jwt.server';
import { tokenRefreshService } from './token-refresh.service';

/**
 * Authentication Service - Handles token validation and refresh
 * Centralized service for middleware authentication logic
 */
class AuthenticationService {
    /**
     * Authenticate request and refresh token if needed
     * @param {NextRequest} request - Next.js request
     * @returns {Promise<{ accessToken: string|null, userRoles: string[], tokenRefreshed: boolean }>}
     */
    async authenticateRequest(request) {
        let accessToken = getAccessToken(request);
        let userRoles = [];
        let tokenRefreshed = false;

        if (!accessToken) {
            return { accessToken: null, userRoles: [], tokenRefreshed: false };
        }

        try {
            // Check if token is expired
            if (jwtService.isExpired(accessToken)) {
                const newToken = await tokenRefreshService.attemptTokenRefresh(request);

                if (newToken) {
                    accessToken = newToken;
                    tokenRefreshed = true;
                } else {
                    // Refresh failed, clear token
                    accessToken = null;
                }
            }

            // Extract roles from valid token
            if (accessToken) {
                userRoles = await jwtService.extractRoles(accessToken);
            }
        } catch (error) {
            // Token validation failed
            accessToken = null;
        }

        return { accessToken, userRoles, tokenRefreshed };
    }

    /**
     * Check if user is authenticated
     * @param {string|null} accessToken - Access token
     * @returns {boolean} True if authenticated
     */
    isAuthenticated(accessToken) {
        return !!accessToken;
    }
}

export const authenticationService = new AuthenticationService();
