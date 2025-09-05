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
import { CreateRoleDTO, UpdateRoleDTO } from "../dtos/role.dto";

export default interface RoleRepository {
  findAll: (args: FindAllArgs) => Promise<RoleEntity[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RoleEntity | null>;

  findByOrganizationIdAndName: (args: FindByOrganizationIdAndNameArgs) => Promise<RoleEntity | null>;

  create: (args: CreateArgs<CreateRoleDTO>) => Promise<RoleEntity>;

  update: (args: UpdateArgs<string, UpdateRoleDTO>) => Promise<RoleEntity>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<RoleEntity>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};