
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaUserPermissionRepository from "../repositories/prisma/user-permission.repository";
import UserPermissionModel from "../models/user-permission.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllByUserIdArgs } from "../shared/types/service.type";

export default class UserPermissionService {
  private repository: PrismaUserPermissionRepository

  constructor() {
    this.repository = new PrismaUserPermissionRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<UserPermissionModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query
    });

    return record;
  };

  getAllByUserId = async (args: GetAllByUserIdArgs): Promise<UserPermissionModel[]> => {
    const record = await this.repository.findAllByUserId({
      userId: args.userId,
      condition: args.condition,
      query: args?.query
    });

    return record;
  };

  getById = async (id: string): Promise<UserPermissionModel> => {
    const record = await this.repository.findById({ id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserPermissionModel): Promise<UserPermissionModel> => {
    return await this.repository.create({ params: new UserPermissionModel(data) });
  };

  delete = async (id: string): Promise<void> => {
    await this.repository.delete({ id: id });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};