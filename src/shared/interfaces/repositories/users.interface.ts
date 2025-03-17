import Users from "../../entities/users.entity";
import { FindByUsernameOrEmailArgs, UpdateArgs } from "../../types/common.type";

export default interface UsersRepositoryInterface {
  findByUsernameOrEmail: (args: FindByUsernameOrEmailArgs) => Promise<Users | null>;

  update: (args: UpdateArgs<string, Users>) => Promise<Users>;
};