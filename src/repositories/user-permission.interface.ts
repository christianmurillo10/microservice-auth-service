import { Prisma } from "../prisma/client";
import UserPermissionEntity from "../entities/user-permission.entity";
import {
  CountArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  FindAllArgs,
  FindAllByUserIdArgs,
  FindAllRoleOrUserBasedPermissionsArgs,
  FindByIdArgs,
  FindByUserIdAndPermissionIdArgs
} from "../shared/types/repository.type";

export default interface UserPermissionRepository {
  findAll: (args: FindAllArgs) => Promise<UserPermissionEntity[]>;

  findAllByUserId: (args: FindAllByUserIdArgs) => Promise<UserPermissionEntity[]>;

  findAllUserBasedPermissions: (args: FindAllRoleOrUserBasedPermissionsArgs) => Promise<UserPermissionEntity[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UserPermissionEntity | null>;

  findByUserIdAndPermissionId: (args: FindByUserIdAndPermissionIdArgs) => Promise<UserPermissionEntity | null>;

  create: (args: CreateArgs<UserPermissionEntity>) => Promise<UserPermissionEntity>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;

  syncCreateMany: (args: CreateManyArgs<UserPermissionEntity>) => Prisma.PrismaPromise<Prisma.BatchPayload>;

  syncDeleteMany: (args: DeleteManyArgs<string>) => Prisma.PrismaPromise<Prisma.BatchPayload>;
};