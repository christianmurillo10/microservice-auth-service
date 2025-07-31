import Session from "../entities/session.entity";
import { UserAccessTypeValue, UserAccessType } from "../entities/user.entity";

class SessionModel implements Session {
  id?: string;
  accessType: UserAccessTypeValue = UserAccessType.Business;
  accessToken: string = "";
  refreshToken: string = "";
  userId: string = "";
  refreshTokenExpiresAt: Date = new Date();
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;

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
  };
};

export default SessionModel;