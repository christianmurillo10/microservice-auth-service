import Organization from "../models/organization.model";
import Permission from "../models/permission.model";
import Role from "../models/role.model";
import User from "../models/user.model";

class OrganizationEntity implements Organization {
  id?: string;
  name: string;
  logoPath?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  users?: User[];
  roles?: Role[];
  permissions?: Permission[];

  constructor(props: Organization) {
    this.id = props.id;
    this.name = props.name;
    this.logoPath = props.logoPath;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.users = props.users;
    this.roles = props.roles;
    this.permissions = props.permissions;
  };

  activate() {
    this.isActive = true;
  };

  deactivate() {
    this.isActive = false;
  };
};

export default OrganizationEntity;