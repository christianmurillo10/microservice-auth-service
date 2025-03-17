import jwt from "jsonwebtoken";
import config from "../../config/jwt.config";
import { MESSAGE_DATA_TOKEN_EXPIRED } from "../constants/message.constant";
import UnauthorizedException from "../exceptions/unauthorized.exception";
import { JWT, JwtParams } from "../types/jwt.types";

export const generateToken = (params: JwtParams): string => {
  const accountData = params.data || null;
  const data = { id: params.id, type: params.type, data: accountData };
  return jwt.sign(data, config.secret, { expiresIn: "1D" });
};

export const verifyToken = (token: string): JWT => {
  try {
    return <JWT>jwt.verify(token, config.secret);
  } catch (error) {
    throw new UnauthorizedException([MESSAGE_DATA_TOKEN_EXPIRED]);
  };
};