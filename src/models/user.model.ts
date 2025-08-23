import Organization from "./organization.model";
import Session from "./session.model";
import UserPermission from "./user-permission.model";
import UserRole from "./user-role.model";

export enum UserAccessType {
  Portal = "PORTAL",
  Organization = "ORGANIZATION",
  AppRecognized = "APP_RECOGNIZED"
};

export type UserAccessTypeValue = UserAccessType.Portal | UserAccessType.Organization | UserAccessType.AppRecognized;

export default interface User {
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