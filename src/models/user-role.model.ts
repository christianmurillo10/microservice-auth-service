import Role from "../entities/role.entity";
import UserRole from "../entities/user-role.entity";
import User from "../entities/user.entity";

class UserRoleModel implements UserRole {
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

export default UserRoleModel;