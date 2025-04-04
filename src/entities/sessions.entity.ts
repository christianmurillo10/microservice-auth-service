import { v4 as uuidv4 } from "uuid";
import SessionsModel, { SessionsAccessType } from "../models/sessions.model";
import { SESSION_TYPE_BUSINESS } from "../shared/constants/sessions.constant";

class Sessions implements SessionsModel {
  id?: string = uuidv4();
  access_type: SessionsAccessType = SESSION_TYPE_BUSINESS;
  access_token: string = "";
  refresh_token: string = "";
  user_id: string = "";
  refresh_token_expires_at: Date = new Date();
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null = null;

  constructor(props: SessionsModel) {
    Object.assign(this, props);
  };
};

export default Sessions;