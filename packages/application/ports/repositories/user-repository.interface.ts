import { UserEntity } from "../../../domain/entities/user.entity";
import { Email } from "../../../domain/values/email.value";
import { BaseRepository } from "./base-repository.interface";

export interface UserRepositoryInterface extends BaseRepository<UserEntity> {
  findByEmail(email: Email): Promise<UserEntity | undefined>;
}
