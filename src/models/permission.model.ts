import Organization from "../entities/organization.entity";
import Permission from "../entities/permission.entity";
import RolePermission from "../entities/role-permission.entity";
import UserPermission from "../entities/user-permission.entity";

class PermissionModel implements Permission {
  id?: string;
  action: string;
  resource: string;
  organizationId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  organization?: Organization;
  rolePermiossions?: RolePermission[];
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
    this.rolePermiossions = props.rolePermiossions;
    this.userPermissions = props.userPermissions;
  };
};

export default PermissionModel;