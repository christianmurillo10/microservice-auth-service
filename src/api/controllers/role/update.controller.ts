import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import RoleService from "../../../services/role.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const service = new RoleService();

const update = async (
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
    const newRole = await service.update(id, {
      name: body.name ?? existingRole.name
    });

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

export default update;