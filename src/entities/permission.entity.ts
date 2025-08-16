import Organization from "./organization.entity";
import RolePermission from "./role-permission.entity";
import UserPermission from "./user-permission.entity";

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