import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_CREATED, MESSAGE_DATA_EXIST } from "../../shared/constants/message.constant";
import { ERROR_ON_CREATE } from "../../shared/constants/error.constant";
import { create as validator } from "../../validators/access-types.validator";
import AccessTypesService from "../../services/access-types.service";
import NotFoundException from "../../shared/exceptions/not-found.exception";
import ConflictException from "../../shared/exceptions/conflict.exception";

const router = Router();
const service = new AccessTypesService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body } = req;
    const record = await service.getByName(body.name)
      .catch(err => {
        if (err instanceof NotFoundException) {
          return null;
        }

        throw err;
      });

    if (record) {
      throw new ConflictException([MESSAGE_DATA_EXIST]);
    };

    return await service.save(body);
  })
  .then(result => {
    apiResponse(res, {
      status_code: 201,
      message: MESSAGE_DATA_CREATED,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_CREATE}: `, err);
    next(err)
  });

export default router.post(
  "/",
  validator,
  controller
);