export default interface Permission {
  id?: string;
  action: string;
  resource: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};