
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaUserRoleRepository from "../repositories/prisma/user-role.repository";
import UserRoleModel from "../models/user-role.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllByUserIdArgs } from "../shared/types/service.type";

export default class UserRoleService {
  private repository: PrismaUserRoleRepository

  constructor() {
    this.repository = new PrismaUserRoleRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<UserRoleModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query
    });

    return record;
  };

  getAllByUsereId = async (args: GetAllByUserIdArgs): Promise<UserRoleModel[]> => {
    const record = await this.repository.findAllByUserId({
      userId: args.userId,
      condition: args.condition,
      query: args?.query
    });

    return record;
  };

  getById = async (id: string): Promise<UserRoleModel> => {
    const record = await this.repository.findById({ id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserRoleModel): Promise<UserRoleModel> => {
    return await this.repository.create({ params: new UserRoleModel(data) });
  };

  delete = async (id: string): Promise<void> => {
    await this.repository.delete({ id: id });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};