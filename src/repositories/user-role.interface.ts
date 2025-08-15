import { Prisma } from "../prisma/client";
import UserRoleModel from "../models/user-role.model";
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
  FindByUserIdAndRoleIdArgs
} from "../shared/types/repository.type";

export default interface UserRoleRepository {
  findAll: (args: FindAllArgs) => Promise<UserRoleModel[]>;

  findAllByUserId: (args: FindAllByUserIdArgs) => Promise<UserRoleModel[]>;

  findAllUserRoleBasedPermissions: (args: FindAllRoleOrUserBasedPermissionsArgs) => Promise<UserRoleModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UserRoleModel | null>;

  findByUserIdAndRoleId: (args: FindByUserIdAndRoleIdArgs) => Promise<UserRoleModel | null>;

  create: (args: CreateArgs<UserRoleModel>) => Promise<UserRoleModel>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;

  syncCreateMany: (args: CreateManyArgs<UserRoleModel>) => Prisma.PrismaPromise<Prisma.BatchPayload>;

  syncDeleteMany: (args: DeleteManyArgs<string>) => Prisma.PrismaPromise<Prisma.BatchPayload>;
};