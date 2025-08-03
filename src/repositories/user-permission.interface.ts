import UserPermissionModel from "../models/user-permission.model";
import {
  CountArgs,
  CreateArgs,
  DeleteArgs,
  FindAllArgs,
  FindAllUserIdArgs,
  FindByIdArgs
} from "../shared/types/repository.type";

export default interface UserPermissionRepository {
  findAll: (args: FindAllArgs) => Promise<UserPermissionModel[]>;

  findAllByUserId: (args: FindAllUserIdArgs) => Promise<UserPermissionModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UserPermissionModel | null>;

  create: (args: CreateArgs<UserPermissionModel>) => Promise<UserPermissionModel>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;
};