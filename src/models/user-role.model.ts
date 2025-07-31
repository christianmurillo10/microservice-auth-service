import UserRole from "../entities/user-role.entity";

class UserRoleModel implements UserRole {
  id?: string;
  userId: string;
  roleId: string;
  assignedAt: Date = new Date();

  constructor(props: UserRole) {
    this.id = props.id;
    this.userId = props.userId;
    this.roleId = props.roleId;
    this.assignedAt = props.assignedAt;
  };
};

export default UserRoleModel;