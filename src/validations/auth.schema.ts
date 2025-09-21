import Joi from "joi";
import { UserAccessType } from "../entities/user.entity";

export const loginSchema = Joi.object({
  accessType: Joi.string().label("Access Type")
    .valid(UserAccessType.Portal, UserAccessType.Organization, UserAccessType.AppRecognized)
    .optional(),
  email: Joi.string().email().label("Email").required(),
  password: Joi.string().label("Password").required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().label("Refresh Token").required(),
});