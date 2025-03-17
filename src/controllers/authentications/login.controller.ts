import { Router, Request, Response, NextFunction } from "express";
import _ from "lodash";
import { apiResponse } from "../../shared/utils/api-response";
import { MESSAGE_DATA_INVALID_PASSWORD, MESSAGE_DATA_NOT_EXIST, MESSAGE_DATA_SIGNED_IN } from "../../shared/constants/message.constant";
import { ERROR_ON_LOGIN } from "../../shared/constants/error.constant";
import { login as validator } from "../../middlewares/validators/authentications.validator";
import UsersRepository from "../../shared/repositories/users.repository";
import NotFoundException from "../../shared/exceptions/not-found.exception";
import BadRequestException from "../../shared/exceptions/bad-request.exception";
import { comparePassword } from "../../shared/utils/bcrypt";
import { generateToken } from "../../shared/utils/jwt";

const router = Router();
const repository = new UsersRepository();

const controller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(req)
  .then(async (req) => {
    const { body } = req;
    const record = await repository.findByUsernameOrEmail({
      username: body.username_or_email,
      email: body.username_or_email,
    });

    if (!record) {
      throw new NotFoundException([MESSAGE_DATA_NOT_EXIST]);
    };

    const validatePassword = comparePassword(body.password, record.password as string);

    if (!validatePassword) {
      throw new BadRequestException([MESSAGE_DATA_INVALID_PASSWORD]);
    };

    return record;
  })
  .then(async (record) => {
    const result = await repository.update({
      id: record.id!,
      params: {
        ...record,
        is_logged: false,
        last_login_at: new Date()
      }
    });

    const data = _.omit(result, [
      "password",
      "is_active",
      "is_logged",
      "last_login",
      "created_at",
      "updated_at",
      "deleted_at",
    ]);

    const token = generateToken({
      id: data.id!,
      type: "Users",
      expiresIn: "1D",
      data: data
    });

    return {
      message: MESSAGE_DATA_SIGNED_IN,
      result: {
        token: token,
        data: data
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
    console.error(`${ERROR_ON_LOGIN}: `, err);
    next(err)
  });

export default router.post(
  "/login",
  validator,
  controller
);