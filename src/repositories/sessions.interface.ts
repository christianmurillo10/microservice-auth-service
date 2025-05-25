import SessionsModel from "../models/sessions.model";
import {
  FindByIdArgs,
  FindByRefreshTokenArgs,
  CreateArgs,
  UpdateArgs
} from "../shared/types/repository.type";

export default interface SessionsRepository {
  findById: (args: FindByIdArgs<string>) => Promise<SessionsModel | null>;

  findByRefreshToken: (args: FindByRefreshTokenArgs) => Promise<SessionsModel | null>;

  create: (args: CreateArgs<SessionsModel>) => Promise<SessionsModel>;

  update: (args: UpdateArgs<string, SessionsModel>) => Promise<SessionsModel>;
};