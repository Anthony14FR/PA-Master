"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useAuthService } from "../../../../shared/hooks/use-services";
import { useAsyncState } from "../../../../shared/hooks/use-async-state";
import { UserViewModel } from "../../core/view-models/user.view-model";
import type { RegisterPayload } from "@kennelo/application/ports/services/auth-service.interface";

export interface AuthState {
  user: UserViewModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | undefined;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<UserViewModel | null>;
  register: (payload: RegisterPayload) => Promise<UserViewModel | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authService = useAuthService();
  const { execute, isLoading, error, reset } = useAsyncState();

  const [user, setUser] = useState<UserViewModel | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          const userEntity = await authService.getCurrentUser();
          if (userEntity) {
            setUser(UserViewModel.fromEntity(userEntity));
          }
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [authService]);

  const login = useCallback(
    async (email: string, password: string): Promise<UserViewModel | null> => {
      const userEntity = await execute(() => authService.login(email, password));
      if (!userEntity) return null;

      const userViewModel = UserViewModel.fromEntity(userEntity);
      setUser(userViewModel);
      return userViewModel;
    },
    [authService, execute]
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<UserViewModel | null> => {
      const userEntity = await execute(() => authService.register(payload));
      if (!userEntity) return null;

      const userViewModel = UserViewModel.fromEntity(userEntity);
      setUser(userViewModel);
      return userViewModel;
    },
    [authService, execute]
  );

  const logout = useCallback(async (): Promise<void> => {
    await execute(() => authService.logout());
    setUser(null);
  }, [authService, execute]);

  const refreshUser = useCallback(async (): Promise<void> => {
    const userEntity = await execute(() => authService.getCurrentUser());
    if (userEntity) {
      setUser(UserViewModel.fromEntity(userEntity));
    } else {
      setUser(null);
    }
  }, [authService, execute]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      isInitialized,
      error,
      login,
      register,
      logout,
      refreshUser,
      clearError: reset,
    }),
    [user, isLoading, isInitialized, error, login, register, logout, refreshUser, reset]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}