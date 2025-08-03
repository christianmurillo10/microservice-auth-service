import UserPermission from "../entities/user-permission.entity";

class UserPermissionModel implements UserPermission {
  id?: string;
  userId: string;
  permissionId: string;
  grantedAt: Date = new Date();

  constructor(props: UserPermission) {
    this.id = props.id;
    this.userId = props.userId;
    this.permissionId = props.permissionId;
    this.grantedAt = props.grantedAt;
  };
};

export default UserPermissionModel;