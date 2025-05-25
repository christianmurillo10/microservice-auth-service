import { UsersAccessTypeValue } from "./users.entity";

export default interface Sessions {
  id?: string;
  access_type: UsersAccessTypeValue;
  access_token: string;
  refresh_token: string;
  user_id: string;
  refresh_token_expires_at: Date;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};