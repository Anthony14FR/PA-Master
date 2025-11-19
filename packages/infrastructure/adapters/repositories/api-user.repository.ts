import { HttpClient } from "../../../application/ports/http/http-client.interface";
import { UserEntity } from "../../../domain/entities/user.entity";
import { Email } from "../../../domain/values/email.value";
import { BaseApiRepository } from "./base-api.repository";
import { UserRepositoryInterface } from "../../../application/ports/repositories/user-repository.interface";

interface UserDto {
  uuid: string;
  email: Email;
  name: string;
  roles?: string[];
}

export class UserRepository extends BaseApiRepository<UserEntity, UserDto> implements UserRepositoryInterface {
  constructor(private readonly _api: HttpClient) {
    super(_api, "/users");
  }

  protected toDomain(dto: UserDto): UserEntity {
    return UserEntity.from(dto);
  }

  protected toDto(entity: UserEntity): UserDto {
    return {
      uuid: entity.uuid,
      email: entity.email,
      name: entity.name,
      roles: entity.roles,
    };
  }

  public async findByEmail(email: Email): Promise<UserEntity | undefined> {
    const res = await this._api.get<UserEntity[]>(
      `${this.basePath}?email=${email.value}`
    );
    return res.data?.[0];
  }

  public async findFromFilter(filter: object): Promise<UserEntity[] | []> {
    const res = await this._api.get<UserEntity[]>(`${this.basePath}`, {
      params: filter,
    });
    return res.data || [];
  }
}
