import Role from "./role.entity";
import User from "./user.entity";

export default interface UserRole {
  id?: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  user?: User;
  role?: Role;
};