export class Locale {
  //private static readonly SUPPORTED = ['en', 'fr', 'de', 'it'] as const;
  
  private constructor(public readonly code: string) {}
  
  static create(code: string): Locale /*| Error*/ {
    /*
    if (!this.SUPPORTED.includes(code as any)) {
      return new Error(`Unsupported locale: ${code}`);
    }
    */
    return new Locale(code);
  }
  
  static default(): Locale {
    return new Locale('en');
  }
  
  /*
  static supported(): readonly string[] {
    return this.SUPPORTED;
  }
  */
  
  equals(other: Locale): boolean {
    return this.code === other.code;
  }
  
  toString(): string {
    return this.code;
  }
}
