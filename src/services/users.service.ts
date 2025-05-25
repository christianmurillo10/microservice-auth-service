import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaUsersRepository from "../repositories/prisma/users.repository";
import UserRequestHeader from "../models/users.model";
import { hashPassword } from "../shared/utils/bcrypt";
import NotFoundException from "../shared/exceptions/not-found.exception";

export default class UsersService {
  private repository: PrismaUsersRepository;

  constructor() {
    this.repository = new PrismaUsersRepository();
  };

  getById = async (id: string): Promise<UserRequestHeader> => {
    const record = await this.repository.findById({ id: id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUsernameOrEmail = async (username_or_email: string): Promise<UserRequestHeader> => {
    const record = await this.repository.findByUsernameOrEmail({
      username: username_or_email,
      email: username_or_email,
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserRequestHeader): Promise<UserRequestHeader> => {
    let record: UserRequestHeader;
    let newData = new UserRequestHeader(data);
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