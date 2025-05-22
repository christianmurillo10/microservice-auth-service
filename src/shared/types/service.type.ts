import { TGenericObject, TQuery } from "./common.type";

export type TGetAllArgs = {
  condition?: TGenericObject,
  query?: TQuery
};

export type TGetByIdArgs<I> = {
  id: I,
  condition?: TGenericObject
};

export type TGetByNameArgs = {
  name: string,
  condition?: TGenericObject
};

export type TGetByRefreshTokenArgs = {
  refresh_token: string,
  condition?: TGenericObject
};

export type TCountAllArgs = {
  condition?: TGenericObject,
  query?: TQuery
};