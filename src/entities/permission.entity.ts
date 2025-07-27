export default interface Permission {
  id?: string;
  name: string;
  description?: string | null;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};