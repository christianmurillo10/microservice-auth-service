import Users from "../../models/users.model";
import { TAccessType } from "../../entities/users.entity";
import JWT from "../utils/jwt";

export const generateAccessToken = (accessType: TAccessType, record: Users, exp: number) => {
  const jwt = new JWT({
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
    return JWT.decodeToken(token);
  } catch (error) {
    return null;
  }
};