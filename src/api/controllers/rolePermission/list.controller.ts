import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/constants/message.constant";
import { ERROR_ON_LIST } from "../../../shared/constants/error.constant";
import { getPagination } from "../../../shared/helpers/common.helper";
import RolePermissionService from "../../../services/role-permission.service";

const rolePermissionService = new RolePermissionService();

const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req;
    const rolePermission = await rolePermissionService.getAll({ query });
    const allRolePermissionCount = await rolePermissionService.count({ query });
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
        rolePermission.length,
        Number(query.page ?? 1),
        Number(query.pageSize ?? 10)
      )
    });
  } catch (error) {
    console.error(`${ERROR_ON_LIST}: `, error);
    next(error);
  };
};

export default list;