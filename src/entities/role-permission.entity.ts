import Permission from "../models/permission.model";
import RolePermission from "../models/role-permission.model";
import Role from "../models/role.model";

class RolePermissionEntity implements RolePermission {
  id?: string;
  roleId: string;
  permissionId: string;
  grantedAt: Date;
  role?: Role;
  permission?: Permission;

  constructor(props: RolePermission) {
    this.id = props.id;
    this.roleId = props.roleId;
    this.permissionId = props.permissionId;
    this.grantedAt = props.grantedAt;
    this.role = props.role;
    this.permission = props.permission;
  };
};

export default RolePermissionEntity;