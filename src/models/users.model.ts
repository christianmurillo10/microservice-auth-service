import { v4 as uuidv4 } from "uuid";
import IUsersEntity, { TAccessType, EAccessType } from "../entities/users.entity";

class Users implements IUsersEntity {
  id?: string = uuidv4();
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  access_type: TAccessType = EAccessType.BUSINESS;
  business_id: number | null = null;
  is_active: boolean = true;
  created_at: Date = new Date();
  updated_at: Date | null = new Date();
  deleted_at: Date | null = null;

  constructor(props: IUsersEntity) {
    Object.assign(this, props);
  };
};

export default Users;