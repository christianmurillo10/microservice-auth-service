import Sessions from "../../../models/sessions.model";
import {
  TFindByIdArgs,
  TFindByRefreshTokenArgs,
  TCreateArgs,
  TUpdateArgs
} from "../repository.type";

export default interface ISessionsRepository {
  findById: (args: TFindByIdArgs<string>) => Promise<Sessions | null>;

  findByRefreshToken: (args: TFindByRefreshTokenArgs) => Promise<Sessions | null>;

  create: (args: TCreateArgs<Sessions>) => Promise<Sessions>;

  update: (args: TUpdateArgs<string, Sessions>) => Promise<Sessions>;
};