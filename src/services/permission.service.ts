
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaPermissionRepository from "../repositories/prisma/permission.repository";
import PermissionEntity from "../entities/permission.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs } from "../shared/types/service.type";

export default class PermissionService {
  private repository: PrismaPermissionRepository

  constructor(repository?: PrismaPermissionRepository) {
    this.repository = repository ?? new PrismaPermissionRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<PermissionEntity[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<PermissionEntity> => {
    const record = await this.repository.findById({
      id,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByOrganizationIdAndActionAndResource = async (organizationId: string, action: string, resource: string): Promise<PermissionEntity> => {
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

  save = async (data: PermissionEntity): Promise<PermissionEntity> => {
    const exclude = ["deletedAt"];

    if (data.id) {
      return await this.repository.update({
        id: data.id,
        params: data,
        exclude
      });
    }

    return await this.repository.create({
      params: data,
      exclude
    });
  };

  delete = async (id: string): Promise<PermissionEntity> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};