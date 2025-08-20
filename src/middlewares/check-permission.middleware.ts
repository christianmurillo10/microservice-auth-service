import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { MESSAGE_DATA_NO_PERMISSION, MESSAGE_DATA_NOT_AUTHORIZED } from "../shared/constants/message.constant";
import UserPermissionService from "../services/user-permission.service";
import UserRoleService from "../services/user-role.service";
import ForbiddenException from "../shared/exceptions/forbidden.exception";

const userPermissionService = new UserPermissionService();
const userRoleService = new UserRoleService();

const checkPermission = (action: string, resource: string) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      const authId = req.auth.id;
      const organizationId = req.auth.organizationId;

      if (!authId || !organizationId) {
        throw new UnauthorizedException([MESSAGE_DATA_NOT_AUTHORIZED])
      }

      // Check if the user has permission directly
      const userPermissions = await userPermissionService.getAllUserBasedPermissions({
        userId: authId,
        organizationId: organizationId,
      });

      if (userPermissions.length > 0) {
        return next();
      }

      // Check if the user has permissions through roles
      const rolePermissions = await userRoleService.getAllUserRoleBasedPermissions({
        userId: authId,
        organizationId: organizationId,
      });
      const hasRBACPermission = rolePermissions.some((userRole) =>
        userRole.role &&
        userRole.role.rolePermissions &&
        userRole.role.rolePermissions.length > 0 &&
        userRole.role.rolePermissions.some(
          (rp) => rp.permission?.action === action && rp.permission.resource === resource
        )
      );

      if (hasRBACPermission) {
        return next();
      }

      throw new ForbiddenException([MESSAGE_DATA_NO_PERMISSION]);
    } catch (error) {
      next(error);
    };
  };
};

export default checkPermission;