export type GenericObject = Record<string, string> | object;

export type GenericArray = any[];

export type UniqueId = number | string | null;

export type Query = {
  filters?: GenericObject,
  sorting?: GenericObject,
  page?: number,
  limit?: number
};

export type ApiResponseInput = {
  service?: string,
  version?: string,
  statusCode: number,
  status?: string,
  message?: string,
  errors?: string[],
  result?: unknown,
};

export type EventMessageData<T> = {
  oldDetails: T,
  newDetails: T
};