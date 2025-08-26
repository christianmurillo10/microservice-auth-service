import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaUserRepository from "../repositories/prisma/user.repository";
import UserEntity from "../entities/user.entity";
import { hashPassword } from "../shared/utils/bcrypt";
import NotFoundException from "../shared/exceptions/not-found.exception";

export default class UserService {
  private repository: PrismaUserRepository;

  constructor() {
    this.repository = new PrismaUserRepository();
  };

  getById = async (id: string): Promise<UserEntity> => {
    const record = await this.repository.findById({
      id,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUsernameOrEmail = async (value: string): Promise<UserEntity> => {
    const record = await this.repository.findByUsernameOrEmail({
      username: value,
      email: value,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserEntity): Promise<UserEntity> => {
    let option = {
      params: data,
      exclude: ["deletedAt"]
    };

    if (data.id) {
      return await this.repository.update({
        id: data.id,
        ...option
      });
    }

    option.params.password = hashPassword(option.params.password as string);
    return await this.repository.create(option);
  };
};