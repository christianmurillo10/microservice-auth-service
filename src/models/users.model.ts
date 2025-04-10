export type AccessType = "PORTAL" | "BUSINESS" | "APP_RECOGNIZED";

export default interface UsersModel {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  access_type: AccessType;
  business_id?: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};