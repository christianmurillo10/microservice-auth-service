export type TGenericObject = Record<string, string> | object;

export type TGenericArray = any[];

export type TUniqueId = number | string | null;

export type TQuery = {
  filters?: TGenericObject,
  sorting?: TGenericObject,
  offset?: number,
  limit?: number
};

export type TApiResponseInput = {
  service?: string,
  version?: string,
  status_code: number,
  status?: string,
  message?: string,
  errors?: string[],
  result?: unknown,
};