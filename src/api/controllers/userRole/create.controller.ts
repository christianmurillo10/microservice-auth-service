import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import UserRoleService from "../../../services/user-role.service";
import BuildUserPermissionsService from "../../../services/rbac/build-user-permissions.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";

const userRoleService = new UserRoleService();

const createController = async (
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

    const existingUserRole = await userRoleService.getByUserIdAndRoleId(userId, body.roleId)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingUserRole) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newUserRole = await userRoleService.save({ ...body, userId });

    // Rebuild user permissions cache
    const buildUserPermissionsService = new BuildUserPermissionsService({
      userId: userId,
      expireInMinutes: 30
    });
    await buildUserPermissionsService.execute();

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newUserRole
    });
  } catch (error) {
    next(error);
  };
};

export default createController;