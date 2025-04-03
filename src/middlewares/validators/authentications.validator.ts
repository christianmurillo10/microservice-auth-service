import { Request, Response, NextFunction } from "express";
import joi from "joi";
import _ from "lodash";
import { validateInput } from "../../shared/helpers/common.helper";
import { MESSAGE_INVALID_BODY } from "../../shared/constants/message.constant";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import { SESSION_TYPE_APP_RECOGNIZED, SESSION_TYPE_BUSINESS, SESSION_TYPE_PORTAL } from "../../shared/constants/sessions.constant";

export const login = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (_.isEmpty(req.body)) {
      throw new BadRequestException([MESSAGE_INVALID_BODY]);
    };

    const schema = joi.object({
      type: joi.string().label("Type")
        .valid(SESSION_TYPE_PORTAL, SESSION_TYPE_BUSINESS, SESSION_TYPE_APP_RECOGNIZED)
        .default(SESSION_TYPE_BUSINESS)
        .optional(),
      email: joi.string().email().label("Email").required(),
      //   .when("username", {
      //     is: joi.exist(),
      //     then: joi.forbidden()
      //   }),
      // username: joi.string().label("Username").optional()
      //   .when("email", {
      //     is: joi.exist(),
      //     then: joi.forbidden()
      //   }),
      password: joi.string().label("Password").required(),
    });
    req.body = await validateInput(req.body, schema);
    next();
  } catch (error) {
    next(error);
  };
};