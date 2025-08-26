import Organization from "./organization.model";
import RolePermission from "./role-permission.model";
import UserRole from "./user-role.model";

export default interface Role {
  id?: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  organization?: Organization;
  rolePermissions?: RolePermission[];
  userRoles?: UserRole[];
};