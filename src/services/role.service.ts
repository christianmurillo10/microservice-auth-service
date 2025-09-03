
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaRoleRepository from "../repositories/prisma/role.repository";
import RoleEntity from "../entities/role.entity";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs } from "../shared/types/service.type";
import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.dto";

export default class RoleService {
  private repository: PrismaRoleRepository

  constructor() {
    this.repository = new PrismaRoleRepository();
  };

  getAll = async (args?: GetAllArgs): Promise<RoleEntity[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query,
      exclude: ["deletedAt"]
    });

    return record;
  };

  getById = async (id: string): Promise<RoleEntity> => {
    const record = await this.repository.findById({
      id,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByOrganizationIdAndName = async (organizationId: string, name: string): Promise<RoleEntity> => {
    const record = await this.repository.findByOrganizationIdAndName({
      organizationId,
      name,
      exclude: ["deletedAt"]
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  create = async (params: CreateRoleDto): Promise<RoleEntity> =>
    this.repository.create({
      params,
      exclude: ["deletedAt"]
    });

  update = async (id: string, params: UpdateRoleDto): Promise<RoleEntity> =>
    this.repository.update({
      id,
      params,
      exclude: ["deletedAt"]
    });

  delete = async (id: string): Promise<RoleEntity> => {
    return await this.repository.softDelete({ id: id });
  };

  deleteMany = async (ids: string[]): Promise<void> => {
    await this.repository.softDeleteMany({ ids: ids });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };
};