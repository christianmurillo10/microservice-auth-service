
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaRolePermissionRepository from "../repositories/prisma/role-permission.repository";
import RolePermissionModel from "../models/role-permission.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllByRoleIdArgs } from "../shared/types/service.type";
import { PrismaClient } from "../prisma/client";

export default class RolePermissionService {
  private repository: PrismaRolePermissionRepository;
  private prisma: PrismaClient;

  constructor() {
    this.repository = new PrismaRolePermissionRepository();
    this.prisma = new PrismaClient();
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

  getByRoleIdAndPermissionId = async (roleId: string, permissionId: string): Promise<RolePermissionModel> => {
    const record = await this.repository.findByRoleIdAndPermissionId({ roleId, permissionId });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: RolePermissionModel): Promise<RolePermissionModel> => {
    return await this.repository.create({ params: new RolePermissionModel(data) });
  };

  delete = async (id: string): Promise<void> => {
    await this.repository.delete({ id: id });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };

  sync = async (roleId: string, permissionIds: string[]): Promise<void> => {
    const existingRolePermissions = await this.repository.findAll({ condition: { roleId } });
    const existingPermissionIds = new Set(existingRolePermissions.map(permission => permission.permissionId));

    // Set toCreate data
    const newPermissionIds = permissionIds.filter(id => !existingPermissionIds.has(id));
    const toCreate: RolePermissionModel[] = newPermissionIds.map(val => new RolePermissionModel({
      roleId,
      permissionId: val,
      grantedAt: new Date()
    }));

    // Set toDelete data
    const incomingPermissionIds = new Set(permissionIds);
    const toDeleteData = existingRolePermissions.filter(val => !incomingPermissionIds.has(val.permissionId));
    const toDeleteIds = toDeleteData.map(data => data.id!);

    await this.prisma.$transaction([
      ...(toCreate.length > 0
        ? [this.repository.syncCreateMany({ params: toCreate })]
        : []
      ),
      ...(toDeleteIds.length > 0
        ? [this.repository.syncDeleteMany({ ids: toDeleteIds })]
        : []
      ),
    ]);
  };
};