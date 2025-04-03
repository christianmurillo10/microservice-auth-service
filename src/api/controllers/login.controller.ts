import { Router, Request, Response, NextFunction } from "express";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS, MESSAGE_DATA_SIGNED_IN, MESSAGE_NOT_IMPLEMENTED } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGIN } from "../../shared/constants/error.constant";
import { login as validator } from "../../middlewares/validators/authentications.validator";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import NotFoundException from "../../shared/exceptions/not-found.exception";
import { comparePassword } from "../../shared/utils/bcrypt";
import JWT from "../../shared/utils/jwt";
import UserKafkaProducer from "../../events/producer/user.producer";
import UsersService from "../../services/users.service";
import Users from "../../entities/users.entity";
import SessionsService from "../../services/sessions.service";
import { addDaysToDate, addMinutesToDate } from "../../shared/helpers/common.helper";
import { SessionsType } from "../../models/sessions.model";

const router = Router();
const service = new UsersService();
const sessionService = new SessionsService();

const generateAccessToken = (type: SessionsType, record: Users, exp: number) => {
  const jwt = new JWT({
    id: record.id as unknown as number,
    email: record.email,
    client: type,
    scope: "*",
    sub: record.business_id as unknown as number,
    exp: exp,
    iat: Date.now() / 1000,
    aud: "Boilerplate"
  });
  return jwt.generateToken();
};

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body } = req;
    const input = body.username ?? body.email;
    let record: Users;

    switch (body.type) {
      case "APP_RECOGNIZED":
        throw new BadRequestException([MESSAGE_NOT_IMPLEMENTED]);
      default:
        record = await service.getByUsernameOrEmail(input)
          .catch(err => {
            if (err instanceof NotFoundException) {
              throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
            }

            throw err;
          });
        break;
    };

    const validatePassword = comparePassword(body.password, record.password as string);
    if (!validatePassword) {
      throw new BadRequestException([MESSAGE_DATA_INVALID_LOGIN_CREDENTIALS]);
    };

    return { body, record };
  })
  .then(async ({ body, record }) => {
    // Generate Access Token
    const accessTokenExpiryDate = addMinutesToDate(new Date(), 30);
    const accessTokenExpiry = accessTokenExpiryDate.getTime() / 1000;
    const accessToken = generateAccessToken(body.type, record, accessTokenExpiry);

    // Save data to sessions table
    const session = await sessionService.save({
      type: body.type,
      access_token: accessToken,
      refresh_token: uuidv4(),
      user_id: record.id as string,
      refresh_token_expires_at: addDaysToDate(new Date(), 30),
      created_at: new Date(),
      updated_at: new Date()
    });

    return {
      record,
      result: {
        user_id: session.user_id,
        token: session.access_token,
        expiration: accessTokenExpiryDate,
        refresh_token: session.refresh_token
      }
    };
  })
  .then(async ({ record, result }) => {
    // Execute producer
    const userProducer = new UserKafkaProducer();
    await userProducer.publishUserLogged(record);

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