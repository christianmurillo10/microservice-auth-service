import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_REFRESH_TOKEN } from "../../shared/constants/message.constant";
import { ERROR_ON_REFRESH_TOKEN } from "../../shared/constants/error.constant";
import { token as validator } from "../../middlewares/validators/authentications.validator";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import RefreshTokenService from "../../services/refresh-token.service";

const router = Router();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const { body } = req;

    if (!authHeader) {
      throw new BadRequestException([MESSAGE_DATA_NOT_EXIST]);
    };

    const refreshtokenService = new RefreshTokenService({
      token: authHeader.split(" ")[1],
      refresh_token: body.refresh_token
    });
    const result = await refreshtokenService.execute();

    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_REFRESH_TOKEN,
      result
    });
  } catch (error) {
    console.error(`${ERROR_ON_REFRESH_TOKEN}: `, error);
    next(error);
  };
};

export default router.post(
  "/refresh-token",
  validator,
  controller
);