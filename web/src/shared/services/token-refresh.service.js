const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const tokenRefreshService = {
  async attemptTokenRefresh(request) {
    try {
      const refreshToken = request.cookies.get('refresh_token')?.value;
      if (!refreshToken) return null;

      const response = await fetch(`${API_URL}/api/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.access_token || null;
    } catch (error) {
      return null;
    }
  },
};
