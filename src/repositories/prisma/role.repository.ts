import { PrismaClient } from "@prisma/client";
import RoleModel from "../../models/role.model";
import RoleRepository from "../role.interface";
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
import { roleSubsets } from "../../shared/helpers/select-subset.helper";

export default class PrismaRoleRepository implements RoleRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.role;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<RoleModel[]> => {
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
      take: args.query?.limit,
      skip: args.query?.page && args.query?.limit ?
        (args.query?.page - 1) * args.query?.limit :
        undefined
    });

    return res.map(item => new RoleModel(item));
  };

  findOne = async (
    args: FindOneArgs
  ): Promise<RoleModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...roleSubsets,
        ...exclude
      },
      where: {
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new RoleModel(res);
  };

  create = async (
    args: CreateArgs<RoleModel>
  ): Promise<RoleModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...roleSubsets,
        ...exclude
      },
      data: args.params
    });

    return new RoleModel(data);
  };

  update = async (
    args: UpdateArgs<string, RoleModel>
  ): Promise<RoleModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...roleSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updatedAt: new Date(),
      }
    });

    return new RoleModel(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<RoleModel> => {
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

    return new RoleModel(data);
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