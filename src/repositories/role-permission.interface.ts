import RolePermissionModel from "../models/role-permission.model";
import {
  CountArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  FindAllArgs,
  FindAllRoleIdArgs,
  FindByIdArgs
} from "../shared/types/repository.type";

export default interface RolePermissionRepository {
  findAll: (args: FindAllArgs) => Promise<RolePermissionModel[]>;

  findAllByRoleId: (args: FindAllRoleIdArgs) => Promise<RolePermissionModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RolePermissionModel | null>;

  create: (args: CreateArgs<RolePermissionModel>) => Promise<RolePermissionModel>;

  syncCreateMany: (args: CreateManyArgs<RolePermissionModel>) => void;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  syncDeleteMany: (args: DeleteManyArgs<string>) => void;

  count: (args?: CountArgs) => Promise<number>;
};