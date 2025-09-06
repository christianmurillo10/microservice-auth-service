import { Role } from "./role.entity";
import { User } from "./user.entity";

export interface UserRole {
  id?: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  user?: User;
  role?: Role;
};

class UserRoleEntity implements UserRole {
  id?: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  user?: User;
  role?: Role;

  constructor(props: UserRole) {
    this.id = props.id;
    this.userId = props.userId;
    this.roleId = props.roleId;
    this.assignedAt = props.assignedAt;
    this.user = props.user;
    this.role = props.role;
  };
};

export default UserRoleEntity;