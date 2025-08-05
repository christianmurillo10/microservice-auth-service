import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../../../shared/utils/api-response";
import authenticate from "../../../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_FIND, MESSAGE_INVALID_PARAMETER } from "../../../../../shared/constants/message.constant";
import { ERROR_ON_READ } from "../../../../../shared/constants/error.constant";
import RolePermissionService from "../../../../../services/role-permission.service";
import BadRequestException from "../../../../../shared/exceptions/bad-request.exception";

const router = Router();
const roleService = new RolePermissionService();

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

    const rolePermission = await roleService.getById(id);

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_FIND,
      data: rolePermission
    });
  } catch (error) {
    console.error(`${ERROR_ON_READ}: `, error);
    next(error);
  };
};

export default router.get(
  "/:organizationId/role-permission/:id",
  authenticate,
  controller
);