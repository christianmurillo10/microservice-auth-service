import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_SIGNED_OUT, MESSAGE_NOT_IMPLEMENTED, MESSAGE_REQUIRED_AUTHORIZATION } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGOUT } from "../../shared/constants/error.constant";
import SessionsService from "../../services/sessions.service";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import UnauthorizedException from "../../shared/exceptions/unauthorized.exception";
import UserKafkaProducer from "../../events/producer/user.producer";
import NotFoundException from "../../shared/exceptions/not-found.exception";

const router = Router();
const sessionService = new SessionsService();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new BadRequestException([MESSAGE_REQUIRED_AUTHORIZATION]);
    };

    return authorization.split(" ")[1];
  })
  .then(async (token) => {
    // Delete session
    const record = await sessionService.getByAccessToken(token)
      .catch(err => {
        if (err instanceof NotFoundException) {
          throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
        };

        throw err;
      });
    await sessionService.delete(record.id as string);

    return record;
  })
  .then(async (record) => {
    // Execute producer
    switch (record.access_type) {
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