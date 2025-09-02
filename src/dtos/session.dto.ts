import { UserAccessTypeValue } from "../models/user.model";

export type CreateSessionDTO = {
  accessType: UserAccessTypeValue;
  accessToken: string;
  refreshToken: string;
  userId: string;
  refreshTokenExpiresAt: Date;
};

export type UpdateSessionDTO = Partial<CreateSessionDTO>;

export type SessionDTO = CreateSessionDTO & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};