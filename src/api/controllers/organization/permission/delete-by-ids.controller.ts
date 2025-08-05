import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../../shared/utils/api-response";
import authenticate from "../../../../middlewares/authenticate.middleware";
import { deleteByIds as validator } from "../../../../middlewares/validators/permission.validator";
import { MESSAGE_DATA_DELETED } from "../../../../shared/constants/message.constant";
import { ERROR_ON_DELETE } from "../../../../shared/constants/error.constant";
import PermissionService from "../../../../services/permission.service";

const router = Router();
const permissionService = new PermissionService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req;
    await permissionService.deleteMany(body.ids);

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_DELETED
    });
  } catch (error) {
    console.error(`${ERROR_ON_DELETE}: `, error);
    next(error);
  };
};

export default router.post(
  "/:organizationId/permissions/delete-by-ids",
  authenticate,
  validator,
  controller
);