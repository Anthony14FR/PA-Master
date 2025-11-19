import type { LocaleDetector } from "@kennelo/application/ports/i18n/locale-detector.interface";

export class HeaderDetector implements LocaleDetector {
  readonly priority = 30;
  
  constructor(private headers?: Headers) {}
  
  async detect(): Promise<string | null> {
    if (!this.headers) return null;
    
    const acceptLang = this.headers.get("accept-language");
    if (!acceptLang) return null;
    
    const lang = acceptLang.split(",")[0]?.split("-")[0];
    return lang || null;
  }
}
