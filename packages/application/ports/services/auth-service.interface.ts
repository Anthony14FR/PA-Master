import { UserEntity } from "../../../domain/entities/user.entity";

export interface AuthService {
  register(payload: {
    uuid: string;
    email: string;
    roles?: string[];
    password?: string;
  }): Promise<string | undefined>;
  login(email: string, password: string): Promise<string | undefined>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserEntity | undefined>;
  getCurrentUserRoles(): Promise<string[] | undefined>;
  isAuthenticated(): Promise<boolean>;
}
