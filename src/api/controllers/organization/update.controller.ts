import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../../shared/constants/error.constant";
import OrganizationService from "../../../services/organization.service";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";

const service = new OrganizationService();

const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { params, body, file } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const existingOrganization = await service.getById(id);
    const newOrganization = await service.update(id, {
      name: body.name ?? existingOrganization.name,
      logoPath: file ? await service.uploadLogo(file) : existingOrganization.logoPath,
      isActive: body.isActive ?? existingOrganization.isActive
    });

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_UPDATED,
      data: newOrganization
    });
  } catch (error) {
    console.error(`${ERROR_ON_UPDATE}: `, error);
    next(error);
  };
};

export default update;