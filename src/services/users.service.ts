import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import UsersRepository from "../repositories/users.repository";
import Users from "../entities/users.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";

export default class UsersService {
  private repository: UsersRepository;

  constructor() {
    this.repository = new UsersRepository();
  };

  getById = async (id: string): Promise<Users> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUsernameOrEmail = async (username_or_email: string): Promise<Users> => {
    const record = await this.repository.findByUsernameOrEmail({
      username: username_or_email,
      email: username_or_email,
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  update = async (id: string, data: Users): Promise<Users> => {
    return this.repository.update({ id, params: data });
  };
};