import Organization from "../models/organization.model";
import Permission from "../models/permission.model";
import RolePermission from "../models/role-permission.model";
import UserPermission from "../models/user-permission.model";

class PermissionEntity implements Permission {
  id?: string;
  action: string;
  resource: string;
  organizationId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  organization?: Organization;
  rolePermissions?: RolePermission[];
  userPermissions?: UserPermission[];

  constructor(props: Permission) {
    this.id = props.id;
    this.action = props.action;
    this.resource = props.resource;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.organization = props.organization;
    this.rolePermissions = props.rolePermissions;
    this.userPermissions = props.userPermissions;
  };
};

export default PermissionEntity;