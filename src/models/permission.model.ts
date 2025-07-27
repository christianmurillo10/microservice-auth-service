import { v4 as uuidv4 } from "uuid";
import Permission from "../entities/permission.entity";

class PermissionModel implements Permission {
  id?: string = uuidv4();
  name: string = "";
  description?: string | null = null;
  businessId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;

  constructor(props: Permission) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.businessId = props.businessId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  };
};

export default PermissionModel;