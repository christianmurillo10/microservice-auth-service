import { CreateSessionDTO, UpdateSessionDTO } from "../dtos/session.dto";
import SessionEntity from "../entities/session.entity";
import {
  FindByIdArgs,
  FindByRefreshTokenArgs,
  CreateArgs,
  UpdateArgs
} from "../shared/types/repository.type";

export default interface SessionRepository {
  findById: (args: FindByIdArgs<string>) => Promise<SessionEntity | null>;

  findByRefreshToken: (args: FindByRefreshTokenArgs) => Promise<SessionEntity | null>;

  create: (args: CreateArgs<CreateSessionDTO>) => Promise<SessionEntity>;

  update: (args: UpdateArgs<string, UpdateSessionDTO>) => Promise<SessionEntity>;
};