import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_SYNCED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import RolePermissionService from "../../../services/role-permission.service";

const rolePermissionService = new RolePermissionService();

const syncController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body } = req;
    const roleId = params.roleId;

    if (roleId === ":roleId") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    await rolePermissionService.sync(roleId, body.permissionIds);

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_SYNCED
    });
  } catch (error) {
    next(error);
  };
};

export default syncController;