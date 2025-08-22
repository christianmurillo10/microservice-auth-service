import { Prisma, PrismaClient } from "../../prisma/client";
import UserRoleModel from "../../models/user-role.model";
import UserRoleRepository from "../user-role.interface";
import {
  FindAllArgs,
  FindAllByUserIdArgs,
  FindAllRoleOrUserBasedPermissionsArgs,
  FindByIdArgs,
  FindByUserIdAndRoleIdArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { permissionSubsets, rolePermissionSubsets, roleSubsets, userRoleSubsets } from "../../shared/helpers/select-subset.helper";

export default class PrismaUserRoleRepository implements UserRoleRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.userRole;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<UserRoleModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...userRoleSubsets,
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

    return res.map(item => new UserRoleModel(item));
  };

  findAllByUserId = async (
    args: FindAllByUserIdArgs
  ): Promise<UserRoleModel[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...userRoleSubsets,
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

    return res.map(item => new UserRoleModel(item));
  };

  findAllUserRoleBasedPermissions = async (
    args: FindAllRoleOrUserBasedPermissionsArgs
  ): Promise<UserRoleModel[]> => {
    const res = await this.client.findMany({
      select: {
        ...userRoleSubsets,
        role: {
          select: {
            ...roleSubsets,
            rolePermissions: {
              select: {
                ...rolePermissionSubsets,
                permission: {
                  select: {
                    ...permissionSubsets
                  },
                }
              }
            }
          },
        }
      },
      where: {
        userId: args.userId
      },
    });

    return res.map(item => new UserRoleModel(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UserRoleModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userRoleSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UserRoleModel(res);
  };

  findByUserIdAndRoleId = async (
    args: FindByUserIdAndRoleIdArgs
  ): Promise<UserRoleModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userRoleSubsets,
        ...exclude
      },
      where: {
        userId: args.userId,
        roleId: args.roleId,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UserRoleModel(res);
  };

  create = async (
    args: CreateArgs<UserRoleModel>
  ): Promise<UserRoleModel> => {
    const { user, role, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userRoleSubsets,
        ...exclude
      },
      data: params
    });

    return new UserRoleModel(data);
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
    args: CreateManyArgs<UserRoleModel>,
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