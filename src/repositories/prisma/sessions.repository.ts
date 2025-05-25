import { PrismaClient } from "@prisma/client";
import SessionsModel from "../../models/sessions.model";
import SessionsRepository from "../sessions.interface";
import {
  FindByIdArgs,
  FindByAccessTokenArgs,
  FindByRefreshTokenArgs,
  CreateArgs,
  UpdateArgs,
  SoftDeleteArgs
} from "../../shared/types/repository.type";
import { setSelectExclude } from "../../shared/helpers/common.helper";
import { sessionsSubsets } from "../../shared/helpers/select-subset.helper";
import { UsersAccessTypeValue } from "../../entities/users.entity";

export default class PrismaSessionsRepository implements SessionsRepository {
  private client;

  constructor() {
    const prisma = new PrismaClient();
    this.client = prisma.sessions;
  };

  findById = async (
    args: FindByIdArgs<string>
  ): Promise<SessionsModel | null> => {
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

    return new SessionsModel({
      ...res,
      access_type: res.access_type as UsersAccessTypeValue
    });
  };

  findByAccessToken = async (
    args: FindByAccessTokenArgs
  ): Promise<SessionsModel | null> => {
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

    return new SessionsModel({
      ...res,
      access_type: res.access_type as UsersAccessTypeValue
    });
  };

  findByRefreshToken = async (
    args: FindByRefreshTokenArgs
  ): Promise<SessionsModel | null> => {
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

    return new SessionsModel({
      ...res,
      access_type: res.access_type as UsersAccessTypeValue
    });
  };

  create = async (
    args: CreateArgs<SessionsModel>
  ): Promise<SessionsModel> => {
    const exclude = setSelectExclude(args.exclude!);
    const data = await this.client.create({
      select: {
        ...sessionsSubsets,
        ...exclude
      },
      data: args.params
    });

    return new SessionsModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
  };

  update = async (
    args: UpdateArgs<string, SessionsModel>
  ): Promise<SessionsModel> => {
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

    return new SessionsModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
  };

  softDelete = async (
    args: SoftDeleteArgs<string>
  ): Promise<SessionsModel> => {
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

    return new SessionsModel({
      ...data,
      access_type: data.access_type as UsersAccessTypeValue
    });
  };
};