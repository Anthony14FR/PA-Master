import { getRefreshToken } from '@/utils/cookies.server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class TokenRefreshService {
  /**
   * Attempt to refresh access token using refresh token
   * @param {NextRequest} request - Next.js request
   * @returns {Promise<string|null>} New access token or null
   */
  async attemptTokenRefresh(request) {
    try {
      const refreshToken = getRefreshToken(request);

      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${API_URL}/api/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.access_token || null;
    } catch (error) {
      console.error('Token refresh failed:', error.message);
      return null;
    }
  }
}

export const tokenRefreshService = new TokenRefreshService();