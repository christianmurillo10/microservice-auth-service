import PermissionModel from "../models/permission.model";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindByIdArgs,
  FindByOrganizationIdAndNameArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  UpdateArgs
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";

export default interface PermissionRepository {
  findAll: (args: FindAllArgs) => Promise<PermissionModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<PermissionModel | null>;

  findByOrganizationIdAndName: (args: FindByOrganizationIdAndNameArgs) => Promise<PermissionModel | null>;

  create: (args: CreateArgs<PermissionModel>) => Promise<PermissionModel>;

  update: (args: UpdateArgs<string, PermissionModel>) => Promise<PermissionModel>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<PermissionModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};