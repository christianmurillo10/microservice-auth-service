import Role from "./role.model";
import Permission from "./permission.model";

export default interface RolePermission {
  id?: string;
  roleId: string;
  permissionId: string;
  grantedAt: Date;
  role?: Role;
  permission?: Permission;
};