import { StorageService } from "../../../application/ports/services/storage-service.interface";
import { AuthService } from "../../../application/ports/services/auth-service.interface";
import { HttpClient } from "../../../application/ports/http/http-client.interface";
import { UserEntity } from "../../../domain/entities/user.entity";
import { JwtUtils } from "../../utils/jwt.utils";

export interface ApiUserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  locale: string;
  is_id_verified: boolean;
  email_verified_at: string | null;
  roles: string[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: ApiUserResponse;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_LOCALE: "user_locale",
} as const;

export class ApiAuthService implements AuthService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storage: StorageService
  ) {}

  async register(payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    locale?: string;
  }): Promise<UserEntity | undefined> {
    const res = await this.httpClient.post<AuthResponse>("/register", payload);

    if (res.status !== 201 || !res.data) {
      return undefined;
    }

    await this._storeAuthData(res.data);
    return UserEntity.fromApi(res.data.user);
  }

  async login(email: string, password: string): Promise<UserEntity | undefined> {
    const res = await this.httpClient.post<AuthResponse>("/login", {
      email,
      password,
    });

    if (res.status !== 200 || !res.data) {
      return undefined;
    }

    await this._storeAuthData(res.data);
    return UserEntity.fromApi(res.data.user);
  }

  async logout(): Promise<void> {
    try {
      await this.httpClient.post("/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    await this._clearAuthData();
  }

  async getCurrentUser(): Promise<UserEntity | undefined> {
    const isAuthenticated = await this.isAuthenticated();
    if (!isAuthenticated) return undefined;

    try {
      const res = await this.httpClient.get<ApiUserResponse>(`/user`);

      if (res.status !== 200 || !res.data) {
        return undefined;
      }

      await this.storage.set(STORAGE_KEYS.USER_LOCALE, res.data.locale);
      return UserEntity.fromApi(res.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return undefined;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return false;

    return !JwtUtils.isExpired(token);
  }

  async getCurrentUserId(): Promise<string | undefined> {
    const token = await this.storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token || JwtUtils.isExpired(token)) return undefined;

    return JwtUtils.getUuid(token);
  }

  async getCurrentUserRoles(): Promise<string[]> {
    const token = await this.storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token || JwtUtils.isExpired(token)) return [];

    return JwtUtils.getRoles(token);
  }

  async getAccessToken(): Promise<string | undefined> {
    return await this.storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  async refreshTokens(): Promise<boolean> {
    const refreshToken = await this.storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) return false;

    try {
      const res = await this.httpClient.post<AuthResponse>("/refresh", {
        refresh_token: refreshToken,
      });

      if (res.status !== 200 || !res.data) {
        await this._clearAuthData();
        return false;
      }

      await this._storeAuthData(res.data);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await this._clearAuthData();
      return false;
    }
  }

  private async _storeAuthData(data: AuthResponse): Promise<void> {
    await Promise.all([
      this.storage.set(STORAGE_KEYS.ACCESS_TOKEN, data.access_token),
      this.storage.set(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token),
      this.storage.set(STORAGE_KEYS.USER_LOCALE, data.user.locale),
    ]);
  }

  private async _clearAuthData(): Promise<void> {
    await Promise.all([
      this.storage.remove(STORAGE_KEYS.ACCESS_TOKEN),
      this.storage.remove(STORAGE_KEYS.REFRESH_TOKEN),
      //this.storage.remove(STORAGE_KEYS.USER_LOCALE),
    ]);
  }
}
