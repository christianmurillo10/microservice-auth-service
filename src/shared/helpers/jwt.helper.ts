import UserRequestHeader from "../../models/users.model";
import JWTModel from "../../models/jwt.model";
import { UsersAccessTypeValue } from "../../entities/users.entity";

export const generateAccessToken = (accessType: UsersAccessTypeValue, record: UserRequestHeader, exp: number) => {
  const jwt = new JWTModel({
    id: record.id as unknown as number,
    email: record.email,
    client: accessType,
    scope: "*",
    sub: record.business_id as unknown as number,
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