import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../../shared/utils/api-response";
import authenticate from "../../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../../shared/constants/error.constant";
import PermissionService from "../../../../services/permission.service";
import BadRequestException from "../../../../shared/exceptions/bad-request.exception";

const router = Router();
const permissionService = new PermissionService();

const controller = async (
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

    const newPermission = await permissionService.delete(id);

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_DELETED,
      data: newPermission
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default router.delete(
  "/:organizationId/permissions/:id",
  authenticate,
  controller
);