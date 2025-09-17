import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../shared/constants/error.constant";
import UserRoleService from "../../../services/user-role.service";
import BuildUserPermissionsService from "../../../services/rbac/build-user-permissions.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const userRoleService = new UserRoleService();

const removeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params } = req;
    const { id, userId } = params;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const newUserRole = await userRoleService.delete(id);

    // Rebuild user permissions cache
    const buildUserPermissionsService = new BuildUserPermissionsService({
      userId: userId,
      expireInMinutes: 30
    });
    await buildUserPermissionsService.execute();

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_DELETED,
      data: newUserRole
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default removeController;