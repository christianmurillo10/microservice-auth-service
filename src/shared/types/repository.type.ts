import { GenericObject, Query } from "./common.type";

export type FindAllArgs = {
  condition?: GenericObject | undefined,
  query?: Query | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByIdArgs<I> = {
  id: I,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByNameArgs = {
  name: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type FindByUsernameOrEmailArgs = {
  username: string,
  email: string,
  condition?: GenericObject | undefined,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type CreateArgs<P> = {
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type UpdateArgs<I, P> = {
  id: I,
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type SoftDeleteArgs<I> = {
  id: I,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};

export type DeleteArgs<I> = {
  id: I
};

export type SoftDeleteManyArgs<I> = {
  ids: I[]
};

export type CountArgs = {
  condition?: GenericObject | undefined,
  query?: Query | undefined
};