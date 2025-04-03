import { PrismaClient } from "@prisma/client";
import { SessionsType } from "../models/sessions.model";
import Sessions from "../entities/sessions.entity";
import SessionsRepositoryInterface from "../shared/types/repositories/sessions.interface";
import {
  FindByIdArgs,
  FindByAccessTokenArgs,
  FindByRefreshTokenArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs
} from "../shared/types/repository.type";
import { setSelectExclude } from "../shared/helpers/common.helper";
import { sessionsSubsets } from "../shared/helpers/select-subset.helper";

export default class SessionsRepository implements SessionsRepositoryInterface {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.sessions;
  };

  findById = async (
    args: FindByIdArgs<string>
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
      type: res.type as SessionsType
    });
  };

  findByAccessToken = async (
    args: FindByAccessTokenArgs
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
      type: res.type as SessionsType
    });
  };

  findByRefreshToken = async (
    args: FindByRefreshTokenArgs
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
      type: res.type as SessionsType
    });
  };

  create = async (
    args: CreateArgs<Sessions>
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
      type: data.type as SessionsType
    });
  };

  update = async (
    args: UpdateArgs<string, Sessions>
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
      type: data.type as SessionsType
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
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
      type: data.type as SessionsType
    });
  };
};