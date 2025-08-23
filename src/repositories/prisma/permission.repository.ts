import { PrismaClient } from "../../prisma/client";
import PermissionEntity from "../../entities/permission.entity";
import PermissionRepository from "../permission.interface";
import {
  FindAllArgs,
  FindByIdArgs,
  FindByOrganizationIdAndActionAndResourceArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { GenericObject } from "../../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { permissionSubsets } from "../../shared/helpers/select-subset.helper";

export default class PrismaPermissionRepository implements PermissionRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.permission;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<PermissionEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      where: {
        deletedAt: null,
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

    return res.map(item => new PermissionEntity(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<PermissionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new PermissionEntity(res);
  };

  findByOrganizationIdAndActionAndResource = async (
    args: FindByOrganizationIdAndActionAndResourceArgs
  ): Promise<PermissionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      where: {
        organizationId: args.organizationId,
        action: args.action,
        resource: args.resource,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new PermissionEntity(res);
  };

  create = async (
    args: CreateArgs<PermissionEntity>
  ): Promise<PermissionEntity> => {
    const { organization, rolePermissions, userPermissions, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      data: params
    });

    return new PermissionEntity(data);
  };

  update = async (
    args: UpdateArgs<string, PermissionEntity>
  ): Promise<PermissionEntity> => {
    const { organization, rolePermissions, userPermissions, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...params,
        updatedAt: new Date(),
      }
    });

    return new PermissionEntity(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<PermissionEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deletedAt: new Date(),
      }
    });

    return new PermissionEntity(data);
  };

  softDeleteMany = async (
    args: SoftDeleteManyArgs<string>
  ): Promise<GenericObject> => {
    const data = await this.client.updateMany({
      where: {
        id: {
          in: args.ids
        }
      },
      data: {
        deletedAt: new Date(),
      }
    });

    return data;
  };

  count = async (
    args?: CountArgs
  ): Promise<number> => {
    const data = this.client.count({
      where: {
        deletedAt: null,
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };
};