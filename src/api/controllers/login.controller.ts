import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_SIGNED_IN, MESSAGE_NOT_IMPLEMENTED } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGIN } from "../../shared/constants/error.constant";
import { login as validator } from "../../middlewares/validators/authentications.validator";
import UserKafkaProducer from "../../events/producer/user.producer";
import LoginService from "../../services/login.service";
import BadRequestException from "../../shared/exceptions/bad-request.exception";

const router = Router();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body } = req;
    const loginService = new LoginService(body);
    return await loginService.execute();
  })
  .then(async ({ record, result }) => {
    const { userRequestHeader } = req;

    // Execute producer
    switch (record.access_type) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_NOT_IMPLEMENTED]);
      default:
        const userProducer = new UserKafkaProducer();
        await userProducer.publishUserLoggedIn(
          {
            id: record.id!,
            is_logged: true,
            last_logged_at: new Date()
          },
          {
            ip_address: userRequestHeader.ip_address ?? undefined,
            host: userRequestHeader.host ?? undefined,
            user_agent: userRequestHeader.user_agent ?? undefined
          }
        );
        break;
    };

    return {
      message: MESSAGE_DATA_SIGNED_IN,
      result
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
    console.error(`${ERROR_ON_LOGIN}: `, err);
    next(err)
  });

export default router.post(
  "/login",
  validator,
  controller
);