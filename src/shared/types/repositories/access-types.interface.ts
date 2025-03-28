import AccessTypes from "../../entities/access-types.entity";
import {
  CountArgs,
  CreateArgs,
  FindAllArgs,
  FindByIdArgs,
  FindByNameArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  UpdateArgs
} from "../repository.type";
import { GenericObject } from "../common.type";

export default interface AccessTypesRepositoryInterface {
  findAll: (args: FindAllArgs) => Promise<AccessTypes[]>;

  findById: (args: FindByIdArgs<string>) => Promise<AccessTypes | null>;

  findByName: (args: FindByNameArgs) => Promise<AccessTypes | null>;

  create: (args: CreateArgs<AccessTypes>) => Promise<AccessTypes>;

  update: (args: UpdateArgs<string, AccessTypes>) => Promise<AccessTypes>;

  softDelete: (args: SoftDeleteArgs<string>) => Promise<AccessTypes>;

  softDeleteMany: (args: SoftDeleteManyArgs<string>) => Promise<GenericObject>;

  count: (args?: CountArgs) => Promise<number>;
};