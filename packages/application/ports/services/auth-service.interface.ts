import { UserEntity } from "../../../domain/entities/user.entity";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  locale?: string;
}

export interface AuthService {
  register(payload: RegisterPayload): Promise<UserEntity | undefined>;
  login(email: string, password: string): Promise<UserEntity | undefined>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserEntity | undefined>;
  getCurrentUserRoles(): Promise<string[]>;
  getCurrentUserId(): Promise<string | undefined>;
  isAuthenticated(): Promise<boolean>;
  getAccessToken(): Promise<string | undefined>;
  refreshTokens(): Promise<boolean>;
}
