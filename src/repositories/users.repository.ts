import { PrismaClient } from "@prisma/client";
import Users from "../entities/users.entity";
import UsersRepositoryInterface from "../shared/types/repositories/users.interface";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../shared/types/repository.type";
import { setSelectExclude } from "../shared/helpers/common.helper";
import { usersSubsets } from "../shared/helpers/select-subset.helper";
import { AccessType } from "../models/users.model";

export default class UsersRepository implements UsersRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.users;
  };

  findById = async (
    args: FindByIdArgs<string>
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
      access_type: res.access_type as AccessType
    });
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
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
      access_type: res.access_type as AccessType
    });
  };

  create = async (
    args: CreateArgs<Users>
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
      access_type: data.access_type as AccessType
    });
  };

  update = async (
    args: UpdateArgs<string, Users>
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
      access_type: data.access_type as AccessType
    });
  };
};