
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaRolePermissionRepository from "../repositories/prisma/role-permission.repository";
import RolePermissionModel from "../models/role-permission.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllByRoleIdArgs } from "../shared/types/service.type";

export default class RolePermissionService {
  private repository: PrismaRolePermissionRepository

  constructor() {
    this.repository = new PrismaRolePermissionRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<RolePermissionModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getAllByRoleId = async (args?: GetAllByRoleIdArgs): Promise<RolePermissionModel[]> => {
    const record = await this.repository.findAll({
      condition: {
        roleId: args?.roleId,
        ...args?.condition
      },
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<RolePermissionModel> => {
    const record = await this.repository.findOne({ condition: { id } });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: RolePermissionModel): Promise<RolePermissionModel> => {
    let record: RolePermissionModel;
    let newData = new RolePermissionModel(data);
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