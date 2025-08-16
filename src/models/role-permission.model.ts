import Permission from "../entities/permission.entity";
import RolePermission from "../entities/role-permission.entity";
import Role from "../entities/role.entity";

class RolePermissionModel implements RolePermission {
  id?: string;
  roleId: string;
  permissionId: string;
  grantedAt: Date = new Date();
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

export default RolePermissionModel;