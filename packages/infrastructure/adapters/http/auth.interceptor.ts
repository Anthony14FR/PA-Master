import {
  Interceptor,
  RequestConfig,
} from "../../../application/ports/http/interceptor.interface";
import { StorageService } from "../../../application/ports/services/storage-service.interface";

export class AuthInterceptor implements Interceptor {
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(
    private storageService: StorageService,
    private apiBaseUrl: string
  ) {}

  async onRequest(config: RequestConfig): Promise<RequestConfig> {
    const publicRoutes = ["/login", "/register", "/refresh"];
    const isPublicRoute = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    if (isPublicRoute) {
      return config;
    }

    const token = await this.storageService.get("access_token");
    if (token) {
      config.options.headers = {
        ...config.options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  }

  async onError(error: any, retry: () => Promise<any>): Promise<any> {
    if (error?.status !== 401) {
      throw error;
    }

    if (this.isRefreshing) {
      await this.refreshPromise;
      return retry();
    }

    try {
      this.isRefreshing = true;
      this.refreshPromise = this.refreshToken();
      await this.refreshPromise;
      return await retry();
    } catch (refreshError) {
      await this.handleLogout();
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = await this.storageService.get("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();

    await this.storageService.set("access_token", data.accessToken);
    if (data.refreshToken) {
      await this.storageService.set("refresh_token", data.refreshToken);
    }
  }

  private async handleLogout(): Promise<void> {
    await this.storageService.remove("access_token");
    await this.storageService.remove("refresh_token");

    window.location.href = "/login";
  }
}
