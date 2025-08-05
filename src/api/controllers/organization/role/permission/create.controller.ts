import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../../../shared/utils/api-response";
import authenticate from "../../../../../middlewares/authenticate.middleware";
import { create as validator } from "../../../../../middlewares/validators/role-permission.validator";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../../../shared/constants/error.constant";
import RolePermissionService from "../../../../../services/role-permission.service";
import NotFoundException from "../../../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../../../shared/exceptions/conflict.exception";

const router = Router();
const rolePermissionService = new RolePermissionService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req;
    const existingRolePermission = await rolePermissionService.getByRoleIdAndPermissionId(body.roleId, body.permissionId)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingRolePermission) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newRolePermission = await rolePermissionService.save(body);

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newRolePermission
    });
  } catch (error) {
    console.error(`${ERROR_ON_CREATE}: `, error);
    next(error);
  };
};

export default router.post(
  "/:organizationId/role-permission/",
  authenticate,
  validator,
  controller
);