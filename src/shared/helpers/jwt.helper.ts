import JWTModel from "../../models/jwt.model";
import { UserAccessTypeValue } from "../../entities/user.entity";

export const generateAccessToken = (
  id: number,
  email: string,
  accessType: UserAccessTypeValue,
  subject: number,
  exp: number
) => {
  const jwt = new JWTModel({
    id: id as unknown as number,
    email: email,
    client: accessType,
    scope: "*",
    sub: subject,
    exp: exp,
    iat: Date.now() / 1000,
    aud: "Microservice"
  });
  return jwt.encodeToken();
};

export const verifyToken = (token: string) => {
  try {
    return JWTModel.decodeToken(token);
  } catch (error) {
    return null;
  }
};