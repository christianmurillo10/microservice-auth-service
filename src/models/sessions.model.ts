import { v4 as uuidv4 } from "uuid";
import SessionsEntity from "../entities/sessions.entity";
import { TAccessType, EAccessType } from "../entities/users.entity";

class Sessions implements SessionsEntity {
  id?: string = uuidv4();
  access_type: TAccessType = EAccessType.BUSINESS;
  access_token: string = "";
  refresh_token: string = "";
  user_id: string = "";
  refresh_token_expires_at: Date = new Date();
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null = null;

  constructor(props: SessionsEntity) {
    Object.assign(this, props);
  };
};

export default Sessions;