import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_REFRESH_TOKEN } from "../../../shared/constants/message.constant";
import BadRequestException from "../../../shared/exceptions/bad-request.exception";
import RefreshTokenService from "../../../services/refresh-token.service";

const refreshTokenController = async (
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
      refreshToken: body.refreshToken
    });
    const data = await refreshtokenService.execute();

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_REFRESH_TOKEN,
      data
    });
  } catch (error) {
    next(error);
  };
};

export default refreshTokenController;