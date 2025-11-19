import { Email } from "../values/email.value";

export class UserEntity {
  private constructor(
    public uuid: string,
    public email: Email,
    public name: string,
    public createdAt?: Date,
    public passwordHash?: string,
    public roles: string[] = []
  ) {}

  public static from({
    uuid,
    email,
    name,
    createdAt,
    passwordHash,
    roles = [],
  }: {
    uuid: string;
    email: Email;
    name: string;
    createdAt?: Date;
    passwordHash?: string;
    roles?: string[];
  }) {
    return new UserEntity(uuid, email, name, createdAt, passwordHash, roles);
  }
}
