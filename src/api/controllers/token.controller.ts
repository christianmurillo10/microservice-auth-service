import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_REFRESH_TOKEN, MESSAGE_DATA_TOKEN_EXPIRED } from "../../shared/constants/message.constant";
import { ERROR_ON_REFRESH_TOKEN } from "../../shared/constants/error.constant";
import { token as validator } from "../../middlewares/validators/authentications.validator";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import UnauthorizedException from "../../shared/exceptions/unauthorized.exception";
import { generateAccessToken, verifyToken } from "../../shared/helpers/jwt.helper";
import UsersService from "../../services/users.service";
import SessionsService from "../../services/sessions.service";
import { addDaysToDate, addMinutesToDate } from "../../shared/helpers/common.helper";
import { EAccessType } from "../../entities/users.entity";

const router = Router();
const service = new UsersService();
const sessionService = new SessionsService();

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

    const token = authHeader.split(" ")[1];
    const tokenData = verifyToken(token);

    if (
      !tokenData ||
      tokenData.client !== EAccessType.PORTAL &&
      tokenData.client !== EAccessType.BUSINESS
    ) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    return {
      tokenData,
      token,
      refreshToken: body.refresh_token
    };
  })
  .then(async ({ tokenData, token, refreshToken }) => {
    const session = await sessionService.getByRefreshToken(refreshToken);

    if (session.access_token !== token) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    }

    // Validate if refresh token date was expired
    const refreshTokenExpiryDate = new Date(session.refresh_token_expires_at);
    const currentDate = new Date();
    if (refreshTokenExpiryDate < currentDate) {
      await sessionService.delete(session.id!);
      throw new UnauthorizedException([MESSAGE_DATA_TOKEN_EXPIRED]);
    }

    const record = await service.getById(tokenData.id as unknown as string);

    // Generate Access Token
    const accessTokenExpiryDate = addMinutesToDate(new Date(), 30);
    const accessTokenExpiry = accessTokenExpiryDate.getTime() / 1000;
    const accessToken = generateAccessToken(tokenData.client, record, accessTokenExpiry);

    // Save data to sessions table
    session.access_token = accessToken;
    session.refresh_token = uuidv4();
    session.refresh_token_expires_at = addDaysToDate(new Date(), 30);
    await sessionService.save(session);

    return {
      message: MESSAGE_DATA_REFRESH_TOKEN,
      result: {
        user_id: session.user_id,
        token: session.access_token,
        expiration: accessTokenExpiryDate,
        refresh_token: session.refresh_token
      }
    };
  })
  .then(({ message, result }) => {
    apiResponse(res, {
      status_code: 200,
      message,
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