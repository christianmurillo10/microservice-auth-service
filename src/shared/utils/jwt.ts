import jwt from "jsonwebtoken";
import config from "../../config/jwt.config";
import { JWTClient, JWTModel } from "../types/jwt.types";
import { SESSION_TYPE_BUSINESS } from "../constants/sessions.constant";

class JWT implements JWTModel {
  id: number = 0;
  email: string = "";
  client: JWTClient = SESSION_TYPE_BUSINESS;
  scope: string = "";
  sub: number = 0;
  exp: number = 0;
  iat: number = Date.now();
  aud: string = "Boilerplate";

  constructor(props: JWTModel) {
    Object.assign(this, props);
  };

  static verifyToken = (token: string): JWT => jwt.verify(token, config.secret) as unknown as JWT;

  generateToken = () => jwt.sign(
    {
      id: this.id,
      email: this.email,
      client: this.client,
      scope: this.scope,
      sub: this.sub,
      exp: this.exp,
      iat: this.iat,
      aud: this.aud
    },
    config.secret
  );
};

export default JWT;