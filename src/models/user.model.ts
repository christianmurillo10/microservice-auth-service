import Organization from "../entities/organization.entity";
import Session from "../entities/session.entity";
import UserPermission from "../entities/user-permission.entity";
import UserRole from "../entities/user-role.entity";
import User, { UserAccessTypeValue, UserAccessType } from "../entities/user.entity";

class UserModel implements User {
  id?: string;
  name: string = "";
  username: string = "";
  email: string = "";
  password: string = "";
  accessType: UserAccessTypeValue = UserAccessType.Organization;
  organizationId?: string | null = null;
  isActive: boolean = true;
  isLogged: boolean = false;
  lastLoggedAt?: Date | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;
  organization?: Organization;
  session?: Session[];
  userRoles?: UserRole[];
  userPermissions?: UserPermission[];

  constructor(props: User) {
    this.id = props.id;
    this.name = props.name;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.accessType = props.accessType;
    this.organizationId = props.organizationId;
    this.isActive = props.isActive;
    this.isLogged = props.isLogged;
    this.lastLoggedAt = props.lastLoggedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
    this.organization = props.organization;
    this.session = props.session;
    this.userRoles = props.userRoles;
    this.userPermissions = props.userPermissions;
  };
};

export default UserModel;