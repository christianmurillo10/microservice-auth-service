
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaRoleRepository from "../repositories/prisma/role.repository";
import RoleModel from "../models/role.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs } from "../shared/types/service.type";

export default class RoleService {
  private repository: PrismaRoleRepository

  constructor() {
    this.repository = new PrismaRoleRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<RoleModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<RoleModel> => {
    const record = await this.repository.findById({ id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByBusinessIdAndName = async (businessId: string, name: string): Promise<RoleModel> => {
    const record = await this.repository.findByBusinessIdAndName({ businessId, name });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: RoleModel): Promise<RoleModel> => {
    let record: RoleModel;
    let newData = new RoleModel(data);
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

  delete = async (id: string): Promise<RoleModel> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};