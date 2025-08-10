
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaPermissionRepository from "../repositories/prisma/permission.repository";
import PermissionModel from "../models/permission.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs } from "../shared/types/service.type";

export default class PermissionService {
  private repository: PrismaPermissionRepository

  constructor() {
    this.repository = new PrismaPermissionRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<PermissionModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<PermissionModel> => {
    const record = await this.repository.findById({
      id,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByOrganizationIdAndActionAndResource = async (organizationId: string, action: string, resource: string): Promise<PermissionModel> => {
    const record = await this.repository.findByOrganizationIdAndActionAndResource({
      organizationId,
      action,
      resource,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: PermissionModel): Promise<PermissionModel> => {
    let record: PermissionModel;
    let newData = new PermissionModel(data);
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

  delete = async (id: string): Promise<PermissionModel> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};