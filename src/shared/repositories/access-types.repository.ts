import { PrismaClient } from "@prisma/client";
import AccessTypes from "../entities/access-types.entity";
import AccessTypesRepositoryInterface from "../types/repositories/access-types.interface";
import {
  FindAllArgs,
  FindByIdArgs,
  FindByNameArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs,
  SoftDeleteManyArgs,
  CountArgs
} from "../types/repository.type";
import { GenericObject } from "../types/common.type";
import { parseQueryFilters, setSelectExclude } from "../helpers/common.helper";
import { accessTypesSubsets } from "../helpers/select-subset.helper";

export default class AccessTypesRepository implements AccessTypesRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.access_types;
  };

  findAll = async (
    args: FindAllArgs
  ): Promise<AccessTypes[]> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findMany({
      select: {
        ...accessTypesSubsets,
        ...exclude
      },
      where: {
        deleted_at: null,
        ...args.condition,
        ...parseQueryFilters(args.query?.filters)
      },
      orderBy: {
        ...args.query?.sorting
      },
      skip: args.query?.offset,
      take: args.query?.limit
    });

    return res.map(item => new AccessTypes(item));
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<AccessTypes | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...accessTypesSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new AccessTypes(res);
  };

  findByName = async (
    args: FindByNameArgs
  ): Promise<AccessTypes | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...accessTypesSubsets,
        ...exclude
      },
      where: {
        name: args.name,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new AccessTypes(res);
  };

  create = async (
    args: CreateArgs<AccessTypes>
  ): Promise<AccessTypes> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...accessTypesSubsets,
        ...exclude
      },
      data: args.params
    });

    return new AccessTypes(data);
  };

  update = async (
    args: UpdateArgs<string, AccessTypes>
  ): Promise<AccessTypes> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...accessTypesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new AccessTypes(data);
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<AccessTypes> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...accessTypesSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new AccessTypes(data);
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
        deleted_at: new Date(),
      }
    });

    return data;
  };

  count = async (
    args?: CountArgs
  ): Promise<number> => {
    const data = this.client.count({
      where: {
        deleted_at: null,
        ...args?.condition,
        ...parseQueryFilters(args?.query?.filters)
      }
    });

    return data;
  };
};