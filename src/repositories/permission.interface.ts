import PermissionEntity from "../entities/permission.entity";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindByIdArgs,
  FindByOrganizationIdAndActionAndResourceArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  UpdateArgs
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";

export default interface PermissionRepository {
  findAll: (args: FindAllArgs) => Promise<PermissionEntity[]>;

  findById: (args: FindByIdArgs<string>) => Promise<PermissionEntity | null>;

  findByOrganizationIdAndActionAndResource: (args: FindByOrganizationIdAndActionAndResourceArgs) => Promise<PermissionEntity | null>;

  create: (args: CreateArgs<PermissionEntity>) => Promise<PermissionEntity>;

  update: (args: UpdateArgs<string, PermissionEntity>) => Promise<PermissionEntity>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<PermissionEntity>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};