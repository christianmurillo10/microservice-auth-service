import UserEntity from "../entities/user.entity";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../shared/types/repository.type";

export default interface UserRepository {
  findById: (args: FindByIdArgs<string>) => Promise<UserEntity | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<UserEntity | null>;

  create: (args: CreateArgs<UserEntity>) => Promise<UserEntity>;

  update: (args: UpdateArgs<string, UserEntity>) => Promise<UserEntity>;
};