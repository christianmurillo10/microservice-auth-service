import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import UsersRepository from "../repositories/users.repository";
import Users from "../entities/users.entity";
import { hashPassword } from "../shared/utils/bcrypt";
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

  save = async (data: Users): Promise<Users> => {
    let record: Users;
    let newData = new Users(data);
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
      option.params.password = hashPassword(option.params.password as string);
      record = await this.repository.create(option);
    }

    return record;
  };
};