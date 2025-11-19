export interface LocaleDetector {
  detect(): Promise<string | null>;
  readonly priority: number;
}
