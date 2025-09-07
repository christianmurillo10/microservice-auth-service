import RoleEntity from "../entities/role.entity";
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

export default interface RoleRepository {
  findAll: (args: FindAllArgs) => Promise<RoleEntity[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RoleEntity | null>;

  findByOrganizationIdAndName: (args: FindByOrganizationIdAndNameArgs) => Promise<RoleEntity | null>;

  create: (args: CreateArgs<RoleEntity>) => Promise<RoleEntity>;

  update: (args: UpdateArgs<string, RoleEntity>) => Promise<RoleEntity>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<RoleEntity>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};