import { UserAccessTypeValue } from "../../entities/user.entity";
import JWTEntity from "../../entities/jwt.entity";

export const generateAccessToken = (
  id: number,
  email: string,
  accessType: UserAccessTypeValue,
  subject: number,
  exp: number
) => {
  const jwt = new JWTEntity({
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
    return JWTEntity.decodeToken(token);
  } catch (error) {
    return null;
  }
};