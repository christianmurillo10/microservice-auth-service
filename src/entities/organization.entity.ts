import { v4 as uuidv4 } from "uuid";
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
    this.id = props.id ?? uuidv4();
    this.name = props.name;
    this.logoPath = props.logoPath ?? null;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
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