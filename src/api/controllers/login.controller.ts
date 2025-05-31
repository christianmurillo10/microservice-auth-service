import { Router, Request, Response, NextFunction } from "express";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_SIGNED_IN } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGIN } from "../../shared/constants/error.constant";
import { login as validator } from "../../middlewares/validators/authentications.validator";
import LoginService from "../../services/login.service";

const router = Router();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { userRequestHeader } = req;
    const { body } = req;
    const loginService = new LoginService({ body, userRequestHeader });
    return await loginService.execute();
  })
  .then((result) => {
    apiResponse(res, {
      status_code: 200,
      message: MESSAGE_DATA_SIGNED_IN,
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