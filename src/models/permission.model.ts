import Permission from "../entities/permission.entity";

class PermissionModel implements Permission {
  id?: string;
  name: string = "";
  description?: string | null = null;
  organizationId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;

  constructor(props: Permission) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  };
};

export default PermissionModel;