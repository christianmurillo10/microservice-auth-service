import { Permission } from "./permission.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";

export interface Organization {
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
};

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