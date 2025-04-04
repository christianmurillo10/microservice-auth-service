import Users from "../../entities/users.entity";
import { SessionsAccessType } from "../../models/sessions.model";
import JWT from "../utils/jwt";

export const generateAccessToken = (accessType: SessionsAccessType, record: Users, exp: number) => {
  const jwt = new JWT({
    id: record.id as unknown as number,
    email: record.email,
    client: accessType,
    scope: "*",
    sub: record.business_id as unknown as number,
    exp: exp,
    iat: Date.now() / 1000,
    aud: "Boilerplate"
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