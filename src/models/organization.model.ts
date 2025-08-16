import Organization from "../entities/organization.entity";
import Permission from "../entities/permission.entity";
import Role from "../entities/role.entity";
import User from "../entities/user.entity";

class OrganizationModel implements Organization {
  id?: string;
  name: string = "";
  logoPath?: string | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  users?: User[];
  roles?: Role[];
  permissions?: Permission[];

  constructor(props: Organization) {
    this.id = props.id;
    this.name = props.name;
    this.logoPath = props.logoPath;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.users = props.users;
    this.roles = props.roles;
    this.permissions = props.permissions;
  };
};

export default OrganizationModel;