import { PrismaClient } from "@prisma/client";
import Users from "../models/users.model";
import IUsersRepository from "../shared/types/repositories/users.interface";
import {
  TFindByIdArgs,
  TFindByUsernameOrEmailArgs,
  TCreateArgs,
  TUpdateArgs
} from "../shared/types/repository.type";
import { setSelectExclude } from "../shared/helpers/common.helper";
import { usersSubsets } from "../shared/helpers/select-subset.helper";
import { TAccessType } from "../entities/users.entity";

export default class UsersRepository implements IUsersRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.users;
  };

  findById = async (
    args: TFindByIdArgs<string>
  ): Promise<Users | null> => {
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

    return new Users({
      ...res,
      access_type: res.access_type as TAccessType
    });
  };

  findByUsernameOrEmail = async (
    args: TFindByUsernameOrEmailArgs
  ): Promise<Users | null> => {
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

    return new Users({
      ...res,
      access_type: res.access_type as TAccessType
    });
  };

  create = async (
    args: TCreateArgs<Users>
  ): Promise<Users> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...usersSubsets,
        ...exclude
      },
      data: args.params
    });

    return new Users({
      ...data,
      access_type: data.access_type as TAccessType
    });
  };

  update = async (
    args: TUpdateArgs<string, Users>
  ): Promise<Users> => {
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

    return new Users({
      ...data,
      access_type: data.access_type as TAccessType
    });
  };
};