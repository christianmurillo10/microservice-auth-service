import { Prisma, PrismaClient } from "../../prisma/client";
import UserPermissionModel from "../../models/user-permission.model";
import UserPermissionRepository from "../user-permission.interface";
import {
  FindAllArgs,
  FindAllByUserIdArgs,
  FindAllUserPermissionsArgs,
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

export default class PrismaUserPermissionRepository implements UserPermissionRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.userPermission;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<UserPermissionModel[]> => {
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

    return res.map(item => new UserPermissionModel(item));
  };

  findAllByUserId = async (
    args: FindAllByUserIdArgs
  ): Promise<UserPermissionModel[]> => {
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

    return res.map(item => new UserPermissionModel(item));
  };

  findAllUserPermissions = async (
    args: FindAllUserPermissionsArgs
  ) => {
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
        userId: args.userId,
        permission: {
          action: args.action,
          resource: args.resource,
          organizationId: args.organizationId,
        },
      },
    });

    return res.map(item => new UserPermissionModel(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UserPermissionModel | null> => {
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

    return new UserPermissionModel(res);
  };

  findByUserIdAndPermissionId = async (
    args: FindByUserIdAndPermissionIdArgs
  ): Promise<UserPermissionModel | null> => {
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

    return new UserPermissionModel(res);
  };

  create = async (
    args: CreateArgs<UserPermissionModel>
  ): Promise<UserPermissionModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userPermissionSubsets,
        ...exclude
      },
      data: args.params
    });

    return new UserPermissionModel(data);
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
    args: CreateManyArgs<UserPermissionModel>,
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