import { useAppContainer } from "../contexts/app-container.context";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { HttpClient } from "../../../application/ports/http/http-client.interface";
import { StorageService } from "../../../application/ports/services/storage-service.interface";
import { Router } from "../../../application/ports/routing/router.interface";
import { AuthService } from "../../../application/ports/services/auth-service.interface";
import { NotificationService } from "../../../application/ports/services/notification-service.interface";
import { EmailService } from "../../../application/ports/services/email-service.interface";
import { LoggerService } from "../../../application/ports/services/logger-service.interface";
import { I18nService } from "../../../application/ports/i18n/i18n-service.interface";

export function useHttpClient(): HttpClient {
    const container = useAppContainer();
    return container.resolve<HttpClient>(DI_TOKENS.HttpClient);
}

export function useStorage(): StorageService {
    const container = useAppContainer();
    return container.resolve<StorageService>(DI_TOKENS.StorageService);
}

export function useRouter(): Router {
    const container = useAppContainer();
    return container.resolve<Router>(DI_TOKENS.Router);
}

export function useAuthService(): AuthService {
    const container = useAppContainer();
    return container.resolve<AuthService>(DI_TOKENS.AuthService);
}

export function useNotificationService(): NotificationService {
    const container = useAppContainer();
    return container.resolve<NotificationService>(DI_TOKENS.NotificationService);
}

export function useEmailService(): EmailService {
    const container = useAppContainer();
    return container.resolve<EmailService>(DI_TOKENS.EmailService);
}

export function useLoggerService(): LoggerService {
    const container = useAppContainer();
    return container.resolve<LoggerService>(DI_TOKENS.LoggerService);
}

export function useI18nService(): I18nService {
    const container = useAppContainer();
    return container.resolve<I18nService>(DI_TOKENS.I18nService);
}
