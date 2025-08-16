import User from "./user.entity";
import Permission from "./permission.entity";

export default interface UserPermission {
  id?: string;
  userId: string;
  permissionId: string;
  grantedAt: Date;
  user?: User;
  permission?: Permission;
};