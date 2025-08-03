import RolePermissionModel from "../models/role-permission.model";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindAllRoleIdArgs,
  FindByIdArgs
} from "../shared/types/repository.type";

export default interface RolePermissionRepository {
  findAll: (args: FindAllArgs) => Promise<RolePermissionModel[]>;

  findAllByRoleId: (args: FindAllRoleIdArgs) => Promise<RolePermissionModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RolePermissionModel | null>;

  create: (args: CreateArgs<RolePermissionModel>) => Promise<RolePermissionModel>;

  count: (args?: CountArgs) => Promise<number>;
};