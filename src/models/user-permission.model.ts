import Permission from "../entities/permission.entity";
import UserPermission from "../entities/user-permission.entity";
import User from "../entities/user.entity";

class UserPermissionModel implements UserPermission {
  id?: string;
  userId: string;
  permissionId: string;
  grantedAt: Date = new Date();
  user?: User;
  permission?: Permission;

  constructor(props: UserPermission) {
    this.id = props.id;
    this.userId = props.userId;
    this.permissionId = props.permissionId;
    this.grantedAt = props.grantedAt;
    this.user = props.user;
    this.permission = props.permission;
  };
};

export default UserPermissionModel;