import { TAccessType } from "./users.entity";

export default interface ISessionsEntity {
  id?: string;
  access_type: TAccessType;
  access_token: string;
  refresh_token: string;
  user_id: string;
  refresh_token_expires_at: Date;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};