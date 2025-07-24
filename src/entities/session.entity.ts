import { UserAccessTypeValue } from "./user.entity";

export default interface Session {
  id?: string;
  accessType: UserAccessTypeValue;
  accessToken: string;
  refreshToken: string;
  userId: string;
  refreshTokenExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};