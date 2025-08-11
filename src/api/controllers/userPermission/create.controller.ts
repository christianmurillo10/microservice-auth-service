import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../../shared/constants/error.constant";
import UserPermissionService from "../../../services/user-permission.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";

const userPermissionService = new UserPermissionService();

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body } = req;
    const userId = params.userId;

    if (userId === ":userId") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const existingUserPermission = await userPermissionService.getByUserIdAndPermissionId(userId, body.permissionId)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingUserPermission) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newUserPermission = await userPermissionService.save({ ...body, userId });

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newUserPermission
    });
  } catch (error) {
    console.error(`${ERROR_ON_CREATE}: `, error);
    next(error);
  };
};

export default create;