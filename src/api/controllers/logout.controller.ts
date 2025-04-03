import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_SIGNED_OUT } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGOUT } from "../../shared/constants/error.constant";
import UsersService from "../../services/users.service";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import UnauthorizedException from "../../shared/exceptions/unauthorized.exception";
import JWT from "../../shared/utils/jwt";
import { SESSION_TYPE_BUSINESS, SESSION_TYPE_PORTAL } from "../../shared/constants/sessions.constant";

const router = Router();
const usersService = new UsersService();

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
    const tokenData = JWT.verifyToken(token);

    if (
      !tokenData ||
      tokenData.client !== SESSION_TYPE_PORTAL &&
      tokenData.client !== SESSION_TYPE_BUSINESS
    ) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    return tokenData;
  })
  .then(async (tokenData) => {
    const record = await usersService.getById(tokenData.id as unknown as string);
    await usersService.save({
      ...record,
      // is_logged: false
    });
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