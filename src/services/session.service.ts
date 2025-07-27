import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaSessionRepository from "../repositories/prisma/session.repository";
import SessionModel from "../models/session.model";
import NotFoundException from "../shared/exceptions/not-found.exception";

export default class SessionService {
  private repository: PrismaSessionRepository;

  constructor() {
    this.repository = new PrismaSessionRepository();
  };

  getById = async (id: string): Promise<SessionModel> => {
    const record = await this.repository.findById({ id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByAccessToken = async (accessToken: string): Promise<SessionModel> => {
    const record = await this.repository.findByAccessToken({ accessToken });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByRefreshToken = async (refreshToken: string): Promise<SessionModel> => {
    const record = await this.repository.findByRefreshToken({ refreshToken });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: SessionModel): Promise<SessionModel> => {
    let record: SessionModel;
    let newData = new SessionModel(data);
    let option = {
      params: newData,
      exclude: ["deletedAt"]
    };

    if (data.id) {
      // Update
      record = await this.repository.update({
        id: data.id,
        ...option
      });
    } else {
      // Create
      record = await this.repository.create(option);
    }

    return record;
  };

  delete = async (id: string): Promise<SessionModel> => {
    return await this.repository.softDelete({ id: id });
  };
};