import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_DELETED } from "../../../shared/constants/message.constant";
import PermissionService from "../../../services/permission.service";

const permissionService = new PermissionService();

const deleteByIdsController = async (
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
    next(error);
  };
};

export default deleteByIdsController;