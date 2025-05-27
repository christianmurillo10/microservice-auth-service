import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_REFRESH_TOKEN } from "../../shared/constants/message.constant";
import { ERROR_ON_REFRESH_TOKEN } from "../../shared/constants/error.constant";
import { token as validator } from "../../middlewares/validators/authentications.validator";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import TokenService from "../../services/token.service";

const router = Router();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const authHeader = req.headers.authorization;
    const { body } = req;

    if (!authHeader) {
      throw new BadRequestException([MESSAGE_DATA_NOT_EXIST]);
    };

    return {
      token: authHeader.split(" ")[1],
      refreshToken: body.refresh_token
    };
  })
  .then(async ({ token, refreshToken }) => {
    const tokenService = new TokenService({
      token,
      refresh_token: refreshToken
    });
    return await tokenService.execute();
  })
  .then((result) => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_REFRESH_TOKEN,
      result
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_REFRESH_TOKEN}: `, err);
    next(err)
  });

export default router.post(
  "/token",
  validator,
  controller
);