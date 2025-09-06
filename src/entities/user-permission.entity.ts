import { Permission } from "./permission.entity";
import { User } from "./user.entity";

export interface UserPermission {
  id?: string;
  userId: string;
  permissionId: string;
  grantedAt: Date;
  user?: User;
  permission?: Permission;
};

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