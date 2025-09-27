import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_FIND_ALL, MESSAGE_DATA_NOT_FOUND } from "../../../shared/constants/message.constant";
import { getPagination } from "../../../shared/helpers/common.helper";
import PermissionService from "../../../services/permission.service";

const permissionService = new PermissionService();

const listController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query, auth } = req;
    const condition = auth.organizationId ? { organizationId: auth.organizationId } : undefined;
    const permission = await permissionService.getAll({ condition, query });
    const allPermissionCount = await permissionService.count({ query });
    let message = MESSAGE_DATA_FIND_ALL;

    if (permission.length < 1) {
      message = MESSAGE_DATA_NOT_FOUND;
    };

    apiResponse(res, {
      statusCode: 200,
      message,
      data: permission,
      pagination: getPagination(
        allPermissionCount,
        permission.length,
        Number(query.page ?? 1),
        Number(query.pageSize ?? 10)
      )
    });
  } catch (error) {
    next(error);
  };
};

export default listController;