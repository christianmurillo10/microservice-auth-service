import { PrismaClient } from "../../prisma/client";
import type { Role as RoleRecord } from "../../prisma/client";
import RoleEntity from "../../entities/role.entity";
import RoleRepository from "../role.interface";
import {
  FindAllArgs,
  FindByIdArgs,
  FindByOrganizationIdAndNameArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { GenericObject } from "../../shared/types/common.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { roleSubsets } from "../../shared/helpers/select-subset.helper";

function toEntity(role: RoleRecord): RoleEntity {
  return new RoleEntity(role);
};

export default class PrismaRoleRepository implements RoleRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.role;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<RoleEntity[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...roleSubsets,
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

    return res.map(item => toEntity(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<RoleEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...roleSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return toEntity(res);
  };

  findByOrganizationIdAndName = async (
    args: FindByOrganizationIdAndNameArgs
  ): Promise<RoleEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...roleSubsets,
        ...exclude
      },
      where: {
        organizationId: args.organizationId,
        name: args.name,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return toEntity(res);
  };

  create = async (
    args: CreateArgs<RoleEntity>
  ): Promise<RoleEntity> => {
    const { organization, rolePermissions, userRoles, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...roleSubsets,
        ...exclude
      },
      data: params
    });

    return toEntity(data);
  };

  update = async (
    args: UpdateArgs<string, RoleEntity>
  ): Promise<RoleEntity> => {
    const { organization, rolePermissions, userRoles, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...roleSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...params,
        updatedAt: new Date(),
      }
    });

    return toEntity(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<RoleEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...roleSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deletedAt: new Date(),
      }
    });

    return toEntity(data);
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