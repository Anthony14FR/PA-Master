export class PasswordTooShortError extends Error {
  public constructor(public readonly length: number) {
    super();
    this.name = "PasswordTooShortError";
  }
}
