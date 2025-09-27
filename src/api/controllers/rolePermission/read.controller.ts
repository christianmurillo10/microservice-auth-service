import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_FIND, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import RolePermissionService from "../../../services/role-permission.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const rolePermissionService = new RolePermissionService();

const readController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const rolePermission = await rolePermissionService.getById(id);

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_FIND,
      data: rolePermission
    });
  } catch (error) {
    next(error);
  };
};

export default readController;