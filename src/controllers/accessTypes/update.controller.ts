import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_UPDATED, MESSAGE_INVALID_PARAMETER } from "../../shared/constants/message.constant";
import { ERROR_ON_UPDATE } from "../../shared/constants/error.constant";
import { update as validator } from "../../validators/access-types.validator";
import AccessTypesService from "../../services/access-types.service";
import BadRequestException from "../../shared/exceptions/bad-request.exception";

const router = Router();
const upload = multer();
const service = new AccessTypesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { params, body } = req;
    const id = params.id;

    if (id === ":id") {
      throw new BadRequestException([MESSAGE_INVALID_PARAMETER]);
    }

    const record = await service.getById(id);
    return await service.save({ ...record, ...body });
  })
  .then(result => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_UPDATED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_UPDATE}: `, err);
    next(err)
  });

export default router.put(
  "/:id",
  upload.single("logo"),
  validator,
  controller
);