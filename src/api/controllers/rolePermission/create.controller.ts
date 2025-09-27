import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import RolePermissionService from "../../../services/role-permission.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";

const rolePermissionService = new RolePermissionService();

const createController = async (
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

    const existingRolePermission = await rolePermissionService.getByRoleIdAndPermissionId(roleId, body.permissionId)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingRolePermission) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newRolePermission = await rolePermissionService.save({ ...body, roleId });

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newRolePermission
    });
  } catch (error) {
    next(error);
  };
};

export default createController;