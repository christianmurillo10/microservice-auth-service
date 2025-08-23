import Organization from "../models/organization.model";
import Session from "../models/session.model";
import UserPermission from "../models/user-permission.model";
import UserRole from "../models/user-role.model";
import { UserAccessTypeValue } from "../models/user.model";
import { comparePassword } from "../shared/utils/bcrypt";

class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public username: string,
    public email: string,
    public password: string,
    public accessType: UserAccessTypeValue,
    public organizationId?: string | null,
    public isActive: boolean = true,
    public isLogged: boolean = false,
    public lastLoggedAt?: Date | null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date | null,
    public organization?: Organization,
    public session?: Session[],
    public userRoles?: UserRole[],
    public userPermissions?: UserPermission[],
  ) { };

  activate() {
    this.isActive = true;
  };

  deactivate() {
    this.isActive = false;
  };

  markLoggedIn() {
    this.isLogged = true;
    this.lastLoggedAt = new Date();
  };

  markLoggedOut() {
    this.isLogged = false;
  };

  setOrganization(orgId?: string | null) {
    this.organizationId = orgId ?? null;
  };

  changePassword(newHash: string) {
    this.password = newHash;
  };

  delete() {
    this.deletedAt = new Date();
  };

  checkPassword(password: string): boolean {
    return comparePassword(password, this.password);
  };
};

export default UserEntity;