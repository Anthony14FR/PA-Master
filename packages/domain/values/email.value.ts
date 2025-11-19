import { EmailInvalidError } from "../errors/email-invalid.error";

export class Email {
  private constructor(public readonly value: string) {}

  public static create(email: string) {
    const emailRegex = /.+@.+\..+/;

    if (!emailRegex.test(email)) {
      return new EmailInvalidError(email);
    }

    return new Email(email);
  }

  public is(email: Email) {
    return this.value === email.value;
  }
}
