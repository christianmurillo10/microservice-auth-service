import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../../shared/utils/api-response";
import authenticate from "../../../../middlewares/authenticate.middleware";
import { MESSAGE_DATA_DELETED, MESSAGE_INVALID_PARAMETER } from "../../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../../shared/constants/error.constant";
import RoleService from "../../../../services/role.service";
import BadRequestException from "../../../../shared/exceptions/bad-request.exception";

const router = Router();
const roleService = new RoleService();

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

    const newRole = await roleService.delete(id);

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_DELETED,
      data: newRole
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default router.delete(
  "/:organizationId/role/:id",
  authenticate,
  controller
);