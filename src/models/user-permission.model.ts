import User from "./user.model";
import Permission from "./permission.model";

export default interface UserPermission {
  id?: string;
  userId: string;
  permissionId: string;
  grantedAt: Date;
  user?: User;
  permission?: Permission;
};