import Users from "../../../models/users.model";
import {
  TFindByIdArgs,
  TFindByUsernameOrEmailArgs,
  TCreateArgs,
  TUpdateArgs
} from "../repository.type";

export default interface IUsersRepository {
  findById: (args: TFindByIdArgs<string>) => Promise<Users | null>;

  findByUsernameOrEmail: (args: TFindByUsernameOrEmailArgs) => Promise<Users | null>;

  create: (args: TCreateArgs<Users>) => Promise<Users>;

  update: (args: TUpdateArgs<string, Users>) => Promise<Users>;
};