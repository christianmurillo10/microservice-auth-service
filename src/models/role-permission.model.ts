import { v4 as uuidv4 } from "uuid";
import RolePermission from "../entities/role-permission.entity";

class RolePermissionModel implements RolePermission {
  id?: string = uuidv4();
  roleId: string;
  permissionId: string;
  grantedAt: Date = new Date();

  constructor(props: RolePermission) {
    this.id = props.id;
    this.roleId = props.roleId;
    this.permissionId = props.permissionId;
    this.grantedAt = props.grantedAt;
  };
};

export default RolePermissionModel;