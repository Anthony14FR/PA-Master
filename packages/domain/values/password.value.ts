import crypto from "crypto";
import { PasswordTooShortError } from "../errors/password-too-short.error";

export class Password {
  private constructor(public readonly value: string) {}

  public static create(password: string) {
    if (password.length < 6) {
      return new PasswordTooShortError(password.length);
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const derived = crypto.scryptSync(password, salt, 64).toString("hex");

    return new Password(`${salt}:${derived}`);
  }

  public static verify(plain: string, stored: string) {
    const [salt, key] = stored.split(":");

    const derived = crypto.scryptSync(plain, salt, 64).toString("hex");

    return derived === key;
  }
}
