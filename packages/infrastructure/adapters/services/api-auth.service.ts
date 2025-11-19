import { StorageService } from "../../../application/ports/services/storage-service.interface";
import { AuthService } from "../../../application/ports/services/auth-service.interface";
import { HttpClient } from "../../../application/ports/http/http-client.interface";
import { UserEntity } from "../../../domain/entities/user.entity";
import { JwtUtils } from "../../utils/jwt.utils";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export class ApiAuthService implements AuthService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly storage: StorageService
  ) {}

  async register(payload: {
    uuid: string;
    email: string;
    roles?: string[];
    password?: string;
  }): Promise<string | undefined> {
    const res = await this.httpClient.post<AuthResponse>(
      "/auth/register",
      payload
    );

    if (res.status !== 201 || !res.data) {
      return undefined;
    }

    const { accessToken, refreshToken } = res.data;

    await this.storage.set("access_token", accessToken);
    await this.storage.set("refresh_token", refreshToken);

    return accessToken;
  }

  async login(email: string, password: string): Promise<string | undefined> {
    const res = await this.httpClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    if (res.status !== 200 || !res.data) {
      return undefined;
    }

    const { accessToken, refreshToken } = res.data;

    await this.storage.set("access_token", accessToken);
    await this.storage.set("refresh_token", refreshToken);

    return accessToken;
  }

  async logout(): Promise<void> {
    try {
      await this.httpClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    await this.storage.remove("access_token");
    await this.storage.remove("refresh_token");
  }

  async getCurrentUser(): Promise<UserEntity | undefined> {
    const uuid = await this.getCurrentUserId();
    if (!uuid) return undefined;

    try {
      const res = await this.httpClient.get<UserEntity>(`/users/${uuid}`);

      if (res.status !== 200 || !res.data) {
        return undefined;
      }

      return res.data;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      return undefined;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.get<string>("access_token");
    if (!token) return false;

    return !JwtUtils.isExpired(token);
  }

  async getCurrentUserId(): Promise<string | undefined> {
    const token = await this.storage.get<string>("access_token");
    if (!token || JwtUtils.isExpired(token)) return undefined;

    return JwtUtils.getUuid(token);
  }

  async getCurrentUserRoles(): Promise<string[]> {
    const token = await this.storage.get<string>("access_token");
    if (!token || JwtUtils.isExpired(token)) return [];

    return JwtUtils.getRoles(token);
  }
}
