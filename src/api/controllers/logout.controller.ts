import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_SIGNED_OUT, MESSAGE_NOT_IMPLEMENTED } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGOUT } from "../../shared/constants/error.constant";
import SessionsService from "../../services/sessions.service";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import UnauthorizedException from "../../shared/exceptions/unauthorized.exception";
import { SESSION_TYPE_BUSINESS, SESSION_TYPE_PORTAL } from "../../shared/constants/sessions.constant";
import { verifyToken } from "../../shared/helpers/jwt.helper";
import UserKafkaProducer from "../../events/producer/user.producer";

const router = Router();
const sessionService = new SessionsService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new BadRequestException([MESSAGE_DATA_NOT_EXIST]);
    };

    const token = authHeader.split(" ")[1];
    const tokenData = verifyToken(token);

    if (
      !tokenData ||
      tokenData.client !== SESSION_TYPE_PORTAL &&
      tokenData.client !== SESSION_TYPE_BUSINESS
    ) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    return { tokenData, token };
  })
  .then(async ({ tokenData, token }) => {
    // Delete session
    const record = await sessionService.getByAccessToken(token);
    await sessionService.delete(record.id as string);
    return { tokenData, record };
  })
  .then(async ({ tokenData, record }) => {
    // Execute producer

    switch (tokenData.client) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_NOT_IMPLEMENTED]);
      default:
        const userProducer = new UserKafkaProducer();
        await userProducer.publishUserLoggedOut({
          id: record.user_id,
          is_logged: false
        });
        break;
    };
  })
  .then(() => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_SIGNED_OUT
    })
  })
  .catch(err => {
    console.error(`${ERROR_ON_LOGOUT}: `, err);
    next(err)
  });

export default router.post(
  "/logout",
  controller
);