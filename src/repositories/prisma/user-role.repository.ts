import { PrismaClient } from "@prisma/client";
import UserRoleModel from "../../models/user-role.model";
import UserRoleRepository from "../user-role.interface";
import {
  FindAllArgs,
  FindOneArgs,
  CreateArgs,
  UpdateArgs,
  CountArgs
} from "../../shared/types/repository.type";
import { parseQueryFilters, setSelectExclude } from "../../shared/helpers/common.helper";
import { userRoleSubsets } from "../../shared/helpers/select-subset.helper";

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
      take: args.query?.limit,
      skip: args.query?.page && args.query?.limit ?
        (args.query?.page - 1) * args.query?.limit :
        undefined
    });

    return res.map(item => new UserRoleModel(item));
  };

  findOne = async (
    args: FindOneArgs
  ): Promise<UserRoleModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userRoleSubsets,
        ...exclude
      },
      where: args.condition
    });

    if (!res) return null;

    return new UserRoleModel(res);
  };

  create = async (
    args: CreateArgs<UserRoleModel>
  ): Promise<UserRoleModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userRoleSubsets,
        ...exclude
      },
      data: args.params
    });

    return new UserRoleModel(data);
  };

  update = async (
    args: UpdateArgs<string, UserRoleModel>
  ): Promise<UserRoleModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...userRoleSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
      }
    });

    return new UserRoleModel(data);
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