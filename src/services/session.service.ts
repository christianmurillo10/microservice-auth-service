import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaSessionRepository from "../repositories/prisma/session.repository";
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

  save = async (data: SessionEntity): Promise<SessionEntity> => {
    const option = {
      params: data,
      exclude: ["deletedAt"]
    };

    if (data.id) {
      return await this.repository.update({
        id: data.id,
        ...option
      });
    }

    return await this.repository.create(option);;
  };

  delete = async (id: string): Promise<SessionEntity> => {
    return await this.repository.softDelete({ id: id });
  };
};