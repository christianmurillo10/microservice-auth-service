import { PrismaClient } from "../../prisma/client";
import UserModel from "../../models/user.model";
import UserRepository from "../user.interface";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../../shared/types/repository.type";
import { setSelectExclude } from "../../shared/helpers/common.helper";
import { userSubsets } from "../../shared/helpers/select-subset.helper";
import { UserAccessTypeValue } from "../../entities/user.entity";

export default class PrismaUserRepository implements UserRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.user;
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UserModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UserModel({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<UserModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: {
        OR: [
          {
            username: {
              equals: args.username,
            },
          },
          {
            email: {
              equals: args.email,
            },
          },
        ],
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UserModel({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  create = async (
    args: CreateArgs<UserModel>
  ): Promise<UserModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userSubsets,
        ...exclude
      },
      data: args.params
    });

    return new UserModel({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };

  update = async (
    args: UpdateArgs<string, UserModel>
  ): Promise<UserModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updatedAt: new Date(),
      }
    });

    return new UserModel({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };
};