import { PrismaClient } from "@prisma/client";
import UsersModel from "../../models/users.model";
import UsersRepository from "../users.interface";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../../shared/types/repository.type";
import { setSelectExclude } from "../../shared/helpers/common.helper";
import { usersSubsets } from "../../shared/helpers/select-subset.helper";
import { UsersAccessTypeValue } from "../../entities/users.entity";

export default class PrismaUsersRepository implements UsersRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.users;
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UsersModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...usersSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UsersModel({
      ...res,
      access_type: res.access_type as UsersAccessTypeValue
    });
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<UsersModel | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...usersSubsets,
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
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new UsersModel({
      ...res,
      access_type: res.access_type as UsersAccessTypeValue
    });
  };

  create = async (
    args: CreateArgs<UsersModel>
  ): Promise<UsersModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...usersSubsets,
        ...exclude
      },
      data: args.params
    });

    return new UsersModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
  };

  update = async (
    args: UpdateArgs<string, UsersModel>
  ): Promise<UsersModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...usersSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new UsersModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
  };
};