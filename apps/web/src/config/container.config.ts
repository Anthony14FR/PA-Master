import {AppConfigBuilder} from "@kennelo/infrastructure/di/config-builder";
import {DI_TOKENS} from "@kennelo/infrastructure/di/tokens";
import {FetchClient} from "@kennelo/infrastructure/adapters/http/fetch-client";
import {LocalStorageService} from "@kennelo/infrastructure/adapters/services/storage/local-storage.service";
import {ApiAuthService} from "@kennelo/infrastructure/adapters/services/api-auth.service";
import {AuthInterceptor} from "@kennelo/infrastructure/adapters/http/auth.interceptor";
import {AuthGuard} from "@kennelo/infrastructure/adapters/services/routing/guards/auth.guard";
import {RoleGuard} from "@kennelo/infrastructure/adapters/services/routing/guards/role.guard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function createWebAppContainer() {
    const apiUrl = `${API_BASE_URL}/api`;
    const httpClient = new FetchClient(apiUrl);
    const storage = new LocalStorageService();
    const authService = new ApiAuthService(httpClient, storage);

    return new AppConfigBuilder()
        .withHttpClient(httpClient)
        .withInterceptors([new AuthInterceptor(storage, apiUrl)])

        .withService(DI_TOKENS.AuthService, authService)
        .withService(DI_TOKENS.StorageService, storage)

        .withGuards([
            new AuthGuard(
                authService,
                ["/s/admin", "/s/app", "/s/my"],
                "/s/account/login"
            ),
            new RoleGuard(
                authService,
                [
                    { path: "/s/admin", roles: ["admin"]},
                    { path: "/s/app", roles: ["admin", "manager"]},
                    { path: "/s/my", roles: ["admin", "manager", "user"]},
                ],
                "/forbidden"
            ),
        ])
        .build();
}
