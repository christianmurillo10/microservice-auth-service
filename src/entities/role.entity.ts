import { v4 as uuidv4 } from "uuid";
import Organization from "../models/organization.model";
import RolePermission from "../models/role-permission.model";
import Role from "../models/role.model";
import UserRole from "../models/user-role.model";

class RoleEntity implements Role {
  id?: string;
  name: string = "";
  organizationId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  organization?: Organization;
  rolePermissions?: RolePermission[];
  userRoles?: UserRole[];

  constructor(props: Role) {
    this.id = props.id ?? uuidv4();
    this.name = props.name;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.organization = props.organization;
    this.rolePermissions = props.rolePermissions;
    this.userRoles = props.userRoles;
  };
};

export default RoleEntity;