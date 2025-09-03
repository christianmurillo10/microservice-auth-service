import { UserAccessTypeValue } from "../models/user.model";

export type CreateSessionDTO = {
  accessType: UserAccessTypeValue;
  accessToken: string;
  refreshToken: string;
  userId: string;
  refreshTokenExpiresAt: Date;
};

export type UpdateSessionDTO = Partial<CreateSessionDTO>;