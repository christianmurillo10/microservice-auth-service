import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../../../shared/utils/api-response";
import authenticate from "../../../../../middlewares/authenticate.middleware";
import { list as validator } from "../../../../../middlewares/validators/role-permission.validator";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../../../shared/constants/message.constant";
import { ERROR_ON_LIST } from "../../../../../shared/constants/error.constant";
import { getPagination } from "../../../../../shared/helpers/common.helper";
import RolePermissionService from "../../../../../services/role-permission.service";

const router = Router();
const roleService = new RolePermissionService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req;
    const rolePermission = await roleService.getAll({ query });
    const roleCount = rolePermission.length;
    const allRolePermissionCount = await roleService.count({ query });
    let message = MESSAGE_DATA_FIND_ALL;

    if (rolePermission.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    apiResponse(res, {
      statusCode: 200,
      message,
      data: rolePermission,
      pagination: getPagination(
        allRolePermissionCount,
        roleCount,
        Number(query.page ?? 1),
        Number(query.pageSize ?? 10)
      )
    });
  } catch (error) {
    console.error(`${ERROR_ON_LIST}: `, error);
    next(error);
  };
};

export default router.get(
  "/:organizationId/roles/:roleId/permissions/",
  authenticate,
  validator,
  controller
);