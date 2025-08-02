export default interface Organization {
  id?: string;
  name: string;
  logoPath?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};