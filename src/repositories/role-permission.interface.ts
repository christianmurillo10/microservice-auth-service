import { Prisma } from "../prisma/client";
import RolePermissionEntity from "../entities/role-permission.entity";
import {
  CountArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  FindAllArgs,
  FindAllByRoleIdArgs,
  FindByIdArgs,
  FindByRoleIdAndPermissionIdArgs
} from "../shared/types/repository.type";
import { CreateRolePermissionDTO } from "../dtos/role-permission.dto";

export default interface RolePermissionRepository {
  findAll: (args: FindAllArgs) => Promise<RolePermissionEntity[]>;

  findAllByRoleId: (args: FindAllByRoleIdArgs) => Promise<RolePermissionEntity[]>;

  findById: (args: FindByIdArgs<string>) => Promise<RolePermissionEntity | null>;

  findByRoleIdAndPermissionId: (args: FindByRoleIdAndPermissionIdArgs) => Promise<RolePermissionEntity | null>;

  create: (args: CreateArgs<CreateRolePermissionDTO>) => Promise<RolePermissionEntity>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;

  syncCreateMany: (args: CreateManyArgs<CreateRolePermissionDTO>) => Prisma.PrismaPromise<Prisma.BatchPayload>;

  syncDeleteMany: (args: DeleteManyArgs<string>) => Prisma.PrismaPromise<Prisma.BatchPayload>;
};