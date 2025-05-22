export enum EAccessType {
  PORTAL = "PORTAL",
  BUSINESS = "BUSINESS",
  APP_RECOGNIZED = "APP_RECOGNIZED"
};

export type TAccessType = EAccessType.PORTAL | EAccessType.BUSINESS | EAccessType.APP_RECOGNIZED;

export default interface IUsersEntity {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  access_type: TAccessType;
  business_id?: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
};