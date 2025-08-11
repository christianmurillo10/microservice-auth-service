import { Prisma } from "../prisma/client";
import RolePermissionModel from "../models/role-permission.model";
import {
  CountArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  FindAllArgs,
  FindAllRoleIdArgs,
  FindByIdArgs,
  FindByRoleIdAndPermissionIdArgs
} from "../shared/types/repository.type";

export default interface RolePermissionRepository {
  findAll: (args: FindAllArgs) => Promise<RolePermissionModel[]>;

  findAllByRoleId: (args: FindAllRoleIdArgs) => Promise<RolePermissionModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RolePermissionModel | null>;

  findByRoleIdAndPermissionId: (args: FindByRoleIdAndPermissionIdArgs) => Promise<RolePermissionModel | null>;

  create: (args: CreateArgs<RolePermissionModel>) => Promise<RolePermissionModel>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;

  syncCreateMany: (args: CreateManyArgs<RolePermissionModel>) => Prisma.PrismaPromise<Prisma.BatchPayload>;

  syncDeleteMany: (args: DeleteManyArgs<string>) => Prisma.PrismaPromise<Prisma.BatchPayload>;
};