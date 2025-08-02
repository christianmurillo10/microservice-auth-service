export default interface Role {
  id?: string;
  name: string;
  description?: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};