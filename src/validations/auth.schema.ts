import joi from "joi";
import { UserAccessType } from "../entities/user.entity";

export const loginSchema = joi.object({
  accessType: joi.string().label("Access Type")
    .valid(UserAccessType.Portal, UserAccessType.Organization, UserAccessType.AppRecognized)
    .optional(),
  email: joi.string().email().label("Email").required(),
  password: joi.string().label("Password").required(),
});

export const refreshTokenSchema = joi.object({
  refreshToken: joi.string().label("Refresh Token").required(),
});