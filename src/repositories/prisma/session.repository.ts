import { PrismaClient } from "../../prisma/client";
import SessionEntity from "../../entities/session.entity";
import SessionRepository from "../session.interface";
import {
  FindByIdArgs,
  FindByAccessTokenArgs,
  FindByRefreshTokenArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs
} from "../../shared/types/repository.type";
import { setSelectExclude } from "../../shared/helpers/common.helper";
import { sessionSubsets } from "../../shared/helpers/select-subset.helper";
import { UserAccessTypeValue } from "../../models/user.model";

export default class PrismaSessionRepository implements SessionRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.session;
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<SessionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...sessionSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new SessionEntity({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  findByAccessToken = async (
    args: FindByAccessTokenArgs
  ): Promise<SessionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...sessionSubsets,
        ...exclude
      },
      where: {
        accessToken: args.accessToken,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new SessionEntity({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  findByRefreshToken = async (
    args: FindByRefreshTokenArgs
  ): Promise<SessionEntity | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...sessionSubsets,
        ...exclude
      },
      where: {
        refreshToken: args.refreshToken,
        deletedAt: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new SessionEntity({
      ...res,
      accessType: res.accessType as UserAccessTypeValue
    });
  };

  create = async (
    args: CreateArgs<SessionEntity>
  ): Promise<SessionEntity> => {
    const { user, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...sessionSubsets,
        ...exclude
      },
      data: params
    });

    return new SessionEntity({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };

  update = async (
    args: UpdateArgs<string, SessionEntity>
  ): Promise<SessionEntity> => {
    const { user, ...params } = args.params;
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...sessionSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...params,
        updatedAt: new Date(),
      }
    });

    return new SessionEntity({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<SessionEntity> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...sessionSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deletedAt: new Date(),
      }
    });

    return new SessionEntity({
      ...data,
      accessType: data.accessType as UserAccessTypeValue
    });
  };
};