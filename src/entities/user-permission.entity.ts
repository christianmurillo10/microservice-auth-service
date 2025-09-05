import Permission from "../models/permission.model";
import UserPermission from "../models/user-permission.model";
import User from "../models/user.model";

class UserPermissionEntity implements UserPermission {
  id?: string;
  userId: string;
  permissionId: string;
  grantedAt: Date;
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

export default UserPermissionEntity;