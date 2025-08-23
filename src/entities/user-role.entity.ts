import Role from "../models/role.model";
import UserRole from "../models/user-role.model";
import User from "../models/user.model";

class UserRoleEntity implements UserRole {
  id?: string;
  userId: string;
  roleId: string;
  assignedAt: Date = new Date();
  user?: User;
  role?: Role;

  constructor(props: UserRole) {
    this.id = props.id;
    this.userId = props.userId;
    this.roleId = props.roleId;
    this.user = props.user;
    this.role = props.role;
  };
};

export default UserRoleEntity;