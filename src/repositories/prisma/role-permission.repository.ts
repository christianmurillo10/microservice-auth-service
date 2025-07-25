import { PrismaClient } from "@prisma/client";
import RolePermissionModel from "../../models/role-permission.model";
import RolePermissionRepository from "../role-permission.interface";
import {
  FindAllArgs,
  FindOneArgs,
  CreateArgs,
  UpdateArgs,
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
      take: args.query?.limit,
      skip: args.query?.page && args.query?.limit ?
        (args.query?.page - 1) * args.query?.limit :
        undefined
    });

    return res.map(item => new RolePermissionModel(item));
  };

  findOne = async (
    args: FindOneArgs
  ): Promise<RolePermissionModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...rolePermissionSubsets,
        ...exclude
      },
      where: args.condition
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

  update = async (
    args: UpdateArgs<string, RolePermissionModel>
  ): Promise<RolePermissionModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...rolePermissionSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
      }
    });

    return new RolePermissionModel(data);
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
};