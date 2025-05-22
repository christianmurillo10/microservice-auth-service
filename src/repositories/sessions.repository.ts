import { PrismaClient } from "@prisma/client";
import Sessions from "../models/sessions.model";
import ISessionsRepository from "../shared/types/repositories/sessions.interface";
import {
  TFindByIdArgs,
  TFindByAccessTokenArgs,
  TFindByRefreshTokenArgs,
  TCreateArgs,
  TUpdateArgs,
  TSoftDeleteArgs
} from "../shared/types/repository.type";
import { setSelectExclude } from "../shared/helpers/common.helper";
import { sessionsSubsets } from "../shared/helpers/select-subset.helper";
import { TAccessType } from "../entities/users.entity";

export default class SessionsRepository implements ISessionsRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.sessions;
  };

  findById = async (
    args: TFindByIdArgs<string>
  ): Promise<Sessions | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...sessionsSubsets,
        ...exclude
      },
      where: {
        id: args.id,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Sessions({
      ...res,
      access_type: res.access_type as TAccessType
    });
  };

  findByAccessToken = async (
    args: TFindByAccessTokenArgs
  ): Promise<Sessions | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...sessionsSubsets,
        ...exclude
      },
      where: {
        access_token: args.access_token,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Sessions({
      ...res,
      access_type: res.access_type as TAccessType
    });
  };

  findByRefreshToken = async (
    args: TFindByRefreshTokenArgs
  ): Promise<Sessions | null> => {
    const exclude = setSelectExclude(args.exclude!);
    const res = await this.client.findFirst({
      select: {
        ...sessionsSubsets,
        ...exclude
      },
      where: {
        refresh_token: args.refresh_token,
        deleted_at: null,
        ...args.condition
      }
    });

    if (!res) return null;

    return new Sessions({
      ...res,
      access_type: res.access_type as TAccessType
    });
  };

  create = async (
    args: TCreateArgs<Sessions>
  ): Promise<Sessions> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...sessionsSubsets,
        ...exclude
      },
      data: args.params
    });

    return new Sessions({
      ...data,
      access_type: data.access_type as TAccessType
    });
  };

  update = async (
    args: TUpdateArgs<string, Sessions>
  ): Promise<Sessions> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...sessionsSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        ...args.params,
        updated_at: new Date(),
      }
    });

    return new Sessions({
      ...data,
      access_type: data.access_type as TAccessType
    });
  };

  softDelete = async (
    args: TSoftDeleteArgs<string>
  ): Promise<Sessions> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.update({
      select: {
        ...sessionsSubsets,
        ...exclude
      },
      where: { id: args.id },
      data: {
        deleted_at: new Date(),
      }
    });

    return new Sessions({
      ...data,
      access_type: data.access_type as TAccessType
    });
  };
};