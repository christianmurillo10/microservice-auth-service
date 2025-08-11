import { Prisma } from "../prisma/client";
import UserPermissionModel from "../models/user-permission.model";
import {
  CountArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  FindAllArgs,
  FindAllUserIdArgs,
  FindByIdArgs,
  FindByUserIdAndPermissionIdArgs
} from "../shared/types/repository.type";

export default interface UserPermissionRepository {
  findAll: (args: FindAllArgs) => Promise<UserPermissionModel[]>;

  findAllByUserId: (args: FindAllUserIdArgs) => Promise<UserPermissionModel[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UserPermissionModel | null>;

  findByUserIdAndPermissionId: (args: FindByUserIdAndPermissionIdArgs) => Promise<UserPermissionModel | null>;

  create: (args: CreateArgs<UserPermissionModel>) => Promise<UserPermissionModel>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;

  syncCreateMany: (args: CreateManyArgs<UserPermissionModel>) => Prisma.PrismaPromise<Prisma.BatchPayload>;

  syncDeleteMany: (args: DeleteManyArgs<string>) => Prisma.PrismaPromise<Prisma.BatchPayload>;
};