import { PrismaClient } from "@prisma/client";
import Users from "../entities/users.entity";
import UsersRepositoryInterface from "../interfaces/repositories/users.interface";
import { FindByUsernameOrEmailArgs, UpdateArgs } from "../types/common.type";
import { setSelectExclude } from "../helpers/common.helper";
import { usersSubsets } from "../helpers/select-subset.helper";

export default class UsersRepository implements UsersRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.users;
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

    return new Users(res);
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
        password: args.params.password as string,
        updated_at: new Date(),
      }
    });

    return new Users(data);
  };
};