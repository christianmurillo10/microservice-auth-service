import { Prisma, PrismaClient } from "../../prisma/client";
import type { RolePermission as RolePermissionRecord } from "../../prisma/client";
import RolePermissionEntity from "../../entities/role-permission.entity";
import RolePermissionRepository from "../role-permission.interface";
import {
  FindAllArgs,
  FindAllByRoleIdArgs,
  FindByIdArgs,
  FindByRoleIdAndPermissionIdArgs,
  CreateArgs,
  CreateManyArgs,
  DeleteArgs,
  DeleteManyArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { rolePermissionSubsets } from "../../shared/helpers/select-subset.helper";

function toEntity(rolePermission: RolePermissionRecord): RolePermissionEntity {
  return new RolePermissionEntity(rolePermission);
};

export default class PrismaRolePermissionRepository implements RolePermissionRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.rolePermission;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<RolePermissionEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...rolePermissionSubsets,
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

  findAllByRoleId = async (
    args: FindAllByRoleIdArgs
  ): Promise<RolePermissionEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...rolePermissionSubsets,
        ...exclude
      },
      where: {
        ...args.condition,
        ...parseQueryFilters(args.query?.filters),
        roleId: args.roleId
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

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<RolePermissionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...rolePermissionSubsets,
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

  findByRoleIdAndPermissionId = async (
    args: FindByRoleIdAndPermissionIdArgs
  ): Promise<RolePermissionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...rolePermissionSubsets,
        ...exclude
      },
      where: {
        roleId: args.roleId,
        permissionId: args.permissionId,
        ...args.condition
      }
    });

    if (!res) return null;

    return toEntity(res);
  };

  create = async (
    args: CreateArgs<RolePermissionEntity>
  ): Promise<RolePermissionEntity> => {
    const { role, permission, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...rolePermissionSubsets,
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
    args: CreateManyArgs<RolePermissionEntity>,
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