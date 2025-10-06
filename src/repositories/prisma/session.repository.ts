import prismaConfig from "../../config/prisma.config";
import type { Session as SessionRecord } from "../../prisma/client";
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
import { UserAccessTypeValue } from "../../entities/user.entity";

function toEntity(session: SessionRecord): SessionEntity {
  return new SessionEntity({
    ...session,
    accessType: session.accessType as UserAccessTypeValue
  });
};

export default class PrismaSessionRepository implements SessionRepository {
  private client;

  constructor() {
    this.client = prismaConfig.session;
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

    return toEntity(res);
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

    return toEntity(res);
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

    return toEntity(res);
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

    return toEntity(data);
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

    return toEntity(data);
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

    return toEntity(data);
  };
};