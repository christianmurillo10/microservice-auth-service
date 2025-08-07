import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../../../shared/utils/api-response";
import { MESSAGE_DATA_SIGNED_IN } from "../../../shared/constants/message.constant";
import { ERROR_ON_LOGIN } from "../../../shared/constants/error.constant";
import LoginService from "../../../services/login.service";

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userRequestHeader } = req;
    const { body } = req;
    const loginService = new LoginService({ input: body, userRequestHeader });
    const data = await loginService.execute();

    apiResponse(res, {
      statusCode: 200,
      message: MESSAGE_DATA_SIGNED_IN,
      data
    });
  } catch (error) {
    console.error(`${ERROR_ON_LOGIN}: `, error);
    next(error);
  };
};

export default login;