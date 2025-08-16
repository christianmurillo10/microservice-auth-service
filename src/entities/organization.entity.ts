import Permission from "./permission.entity";
import Role from "./role.entity";
import User from "./user.entity";

export default interface Organization {
  id?: string;
  name: string;
  logoPath?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  users?: User[];
  roles?: Role[];
  permissions?: Permission[];
};