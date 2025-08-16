import Organization from "./organization.entity";
import RolePermission from "./role-permission.entity";
import UserRole from "./user-role.entity";

export default interface Role {
  id?: string;
  name: string;
  description?: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  organization?: Organization;
  rolePermissions?: RolePermission[];
  userRoles?: UserRole[];
};