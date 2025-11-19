import {AppConfigBuilder} from "@kennelo/infrastructure/di/config-builder";
import {DI_TOKENS} from "@kennelo/infrastructure/di/tokens";
import {FetchClient} from "@kennelo/infrastructure/adapters/http/fetch-client";
import {LocalStorageService} from "@kennelo/infrastructure/adapters/services/storage/local-storage.service";
import {ApiAuthService} from "@kennelo/infrastructure/adapters/services/api-auth.service";
import {AuthInterceptor} from "@kennelo/infrastructure/adapters/http/auth.interceptor";
import {AuthGuard} from "@kennelo/infrastructure/adapters/services/routing/guards/auth.guard";
import {RoleGuard} from "@kennelo/infrastructure/adapters/services/routing/guards/role.guard";
import {SimpleI18nService} from "@kennelo/infrastructure/adapters/i18n/simple-i18n.service";
import {QueryParamDetector} from "@kennelo/infrastructure/adapters/i18n/detectors/query-param.detector";
import {StorageDetector} from "@kennelo/infrastructure/adapters/i18n/detectors/storage.detector";
import {BrowserDetector} from "@kennelo/infrastructure/adapters/i18n/detectors/browser.detector";
import {NextJsLinkAdapter} from "@/adapters/nextjs-link.adapter";
import {getDictionary} from "@/dictionaries";
import { Locale as LocaleValue } from "@kennelo/domain/values/locale.value";
import { Locale } from "./app.config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api`;

export const getAppConfigs = () => {
    const httpClient = new FetchClient(API_URL);
    const storage = new LocalStorageService();

    return {
        httpClient: httpClient,
        storage: storage,
        authService: new ApiAuthService(httpClient, storage),
    };
};

export function createWebAppContainer(lang: string = "en") {
    const appConfigs = getAppConfigs();

    const httpClient = appConfigs.httpClient;
    const storage = appConfigs.storage;
    const authService = appConfigs.authService;

    return new AppConfigBuilder()
        .withHttpClient(httpClient)
        .withInterceptors([new AuthInterceptor(storage, API_URL)])

        .withService(DI_TOKENS.AuthService, authService)
        .withService(DI_TOKENS.StorageService, storage)
        .withService(DI_TOKENS.LinkComponent, NextJsLinkAdapter)

        .withService(
            DI_TOKENS.I18nService,
            new SimpleI18nService(
                [
                    new QueryParamDetector(1, "lang"),
                    new StorageDetector(2, storage, "user_locale"),
                    new BrowserDetector(3),
                ],
                storage,
                (locale: string) => getDictionary(locale as Locale),
                LocaleValue.create(lang)
            )
        )

        .withGuards([
            new AuthGuard(
                authService,
                ["/s/admin", "/s/app", "/s/my"],
                "/s/account/login"
            ),
            new RoleGuard(
                authService,
                [
                    {path: "/s/admin", roles: ["admin"]},
                    {path: "/s/app", roles: ["admin", "manager"]},
                    {path: "/s/my", roles: ["admin", "manager", "user"]},
                ],
                "/forbidden"
            ),
        ])
        .build();
}
