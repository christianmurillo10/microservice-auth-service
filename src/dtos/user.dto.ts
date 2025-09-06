import { UserAccessTypeValue } from "../models/user.model";

export type CreateUserDTO = {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  accessType: UserAccessTypeValue;
  organizationId?: string | null;
  isActive: boolean;
  isLogged: boolean;
  lastLoggedAt?: Date | null;
};

export type UpdateUserDTO = Partial<CreateUserDTO>;