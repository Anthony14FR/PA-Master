import type { LocaleDetector } from "@kennelo/application/ports/i18n/locale-detector.interface";
import type { StorageService } from "@kennelo/application/ports/services/storage-service.interface";

export class StorageDetector implements LocaleDetector {
    constructor(
        readonly priority = 20,
        private storage: StorageService,
        private key: string = "locale"
    ) {}

    async detect(): Promise<string | null> {
        const value = await this.storage.get<string>(this.key);
        return value || null;
    }
}
