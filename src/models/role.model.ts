import Role from "../entities/role.entity";

class RoleModel implements Role {
  id?: string;
  name: string = "";
  description?: string | null;
  organizationId: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  deletedAt?: Date | null = null;

  constructor(props: Role) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.organizationId = props.organizationId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  };
};

export default RoleModel;