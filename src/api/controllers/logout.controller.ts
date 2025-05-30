import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_SIGNED_OUT, MESSAGE_REQUIRED_AUTHORIZATION } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGOUT } from "../../shared/constants/error.constant";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import LogoutService from "../../services/logout.service";

const router = Router();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { headers, userRequestHeader } = req;
    const { authorization } = headers;

    if (!authorization) {
      throw new BadRequestException([MESSAGE_REQUIRED_AUTHORIZATION]);
    };

    const token = authorization.split(" ")[1];
    const logoutService = new LogoutService({ token, userRequestHeader });
    await logoutService.execute();
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