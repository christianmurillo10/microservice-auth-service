import prismaConfig from "../../config/prisma.config";
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

function toEntity(user: UserRecord): UserEntity {
  return new UserEntity({
    ...user,
    accessType: user.accessType as UserAccessTypeValue
  });
};

export default class PrismaUserRepository implements UserRepository {
  private client;

  constructor() {
    this.client = prismaConfig.user;
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
    args: CreateArgs<UserEntity>
  ): Promise<UserEntity> => {
    const { organization, session, userRoles, userPermissions, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...userSubsets,
        ...exclude
      },
      data: params
    });

    return toEntity(data);
  };

  update = async (
    args: UpdateArgs<string, UserEntity>
  ): Promise<UserEntity> => {
    const { organization, session, userRoles, userPermissions, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...userSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...params,
        updatedAt: new Date(),
      }
    });

    return toEntity(data);
  };
};