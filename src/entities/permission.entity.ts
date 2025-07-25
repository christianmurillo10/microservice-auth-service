export default interface Permission {
  id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};