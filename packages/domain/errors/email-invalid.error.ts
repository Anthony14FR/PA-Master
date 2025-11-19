export class EmailInvalidError extends Error {
  public constructor(public readonly email: string) {
    super();
    this.name = "EmailInvalidError";
  }
}
