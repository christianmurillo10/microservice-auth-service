import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import authenticate from "../../../middlewares/authenticate.middleware";
import { update as validator } from "../../../middlewares/validators/role.validator";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import RoleService from "../../../services/role.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const router = Router();
const service = new RoleService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const existingRole = await service.getById(id);
    const newRole = await service.save({ ...existingRole, ...body });

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_UPDATED,
      data: newRole
    });
  } catch (error) {
    console.error(`${ERROR_ON_UPDATE}: `, error);
    next(error);
  };
};

export default router.put(
  "/:id",
  authenticate,
  validator,
  controller
);