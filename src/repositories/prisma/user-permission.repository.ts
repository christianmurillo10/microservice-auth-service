import { Prisma, PrismaClient } from "../../prisma/client";
import type { UserPermission as UserPermissionRecord } from "../../prisma/client";
import UserPermissionEntity from "../../entities/user-permission.entity";
import UserPermissionRepository from "../user-permission.interface";
import {
  FindAllArgs,
  FindAllByUserIdArgs,
  FindAllRoleOrUserBasedPermissionsArgs,
  FindByIdArgs,
  FindByUserIdAndPermissionIdArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { permissionSubsets, userPermissionSubsets } from "../../shared/helpers/select-subset.helper";

function toEntity(userPermission: UserPermissionRecord): UserPermissionEntity {
  return new UserPermissionEntity(userPermission);
};

export default class PrismaUserPermissionRepository implements UserPermissionRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.userPermission;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<UserPermissionEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...userPermissionSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...parseQueryFilters(args.query?.filters)
      },
      orderBy: {
        ...args.query?.sorting
      },
      take: args.query?.pageSize,
      skip: args.query?.page && args.query?.pageSize ?
        (args.query?.page - 1) * args.query?.pageSize :
        undefined
    });

    return res.map(item => toEntity(item));
  };

  findAllByUserId = async (
    args: FindAllByUserIdArgs
  ): Promise<UserPermissionEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...userPermissionSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...parseQueryFilters(args.query?.filters),
        userId: args.userId
      },
      orderBy: {
        ...args.query?.sorting
      },
      take: args.query?.pageSize,
      skip: args.query?.page && args.query?.pageSize ?
        (args.query?.page - 1) * args.query?.pageSize :
        undefined
    });

    return res.map(item => toEntity(item));
  };

  findAllUserBasedPermissions = async (
    args: FindAllRoleOrUserBasedPermissionsArgs
  ): Promise<UserPermissionEntity[]> => {
    const res = await this.client.findMany({
      select: {
        ...userPermissionSubsets,
        permission: {
          select: {
            ...permissionSubsets,
            deletedAt: false
          }
        }
      },
      where: {
        userId: args.userId
      },
    });

    return res.map(item => toEntity(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UserPermissionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userPermissionSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        ...args.condition
      }
    });

    if (!res) return null;

    return toEntity(res);
  };

  findByUserIdAndPermissionId = async (
    args: FindByUserIdAndPermissionIdArgs
  ): Promise<UserPermissionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userPermissionSubsets,
        ...exclude
      },
      where: {
        userId: args.userId,
        permissionId: args.permissionId,
        ...args.condition
      }
    });

    if (!res) return null;

    return toEntity(res);
  };

  create = async (
    args: CreateArgs<UserPermissionEntity>
  ): Promise<UserPermissionEntity> => {
    const { user, permission, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userPermissionSubsets,
        ...exclude
      },
      data: params
    });

    return toEntity(data);
  };

  delete = async (
    args: DeleteArgs<string>
  ): Promise<void> => {
    await this.client.delete({
      where: { id: args.id }
    });
  };

  count = async (
    args?: CountArgs
  ): Promise<number> => {
    const data = this.client.count({
      where: {
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };

  syncCreateMany = (
    args: CreateManyArgs<UserPermissionEntity>,
  ): Prisma.PrismaPromise<Prisma.BatchPayload> => {
    return this.client.createMany({
      data: args.params
    });
  };

  syncDeleteMany = (
    args: DeleteManyArgs<string>
  ): Prisma.PrismaPromise<Prisma.BatchPayload> => {
    return this.client.deleteMany({
      where: {
        id: {
          in: args.ids
        }
      }
    });
  };
};