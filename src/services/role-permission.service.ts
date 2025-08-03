
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
      query: args?.query
    });

    return record;
  };

  getAllByRoleId = async (args: GetAllByRoleIdArgs): Promise<RolePermissionModel[]> => {
    const record = await this.repository.findAllByRoleId({
      roleId: args.roleId,
      condition: args.condition,
      query: args?.query
    });

    return record;
  };

  getById = async (id: string): Promise<RolePermissionModel> => {
    const record = await this.repository.findById({ id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: RolePermissionModel): Promise<RolePermissionModel> => {
    const newData = new RolePermissionModel(data);
    return await this.repository.create({ params: newData });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};