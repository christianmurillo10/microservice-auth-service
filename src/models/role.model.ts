import Organization from "../entities/organization.entity";
import RolePermission from "../entities/role-permission.entity";
import Role from "../entities/role.entity";
import UserRole from "../entities/user-role.entity";

class RoleModel implements Role {
  id?: string;
  name: string = "";
  description?: string | null;
  organizationId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  organization?: Organization;
  rolePermissions?: RolePermission[];
  userRoles?: UserRole[];

  constructor(props: Role) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.organization = props.organization;
    this.rolePermissions = props.rolePermissions;
    this.userRoles = props.userRoles;
  };
};

export default RoleModel;