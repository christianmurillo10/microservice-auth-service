import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_SYNCED } from "../../../shared/constants/message.constant";
import { ERROR_ON_SYNC } from "../../../shared/constants/error.constant";
// import RolePermissionService from "../../../services/role-permission.service";

// const rolePermissionService = new RolePermissionService();

const sync = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body } = req;

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_SYNCED,
      data: body
    });
  } catch (error) {
    console.error(`${ERROR_ON_SYNC}: `, error);
    next(error);
  };
};

export default sync;