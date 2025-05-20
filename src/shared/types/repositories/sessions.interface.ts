import Sessions from "../../../models/sessions.model";
import {
  FindByIdArgs,
  FindByRefreshTokenArgs,
  CreateArgs,
  UpdateArgs
} from "../repository.type";

export default interface SessionsRepositoryInterface {
  findById: (args: FindByIdArgs<string>) => Promise<Sessions | null>;

  findByRefreshToken: (args: FindByRefreshTokenArgs) => Promise<Sessions | null>;

  create: (args: CreateArgs<Sessions>) => Promise<Sessions>;

  update: (args: UpdateArgs<string, Sessions>) => Promise<Sessions>;
};