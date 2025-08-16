import Role from "./role.entity";
import Permission from "./permission.entity";

export default interface RolePermission {
  id?: string;
  roleId: string;
  permissionId: string;
  grantedAt: Date;
  role?: Role;
  permission?: Permission;
};