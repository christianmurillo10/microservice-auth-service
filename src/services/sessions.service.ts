import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaSessionsRepository from "../repositories/prisma/sessions.repository";
import SessionsModel from "../models/sessions.model";
import NotFoundException from "../shared/exceptions/not-found.exception";

export default class SessionsService {
  private repository: PrismaSessionsRepository;

  constructor() {
    this.repository = new PrismaSessionsRepository();
  };

  getById = async (id: string): Promise<SessionsModel> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByAccessToken = async (access_token: string): Promise<SessionsModel> => {
    const record = await this.repository.findByAccessToken({ access_token });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByRefreshToken = async (refresh_token: string): Promise<SessionsModel> => {
    const record = await this.repository.findByRefreshToken({ refresh_token });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: SessionsModel): Promise<SessionsModel> => {
    let record: SessionsModel;
    let newData = new SessionsModel(data);
    let option = {
      params: newData,
      exclude: ["deleted_at"]
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

  delete = async (id: string): Promise<SessionsModel> => {
    return await this.repository.softDelete({ id: id });
  };
};