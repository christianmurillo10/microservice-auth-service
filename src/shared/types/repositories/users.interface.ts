import Users from "../../../models/users.model";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../repository.type";

export default interface UsersRepositoryInterface {
  findById: (args: FindByIdArgs<string>) => Promise<Users | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<Users | null>;

  create: (args: CreateArgs<Users>) => Promise<Users>;

  update: (args: UpdateArgs<string, Users>) => Promise<Users>;
};