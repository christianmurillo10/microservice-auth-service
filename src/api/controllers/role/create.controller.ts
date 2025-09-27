import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../../shared/constants/message.constant";
import RoleService from "../../../services/role.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import ConflictException from "../../../shared/exceptions/conflict.exception";

const roleService = new RoleService();

const createController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body, auth } = req;
    const organizationId = auth.organizationId!;
    const existingRole = await roleService.getByOrganizationIdAndName(organizationId, body.name)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    if (existingRole) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    const newRole = await roleService.save({ ...body, organizationId });

    apiResponse(res, {
      statusCode: 201,
      message: MESSAGE_DATA_CREATED,
      data: newRole
    });
  } catch (error) {
    next(error);
  };
};

export default createController;