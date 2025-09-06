import { Organization } from "./organization.entity";
import { RolePermission } from "./role-permission.entity";
import { UserRole } from "./user-role.entity";

export interface Role {
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

class RoleEntity implements Role {
  id?: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  organization?: Organization;
  rolePermissions?: RolePermission[];
  userRoles?: UserRole[];

  constructor(props: Role) {
    this.id = props.id;
    this.name = props.name;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.organization = props.organization;
    this.rolePermissions = props.rolePermissions;
    this.userRoles = props.userRoles;
  };
};

export default RoleEntity;