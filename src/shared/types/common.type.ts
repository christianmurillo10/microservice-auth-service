export type GenericObject = Record<string, string> | object;

export type FindByIdArgs<I> = {
  id: I,
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

export type UpdateArgs<I, P> = {
  id: I,
  params: P,
  include?: string[] | undefined,
  exclude?: string[] | undefined
};