import { v4 as uuidv4 } from "uuid";
import { comparePassword } from "../shared/utils/bcrypt";
import { Organization } from "./organization.entity";
import { Session } from "./session.entity";
import { UserRole } from "./user-role.entity";
import { UserPermission } from "./user-permission.entity";

export enum UserAccessType {
  Portal = "PORTAL",
  Organization = "ORGANIZATION",
  AppRecognized = "APP_RECOGNIZED"
};

export type UserAccessTypeValue = UserAccessType.Portal | UserAccessType.Organization | UserAccessType.AppRecognized;

export interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  accessType: UserAccessTypeValue;
  organizationId?: string | null;
  isActive: boolean;
  isLogged: boolean;
  lastLoggedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  organization?: Organization;
  session?: Session[];
  userRoles?: UserRole[];
  userPermissions?: UserPermission[];
};

class UserEntity implements User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  accessType: UserAccessTypeValue;
  organizationId?: string | null;
  isActive: boolean;
  isLogged: boolean;
  lastLoggedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  organization?: Organization;
  session?: Session[];
  userRoles?: UserRole[];
  userPermissions?: UserPermission[];

  constructor(props: User) {
    this.id = props.id ?? uuidv4();
    this.name = props.name;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.accessType = props.accessType;
    this.organizationId = props.organizationId ?? null;
    this.isActive = props.isActive ?? true;
    this.isLogged = props.isLogged ?? false;
    this.lastLoggedAt = props.lastLoggedAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.organization = props.organization;
    this.session = props.session;
    this.userRoles = props.userRoles;
    this.userPermissions = props.userPermissions;
  };

  activate() {
    this.isActive = true;
    this.updatedAt = new Date();
  };

  deactivate() {
    this.isActive = false;
    this.updatedAt = new Date();
  };

  markLoggedIn() {
    this.isLogged = true;
    this.lastLoggedAt = new Date();
    this.updatedAt = new Date();
  };

  markLoggedOut() {
    this.isLogged = false;
    this.updatedAt = new Date();
  };

  setOrganization(orgId?: string | null) {
    this.organizationId = orgId ?? null;
    this.updatedAt = new Date();
  };

  changePassword(newHash: string) {
    this.password = newHash;
    this.updatedAt = new Date();
  };

  delete() {
    this.deletedAt = new Date();
  };

  checkPassword(password: string): boolean {
    return comparePassword(password, this.password);
  };
};

export default UserEntity;