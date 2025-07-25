import { PrismaClient } from "@prisma/client";
import PermissionModel from "../../models/permission.model";
import PermissionRepository from "../permission.interface";
import {
  FindAllArgs,
  FindOneArgs,
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
  ): Promise<PermissionModel[]> => {
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
      take: args.query?.limit,
      skip: args.query?.page && args.query?.limit ?
        (args.query?.page - 1) * args.query?.limit :
        undefined
    });

    return res.map(item => new PermissionModel(item));
  };

  findOne = async (
    args: FindOneArgs
  ): Promise<PermissionModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      where: {
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new PermissionModel(res);
  };

  create = async (
    args: CreateArgs<PermissionModel>
  ): Promise<PermissionModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      data: args.params
    });

    return new PermissionModel(data);
  };

  update = async (
    args: UpdateArgs<string, PermissionModel>
  ): Promise<PermissionModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...permissionSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updatedAt: new Date(),
      }
    });

    return new PermissionModel(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<PermissionModel> => {
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

    return new PermissionModel(data);
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