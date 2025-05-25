import UserRequestHeader from "../../../models/users.model";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../repository.type";

export default interface UsersRepository {
  findById: (args: FindByIdArgs<string>) => Promise<UserRequestHeader | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<UserRequestHeader | null>;

  create: (args: CreateArgs<UserRequestHeader>) => Promise<UserRequestHeader>;

  update: (args: UpdateArgs<string, UserRequestHeader>) => Promise<UserRequestHeader>;
};