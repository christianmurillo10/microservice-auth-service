import Session from "../models/session.model";
import User, { UserAccessTypeValue, UserAccessType } from "../models/user.model";

class SessionEntity implements Session {
  id?: string;
  accessType: UserAccessTypeValue = UserAccessType.Organization;
  accessToken: string = "";
  refreshToken: string = "";
  userId: string = "";
  refreshTokenExpiresAt: Date = new Date();
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  user?: User;

  constructor(props: Session) {
    this.id = props.id;
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
};

export default SessionEntity;