import { GenericObject, Query } from "./common.type";

export type GetAllArgs = {
  condition?: GenericObject,
  query?: Query
};

export type GetAllBetweenCreatedAtArgs = {
  dateFrom: string,
  dateTo: string,
  condition?: GenericObject,
  query?: Query
};

export type GetAllByUserIdArgs = {
  userId: string,
  condition?: GenericObject,
  query?: Query
};

export type GetAllByRoleIdArgs = {
  roleId: string,
  condition?: GenericObject,
  query?: Query
};

export type GetAllRoleOrUserBasedPermissionsArgs = {
  userId: string
};

export type CountAllArgs = {
  condition?: GenericObject,
  query?: Query
};