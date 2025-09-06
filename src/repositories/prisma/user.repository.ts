import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "../../prisma/client";
import type { User as UserRecord } from "../../prisma/client";
import UserEntity, { UserAccessTypeValue } from "../../entities/user.entity";
import UserRepository from "../user.interface";
import {
  FindByIdArgs,
  FindByUsernameOrEmailArgs,
  CreateArgs,
  UpdateArgs
} from "../../shared/types/repository.type";
import { setSelectExclude } from "../../shared/helpers/common.helper";
import { userSubsets } from "../../shared/helpers/select-subset.helper";
import { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";

function toEntity(user: UserRecord): UserEntity {
  return new UserEntity({
    ...user,
    accessType: user.accessType as UserAccessTypeValue
  });
};

export default class PrismaUserRepository implements UserRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.user;
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<UserEntity | null> => {
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

    return toEntity(res);
  };

  findByUsernameOrEmail = async (
    args: FindByUsernameOrEmailArgs
  ): Promise<UserEntity | null> => {
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

    return toEntity(res);
  };

  create = async (
    args: CreateArgs<CreateUserDTO>
  ): Promise<UserEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userSubsets,
        ...exclude
      },
      data: {
        ...args.params,
        id: args.params.id ?? uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return toEntity(data);
  };

  update = async (
    args: UpdateArgs<string, UpdateUserDTO>
  ): Promise<UserEntity> => {
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

    return toEntity(data);
  };
};