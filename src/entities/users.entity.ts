export enum UserAccessType {
  PORTAL = "PORTAL",
  BUSINESS = "BUSINESS",
  APP_RECOGNIZED = "APP_RECOGNIZED"
};

export type AccessType = UserAccessType.PORTAL | UserAccessType.BUSINESS | UserAccessType.APP_RECOGNIZED;

export default interface UsersEntity {
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