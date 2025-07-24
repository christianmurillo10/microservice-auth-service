import UserRequestHeader from "../models/user.model";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../shared/types/repository.type";

export default interface UserRepository {
  findById: (args: FindByIdArgs<string>) => Promise<UserRequestHeader | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<UserRequestHeader | null>;

  create: (args: CreateArgs<UserRequestHeader>) => Promise<UserRequestHeader>;

  update: (args: UpdateArgs<string, UserRequestHeader>) => Promise<UserRequestHeader>;
};