import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_SYNCED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_SYNC } from "../../../shared/constants/error.constant";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import UserRoleService from "../../../services/user-role.service";
import BuildUserPermissionsService from "../../../services/rbac/build-user-permissions.service";

const userRoleService = new UserRoleService();

const syncController = async (
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

    await userRoleService.sync(userId, body.roleIds);

    // Rebuild user permissions cache
    const buildUserPermissionsService = new BuildUserPermissionsService({
      userId: userId,
      expireInMinutes: 30
    });
    await buildUserPermissionsService.execute();

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_SYNCED
    });
  } catch (error) {
    console.error(`${ERROR_ON_SYNC}: `, error);
    next(error);
  };
};

export default syncController;