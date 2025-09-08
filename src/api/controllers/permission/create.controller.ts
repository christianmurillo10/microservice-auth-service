import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import PermissionService from "../../../services/permission.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";

const permissionService = new PermissionService();

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body } = req;
    const { organizationId } = params;
    const existingPermission = await permissionService.getByOrganizationIdAndActionAndResource(organizationId, body.action, body.resource)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingPermission) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newPermission = await permissionService.save({ ...body, organizationId });

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newPermission
    });
  } catch (error) {
    console.error(`${ERROR_ON_CREATE}: `, error);
    next(error);
  };
};

export default create;