import { UserAccessTypeValue } from "../entities/user.entity";

export type CreateSessionDTO = {
  accessType: UserAccessTypeValue;
  accessToken: string;
  refreshToken: string;
  userId: string;
  refreshTokenExpiresAt: Date;
};

export type UpdateSessionDTO = Partial<CreateSessionDTO>;