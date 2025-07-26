import UserRoleModel from "../models/user-role.model";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindOneArgs,
  UpdateArgs
} from "../shared/types/repository.type";

export default interface UserRoleRepository {
  findAll: (args: FindAllArgs) => Promise<UserRoleModel[]>;

  findOne: (args: FindOneArgs) => Promise<UserRoleModel | null>;

  create: (args: CreateArgs<UserRoleModel>) => Promise<UserRoleModel>;

  update: (args: UpdateArgs<string, UserRoleModel>) => Promise<UserRoleModel>;

  count: (args?: CountArgs) => Promise<number>;
};