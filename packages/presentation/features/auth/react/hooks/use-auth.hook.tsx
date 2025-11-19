import { useState, useCallback } from "react";
import { useAuthService } from "../../../../shared/hooks/use-services";

export function useAuth() {
    const authService = useAuthService();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        setError(undefined);

        try {
            const token = await authService.login(email, password);
            return token;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [authService]);

    const register = useCallback(async (payload: {
        uuid: string;
        email: string;
        roles?: string[];
        password?: string;
    }) => {
        setIsLoading(true);
        setError(undefined);

        try {
            const token = await authService.register(payload);
            return token;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [authService]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(undefined);

        try {
            await authService.logout();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Logout failed");
        } finally {
            setIsLoading(false);
        }
    }, [authService]);

    const isAuthenticated = useCallback(async () => {
        return await authService.isAuthenticated();
    }, [authService]);

    const getCurrentUser = useCallback(async () => {
        return await authService.getCurrentUser();
    }, [authService]);

    return {
        login,
        register,
        logout,
        isAuthenticated,
        getCurrentUser,
        isLoading,
        error,
    };
}
