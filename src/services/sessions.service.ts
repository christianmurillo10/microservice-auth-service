import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import SessionsRepository from "../repositories/sessions.repository";
import Sessions from "../entities/sessions.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";

export default class SessionsService {
  private repository: SessionsRepository;

  constructor() {
    this.repository = new SessionsRepository();
  };

  getById = async (id: string): Promise<Sessions> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByAccessToken = async (access_token: string): Promise<Sessions> => {
    const record = await this.repository.findByAccessToken({ access_token });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByRefreshToken = async (refresh_token: string): Promise<Sessions> => {
    const record = await this.repository.findByRefreshToken({ refresh_token });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: Sessions): Promise<Sessions> => {
    let record: Sessions;
    let newData = new Sessions(data);
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

  delete = async (id: string): Promise<Sessions> => {
    return await this.repository.softDelete({ id: id });
  };
};