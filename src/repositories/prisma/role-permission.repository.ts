import { Prisma, PrismaClient } from "../../prisma/client";
import RolePermissionModel from "../../models/role-permission.model";
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

export default class PrismaRolePermissionRepository implements RolePermissionRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.rolePermission;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<RolePermissionModel[]> => {
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

    return res.map(item => new RolePermissionModel(item));
  };

  findAllByRoleId = async (
    args: FindAllByRoleIdArgs
  ): Promise<RolePermissionModel[]> => {
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

    return res.map(item => new RolePermissionModel(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<RolePermissionModel | null> => {
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

    return new RolePermissionModel(res);
  };

  findByRoleIdAndPermissionId = async (
    args: FindByRoleIdAndPermissionIdArgs
  ): Promise<RolePermissionModel | null> => {
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

    return new RolePermissionModel(res);
  };

  create = async (
    args: CreateArgs<RolePermissionModel>
  ): Promise<RolePermissionModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...rolePermissionSubsets,
        ...exclude
      },
      data: args.params
    });

    return new RolePermissionModel(data);
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
    args: CreateManyArgs<RolePermissionModel>,
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