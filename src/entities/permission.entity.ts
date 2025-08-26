import { v4 as uuidv4 } from "uuid";
import Organization from "../models/organization.model";
import Permission from "../models/permission.model";
import RolePermission from "../models/role-permission.model";
import UserPermission from "../models/user-permission.model";

class PermissionEntity implements Permission {
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

  constructor(props: Permission) {
    this.id = props.id ?? uuidv4();
    this.action = props.action;
    this.resource = props.resource;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.organization = props.organization;
    this.rolePermissions = props.rolePermissions;
    this.userPermissions = props.userPermissions;
  };
};

export default PermissionEntity;