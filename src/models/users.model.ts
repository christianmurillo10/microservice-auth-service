export default interface UsersModel {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  business_id?: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};