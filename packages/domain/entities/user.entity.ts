import { Email } from "../values/email.value";

export class UserEntity {
  private constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly roles: string[] = [],
    public readonly locale: string = "en",
    public readonly phone?: string,
    public readonly isIdVerified: boolean = false,
    public readonly emailVerifiedAt?: Date
  ) {}

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  public hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  public isAdmin(): boolean {
    return this.hasRole("admin");
  }

  public static from(data: {
    id: string;
    email: Email;
    firstName: string;
    lastName: string;
    roles?: string[];
    locale?: string;
    phone?: string;
    isIdVerified?: boolean;
    emailVerifiedAt?: Date;
  }): UserEntity {
    return new UserEntity(
      data.id,
      data.email,
      data.firstName,
      data.lastName,
      data.roles ?? [],
      data.locale ?? "en",
      data.phone,
      data.isIdVerified ?? false,
      data.emailVerifiedAt
    );
  }

  /**
   * Create UserEntity from API response (snake_case)
   */
  public static fromApi(data: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    roles?: string[];
    locale?: string;
    phone?: string | null;
    is_id_verified?: boolean;
    email_verified_at?: string | null;
  }): UserEntity {
    const emailValue = Email.create(data.email);
    if (emailValue instanceof Error) {
      throw emailValue;
    }

    return new UserEntity(
      data.id,
      emailValue,
      data.first_name,
      data.last_name,
      data.roles ?? [],
      data.locale ?? "en",
      data.phone ?? undefined,
      data.is_id_verified ?? false,
      data.email_verified_at ? new Date(data.email_verified_at) : undefined
    );
  }
}
