import UserPermissionService from "../user-permission.service";
import UserRoleService from "../user-role.service";
import redisConfig from "../../config/redis.config";

type State = {
  userId: string;
  organizationId: string;
};

type Output = Record<string, string[]>;

export default class BuildUserPermissionsService {
  private state: State;

  userPermissionService: UserPermissionService;
  userRoleService: UserRoleService;

  constructor(state: State) {
    this.state = state;
    this.userPermissionService = new UserPermissionService();
    this.userRoleService = new UserRoleService();
  };

  private saveToRedis = async (userId: string, permissions: Record<string, string[]>) => {
    await redisConfig.set(
      `user_permissions:${userId}`,
      JSON.stringify(permissions),
      "EX",
      3600
    );
  };

  execute = async (): Promise<Output> => {
    const { userId, organizationId } = this.state;
    const permissions: Record<string, string[]> = {};

    // Fetch all permissions directly assigned to the user
    const userPermissions = await this.userPermissionService.getAllUserBasedPermissions({
      userId,
      organizationId,
    });

    if (userPermissions.length > 0) {
      userPermissions.forEach(up => {
        if (!up.permission) return;

        if (!permissions[up.permission.resource]) {
          permissions[up.permission.resource] = [];
        }

        permissions[up.permission.resource].push(up.permission.action);
      });

      await this.saveToRedis(userId, permissions);

      return permissions;
    }

    // Fetch all permissions assigned through roles
    const rolePermissions = await this.userRoleService.getAllUserRoleBasedPermissions({
      userId,
      organizationId,
    });

    if (rolePermissions.length === 0) {
      rolePermissions.forEach(rp => {
        if (!rp.role || !rp.role.rolePermissions) return;

        rp.role.rolePermissions.forEach(rpPermission => {
          if (!rpPermission.permission) return;

          if (!permissions[rpPermission.permission.resource]) {
            permissions[rpPermission.permission.resource] = [];
          }

          permissions[rpPermission.permission.resource].push(rpPermission.permission.action);
        });
      });

      await this.saveToRedis(userId, permissions);

      return permissions;
    }

    await this.saveToRedis(userId, permissions);

    return permissions;
  };
};