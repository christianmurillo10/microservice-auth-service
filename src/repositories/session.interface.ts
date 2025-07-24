import SessionModel from "../models/session.model";
import {
  FindByIdArgs,
  FindByRefreshTokenArgs,
  CreateArgs,
  UpdateArgs
} from "../shared/types/repository.type";

export default interface SessionRepository {
  findById: (args: FindByIdArgs<string>) => Promise<SessionModel | null>;

  findByRefreshToken: (args: FindByRefreshTokenArgs) => Promise<SessionModel | null>;

  create: (args: CreateArgs<SessionModel>) => Promise<SessionModel>;

  update: (args: UpdateArgs<string, SessionModel>) => Promise<SessionModel>;
};