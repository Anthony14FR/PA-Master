import type { LocaleDetector } from "@kennelo/application/ports/i18n/locale-detector.interface";

export class QueryParamDetector implements LocaleDetector {
  constructor(readonly priority = 10, private paramName: string = "lang") {}

  async detect(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    return params.get(this.paramName);
  }
}
