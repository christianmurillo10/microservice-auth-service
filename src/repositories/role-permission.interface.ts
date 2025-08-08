import RolePermissionModel from "../models/role-permission.model";
import {
  CountArgs,
  CreateArgs,
  DeleteArgs,
  FindAllArgs,
  FindAllRoleIdArgs,
  FindByIdArgs,
  SyncArgs
} from "../shared/types/repository.type";

export default interface RolePermissionRepository {
  findAll: (args: FindAllArgs) => Promise<RolePermissionModel[]>;

  findAllByRoleId: (args: FindAllRoleIdArgs) => Promise<RolePermissionModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RolePermissionModel | null>;

  create: (args: CreateArgs<RolePermissionModel>) => Promise<RolePermissionModel>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;

  sync: (args: SyncArgs<RolePermissionModel>) => Promise<void>;
};