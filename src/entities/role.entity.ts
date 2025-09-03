import Organization from "../models/organization.model";
import RolePermission from "../models/role-permission.model";
import Role from "../models/role.model";
import UserRole from "../models/user-role.model";

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