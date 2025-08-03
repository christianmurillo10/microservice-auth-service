import UserRoleModel from "../models/user-role.model";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindAllUserIdArgs,
  FindByIdArgs
} from "../shared/types/repository.type";

export default interface UserRoleRepository {
  findAll: (args: FindAllArgs) => Promise<UserRoleModel[]>;

  findAllByUserId: (args: FindAllUserIdArgs) => Promise<UserRoleModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UserRoleModel | null>;

  create: (args: CreateArgs<UserRoleModel>) => Promise<UserRoleModel>;

  count: (args?: CountArgs) => Promise<number>;
};