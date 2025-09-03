import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaSessionRepository from "../repositories/prisma/session.repository";
import { CreateSessionDTO, UpdateSessionDTO } from "../dtos/session.dto";
import SessionEntity from "../entities/session.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";

export default class SessionService {
  private repository: PrismaSessionRepository;

  constructor() {
    this.repository = new PrismaSessionRepository();
  };

  getById = async (id: string): Promise<SessionEntity> => {
    const record = await this.repository.findById({
      id,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByAccessToken = async (accessToken: string): Promise<SessionEntity> => {
    const record = await this.repository.findByAccessToken({
      accessToken,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByRefreshToken = async (refreshToken: string): Promise<SessionEntity> => {
    const record = await this.repository.findByRefreshToken({
      refreshToken,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  create = async (data: CreateSessionDTO): Promise<SessionEntity> =>
    this.repository.create({
      params: data,
      exclude: ["deletedAt"]
    });

  update = async (id: string, data: UpdateSessionDTO): Promise<SessionEntity> =>
    this.repository.update({
      id: id,
      params: data,
      exclude: ["deletedAt"]
    });

  delete = async (id: string): Promise<SessionEntity> => {
    return await this.repository.softDelete({ id: id });
  };
};