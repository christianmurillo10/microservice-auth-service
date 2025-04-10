import { v4 as uuidv4 } from "uuid";
import UsersModel, { AccessType } from "../models/users.model";

class Users implements UsersModel {
  id?: string = uuidv4();
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  access_type: AccessType = "BUSINESS";
  business_id: number | null = null;
  is_active: boolean = true;
  created_at: Date = new Date();
  updated_at: Date | null = new Date();
  deleted_at: Date | null = null;

  constructor(props: UsersModel) {
    Object.assign(this, props);
  };
};

export default Users;