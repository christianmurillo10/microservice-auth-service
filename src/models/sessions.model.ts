import { v4 as uuidv4 } from "uuid";
import SessionsEntity from "../entities/sessions.entity";
import { UsersAccessTypeValue, UsersAccessType } from "../entities/users.entity";

class SessionsModel implements SessionsEntity {
  id?: string = uuidv4();
  access_type: UsersAccessTypeValue = UsersAccessType.Business;
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

export default SessionsModel;