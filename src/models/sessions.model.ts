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
    this.id = props.id;
    this.access_type = props.access_type;
    this.access_token = props.access_token;
    this.refresh_token = props.refresh_token;
    this.user_id = props.user_id;
    this.refresh_token_expires_at = props.refresh_token_expires_at;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.deleted_at = props.deleted_at;
  };
};

export default SessionsModel;