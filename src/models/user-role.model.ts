import Role from "./role.model";
import User from "./user.model";

export default interface UserRole {
  id?: string;
  userId: string;
  roleId: string;
  assignedAt: Date;
  user?: User;
  role?: Role;
};