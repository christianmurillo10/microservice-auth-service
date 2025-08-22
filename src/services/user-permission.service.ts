import { PrismaClient } from "../prisma/client";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaUserPermissionRepository from "../repositories/prisma/user-permission.repository";
import UserPermissionModel from "../models/user-permission.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllByUserIdArgs, GetAllRoleOrUserBasedPermissionsArgs } from "../shared/types/service.type";

export default class UserPermissionService {
  private repository: PrismaUserPermissionRepository;
  private prisma: PrismaClient;

  constructor() {
    this.repository = new PrismaUserPermissionRepository();
    this.prisma = new PrismaClient();
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

  getAllUserBasedPermissions = async (args: GetAllRoleOrUserBasedPermissionsArgs): Promise<UserPermissionModel[]> => {
    const record = await this.repository.findAllUserBasedPermissions({ userId: args.userId });

    return record;
  };

  getById = async (id: string): Promise<UserPermissionModel> => {
    const record = await this.repository.findById({ id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUserIdAndPermissionId = async (userId: string, permissionId: string): Promise<UserPermissionModel> => {
    const record = await this.repository.findByUserIdAndPermissionId({ userId, permissionId });

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

  sync = async (userId: string, permissionIds: string[]): Promise<void> => {
    const existingUserPermissions = await this.repository.findAll({ condition: { userId } });
    const existingPermissionIds = new Set(existingUserPermissions.map(permission => permission.permissionId));

    // Set toCreate data
    const newPermissionIds = permissionIds.filter(id => !existingPermissionIds.has(id));
    const toCreate: UserPermissionModel[] = newPermissionIds.map(val => new UserPermissionModel({
      userId,
      permissionId: val,
      grantedAt: new Date()
    }));

    // Set toDelete data
    const incomingPermissionIds = new Set(permissionIds);
    const toDeleteData = existingUserPermissions.filter(val => !incomingPermissionIds.has(val.permissionId));
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