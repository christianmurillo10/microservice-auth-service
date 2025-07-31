import RoleModel from "../models/role.model";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindByIdArgs,
  FindByBusinessIdAndNameArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  UpdateArgs
} from "../shared/types/repository.type";
import { GenericObject } from "../shared/types/common.type";

export default interface RoleRepository {
  findAll: (args: FindAllArgs) => Promise<RoleModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RoleModel | null>;

  findByBusinessIdAndName: (args: FindByBusinessIdAndNameArgs) => Promise<RoleModel | null>;

  create: (args: CreateArgs<RoleModel>) => Promise<RoleModel>;

  update: (args: UpdateArgs<string, RoleModel>) => Promise<RoleModel>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<RoleModel>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};