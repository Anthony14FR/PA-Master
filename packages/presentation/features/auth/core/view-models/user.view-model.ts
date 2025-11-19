import { UserEntity } from "@kennelo/domain/entities/user.entity";

export class UserViewModel {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly fullName: string,
    public readonly roles: string[],
    public readonly locale: string,
    public readonly phone?: string,
    public readonly isIdVerified: boolean = false,
    public readonly emailVerifiedAt?: Date
  ) {}

  public get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  public hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  public isAdmin(): boolean {
    return this.hasRole("admin");
  }

  public isManager(): boolean {
    return this.hasRole("manager") || this.isAdmin();
  }

  public static fromEntity(entity: UserEntity): UserViewModel {
    return new UserViewModel(
      entity.id,
      entity.email.value,
      entity.firstName,
      entity.lastName,
      entity.fullName,
      entity.roles,
      entity.locale,
      entity.phone,
      entity.isIdVerified,
      entity.emailVerifiedAt
    );
  }
}