import { Permission } from "./permission.entity";
import { Role } from "./role.entity";

export interface RolePermission {
  id?: string;
  roleId: string;
  permissionId: string;
  grantedAt: Date;
  role?: Role;
  permission?: Permission;
};

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