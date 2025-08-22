import { PrismaClient } from "../prisma/client";
import { MESSAGE_DATA_NOT_EXIST } from "../shared/constants/message.constant";
import PrismaUserRoleRepository from "../repositories/prisma/user-role.repository";
import UserRoleModel from "../models/user-role.model";
import NotFoundException from "../shared/exceptions/not-found.exception";
import { CountAllArgs, GetAllArgs, GetAllByUserIdArgs, GetAllRoleOrUserBasedPermissionsArgs } from "../shared/types/service.type";

export default class UserRoleService {
  private repository: PrismaUserRoleRepository;
  private prisma: PrismaClient;

  constructor() {
    this.repository = new PrismaUserRoleRepository();
    this.prisma = new PrismaClient();
  };

  getAll = async (args?: GetAllArgs): Promise<UserRoleModel[]> => {
    const record = await this.repository.findAll({
      condition: args?.condition,
      query: args?.query
    });

    return record;
  };

  getAllByUsereId = async (args: GetAllByUserIdArgs): Promise<UserRoleModel[]> => {
    const record = await this.repository.findAllByUserId({
      userId: args.userId,
      condition: args.condition,
      query: args?.query
    });

    return record;
  };

  getAllUserRoleBasedPermissions = async (args: GetAllRoleOrUserBasedPermissionsArgs): Promise<UserRoleModel[]> => {
    const record = await this.repository.findAllUserRoleBasedPermissions({ userId: args.userId });

    return record;
  };

  getById = async (id: string): Promise<UserRoleModel> => {
    const record = await this.repository.findById({ id });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  getByUserIdAndRoleId = async (userId: string, roleId: string): Promise<UserRoleModel> => {
    const record = await this.repository.findByUserIdAndRoleId({ userId, roleId });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    return record;
  };

  save = async (data: UserRoleModel): Promise<UserRoleModel> => {
    return await this.repository.create({ params: new UserRoleModel(data) });
  };

  delete = async (id: string): Promise<void> => {
    await this.repository.delete({ id: id });
  };

  count = async (args: CountAllArgs): Promise<number> => {
    return await this.repository.count(args);
  };

  sync = async (userId: string, roleIds: string[]): Promise<void> => {
    const existingUserPermissions = await this.repository.findAll({ condition: { userId } });
    const existingPermissionIds = new Set(existingUserPermissions.map(role => role.roleId));

    // Set toCreate data
    const newPermissionIds = roleIds.filter(id => !existingPermissionIds.has(id));
    const toCreate: UserRoleModel[] = newPermissionIds.map(val => new UserRoleModel({
      userId,
      roleId: val,
      assignedAt: new Date()
    }));

    // Set toDelete data
    const incomingPermissionIds = new Set(roleIds);
    const toDeleteData = existingUserPermissions.filter(val => !incomingPermissionIds.has(val.roleId));
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