
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
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getAllByUsereId = async (args?: GetAllByUserIdArgs): Promise<UserRoleModel[]> => {
    const record = await this.repository.findAll({
      condition: {
        userId: args?.userId,
        ...args?.condition
      },
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<UserRoleModel> => {
    const record = await this.repository.findOne({ condition: { id } });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserRoleModel): Promise<UserRoleModel> => {
    let record: UserRoleModel;
    let newData = new UserRoleModel(data);
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

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};