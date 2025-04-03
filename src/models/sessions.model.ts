export type SessionsType = "PORTAL" | "BUSINESS" | "APP_RECOGNIZED";

export default interface SessionsModel {
  id?: string;
  type: SessionsType;
  access_token: string;
  refresh_token: string;
  user_id: string;
  refresh_token_expires_at: Date;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};