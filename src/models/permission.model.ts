import Organization from "./organization.model";
import RolePermission from "./role-permission.model";
import UserPermission from "./user-permission.model";

export default interface Permission {
  id?: string;
  action: string;
  resource: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  organization?: Organization;
  rolePermissions?: RolePermission[];
  userPermissions?: UserPermission[];
};