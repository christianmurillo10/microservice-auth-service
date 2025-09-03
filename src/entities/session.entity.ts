import { v4 as uuidv4 } from "uuid";
import Session from "../models/session.model";
import User, { UserAccessTypeValue } from "../models/user.model";

class SessionEntity implements Session {
  id?: string;
  accessType: UserAccessTypeValue;
  accessToken: string;
  refreshToken: string;
  userId: string;
  refreshTokenExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  user?: User;

  constructor(props: Session) {
    this.id = props.id ?? uuidv4();
    this.accessType = props.accessType;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.userId = props.userId;
    this.refreshTokenExpiresAt = props.refreshTokenExpiresAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.user = props.user;
  };

  isRefreshExpired(at: Date = new Date()): boolean {
    return this.refreshTokenExpiresAt.getTime() <= at.getTime();
  };
};

export default SessionEntity;