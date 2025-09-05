import { Prisma } from "../prisma/client";
import UserRoleEntity from "../entities/user-role.entity";
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
import { CreateUserRoleDTO } from "../dtos/user-role.dto";

export default interface UserRoleRepository {
  findAll: (args: FindAllArgs) => Promise<UserRoleEntity[]>;

  findAllByUserId: (args: FindAllByUserIdArgs) => Promise<UserRoleEntity[]>;

  findAllUserRoleBasedPermissions: (args: FindAllRoleOrUserBasedPermissionsArgs) => Promise<UserRoleEntity[]>;

  findById: (args: FindByIdArgs<string>) => Promise<UserRoleEntity | null>;

  findByUserIdAndRoleId: (args: FindByUserIdAndRoleIdArgs) => Promise<UserRoleEntity | null>;

  create: (args: CreateArgs<CreateUserRoleDTO>) => Promise<UserRoleEntity>;

  delete: (args: DeleteArgs<string>) => Promise<void>;

  count: (args?: CountArgs) => Promise<number>;

  syncCreateMany: (args: CreateManyArgs<CreateUserRoleDTO>) => Prisma.PrismaPromise<Prisma.BatchPayload>;

  syncDeleteMany: (args: DeleteManyArgs<string>) => Prisma.PrismaPromise<Prisma.BatchPayload>;
};