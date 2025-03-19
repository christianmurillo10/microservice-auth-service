import Users from "../../entities/users.entity";
import { FindByIdArgs, FindByUsernameOrEmailArgs, UpdateArgs } from "../common.type";

export default interface UsersRepositoryInterface {
  findById: (args: FindByIdArgs<string>) => Promise<Users | null>;

  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<Users | null>;

  update: (args: UpdateArgs<string, Users>) => Promise<Users>;
};